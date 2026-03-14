/**
 * Edition Provider Factory — Digital Library
 *
 * Returns the appropriate EditionProvider based on tenant configuration.
 * Currently only InternalEditionProvider is available.
 * Future: ThorEditionProvider for external magazine distribution.
 */

import type { EditionProvider } from './EditionProvider'
import { InternalEditionProvider } from './InternalEditionProvider'

export type { EditionProvider } from './EditionProvider'
export type {
  DigitalSubscription,
  MagazineSummary,
  Edition,
  PageImage,
  TOCEntry,
  RecentRead,
} from './EditionProvider'
export { InternalEditionProvider } from './InternalEditionProvider'

/**
 * Get the configured edition provider for the current tenant.
 *
 * Currently always returns InternalEditionProvider.
 * In the future, this will check tenant settings and may return
 * a ThorEditionProvider for clients using the THOR distribution API.
 *
 * @returns EditionProvider instance
 */
export function getEditionProvider(): EditionProvider {
  // Future: check tenant settings for provider type
  // const settings = await getEcommerceSettings()
  // if (settings.digitalLibrary?.provider === 'thor') {
  //   return new ThorEditionProvider(settings.digitalLibrary.thor)
  // }
  return new InternalEditionProvider()
}
