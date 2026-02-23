import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

export async function seedBeauty(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement beauty seeding
  payload.logger.info('      ⚠ Beauty seeding not yet implemented')

  return result
}
