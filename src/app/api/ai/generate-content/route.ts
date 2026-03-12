/**
 * AI Content Generation API
 *
 * POST /api/ai/generate-content
 * Body: { prompt, tone?, language?, maxTokens?, temperature?, context? }
 * Returns: { success, content, error?, tokensUsed?, model? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contentGenerator } from '@/features/ai/lib/services/contentGenerator'

export async function POST(request: NextRequest) {
  // Auth check — only logged-in admin/editor users
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
    const { prompt, tone, language, maxTokens, temperature, context } = body

    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Prompt is verplicht' },
        { status: 400 },
      )
    }

    const result = await contentGenerator.generateContent({
      prompt,
      tone: tone || 'professional',
      language: language || 'nl',
      maxTokens: maxTokens || 1000,
      temperature: temperature || 0.7,
      context,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      content: result.data,
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI generate-content error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
