/**
 * Image Service
 * Generates placeholder images using Picsum Photos (with optional Unsplash upgrade)
 */

interface ImageOptions {
  width?: number
  height?: number
  keyword?: string
  grayscale?: boolean
  blur?: boolean
}

export class ImageService {
  /**
   * Generate a deterministic seed from a keyword
   * Same keyword = same image (consistent across generations)
   */
  private generateSeed(keyword: string): string {
    // Simple hash function to generate consistent seeds
    let hash = 0
    for (let i = 0; i < keyword.length; i++) {
      const char = keyword.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    // Convert to positive seed
    return Math.abs(hash).toString()
  }

  /**
   * Get a placeholder image URL
   * Uses Picsum Photos with deterministic seeds
   */
  getPlaceholderUrl(options: ImageOptions = {}): string {
    const {
      width = 1200,
      height = 800,
      keyword = 'default',
      grayscale = false,
      blur = false,
    } = options

    const seed = this.generateSeed(keyword)

    // Build Picsum URL with seed
    let url = `https://picsum.photos/seed/${seed}/${width}/${height}`

    // Add modifiers
    const params: string[] = []
    if (grayscale) params.push('grayscale')
    if (blur) params.push('blur')

    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    return url
  }

  /**
   * Get a hero image (wide landscape)
   */
  getHeroImage(keyword: string): string {
    return this.getPlaceholderUrl({
      width: 1920,
      height: 1080,
      keyword: `hero-${keyword}`,
    })
  }

  /**
   * Get a team member photo (square portrait)
   */
  getTeamMemberImage(name: string): string {
    return this.getPlaceholderUrl({
      width: 400,
      height: 400,
      keyword: `person-${name}`,
    })
  }

  /**
   * Get a case/portfolio image (landscape)
   */
  getCaseImage(projectName: string): string {
    return this.getPlaceholderUrl({
      width: 800,
      height: 600,
      keyword: `project-${projectName}`,
    })
  }

  /**
   * Get a blog post featured image (landscape)
   */
  getBlogImage(title: string): string {
    return this.getPlaceholderUrl({
      width: 1200,
      height: 630,
      keyword: `blog-${title}`,
    })
  }

  /**
   * Get a generic content image
   */
  getContentImage(keyword: string, aspectRatio: '16:9' | '4:3' | '1:1' = '16:9'): string {
    const dimensions = {
      '16:9': { width: 1600, height: 900 },
      '4:3': { width: 1200, height: 900 },
      '1:1': { width: 800, height: 800 },
    }

    const { width, height } = dimensions[aspectRatio]

    return this.getPlaceholderUrl({
      width,
      height,
      keyword,
    })
  }

  /**
   * Future: Unsplash integration (when API key is available)
   * This would search Unsplash for real, relevant images
   */
  async getUnsplashImage(keyword: string): Promise<string | null> {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY

    if (!apiKey) {
      return null // Fallback to Picsum
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        },
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular
      }

      return null
    } catch (error) {
      console.error('[ImageService] Unsplash API error:', error)
      return null
    }
  }
}

// Export singleton instance
export const imageService = new ImageService()
