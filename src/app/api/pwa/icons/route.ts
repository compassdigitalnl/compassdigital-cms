/**
 * Dynamic PWA Icon Generation Route
 *
 * Serves /api/pwa/icons?size=192&purpose=any
 *
 * Attempts to read the logo or favicon from Payload CMS Settings.
 * If no image is uploaded, generates a colored square with the company initial.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateIcon, generateFallbackIcon } from '@/features/pwa/lib/icon-generator'
import { DEFAULT_THEME_COLOR } from '@/features/pwa/lib/types'
import type { IconPurpose } from '@/features/pwa/lib/types'
import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const size = Math.min(Math.max(Number(searchParams.get('size')) || 192, 16), 1024)
  const purpose = (searchParams.get('purpose') as IconPurpose) || 'any'

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' })

    const companyName = (settings.companyName as string) || 'C'
    const themeColor = (settings.primaryColor as string) || DEFAULT_THEME_COLOR

    // Try to get the source image from settings (favicon first, then logo)
    let sourceBuffer: Buffer | null = null

    // Try favicon
    if (settings.favicon && typeof settings.favicon === 'object' && 'filename' in settings.favicon) {
      sourceBuffer = await tryReadMediaFile(settings.favicon.filename as string)
    }

    // Fallback to logo
    if (!sourceBuffer && settings.logo && typeof settings.logo === 'object' && 'filename' in settings.logo) {
      sourceBuffer = await tryReadMediaFile(settings.logo.filename as string)
    }

    let iconBuffer: Buffer

    if (sourceBuffer) {
      iconBuffer = await generateIcon(sourceBuffer, size, purpose, themeColor)
    } else {
      // No uploaded image — generate a branded fallback
      iconBuffer = await generateFallbackIcon(companyName, size, themeColor)
    }

    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    })
  } catch (error) {
    console.error('[PWA Icons] Fout bij genereren icoon:', error)

    // Last resort: generate a simple fallback
    const fallback = await generateFallbackIcon('C', size)
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}

/**
 * Try to read a media file from the Payload media directory.
 * Returns null if the file cannot be read.
 */
async function tryReadMediaFile(filename: string): Promise<Buffer | null> {
  try {
    // Prevent path traversal attacks
    if (filename.includes('..') || filename.includes('\0') || path.isAbsolute(filename)) {
      return null
    }
    // Payload stores uploads in the media directory (configurable, defaults to ./media)
    const mediaDir = path.resolve(process.cwd(), 'media')
    const filePath = path.join(mediaDir, filename)
    // Double-check resolved path stays within media directory
    if (!filePath.startsWith(mediaDir)) {
      return null
    }
    const buffer = await fs.readFile(filePath)
    return buffer
  } catch {
    return null
  }
}
