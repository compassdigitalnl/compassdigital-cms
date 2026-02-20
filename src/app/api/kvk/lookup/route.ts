import { NextRequest, NextResponse } from 'next/server'
import { lookupKVK, isKVKLookupAvailable, getKVKMode } from '@/lib/kvk/client'

/**
 * GET /api/kvk/lookup?kvk=12345678
 *
 * Lookup company data by KVK number (Chamber of Commerce)
 *
 * Usage:
 * fetch('/api/kvk/lookup?kvk=12345678')
 *   .then(res => res.json())
 *   .then(data => console.log(data.company))
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const kvkNumber = searchParams.get('kvk')

    // Validate input
    if (!kvkNumber) {
      return NextResponse.json(
        {
          error: 'Missing KVK number',
          message: 'Please provide a KVK number in the query parameter: ?kvk=12345678',
        },
        { status: 400 }
      )
    }

    // Check if KVK lookup is available
    if (!isKVKLookupAvailable()) {
      return NextResponse.json(
        {
          error: 'KVK lookup not available',
          message: 'KVK lookup is disabled. Please enable ENABLE_KVK_LOOKUP in .env',
        },
        { status: 503 }
      )
    }

    // Lookup company data
    const company = await lookupKVK(kvkNumber)

    if (!company) {
      return NextResponse.json(
        {
          error: 'Company not found',
          message: `Geen bedrijf gevonden met KVK nummer ${kvkNumber}`,
          kvkNumber,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      company,
      mode: getKVKMode(), // 'mock' or 'real'
    })
  } catch (error: any) {
    console.error('❌ KVK lookup API error:', error)

    return NextResponse.json(
      {
        error: 'KVK lookup failed',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
