/**
 * AI Image Save to Media API
 *
 * POST /api/ai/save-image
 * Body: { imageUrl, alt?, filename? }
 *
 * Downloads an AI-generated image (e.g. from DALL-E) and saves it
 * to the Payload Media collection.
 * Returns the created Media document.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  let payload
  try {
    payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { imageUrl, alt, filename: customFilename } = body

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'imageUrl is verplicht' },
        { status: 400 },
      )
    }

    // Download the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Kon afbeelding niet downloaden' },
        { status: 500 },
      )
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = imageResponse.headers.get('content-type') || 'image/png'

    // Determine file extension from content type
    const extMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
    }
    const ext = extMap[contentType] || '.png'
    const filename = customFilename
      ? `${customFilename.replace(/\.[^.]+$/, '')}${ext}`
      : `ai-generated-${Date.now()}${ext}`

    // Create Media document via Payload local API
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: alt || 'AI-gegenereerde afbeelding',
      },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
    })

    return NextResponse.json({
      success: true,
      media: {
        id: mediaDoc.id,
        url: mediaDoc.url,
        alt: mediaDoc.alt,
        filename: mediaDoc.filename,
      },
    })
  } catch (error) {
    console.error('[AI] Save image error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onbekende fout' },
      { status: 500 },
    )
  }
}
