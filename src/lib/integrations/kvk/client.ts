/**
 * KVK API Client - Chamber of Commerce Data Lookup
 *
 * Allows automatic company data lookup during B2B registration
 *
 * API Documentation: https://developers.kvk.nl
 * Free tier: 100 requests/month
 * Paid: €50/month for 5,000 requests
 */

export interface KVKCompanyData {
  kvkNumber: string
  name: string
  tradeName?: string
  legalForm?: string
  address: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
    country: string
  }
  website?: string
  phone?: string
  email?: string
  established?: string
}

const KVK_API_URL = process.env.KVK_API_URL || 'https://api.kvk.nl/api/v1/zoeken'
const KVK_API_KEY = process.env.KVK_API_KEY
const ENABLE_KVK_LOOKUP = process.env.ENABLE_KVK_LOOKUP === 'true'

/**
 * Mock KVK data for development/testing
 */
const MOCK_KVK_DATA: Record<string, KVKCompanyData> = {
  '12345678': {
    kvkNumber: '12345678',
    name: 'Demo Bedrijf Nederland B.V.',
    tradeName: 'Demo Bedrijf',
    legalForm: 'B.V.',
    address: {
      street: 'Hoofdstraat',
      houseNumber: '123',
      postalCode: '1234 AB',
      city: 'Amsterdam',
      country: 'Nederland',
    },
    website: 'https://www.example.com',
    phone: '+31 20 123 4567',
    email: 'info@example.com',
    established: '2015-03-15',
  },
  '87654321': {
    kvkNumber: '87654321',
    name: 'Zorginstituut de Zonnebloem',
    tradeName: 'De Zonnebloem',
    legalForm: 'Stichting',
    address: {
      street: 'Kerkstraat',
      houseNumber: '45',
      postalCode: '5678 CD',
      city: 'Utrecht',
      country: 'Nederland',
    },
    phone: '+31 30 987 6543',
    established: '2010-01-20',
  },
}

/**
 * Lookup company data by KVK number
 */
export async function lookupKVK(kvkNumber: string): Promise<KVKCompanyData | null> {
  // Remove any spaces or dashes
  const cleanKVK = kvkNumber.replace(/[\s-]/g, '')

  // Validate format (8 digits)
  if (!/^\d{8}$/.test(cleanKVK)) {
    throw new Error('KVK nummer moet 8 cijfers bevatten')
  }

  // If KVK lookup is disabled or no API key, use mock data
  if (!ENABLE_KVK_LOOKUP || !KVK_API_KEY) {
    console.log('📋 Using mock KVK data for:', cleanKVK)
    return MOCK_KVK_DATA[cleanKVK] || null
  }

  try {
    console.log('🔍 Fetching real KVK data for:', cleanKVK)

    const response = await fetch(`${KVK_API_URL}?kvkNummer=${cleanKVK}`, {
      method: 'GET',
      headers: {
        'apikey': KVK_API_KEY,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // Company not found
      }
      throw new Error(`KVK API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform KVK API response to our format
    const company = data.resultaten?.[0]
    if (!company) {
      return null
    }

    return {
      kvkNumber: company.kvkNummer,
      name: company.handelsnaam || company.naam,
      tradeName: company.handelsnaam,
      legalForm: company.rechtsvorm,
      address: {
        street: company.adres?.straatnaam || '',
        houseNumber: company.adres?.huisnummer || '',
        postalCode: company.adres?.postcode || '',
        city: company.adres?.plaats || '',
        country: 'Nederland',
      },
      website: company.website,
      phone: company.telefoonnummer,
      established: company.datumOprichting,
    }
  } catch (error) {
    console.error('❌ KVK lookup failed:', error)
    throw error
  }
}

/**
 * Check if KVK lookup is available
 */
export function isKVKLookupAvailable(): boolean {
  return ENABLE_KVK_LOOKUP && (!!KVK_API_KEY || !!MOCK_KVK_DATA)
}

/**
 * Get KVK lookup mode (mock or real)
 */
export function getKVKMode(): 'mock' | 'real' | 'disabled' {
  if (!ENABLE_KVK_LOOKUP) return 'disabled'
  if (!KVK_API_KEY) return 'mock'
  return 'real'
}
