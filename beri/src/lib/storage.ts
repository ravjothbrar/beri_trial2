/**
 * IndexedDB storage layer for BERI
 */

import { openDB, type IDBPDatabase } from 'idb'
import type { Chunk } from '@/types'
import { DB_NAME, DB_VERSION, CHUNKS_STORE } from './constants'
import chunksData from '@/data/chunks.json'

let db: IDBPDatabase | null = null

/**
 * Initialise IndexedDB storage
 */
export async function initStorage(): Promise<void> {
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(CHUNKS_STORE)) {
        database.createObjectStore(CHUNKS_STORE, { keyPath: 'id' })
      }
    },
  })
}

/**
 * Load chunks from bundled JSON into IndexedDB
 */
export async function loadChunksFromJSON(): Promise<void> {
  if (!db) {
    throw new Error('Storage not initialised')
  }

  const chunks = chunksData as Chunk[]
  const tx = db.transaction(CHUNKS_STORE, 'readwrite')
  const store = tx.objectStore(CHUNKS_STORE)

  // Clear existing chunks
  await store.clear()

  // Add all chunks
  for (const chunk of chunks) {
    await store.add(chunk)
  }

  await tx.done
}

/**
 * Get all chunks from storage
 */
export async function getAllChunks(): Promise<Chunk[]> {
  if (!db) {
    throw new Error('Storage not initialised')
  }

  return db.getAll(CHUNKS_STORE)
}

/**
 * Check if chunks are already loaded
 */
export async function hasChunks(): Promise<boolean> {
  if (!db) {
    throw new Error('Storage not initialised')
  }

  const count = await db.count(CHUNKS_STORE)
  return count > 0
}
