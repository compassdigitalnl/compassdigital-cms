/**
 * AI-Powered Site Generator API Endpoint
 *
 * Uses SiteGeneratorService with OpenAI GPT-4 for professional content generation.
 * Generates complete websites with SEO-optimized copy, metadata, and structure.
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for AI processing
export const runtime = 'nodejs' // Use Node.js runtime for OpenAI SDK
export const preferredRegion = 'auto' // Auto-select best region

interface GenerateSiteRequest {
  wizardData: WizardState
  sseConnectionId: string
}

/**
 * Generate site with AI
 * Background process that uses SiteGeneratorService
 */
async function generateSiteWithAI(wizardData: WizardState, sseConnectionId: string) {
  try {
    // Create progress callback for SSE updates
    const onProgress = async (progress: number, message: string) => {
      await sendProgress(sseConnectionId, {
        type: 'progress',
        progress,
        message,
      })
    }

    // Lazy import SiteGeneratorService to avoid build-time initialization
    const { SiteGeneratorService } = await import('@/lib/siteGenerator/SiteGeneratorService')

    // Initialize AI-powered generator
    const generator = new SiteGeneratorService(onProgress)

    // Generate complete site with AI
    console.log('[AI Wizard] Starting site generation with AI...')
    const result = await generator.generateSite(wizardData)
    console.log('[AI Wizard] Site generation complete:', result.pages.length, 'pages created')

    // Send completion with preview URL and page info
    await sendProgress(sseConnectionId, {
      type: 'complete',
      data: {
        previewUrl: result.previewUrl || '/',
        pages: result.pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
      },
    })

    return result
  } catch (error: any) {
    console.error('[AI Wizard] Error:', error)

    // Send error to client via SSE
    await sendProgress(sseConnectionId, {
      type: 'error',
      error: error.message || 'AI generation failed',
    })

    throw error
  }
}

/**
 * POST /api/wizard/generate-site
 * Accepts wizard data and SSE connection ID
 * Returns immediately with job ID, generation happens in background
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateSiteRequest = await request.json()
    const { wizardData, sseConnectionId } = body

    // Validate input
    if (!wizardData || !sseConnectionId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('[AI Wizard] OPENAI_API_KEY not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'AI service not configured. Please set OPENAI_API_KEY environment variable.'
        },
        { status: 500 },
      )
    }

    // Generate unique job ID
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`
    console.log('[AI Wizard] Starting job:', jobId)

    // Start AI generation in background (non-blocking)
    generateSiteWithAI(wizardData, sseConnectionId).catch((error) => {
      console.error('[AI Wizard] Background generation failed:', error)
    })

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId,
      message: 'AI site generation started',
    })
  } catch (error: any) {
    console.error('[AI Wizard] API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
