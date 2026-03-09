/**
 * PWAHead — Server Component
 *
 * Renders PWA-related <head> meta tags.
 * Fetches tenant settings to populate app name and theme color.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { DEFAULT_THEME_COLOR } from '../../lib/types'

export async function PWAHead() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })

  const appName = (settings.companyName as string) || 'CompassDigital'
  const themeColor = (settings.primaryColor as string) || DEFAULT_THEME_COLOR

  return (
    <>
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content={themeColor} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={appName} />
      <link rel="apple-touch-icon" href="/api/pwa/icons?size=180" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={appName} />
      <meta name="msapplication-TileColor" content={themeColor} />
    </>
  )
}
