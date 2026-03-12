/**
 * Stock Photos Download API
 *
 * POST /api/stock-photos/download
 * Body: { photo: StockPhoto }
 *
 * Downloads a stock photo and saves it to the Media collection.
 * Returns the created Media document.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stockPhotoService } from '@/features/stock-photos/lib/StockPhotoService'
import type { StockPhoto } from '@/features/stock-photos/lib/StockPhotoService'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
  // Auth check
  let payload
  try {
    payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const photo = body.photo as StockPhoto

    if (!photo || !photo.fullUrl) {
      return NextResponse.json({ error: 'Missing photo data' }, { status: 400 })
    }

    // Download the image
    const { buffer, filename, mimeType, alt, caption } =
      await stockPhotoService.downloadPhoto(photo)

    // Write to a temp file (Payload requires a file path for upload)
    const tmpDir = path.join(process.cwd(), 'tmp')
    await fs.mkdir(tmpDir, { recursive: true })
    const tmpPath = path.join(tmpDir, filename)
    await fs.writeFile(tmpPath, buffer)

    // Create Media document via Payload local API
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: filename,
        size: buffer.length,
      },
    })

    // Clean up temp file
    await fs.unlink(tmpPath).catch(() => {})

    return NextResponse.json({
      success: true,
      media: {
        id: mediaDoc.id,
        url: mediaDoc.url,
        alt: mediaDoc.alt,
        filename: mediaDoc.filename,
      },
      attribution: caption,
    })
  } catch (error: any) {
    console.error('[StockPhotos] Download error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to download photo' },
      { status: 500 },
    )
  }
}
