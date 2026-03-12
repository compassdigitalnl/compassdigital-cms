/**
 * AI Translation API
 *
 * POST /api/ai/translate
 * Body: { action, ...params }
 *   action = 'translate' | 'detect' | 'translate-multiple' | 'generate' | 'localize'
 * Returns: { success, data, error? }
 *
 * GET /api/ai/translate/languages
 * Returns: { languages: [...] }
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
    const { action = 'translate', ...params } = body

    let result

    switch (action) {
      case 'translate':
        if (!params.content?.trim() || !params.targetLanguage) {
          return NextResponse.json(
            { success: false, error: 'Content en targetLanguage zijn verplicht' },
            { status: 400 },
          )
        }
        result = await translationService.translate(params.content, params.targetLanguage, {
          sourceLanguage: params.sourceLanguage,
          tone: params.tone,
          formality: params.formality,
          preserveFormatting: params.preserveFormatting,
        })
        break

      case 'detect':
        if (!params.content?.trim()) {
          return NextResponse.json(
            { success: false, error: 'Content is verplicht' },
            { status: 400 },
          )
        }
        result = await translationService.detectLanguage(params.content)
        break

      case 'translate-multiple':
        if (!params.content?.trim() || !params.targetLanguages?.length) {
          return NextResponse.json(
            { success: false, error: 'Content en targetLanguages zijn verplicht' },
            { status: 400 },
          )
        }
        result = await translationService.translateMultiple(params.content, params.targetLanguages, {
          sourceLanguage: params.sourceLanguage,
          tone: params.tone,
          formality: params.formality,
          preserveFormatting: params.preserveFormatting,
        })
        break

      case 'generate':
        if (!params.prompt?.trim() || !params.targetLanguage) {
          return NextResponse.json(
            { success: false, error: 'Prompt en targetLanguage zijn verplicht' },
            { status: 400 },
          )
        }
        result = await translationService.generateInLanguage(params.prompt, params.targetLanguage, {
          tone: params.tone,
          context: params.context,
          maxTokens: params.maxTokens,
        })
        break

      case 'localize':
        if (!params.content?.trim() || !params.targetLanguage) {
          return NextResponse.json(
            { success: false, error: 'Content en targetLanguage zijn verplicht' },
            { status: 400 },
          )
        }
        result = await translationService.localize(params.content, params.targetLanguage, {
          region: params.region,
          culturalAdaptation: params.culturalAdaptation,
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: `Onbekende actie: ${action}` },
          { status: 400 },
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    // Return data under both 'data' and 'translation' keys
    // AITranslator component expects 'translation', other consumers use 'data'
    return NextResponse.json({
      success: true,
      data: result.data,
      translation: result.data,
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI translate error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    languages: translationService.getSupportedLanguages(),
  })
}
