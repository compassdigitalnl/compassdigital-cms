/**
 * Stock Photos Search API
 *
 * GET /api/stock-photos/search?q=medical&page=1&perPage=24&orientation=landscape&source=all
 */
import { NextRequest, NextResponse } from 'next/server'
import { stockPhotoService } from '@/features/stock-photos/lib/StockPhotoService'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  // Auth check — only logged-in admin/editor users
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '24')
  const orientation = searchParams.get('orientation') as 'landscape' | 'portrait' | 'square' | undefined
  const source = (searchParams.get('source') || 'all') as 'unsplash' | 'pexels' | 'all'

  if (!query.trim()) {
    return NextResponse.json({
      photos: [],
      totalPages: 0,
      totalResults: 0,
      source: 'none',
      availableSources: stockPhotoService.availableSources,
    })
  }

  const result = await stockPhotoService.search({
    query,
    page,
    perPage,
    orientation: orientation || undefined,
    source,
  })

  return NextResponse.json({
    ...result,
    availableSources: stockPhotoService.availableSources,
  })
}
