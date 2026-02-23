import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

export async function seedHoreca(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // TODO: Implement horeca seeding
  payload.logger.info('      ⚠ Horeca seeding not yet implemented')

  return result
}
