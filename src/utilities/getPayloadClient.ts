/**
 * Singleton Payload Client
 *
 * Ensures only one Payload instance is created to avoid DuplicateCollection errors
 * Caches the initialization promise to handle concurrent calls
 *
 * IMPORTANT: This must be the ONLY way to access Payload in the application
 */

import { getPayload, type Payload } from 'payload'
import { getCachedConfig } from './cachedConfig'

let cachedPayload: Payload | null = null
let initializationPromise: Promise<Payload> | null = null

export async function getPayloadClient(): Promise<Payload> {
  // Return cached instance if available
  if (cachedPayload) {
    return cachedPayload
  }

  // Return existing initialization promise if one is in progress
  if (initializationPromise) {
    return initializationPromise
  }

  // Start new initialization with cached config
  initializationPromise = (async () => {
    const config = await getCachedConfig()
    const payload = await getPayload({ config })
    cachedPayload = payload
    return payload
  })()

  return initializationPromise
}

// Reset function for testing
export function resetPayloadClient() {
  cachedPayload = null
  initializationPromise = null
}
