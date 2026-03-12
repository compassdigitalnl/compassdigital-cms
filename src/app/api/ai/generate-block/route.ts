/**
 * AI Block Generation API
 *
 * POST /api/ai/generate-block
 * Body: { blockType, mode?, customPrompt?, businessInfo?, language? }
 * Returns: { success, blockData, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { blockGenerator } from '@/features/ai/lib/services/blockGenerator'

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
    const { blockType, mode, customPrompt, businessInfo, language } = body

    if (!blockType) {
      return NextResponse.json(
        { success: false, error: 'blockType is verplicht' },
        { status: 400 },
      )
    }

    const result = await blockGenerator.generateBlock({
      blockType,
      mode: mode || 'smart',
      customPrompt,
      businessInfo,
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
      blockData: result.data,
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI generate-block error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
