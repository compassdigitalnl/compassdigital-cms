import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

/**
 * Seed E-commerce Content
 *
 * Products, categories, brands
 */
export async function seedEcommerce(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement product seeding
  payload.logger.info('      ⚠ E-commerce seeding not yet implemented')

  return result
}
