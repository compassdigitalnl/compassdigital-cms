import React from 'react'
import type { Page, BlogPost } from '../payload-types'

type JSONLDOrganization = {
  '@context': string
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}

type JSONLDWebsite = {
  '@context': string
  '@type': 'WebSite'
  name: string
  url: string
}

type JSONLDWebPage = {
  '@context': string
  '@type': 'WebPage'
  name: string
  description?: string
  url: string
}

type JSONLDBreadcrumb = {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

type JSONLDLocalBusiness = {
  '@context': string
  '@type': 'LocalBusiness'
  name: string
  description?: string
  url: string
  telephone?: string
  email?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  priceRange?: string
  image?: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
}

type JSONLDFAQPage = {
  '@context': string
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

type JSONLDArticle = {
  '@context': string
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle'
  headline: string
  description?: string
  image?: string | string[]
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
    url?: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
  articleBody?: string
  wordCount?: number
  keywords?: string[]
}

type JSONLDService = {
  '@context': string
  '@type': 'Service'
  name: string
  description?: string
  provider: {
    '@type': 'Organization'
    name: string
    url: string
  }
  serviceType?: string
  areaServed?: string
  hasOfferCatalog?: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: Array<{
      '@type': 'Offer'
      itemOffered: {
        '@type': 'Service'
        name: string
        description?: string
      }
    }>
  }
}

type JSONLDReview = {
  '@context': string
  '@type': 'Review'
  itemReviewed: {
    '@type': string
    name: string
  }
  author: {
    '@type': 'Person'
    name: string
  }
  reviewRating: {
    '@type': 'Rating'
    ratingValue: number
    bestRating?: number
    worstRating?: number
  }
  reviewBody?: string
  datePublished?: string
}

/**
 * Generate JSON-LD structured data for a page
 */
export function generatePageJSONLD(args: {
  doc: Page
  url: string
  siteUrl: string
  siteName?: string
}): Array<JSONLDWebsite | JSONLDWebPage | JSONLDBreadcrumb | JSONLDOrganization> {
  const { doc, url, siteUrl, siteName = 'Website' } = args
  const jsonld: any[] = []

  // WebSite schema (for home page)
  if (doc.slug === '' || doc.slug === 'home') {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    })
  }

  // WebPage schema
  jsonld.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: doc.meta?.title || doc.title,
    description: doc.meta?.description,
    url,
  })

  // Breadcrumb schema (for non-home pages)
  if (doc.slug && doc.slug !== '' && doc.slug !== 'home') {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: doc.title,
        },
      ],
    })
  }

  return jsonld
}

/**
 * Generate Organization JSON-LD (should be added once globally, typically in layout)
 */
export function generateOrganizationJSONLD(args: {
  name: string
  url: string
  logo?: string
  socialLinks?: string[]
}): JSONLDOrganization {
  const { name, url, logo, socialLinks } = args

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(socialLinks && socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
  }
}

/**
 * Generate LocalBusiness JSON-LD
 * Use this for businesses with a physical location
 */
export function generateLocalBusinessJSONLD(args: {
  name: string
  description?: string
  url: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string // City
    addressRegion?: string // State/Province
    postalCode?: string
    addressCountry?: string // e.g., "NL", "US"
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[] // e.g., ["Mo-Fr 09:00-17:00"]
  priceRange?: string // e.g., "$$"
  image?: string
  rating?: {
    ratingValue: number
    reviewCount: number
  }
}): JSONLDLocalBusiness {
  const { name, description, url, telephone, email, address, geo, openingHours, priceRange, image, rating } = args

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    ...(description ? { description } : {}),
    url,
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(address ? {
      address: {
        '@type': 'PostalAddress',
        ...address,
      }
    } : {}),
    ...(geo ? {
      geo: {
        '@type': 'GeoCoordinates',
        ...geo,
      }
    } : {}),
    ...(openingHours ? { openingHours } : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(image ? { image } : {}),
    ...(rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    } : {}),
  }
}

/**
 * Generate FAQPage JSON-LD from FAQ blocks
 * Extracts FAQ items from page layout
 */
