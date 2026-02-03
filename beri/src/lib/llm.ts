/**
 * LLM layer using WebLLM
 */

import * as webllm from '@mlc-ai/web-llm'
import { LLM_MODEL, MAX_TOKENS, TEMPERATURE } from './constants'
import type { ProgressCallback } from '@/types'

let engine: webllm.MLCEngine | null = null

/**
 * Check if WebGPU is available
 * @returns Whether WebGPU is supported
 */
export async function checkWebGPU(): Promise<boolean> {
  if (!navigator.gpu) {
    return false
  }

  try {
    const adapter = await navigator.gpu.requestAdapter()
    return adapter !== null
  } catch {
    return false
  }
}

/**
 * Initialise the LLM engine
 * @param onProgress - Progress callback for loading updates
 */
export async function initLLM(onProgress?: ProgressCallback): Promise<void> {
  onProgress?.(0, 'Initialising language model...')

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    const progress = Math.round(report.progress * 100)
    onProgress?.(progress, report.text)
  }

  engine = new webllm.MLCEngine({
    initProgressCallback,
  })

  await engine.reload(LLM_MODEL)

  onProgress?.(100, 'Language model ready')
}

/**
 * Generate a response using the LLM
 * @param systemPrompt - The system prompt
 * @param context - The retrieved context
 * @param query - The user's question
 * @param onToken - Callback for each generated token
 * @returns The complete response
 */
export async function generate(
  systemPrompt: string,
  context: string,
  query: string,
  onToken?: (token: string) => void
): Promise<string> {
  if (!engine) {
    throw new Error('LLM not initialised')
  }

  const userMessage = `CONTEXT:
${context}

QUESTION: ${query}

Based on the context above, please answer the question. Remember to cite your sources.`

  const messages: webllm.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]

  let fullResponse = ''

  const asyncChunkGenerator = await engine.chat.completions.create({
    messages,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    stream: true,
  })

  for await (const chunk of asyncChunkGenerator) {
    const token = chunk.choices[0]?.delta?.content || ''
    if (token) {
      fullResponse += token
      onToken?.(token)
    }
  }

  return fullResponse
}

/**
 * Reset the chat context
 */
export async function resetChat(): Promise<void> {
  if (engine) {
    await engine.resetChat()
  }
}
