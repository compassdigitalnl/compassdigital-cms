import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'

/**
 * Seed Construction Content
 *
 * Services, projects
 */
export async function seedConstruction(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // Example construction services
  const services = [
    { title: 'Nieuwbouw', slug: 'nieuwbouw', description: 'Complete nieuwbouwprojecten' },
    { title: 'Renovatie', slug: 'renovatie', description: 'Verbouwing en renovatie' },
    { title: 'Onderhoud', slug: 'onderhoud', description: 'Periodiek onderhoud en reparaties' },
  ]

  for (const service of services) {
    if (!(await checkExistingContent(payload, 'construction-services', service.slug))) {
      await payload.create({
        collection: 'construction-services',
        data: {
          ...service,
          _status: status,
          shortDescription: service.description,
          longDescription: [
            {
              children: [{ text: service.description }],
            },
          ],
        },
      })
      result.collections['construction-services'] = (result.collections['construction-services'] || 0) + 1
    }
  }

  return result
}
