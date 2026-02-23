import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

export async function seedHospitality(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement hospitality seeding
  payload.logger.info('      ⚠ Hospitality seeding not yet implemented')

  return result
}
