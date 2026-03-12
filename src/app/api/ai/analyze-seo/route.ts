/**
 * AI SEO Analysis API
 *
 * POST /api/ai/analyze-seo
 * Body: { content, title?, metaDescription?, targetKeywords?, url?, language?, action? }
 *   action = 'analyze' (default) | 'meta-tags' | 'keywords' | 'optimize' | 'schema' | 'slug'
 * Returns: { success, analysis|data, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seoOptimizer } from '@/features/ai/lib/services/seoOptimizer'

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
    const { action = 'analyze', ...params } = body

    let result

    switch (action) {
      case 'analyze':
      default:
        if (!params.content?.trim()) {
          return NextResponse.json({ success: false, error: 'Content is verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.analyzeContent({
          content: params.content,
          title: params.title,
          metaDescription: params.metaDescription,
          targetKeywords: params.targetKeywords,
          url: params.url,
          language: params.language,
        })
        // AISEOOptimizer component expects { success, analysis }
        if (result.success) {
          return NextResponse.json({
            success: true,
            analysis: result.data,
            tokensUsed: result.tokensUsed,
            model: result.model,
          })
        }
        break

      case 'meta-tags':
        if (!params.content?.trim()) {
          return NextResponse.json({ success: false, error: 'Content is verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.generateMetaTags({
          content: params.content,
          title: params.title,
          targetKeywords: params.targetKeywords,
          language: params.language,
          pageType: params.pageType,
        })
        break

      case 'keywords':
        if (!params.topic?.trim()) {
          return NextResponse.json({ success: false, error: 'Topic is verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.researchKeywords({
          topic: params.topic,
          industry: params.industry,
          targetAudience: params.targetAudience,
          language: params.language,
          includeQuestions: params.includeQuestions,
        })
        break

      case 'optimize':
        if (!params.content?.trim() || !params.targetKeywords?.length) {
          return NextResponse.json({ success: false, error: 'Content en targetKeywords zijn verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.optimizeContent(params.content, params.targetKeywords)
        break

      case 'schema':
        if (!params.type || !params.data) {
          return NextResponse.json({ success: false, error: 'Type en data zijn verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.generateSchemaMarkup({ type: params.type, data: params.data })
        break

      case 'slug':
        if (!params.title?.trim()) {
          return NextResponse.json({ success: false, error: 'Title is verplicht' }, { status: 400 })
        }
        result = await seoOptimizer.generateSlug(params.title, params.keywords)
        break
    }

    if (!result || !result.success) {
      return NextResponse.json(
        { success: false, error: result?.error || 'Analyse mislukt' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed,
      model: result.model,
    })
  } catch (error) {
    console.error('AI analyze-seo error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
