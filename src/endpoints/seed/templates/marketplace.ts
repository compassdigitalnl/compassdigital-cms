import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

export async function seedMarketplace(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement marketplace seeding
  payload.logger.info('      ⚠ Marketplace seeding not yet implemented')

  return result
}
