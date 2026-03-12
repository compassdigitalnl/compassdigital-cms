/**
 * AI Image Generation API (DALL-E)
 *
 * POST /api/ai/generate-image
 * Body: { prompt, size?, quality?, style?, type?, description?, brandColors? }
 *   type = 'custom' | 'hero' | 'featured' | 'service-icon' | 'team-photo'
 * Returns: { success, image: { url, revisedPrompt }, error? }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { imageGenerator } from '@/features/ai/lib/services/imageGenerator'

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
    const { type = 'custom', prompt, size, quality, style, description, brandColors, title } = body

    let result

    switch (type) {
      case 'hero':
        if (!description?.trim()) {
          return NextResponse.json({ success: false, error: 'description is verplicht voor hero images' }, { status: 400 })
        }
        result = await imageGenerator.generateHeroImage(description, brandColors)
        break

      case 'featured':
        if (!title?.trim() || !description?.trim()) {
          return NextResponse.json({ success: false, error: 'title en description zijn verplicht' }, { status: 400 })
        }
        result = await imageGenerator.generateFeaturedImage(title, description)
        break

      case 'service-icon':
        if (!description?.trim()) {
          return NextResponse.json({ success: false, error: 'description is verplicht' }, { status: 400 })
        }
        result = await imageGenerator.generateServiceIcon(description, style || 'minimalist')
        break

      case 'team-photo':
        if (!description?.trim()) {
          return NextResponse.json({ success: false, error: 'description is verplicht' }, { status: 400 })
        }
        result = await imageGenerator.generateTeamPhoto(description)
        break

      case 'custom':
      default:
        if (!prompt?.trim()) {
          return NextResponse.json({ success: false, error: 'prompt is verplicht' }, { status: 400 })
        }
        result = await imageGenerator.generateImage({
          prompt,
          size: size || '1024x1024',
          quality: quality || 'standard',
          style: style || 'natural',
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
      image: result.data,
      model: result.model,
    })
  } catch (error) {
    console.error('AI generate-image error:', error)
    return NextResponse.json(
      { success: false, error: 'Afbeelding genereren mislukt' },
      { status: 500 },
    )
  }
}
