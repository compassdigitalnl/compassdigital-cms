/**
 * Cached Payload Config
 *
 * Ensures the Payload config is only loaded once across all webpack contexts
 */

import type { SanitizedConfig } from 'payload'

let cachedConfigPromise: Promise<SanitizedConfig> | null = null

export async function getCachedConfig(): Promise<SanitizedConfig> {
  if (cachedConfigPromise) {
    return cachedConfigPromise
  }

  // Import and resolve config only once
  cachedConfigPromise = import('@payload-config').then((module) => module.default)

  return cachedConfigPromise
}
