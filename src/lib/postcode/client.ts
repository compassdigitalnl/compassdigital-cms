/**
 * Postcode API Client - Address Lookup by Postal Code
 *
 * Provider-agnostic abstraction for postcode lookup services.
 * Default: PDOK Locatieserver (gratis, BAG data, alle NL adressen)
 *
 * Providers:
 * - pdok (default): PDOK Locatieserver — gratis, geen API key nodig
 * - postcode-eu: Postcode.eu — betaald, 13 landen
 *
 * Env vars:
 * - POSTCODE_PROVIDER: 'pdok' | 'postcode-eu' (default: 'pdok')
 * - POSTCODE_API_KEY: Postcode.eu API key (alleen voor postcode-eu)
 * - POSTCODE_API_SECRET: Postcode.eu API secret (alleen voor postcode-eu)
 */

export interface PostcodeLookupResult {
  street: string
  city: string
  province?: string
  municipality?: string
  latitude?: number
  longitude?: number
}

export interface PostcodeProvider {
  lookup(postalCode: string, houseNumber?: string): Promise<PostcodeLookupResult | null>
}

// ─── PDOK Locatieserver Provider (default) ───────────────────────────────────

const PDOK_API = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free'

class PdokProvider implements PostcodeProvider {
  async lookup(postalCode: string, houseNumber?: string): Promise<PostcodeLookupResult | null> {
    const clean = postalCode.replace(/\s/g, '').toUpperCase()

    let q = `postcode:${clean}`
    if (houseNumber && houseNumber.trim()) {
      q += ` AND huisnummer:${houseNumber.trim()}`
    }

    const url = `${PDOK_API}?q=${encodeURIComponent(q)}&fq=type:adres&rows=1`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        console.error(`PDOK API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      const doc = data?.response?.docs?.[0]

      if (!doc || !doc.straatnaam) return null

      return {
        street: doc.straatnaam,
        city: doc.woonplaatsnaam || '',
        province: doc.provincienaam || undefined,
        municipality: doc.gemeentenaam || undefined,
      }
    } catch (error) {
      console.error('PDOK lookup failed:', error)
      return null
    }
  }
}

// ─── Postcode.eu Provider ────────────────────────────────────────────────────

const POSTCODE_EU_API = 'https://api.postcode.eu/nl/v1/addresses/postcode'

class PostcodeEuProvider implements PostcodeProvider {
  private apiKey: string
  private apiSecret: string

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  async lookup(postalCode: string, houseNumber?: string): Promise<PostcodeLookupResult | null> {
    const clean = postalCode.replace(/\s/g, '').toUpperCase()

    let url = `${POSTCODE_EU_API}/${clean}`
    if (houseNumber) {
      url += `/${houseNumber}`
    }

    try {
      const credentials = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) return null
        console.error(`Postcode.eu API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()

      return {
        street: data.street || '',
        city: data.city || '',
        province: data.province || undefined,
        municipality: data.municipality || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
      }
    } catch (error) {
      console.error('Postcode.eu lookup failed:', error)
      return null
    }
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const POSTCODE_PROVIDER = process.env.POSTCODE_PROVIDER || 'pdok'
const POSTCODE_API_KEY = process.env.POSTCODE_API_KEY || ''
const POSTCODE_API_SECRET = process.env.POSTCODE_API_SECRET || ''

function createProvider(): PostcodeProvider {
  if (POSTCODE_PROVIDER === 'postcode-eu' && POSTCODE_API_KEY && POSTCODE_API_SECRET) {
    return new PostcodeEuProvider(POSTCODE_API_KEY, POSTCODE_API_SECRET)
  }
  return new PdokProvider()
}

const provider = createProvider()

/**
 * Lookup address by postal code (and optional house number)
 */
export async function lookupPostcode(
  postalCode: string,
  houseNumber?: string,
): Promise<PostcodeLookupResult | null> {
  const clean = postalCode.replace(/\s/g, '').toUpperCase()

  // Validate NL format
  if (!/^\d{4}[A-Z]{2}$/.test(clean)) {
    throw new Error('Voer een geldige Nederlandse postcode in (bijv. 1234AB)')
  }

  return provider.lookup(clean, houseNumber)
}

/**
 * Check if postcode lookup is available
 */
export function isPostcodeLookupAvailable(): boolean {
  return true
}

/**
 * Get current postcode provider mode
 */
export function getPostcodeMode(): 'pdok' | 'postcode-eu' {
  if (POSTCODE_PROVIDER === 'postcode-eu' && POSTCODE_API_KEY && POSTCODE_API_SECRET) {
    return 'postcode-eu'
  }
  return 'pdok'
}
