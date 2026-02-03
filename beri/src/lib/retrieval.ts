/**
 * Retrieval layer for semantic search
 */

import type { ScoredChunk, MessageSource } from '@/types'
import { embed } from './embeddings'
import { getAllChunks } from './storage'
import { TOP_K_CHUNKS, SIMILARITY_THRESHOLD } from './constants'

/**
 * Calculate cosine similarity between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns Similarity score between -1 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  if (magnitude === 0) return 0

  return dotProduct / magnitude
}

/**
 * Retrieve the most relevant chunks for a query
 * @param query - The user's question
 * @returns Top-K most relevant chunks with scores
 */
export async function retrieveContext(query: string): Promise<ScoredChunk[]> {
  // Get query embedding
  const queryEmbedding = await embed(query)

  // Get all chunks from storage
  const chunks = await getAllChunks()

  // Score all chunks
  const scoredChunks: ScoredChunk[] = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  // Sort by score (highest first) and filter by threshold
  const relevantChunks = scoredChunks
    .filter((chunk) => chunk.score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K_CHUNKS)

  return relevantChunks
}

/**
 * Format retrieved chunks into a context string for the LLM
 * @param chunks - The retrieved chunks
 * @returns Formatted context string
 */
export function formatContext(chunks: ScoredChunk[]): string {
  if (chunks.length === 0) {
    return 'No relevant policy content found.'
  }

  return chunks
    .map((chunk, index) => {
      const source = `[Source ${index + 1}: ${chunk.metadata.source} - ${chunk.metadata.section}]`
      return `${source}\n${chunk.content}`
    })
    .join('\n\n---\n\n')
}

/**
 * Extract unique sources from retrieved chunks
 * @param chunks - The retrieved chunks
 * @returns Array of unique source citations
 */
export function extractSources(chunks: ScoredChunk[]): MessageSource[] {
  const seen = new Set<string>()
  const sources: MessageSource[] = []

  for (const chunk of chunks) {
    const key = `${chunk.metadata.source}|${chunk.metadata.section}`
    if (!seen.has(key)) {
      seen.add(key)
      sources.push({
        source: chunk.metadata.source,
        section: chunk.metadata.section,
      })
    }
  }

  return sources
}
