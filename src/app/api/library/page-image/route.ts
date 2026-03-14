import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import sharp from 'sharp'

/**
 * Rate limiter — simple in-memory map
 * Tracks requests per user per minute (max 120 req/min)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 120
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60_000)

/**
 * Add a subtle watermark with the user's email as diagonal text
 */
async function addWatermark(
  imageBuffer: Buffer,
  text: string,
): Promise<Buffer> {
  const image = sharp(imageBuffer)
  const metadata = await image.metadata()
  const width = metadata.width || 800
  const height = metadata.height || 1100

  // Escape special XML characters
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}">
      <text
        x="50%" y="50%"
        font-size="20"
        fill="rgba(128,128,128,0.15)"
        text-anchor="middle"
        transform="rotate(-45 ${width / 2} ${height / 2})"
      >${escapedText}</text>
    </svg>
  `)

  return image
    .composite([{ input: svgOverlay, blend: 'over' }])
    .toBuffer()
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    // Auth check
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Rate limit check
    const userId = String(user.id)
    if (!checkRateLimit(userId)) {
      return Response.json(
        { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
        { status: 429 },
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const magazineSlug = searchParams.get('magazine')
    const editionIndex = searchParams.get('edition')
    const pageNumber = searchParams.get('page')

    if (!magazineSlug || editionIndex === null || pageNumber === null) {
      return Response.json(
        {
          error:
            'Ontbrekende parameters. Vereist: magazine, edition, page',
        },
        { status: 400 },
      )
    }

    const editionIdx = parseInt(editionIndex, 10)
    const pageNum = parseInt(pageNumber, 10)

    if (isNaN(editionIdx) || isNaN(pageNum) || pageNum < 1) {
      return Response.json(
        { error: 'Ongeldige parameters' },
        { status: 400 },
      )
    }

    // Find the magazine
    const magazineResult = await payload.find({
      collection: 'magazines',
      where: { slug: { equals: magazineSlug } },
      limit: 1,
      depth: 0,
    })

    if (magazineResult.docs.length === 0) {
      return Response.json(
        { error: 'Magazine niet gevonden' },
        { status: 404 },
      )
    }

    const magazine = magazineResult.docs[0]

    // Check that the edition exists and is digital
    const editions = (magazine.editions || []) as any[]
    const edition = editions[editionIdx]

    if (!edition || !edition.isDigital) {
      return Response.json(
        { error: 'Editie niet gevonden of niet digitaal beschikbaar' },
        { status: 404 },
      )
    }

    // Check digital availability date
    if (edition.digitalAvailableFrom) {
      const availableFrom = new Date(edition.digitalAvailableFrom)
      if (availableFrom > new Date()) {
        return Response.json(
          { error: 'Deze editie is nog niet beschikbaar' },
          { status: 403 },
        )
      }
    }

    // Subscription check — user must have an active subscription
    const subscriptions = await payload.find({
      collection: 'user-subscriptions',
      where: {
        user: { equals: user.id },
        status: { equals: 'active' },
      },
      limit: 1,
      depth: 0,
    })

    if (subscriptions.docs.length === 0) {
      return Response.json(
        { error: 'Geen actief abonnement. Een abonnement is vereist voor de digitale bibliotheek.' },
        { status: 403 },
      )
    }

    // Find the page image in digital-edition-pages
    const pageResult = await payload.find({
      collection: 'digital-edition-pages',
      where: {
        and: [
          { magazine: { equals: magazine.id } },
          { editionIndex: { equals: editionIdx } },
          { pageNumber: { equals: pageNum } },
        ],
      },
      limit: 1,
      depth: 1, // resolve pageImage upload
    })

    if (pageResult.docs.length === 0) {
      return Response.json(
        { error: 'Pagina niet gevonden' },
        { status: 404 },
      )
    }

    const page = pageResult.docs[0] as any
    const pageImage = page.pageImage as any

    if (!pageImage || !pageImage.url) {
      return Response.json(
        { error: 'Pagina-afbeelding niet beschikbaar' },
        { status: 404 },
      )
    }

    // Fetch the actual image
    const imageUrl = pageImage.url.startsWith('http')
      ? pageImage.url
      : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${pageImage.url}`

    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return Response.json(
        { error: 'Kon pagina-afbeelding niet laden' },
        { status: 500 },
      )
    }

    let imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // Apply watermark with user email
    try {
      const watermarkText = user.email || `user-${userId}`
      imageBuffer = await addWatermark(imageBuffer, watermarkText)
    } catch (wmError) {
      // If watermarking fails, serve the image without watermark
      console.warn('[Library Page Image] Watermark failed:', wmError)
    }

    // Determine content type from the original image
    const contentType = pageImage.mimeType || 'image/webp'

    // Return image with security headers
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(imageBuffer.length),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  } catch (error) {
    console.error('[Library Page Image] Error:', error)
    return Response.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
