/**
 * Get Payload Instance
 * Helper to get configured Payload CMS instance
 */

import { getPayload } from 'payload'
import configPromise from '@/payload.config'

let cachedPayload: any = null

/**
 * Get Payload CMS instance (cached)
 * Reuses same instance to avoid multiple initializations
 */
export async function getPayloadClient() {
  if (cachedPayload) {
    return cachedPayload
  }

  cachedPayload = await getPayload({ config: configPromise })
  return cachedPayload
}
