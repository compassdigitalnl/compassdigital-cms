import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

interface ContentFeatures {
  blog: boolean
  faq: boolean
  testimonials: boolean
  cases: boolean
}

export async function seedContent(
  payload: Payload,
  options: SeedOptions,
  status: string,
  features: ContentFeatures,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement content seeding
  payload.logger.info('      ⚠ Content seeding not yet implemented')

  return result
}
