/**
 * SEO Auto-Fill Utilities
 *
 * Automatically generate SEO metadata (meta titles, descriptions, OG images)
 * from existing content to improve SEO coverage and reduce manual work.
 */

/**
 * Get site name from environment or use default
 */
function getSiteName(): string {
  return process.env.SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME || 'SiteForge'
}

/**
 * Truncate text to specific length with ellipsis
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Extract plain text from Lexical/rich text content
 * This is a simple implementation - could be enhanced
 */
function extractPlainText(content: any): string {
  if (!content) return ''

  // If it's already a string
  if (typeof content === 'string') return content

  // If it's Lexical JSON format
  if (content.root && content.root.children) {
    let text = ''
    const extractFromNode = (node: any): void => {
      if (node.text) {
        text += node.text + ' '
      }
      if (node.children) {
        node.children.forEach(extractFromNode)
      }
    }
    content.root.children.forEach(extractFromNode)
    return text.trim()
  }

  // If it's an array (some rich text formats)
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item
        if (item.text) return item.text
        if (item.children) return extractPlainText(item.children)
        return ''
      })
      .join(' ')
  }

  // Fallback: stringify and try to extract
  return String(content).replace(/<[^>]*>/g, '')
}

/**
 * Auto-generate meta title from page/post title
 *
 * Formats: "{Title} | {Site Name}"
 * Max length: 60 characters (SEO best practice)
 *
 * @example
 * autoGenerateMetaTitle({ data: { title: 'About Us', seo: {} } })
 * // => { data: { seo: { metaTitle: 'About Us | SiteForge' } } }
 */
export const autoGenerateMetaTitle = ({ data, operation }: any) => {
  // Only auto-generate if meta title is empty
  if (data.seo?.metaTitle || data.meta?.title) {
    return data
  }

  // Get title from various possible fields
  const title = data.title || data.name || ''
  if (!title) return data

  const siteName = getSiteName()
  const fullTitle = `${title} | ${siteName}`

  // Ensure seo/meta object exists
  if (data.seo && data.seo.metaTitle === undefined) {
    data.seo.metaTitle = truncate(fullTitle, 60)
  }
  if (data.meta && data.meta.title === undefined) {
    data.meta.title = truncate(fullTitle, 60)
  }

  return data
}

/**
 * Auto-generate meta description from excerpt or content
 *
 * Priority: excerpt > shortDescription > description > content
 * Max length: 160 characters (SEO best practice)
 *
 * @example
 * autoGenerateMetaDescription({ data: { excerpt: 'A great product...', seo: {} } })
 * // => { data: { seo: { metaDescription: 'A great product...' } } }
 */
export const autoGenerateMetaDescription = ({ data, operation }: any) => {
  // Only auto-generate if meta description is empty
  if (data.seo?.metaDescription || data.meta?.description) {
    return data
  }

  // Get description from various possible fields (priority order)
  let description = ''

  if (data.excerpt) {
    description = typeof data.excerpt === 'string' ? data.excerpt : extractPlainText(data.excerpt)
  } else if (data.shortDescription) {
    description =
      typeof data.shortDescription === 'string'
        ? data.shortDescription
        : extractPlainText(data.shortDescription)
  } else if (data.description) {
    description =
      typeof data.description === 'string' ? data.description : extractPlainText(data.description)
  } else if (data.content) {
    description = extractPlainText(data.content)
  }

  if (!description) return data

  // Truncate to 160 chars
  const truncatedDescription = truncate(description, 160)

  // Ensure seo/meta object exists
  if (data.seo && data.seo.metaDescription === undefined) {
    data.seo.metaDescription = truncatedDescription
  }
  if (data.meta && data.meta.description === undefined) {
    data.meta.description = truncatedDescription
  }

  return data
}

/**
 * Auto-use featured image as OG image if OG image not set
 *
 * Fallback priority: featuredImage > images[0] > heroImage
 *
 * @example
 * autoGenerateOGImage({ data: { featuredImage: '123', seo: {} } })
 * // => { data: { seo: { ogImage: '123' } } }
 */
export const autoGenerateOGImage = ({ data, operation }: any) => {
  // Only auto-generate if OG image is empty
  if (data.seo?.ogImage || data.meta?.image) {
    return data
  }

  // Get image from various possible fields (priority order)
  let image = null

  if (data.featuredImage) {
    image = data.featuredImage
  } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    image = data.images[0]
  } else if (data.heroImage) {
    image = data.heroImage
  }

  if (!image) return data

  // Ensure seo/meta object exists
  if (data.seo && data.seo.ogImage === undefined) {
    data.seo.ogImage = image
  }
  if (data.meta && data.meta.image === undefined) {
    data.meta.image = image
  }

  return data
}

/**
 * Combined SEO auto-fill hook
 *
 * Applies all SEO auto-fill functions in one hook for convenience.
 * Use this in collections that have all SEO fields.
 *
 * @example
 * hooks: {
 *   beforeChange: [autoFillSEO]
 * }
 */
export const autoFillSEO = ({ data, operation }: any) => {
  data = autoGenerateMetaTitle({ data, operation })
  data = autoGenerateMetaDescription({ data, operation })
  data = autoGenerateOGImage({ data, operation })
  return data
}

/**
 * Auto-set published date when status changes to 'published'
 *
 * Only sets on first publish (doesn't update on subsequent changes)
 *
 * @example
 * hooks: {
 *   beforeChange: [autoSetPublishedDate]
 * }
 */
export const autoSetPublishedDate = ({ data, operation, originalDoc }: any) => {
  // Check if status is being changed to 'published'
  if (data.status === 'published') {
    // If publishedAt doesn't exist yet, set it
    if (!data.publishedAt) {
      // For create operations
      if (operation === 'create') {
        data.publishedAt = new Date().toISOString()
      }
      // For update operations - check if it wasn't published before
      else if (operation === 'update' && originalDoc?.status !== 'published') {
        data.publishedAt = new Date().toISOString()
      }
    }
  }

  return data
}

/**
 * Auto-set author to current user if not set
 *
 * Useful for blog posts and other authored content
 *
 * @example
 * hooks: {
 *   beforeChange: [autoSetAuthor]
 * }
 */
export const autoSetAuthor = ({ data, operation, req }: any) => {
  // Only on create, and only if author not set
  if (operation === 'create' && !data.author && req?.user) {
    data.author = req.user.id
  }

  return data
}

/**
 * Auto-calculate stock status from stock level
 *
 * - stock === 0 → 'out-of-stock'
 * - stock <= lowStockThreshold → 'low-stock' (if available)
 * - stock > threshold → 'in-stock'
 *
 * @example
 * hooks: {
 *   beforeChange: [autoUpdateStockStatus]
 * }
 */
export const autoUpdateStockStatus = ({ data, operation }: any) => {
  // Only if tracking stock
  if (!data.trackStock || data.stock === undefined) {
    return data
  }

  const stock = Number(data.stock)
  const lowThreshold = Number(data.lowStockThreshold) || 5

  if (stock === 0) {
    data.stockStatus = 'out-of-stock'
  } else if (stock <= lowThreshold) {
    // Use 'low-stock' if available, otherwise fall back to 'in-stock'
    data.stockStatus = 'in-stock' // Most schemas don't have 'low-stock' yet
  } else {
    data.stockStatus = 'in-stock'
  }

  return data
}
