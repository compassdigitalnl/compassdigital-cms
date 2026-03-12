/**
 * AI Multi-Language Translation API
 *
 * POST /api/ai/translate-multiple
 * Body: { content, targetLanguages: ['en', 'de', 'fr'], sourceLanguage?, tone?, formality?, preserveFormatting? }
 * Returns: { success, data: { original, translations }, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { translationService } from '@/features/ai/lib/services/translationService'

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
    const { content, targetLanguages, sourceLanguage, tone, formality, preserveFormatting } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is verplicht' },
        { status: 400 },
      )
    }

    if (!targetLanguages?.length) {
      return NextResponse.json(
        { success: false, error: 'targetLanguages is verplicht (array van taalcodes)' },
        { status: 400 },
      )
    }

    const result = await translationService.translateMultiple(content, targetLanguages, {
      sourceLanguage: sourceLanguage || 'auto',
      tone: tone || 'preserve',
      formality: formality || 'preserve',
      preserveFormatting: preserveFormatting ?? true,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      multiLangContent: result.data, // AIMultiLanguage component expects this key
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI translate-multiple error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
