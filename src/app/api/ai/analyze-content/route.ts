/**
 * AI Content Analysis API
 *
 * POST /api/ai/analyze-content
 * Body: { content, language?, focusAreas?, includeGrammarCheck?, type? }
 *   type = 'full' | 'readability' | 'tone' | 'grammar' | 'structure' | 'sentiment' | 'improvements'
 * Returns: { success, data, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contentAnalyzer } from '@/features/ai/lib/services/contentAnalyzer'

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
    const { content, language, focusAreas, includeGrammarCheck, type = 'full' } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is verplicht' },
        { status: 400 },
      )
    }

    let result

    switch (type) {
      case 'readability':
        result = await contentAnalyzer.analyzeReadability(content)
        break
      case 'tone':
        result = await contentAnalyzer.analyzeTone(content)
        break
      case 'grammar':
        result = await contentAnalyzer.checkGrammar(content, language || 'nl')
        break
      case 'structure':
        result = await contentAnalyzer.analyzeStructure(content)
        break
      case 'sentiment':
        result = await contentAnalyzer.analyzeSentiment(content)
        break
      case 'improvements':
        result = await contentAnalyzer.getImprovementSuggestions(content, focusAreas)
        break
      case 'full':
      default:
        result = await contentAnalyzer.analyzeContent(content, {
          language: language || 'nl',
          focusAreas,
          includeGrammarCheck: includeGrammarCheck ?? true,
        })
        break
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      analysis: result.data, // AIContentAnalyzer + AI playground expect this key
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI analyze-content error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
