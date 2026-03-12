/**
 * Stock Photo Service
 *
 * Unified search interface for Unsplash and Pexels stock photo APIs.
 * Falls back gracefully when API keys are not configured.
 */

export interface StockPhoto {
  id: string
  source: 'unsplash' | 'pexels'
  previewUrl: string
  fullUrl: string
  downloadUrl: string
  width: number
  height: number
  alt: string
  photographer: string
  photographerUrl: string
  color: string | null
}

export interface StockPhotoSearchOptions {
  query: string
  page?: number
  perPage?: number
  orientation?: 'landscape' | 'portrait' | 'square'
  source?: 'unsplash' | 'pexels' | 'all'
}

export interface StockPhotoSearchResult {
  photos: StockPhoto[]
  totalPages: number
  totalResults: number
  source: string
}

export class StockPhotoService {
  private unsplashKey: string | undefined
  private pexelsKey: string | undefined

  constructor() {
    this.unsplashKey = process.env.UNSPLASH_ACCESS_KEY
    this.pexelsKey = process.env.PEXELS_API_KEY
  }

  get availableSources(): string[] {
    const sources: string[] = []
    if (this.unsplashKey) sources.push('unsplash')
    if (this.pexelsKey) sources.push('pexels')
    return sources
  }

  async search(options: StockPhotoSearchOptions): Promise<StockPhotoSearchResult> {
    const { source = 'all', query, page = 1, perPage = 24, orientation } = options

    if (!query.trim()) {
      return { photos: [], totalPages: 0, totalResults: 0, source: 'none' }
    }

    const results: StockPhoto[] = []
    let totalResults = 0
    let totalPages = 0
    const usedSources: string[] = []

    // Search Unsplash
    if ((source === 'all' || source === 'unsplash') && this.unsplashKey) {
      try {
        const unsplashResult = await this.searchUnsplash(query, page, perPage, orientation)
        results.push(...unsplashResult.photos)
        totalResults += unsplashResult.totalResults
        totalPages = Math.max(totalPages, unsplashResult.totalPages)
        usedSources.push('unsplash')
      } catch (err) {
        console.error('[StockPhotos] Unsplash search error:', err)
      }
    }

    // Search Pexels
    if ((source === 'all' || source === 'pexels') && this.pexelsKey) {
      try {
        const pexelsResult = await this.searchPexels(query, page, perPage, orientation)
        results.push(...pexelsResult.photos)
        totalResults += pexelsResult.totalResults
        totalPages = Math.max(totalPages, pexelsResult.totalPages)
        usedSources.push('pexels')
      } catch (err) {
        console.error('[StockPhotos] Pexels search error:', err)
      }
    }

    // Interleave results from both sources for mixed display
    if (usedSources.length === 2) {
      const unsplash = results.filter((p) => p.source === 'unsplash')
      const pexels = results.filter((p) => p.source === 'pexels')
      const interleaved: StockPhoto[] = []
      const maxLen = Math.max(unsplash.length, pexels.length)
      for (let i = 0; i < maxLen; i++) {
        if (i < unsplash.length) interleaved.push(unsplash[i])
        if (i < pexels.length) interleaved.push(pexels[i])
      }
      return { photos: interleaved, totalPages, totalResults, source: usedSources.join('+') }
    }

    return {
      photos: results,
      totalPages,
      totalResults,
      source: usedSources.join('+') || 'none',
    }
  }

  private async searchUnsplash(
    query: string,
    page: number,
    perPage: number,
    orientation?: string,
  ): Promise<StockPhotoSearchResult> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    })
    if (orientation) params.set('orientation', orientation)

    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${this.unsplashKey}` },
    })

    if (!res.ok) throw new Error(`Unsplash API ${res.status}: ${res.statusText}`)

    const data = await res.json()

    const photos: StockPhoto[] = (data.results || []).map((item: any) => ({
      id: `unsplash-${item.id}`,
      source: 'unsplash' as const,
      previewUrl: item.urls?.small || item.urls?.regular,
      fullUrl: item.urls?.regular,
      downloadUrl: item.links?.download_location || item.urls?.full,
      width: item.width,
      height: item.height,
      alt: item.alt_description || item.description || query,
      photographer: item.user?.name || 'Unknown',
      photographerUrl: item.user?.links?.html || '',
      color: item.color || null,
    }))

    return {
      photos,
      totalPages: data.total_pages || 0,
      totalResults: data.total || 0,
      source: 'unsplash',
    }
  }

  private async searchPexels(
    query: string,
    page: number,
    perPage: number,
    orientation?: string,
  ): Promise<StockPhotoSearchResult> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    })
    if (orientation) params.set('orientation', orientation)

    const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: this.pexelsKey! },
    })

    if (!res.ok) throw new Error(`Pexels API ${res.status}: ${res.statusText}`)

    const data = await res.json()

    const photos: StockPhoto[] = (data.photos || []).map((item: any) => ({
      id: `pexels-${item.id}`,
      source: 'pexels' as const,
      previewUrl: item.src?.medium || item.src?.large,
      fullUrl: item.src?.large2x || item.src?.large,
      downloadUrl: item.src?.original,
      width: item.width,
      height: item.height,
      alt: item.alt || query,
      photographer: item.photographer || 'Unknown',
      photographerUrl: item.photographer_url || '',
      color: item.avg_color || null,
    }))

    return {
      photos,
      totalPages: Math.ceil((data.total_results || 0) / perPage),
      totalResults: data.total_results || 0,
      source: 'pexels',
    }
  }

  /**
   * Download a stock photo and return the buffer + metadata.
   * For Unsplash, triggers the required download tracking endpoint.
   */
  async downloadPhoto(photo: StockPhoto): Promise<{
    buffer: Buffer
    filename: string
    mimeType: string
    alt: string
    caption: string
  }> {
    // Unsplash requires triggering their download endpoint for attribution tracking
    if (photo.source === 'unsplash' && this.unsplashKey && photo.downloadUrl.includes('unsplash.com')) {
      try {
        await fetch(photo.downloadUrl, {
          headers: { Authorization: `Client-ID ${this.unsplashKey}` },
        })
      } catch {
        // Non-critical — tracking only
      }
    }

    // Download the actual image (with SSRF protection)
    const imageUrl = photo.fullUrl
    const allowedHosts = [
      'images.unsplash.com',
      'unsplash.com',
      'images.pexels.com',
      'www.pexels.com',
    ]
    try {
      const urlObj = new URL(imageUrl)
      if (!allowedHosts.some((h) => urlObj.hostname === h || urlObj.hostname.endsWith(`.${h}`))) {
        throw new Error('Image URL not from allowed source')
      }
    } catch (e) {
      throw new Error('Invalid image URL')
    }
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
    const safeName = photo.alt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60)

    const filename = `${photo.source}-${safeName}-${Date.now()}.${ext}`
    const caption = `Foto door ${photo.photographer} via ${photo.source === 'unsplash' ? 'Unsplash' : 'Pexels'}`

    return { buffer, filename, mimeType: contentType, alt: photo.alt, caption }
  }
}

export const stockPhotoService = new StockPhotoService()
