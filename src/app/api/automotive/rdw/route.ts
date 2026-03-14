import { NextRequest, NextResponse } from 'next/server'

/**
 * RDW Kenteken Lookup API
 *
 * GET /api/automotive/rdw?kenteken=XX-XXX-X
 *
 * Zoekt voertuiggegevens op via de RDW Open Data API.
 * Strips dashes/spaces, uppercases the plate before querying.
 */

const RDW_API_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json'

type RdwRecord = {
  kenteken?: string
  merk?: string
  handelsbenaming?: string
  datum_eerste_toelating?: string
  brandstof_omschrijving?: string
  eerste_kleur?: string
  inrichting?: string
  massa_rijklaar?: string
  vervaldatum_apk?: string
}

type RdwResponse = {
  brand: string
  model: string
  year: number | null
  fuel: string
  color: string
  bodyType: string
  weight: number | null
  apkExpiry: string | null
}

function parseYear(dateStr?: string): number | null {
  if (!dateStr || dateStr.length < 4) return null
  // RDW date format: YYYYMMDD
  const year = parseInt(dateStr.substring(0, 4), 10)
  return isNaN(year) ? null : year
}

function formatApkDate(dateStr?: string): string | null {
  if (!dateStr || dateStr.length < 8) return null
  // RDW date format: YYYYMMDD -> YYYY-MM-DD
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  return `${year}-${month}-${day}`
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawKenteken = searchParams.get('kenteken')

    if (!rawKenteken) {
      return NextResponse.json(
        { error: 'Kenteken is verplicht' },
        { status: 400 },
      )
    }

    // Normalize: remove dashes, spaces, uppercase
    const kenteken = rawKenteken.replace(/[-\s]/g, '').toUpperCase()

    if (kenteken.length < 4 || kenteken.length > 8) {
      return NextResponse.json(
        { error: 'Ongeldig kenteken formaat' },
        { status: 400 },
      )
    }

    const response = await fetch(`${RDW_API_URL}?kenteken=${kenteken}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`[automotive/rdw] RDW API responded with ${response.status}`)
      return NextResponse.json(
        { error: 'Fout bij ophalen voertuiggegevens van RDW' },
        { status: 502 },
      )
    }

    const data: RdwRecord[] = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Geen voertuig gevonden voor dit kenteken' },
        { status: 404 },
      )
    }

    const record = data[0]

    const result: RdwResponse = {
      brand: record.merk || '',
      model: record.handelsbenaming || '',
      year: parseYear(record.datum_eerste_toelating),
      fuel: record.brandstof_omschrijving || '',
      color: record.eerste_kleur || '',
      bodyType: record.inrichting || '',
      weight: record.massa_rijklaar ? parseInt(record.massa_rijklaar, 10) : null,
      apkExpiry: formatApkDate(record.vervaldatum_apk),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[automotive/rdw] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het opzoeken van het kenteken' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
