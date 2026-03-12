/**
 * AI Page Generation API
 *
 * POST /api/ai/generate-page
 * Body: { pagePurpose, pageType?, businessInfo?, preferences? }
 * Returns: { success, pageStructure, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { pageGenerator } from '@/features/ai/lib/services/pageGenerator'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { pagePurpose, pageType, businessInfo, preferences, language } = body

    if (!pagePurpose?.trim()) {
      return NextResponse.json(
        { success: false, error: 'pagePurpose is verplicht' },
        { status: 400 },
      )
    }

    const result = await pageGenerator.generatePage({
      pagePurpose,
      pageType: pageType || 'custom',
      businessInfo,
      preferences,
      language: language || 'nl',
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      pageStructure: result.data,
    })
  } catch (error) {
    console.error('AI generate-page error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
