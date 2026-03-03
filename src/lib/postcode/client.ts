/**
 * Postcode API Client - Address Lookup by Postal Code
 *
 * Provider-agnostic abstraction for postcode lookup services.
 * Default: Postcode.eu (marktleider NL, 13 landen, €50/jaar + €0.005/call)
 *
 * API Documentation: https://api.postcode.eu/documentation
 *
 * Env vars:
 * - POSTCODE_API_KEY: Postcode.eu API key
 * - POSTCODE_API_SECRET: Postcode.eu API secret
 * - POSTCODE_PROVIDER: 'postcode-eu' | 'mock' (default: 'mock')
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

// ─── Mock Provider ───────────────────────────────────────────────────────────

const MOCK_POSTCODES: Record<string, PostcodeLookupResult> = {
  '1012AB': { street: 'Dam', city: 'Amsterdam', province: 'Noord-Holland' },
  '1017CT': { street: 'Museumstraat', city: 'Amsterdam', province: 'Noord-Holland' },
  '1071DJ': { street: 'Vondelstraat', city: 'Amsterdam', province: 'Noord-Holland' },
  '2511AA': { street: 'Buitenhof', city: 'Den Haag', province: 'Zuid-Holland' },
  '2514JA': { street: 'Plein', city: 'Den Haag', province: 'Zuid-Holland' },
  '3011HA': { street: 'Coolsingel', city: 'Rotterdam', province: 'Zuid-Holland' },
  '3511CE': { street: 'Domplein', city: 'Utrecht', province: 'Utrecht' },
  '3512JE': { street: 'Oudegracht', city: 'Utrecht', province: 'Utrecht' },
  '5611EL': { street: 'Markt', city: 'Eindhoven', province: 'Noord-Brabant' },
  '6211CL': { street: 'Vrijthof', city: 'Maastricht', province: 'Limburg' },
  '9711JB': { street: 'Grote Markt', city: 'Groningen', province: 'Groningen' },
  '7511JA': { street: 'Oude Markt', city: 'Enschede', province: 'Overijssel' },
}

class MockProvider implements PostcodeProvider {
  async lookup(postalCode: string): Promise<PostcodeLookupResult | null> {
    const clean = postalCode.replace(/\s/g, '').toUpperCase()
    console.log('📮 Using mock postcode data for:', clean)
    return MOCK_POSTCODES[clean] || null
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const POSTCODE_PROVIDER = process.env.POSTCODE_PROVIDER || 'mock'
const POSTCODE_API_KEY = process.env.POSTCODE_API_KEY || ''
const POSTCODE_API_SECRET = process.env.POSTCODE_API_SECRET || ''

function createProvider(): PostcodeProvider {
  if (POSTCODE_PROVIDER === 'postcode-eu' && POSTCODE_API_KEY && POSTCODE_API_SECRET) {
    return new PostcodeEuProvider(POSTCODE_API_KEY, POSTCODE_API_SECRET)
  }
  return new MockProvider()
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
  return true // Always available (mock fallback)
}

/**
 * Get current postcode provider mode
 */
export function getPostcodeMode(): 'postcode-eu' | 'mock' {
  if (POSTCODE_PROVIDER === 'postcode-eu' && POSTCODE_API_KEY && POSTCODE_API_SECRET) {
    return 'postcode-eu'
  }
  return 'mock'
}