export function generateFAQPageJSONLD(args: {
  doc: Page
}): JSONLDFAQPage | null {
  const { doc } = args

  // Find all FAQ blocks in the page layout
  const faqItems: Array<{ question: string; answer: string }> = []

  if (doc.layout) {
    for (const block of doc.layout) {
      if (block.blockType === 'faq' && 'items' in block && Array.isArray(block.items)) {
        for (const item of block.items) {
          if (item.question && item.answer) {
            faqItems.push({
              question: item.question,
              answer: item.answer,
            })
          }
        }
      }
    }
  }

  // Only generate if we have FAQ items
  if (faqItems.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Generate Article JSON-LD for blog posts
 */
export function generateArticleJSONLD(args: {
  post: BlogPost
  url: string
  siteUrl: string
  siteName: string
  logoUrl?: string
}): JSONLDArticle {
  const { post, url, siteUrl, siteName, logoUrl } = args

  // Extract image URL
  let imageUrl: string | undefined
  if (post.meta?.image && typeof post.meta.image === 'object' && 'url' in post.meta.image) {
    imageUrl = `${siteUrl}${post.meta.image.url}`
  }

  // Extract author name
  let authorName = 'Anonymous'
  if (post.populatedAuthors && Array.isArray(post.populatedAuthors) && post.populatedAuthors.length > 0) {
    const firstAuthor = post.populatedAuthors[0]
    if (typeof firstAuthor === 'object' && 'name' in firstAuthor) {
      authorName = firstAuthor.name as string
    }
  }

  // Extract categories as keywords
  const keywords: string[] = []
  if (post.categories && Array.isArray(post.categories)) {
    for (const category of post.categories) {
      if (typeof category === 'object' && 'title' in category && typeof category.title === 'string') {
        keywords.push(category.title)
      }
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta?.description,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: post.publishedAt || post.createdAt,
    ...(post.updatedAt && post.updatedAt !== post.createdAt ? { dateModified: post.updatedAt } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      ...(logoUrl ? {
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        }
      } : {}),
    },
    ...(keywords.length > 0 ? { keywords } : {}),
  }
}

/**
 * Generate Service JSON-LD
 * Use this for service-based businesses
 */
export function generateServiceJSONLD(args: {
  name: string
  description?: string
  providerName: string
  providerUrl: string
  serviceType?: string
  areaServed?: string
  services?: Array<{
    name: string
    description?: string
  }>
}): JSONLDService {
  const { name, description, providerName, providerUrl, serviceType, areaServed, services } = args

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(description ? { description } : {}),
    provider: {
      '@type': 'Organization',
      name: providerName,
      url: providerUrl,
    },
    ...(serviceType ? { serviceType } : {}),
    ...(areaServed ? { areaServed } : {}),
    ...(services && services.length > 0 ? {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${name} Services`,
        itemListElement: services.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            ...(service.description ? { description: service.description } : {}),
          },
        })),
      }
    } : {}),
  }
}

/**
 * Generate AggregateRating JSON-LD from testimonials
 * Extracts ratings from testimonial blocks
 */
export function generateAggregateRatingJSONLD(args: {
  doc: Page
  itemName: string
  itemType?: string // e.g., 'Organization', 'Product', 'Service'
}): { aggregateRating: any } | null {
  const { doc, itemName, itemType = 'Organization' } = args

  // Find all testimonial blocks with ratings
  const ratings: number[] = []

  if (doc.layout) {
    for (const block of doc.layout) {
      if (block.blockType === 'testimonials' && 'testimonials' in block && Array.isArray(block.testimonials)) {
        for (const testimonial of block.testimonials) {
          if ('rating' in testimonial && typeof testimonial.rating === 'number') {
            ratings.push(testimonial.rating)
          }
        }
      }
    }
  }

  // Only generate if we have ratings
  if (ratings.length === 0) {
    return null
  }

  const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: ratings.length,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

/**
 * Enhanced page JSON-LD generator with advanced schemas
 */
export function generateAdvancedPageJSONLD(args: {
  doc: Page
  url: string
  siteUrl: string
  siteName?: string
  includeLocalBusiness?: {
    name: string
    telephone?: string
    email?: string
    address?: {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
      postalCode?: string
      addressCountry?: string
    }
    geo?: {
      latitude: number
      longitude: number
    }
    openingHours?: string[]
  }
}): any[] {
  const { doc, url, siteUrl, siteName = 'Website', includeLocalBusiness } = args
  const jsonld: any[] = []

  // Start with basic page schemas
  jsonld.push(...generatePageJSONLD({ doc, url, siteUrl, siteName }))

  // Add FAQ schema if page has FAQ blocks
  const faqSchema = generateFAQPageJSONLD({ doc })
  if (faqSchema) {
    jsonld.push(faqSchema)
  }

  // Add LocalBusiness schema if configured
  if (includeLocalBusiness) {
    const ratingData = generateAggregateRatingJSONLD({ doc, itemName: includeLocalBusiness.name })

    jsonld.push(generateLocalBusinessJSONLD({
      name: includeLocalBusiness.name,
      url: siteUrl,
      telephone: includeLocalBusiness.telephone,
      email: includeLocalBusiness.email,
      address: includeLocalBusiness.address,
      geo: includeLocalBusiness.geo,
      openingHours: includeLocalBusiness.openingHours,
      rating: ratingData?.aggregateRating ? {
        ratingValue: ratingData.aggregateRating.ratingValue,
        reviewCount: ratingData.aggregateRating.reviewCount,
      } : undefined,
    }))
  }

  return jsonld
}

/**
 * Render JSON-LD as a script tag (for use in components)
 */
export function renderJSONLD(jsonld: any | any[]) {
  const data = Array.isArray(jsonld) ? jsonld : [jsonld]

  return data.map((item, index) =>
    React.createElement('script', {
      key: `jsonld-${index}`,
      type: 'application/ld+json',
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(item, null, 0), // Minified for production
      },
    }),
  )
}
