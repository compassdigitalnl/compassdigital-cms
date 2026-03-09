/**
 * Web App Manifest Generator
 *
 * Generates a W3C Web App Manifest from tenant Settings.
 * Called by the dynamic manifest route at /manifest.webmanifest.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { WebAppManifest } from './types'
import { MANIFEST_ICON_SIZES, DEFAULT_THEME_COLOR, DEFAULT_BACKGROUND_COLOR } from './types'

/**
 * Generate a Web App Manifest from the current tenant's settings.
 *
 * Reads companyName, tagline, description and branding colors from Payload CMS,
 * then builds a standards-compliant manifest object.
 */
export async function generateManifest(): Promise<WebAppManifest> {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })

  const companyName = (settings.companyName as string) || 'CompassDigital'
  const description = (settings.description as string) || (settings.tagline as string) || ''
  const themeColor = (settings.primaryColor as string) || DEFAULT_THEME_COLOR

  // Short name: max 12 chars for home screen label
  const shortName = companyName.length > 12 ? companyName.slice(0, 12).trim() : companyName

  const icons = MANIFEST_ICON_SIZES.map(({ size, purpose }) => ({
    src: `/api/pwa/icons?size=${size}&purpose=${purpose}`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose,
  }))

  return {
    name: companyName,
    short_name: shortName,
    description,
    start_url: '/',
    display: 'standalone',
    background_color: DEFAULT_BACKGROUND_COLOR,
    theme_color: themeColor,
    icons,
    orientation: 'portrait-primary',
    lang: 'nl',
    categories: ['shopping'],
    scope: '/',
    id: '/',
  }
}
