import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Fetch e-commerce settings from the global.
 * Server-side only — use in page.tsx / layout.tsx / server components.
 *
 * Returns null if the global doesn't exist or fetch fails.
 */
export async function getEcommerceSettings(): Promise<any | null> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'e-commerce-settings', depth: 1 })
  } catch (error) {
    console.warn('[getEcommerceSettings] Could not fetch:', error)
    return null
  }
}
