import type { Page, BlogPost, Settings } from '@/payload-types'

// ─────────────────────────────────────────────────────────────
// LocalBusiness Schema
// ─────────────────────────────────────────────────────────────
export function buildLocalBusinessSchema(settings: Settings, siteUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': settings.businessCategory || 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: settings.companyName,
    url: siteUrl,
  }

  // Description
  if (settings.description) {
    schema.description = settings.description
  }

  // Contact
  if (settings.phone) schema.telephone = settings.phone
  if (settings.email) schema.email = settings.email

  // Address
  if (settings.address?.street) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      postalCode: settings.address.postalCode,
      addressLocality: settings.address.city,
      addressCountry: settings.address.country || 'NL',
    }
  }

  // Geo coordinates
  if (settings.geo?.latitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: settings.geo.latitude,
      longitude: settings.geo.longitude,
    }
  }

  // Logo
  if (settings.logo && typeof settings.logo === 'object' && 'url' in settings.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: `${siteUrl}${settings.logo.url}`,
    }
    schema.image = `${siteUrl}${settings.logo.url}`
  }

  // Opening hours
  if (settings.hours && Array.isArray(settings.hours) && settings.hours.length > 0) {
    schema.openingHoursSpecification = settings.hours
      .filter((h: any) => h.open)
      .map((h: any) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: translateDay(h.day),
        opens: h.from,
        closes: h.to,
      }))
  }

  // Social media
  const sameAs = [
    settings.facebook,
    settings.instagram,
    settings.linkedin,
    settings.twitter,
    settings.youtube,
    settings.tiktok,
  ].filter(Boolean)
  if (sameAs.length) schema.sameAs = sameAs

  // Business identifiers
  if (settings.kvkNumber) schema.taxID = settings.kvkNumber
  if (settings.vatNumber) schema.vatID = settings.vatNumber
  if (settings.priceRange) schema.priceRange = settings.priceRange

  return schema
}

// ─────────────────────────────────────────────────────────────
// WebSite Schema (homepage only)
// ─────────────────────────────────────────────────────────────
export function buildWebSiteSchema(settings: Settings, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: settings.companyName,
    url: siteUrl,
    description: settings.description,
    publisher: { '@id': `${siteUrl}/#organization` },
  }
}

// ─────────────────────────────────────────────────────────────
// BreadcrumbList Schema
// ─────────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(page: Page, siteUrl: string) {
  const items: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl,
    },
  ]

  if (page.slug !== 'home' && page.slug !== '/') {
    const segments = page.slug.split('/').filter(Boolean)

    if (segments.length > 1) {
      segments.slice(0, -1).forEach((segment: string, index: number) => {
        items.push({
          '@type': 'ListItem',
          position: index + 2,
          name: capitalize(segment),
          item: `${siteUrl}/${segments.slice(0, index + 1).join('/')}`,
        })
      })
    }

    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: page.title,
      item: `${siteUrl}/${page.slug}`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

// ─────────────────────────────────────────────────────────────
// FAQ Schema (automatic from FAQ blocks)
// ─────────────────────────────────────────────────────────────
export function buildFAQSchema(block: any) {
  if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: block.items.map((item: any) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: extractPlainText(item.answer),
      },
    })),
  }
}

// ─────────────────────────────────────────────────────────────
// Article Schema (blog posts)
// ─────────────────────────────────────────────────────────────
export function buildArticleSchema(
  post: BlogPost,
  settings: Settings,
  siteUrl: string
) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${siteUrl}/blog/${post.slug}#article`,
    headline: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: settings.companyName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.companyName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}#webpage`,
    },
    inLanguage: 'nl-NL',
  }

  // Description/excerpt
  if (post.excerpt) {
    schema.description = post.excerpt
  }

  // Publisher logo
  if (settings.logo && typeof settings.logo === 'object' && 'url' in settings.logo) {
    schema.publisher.logo = {
      '@type': 'ImageObject',
      url: `${siteUrl}${settings.logo.url}`,
    }
  }

  // Featured image
  if (post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage) {
    schema.image = `${siteUrl}${post.featuredImage.url}`
  } else {
    // Fallback to auto-generated OG image
    schema.image = `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=blog`
  }

  return schema
}

// ─────────────────────────────────────────────────────────────
// Review/Testimonial Schemas with AggregateRating
// ─────────────────────────────────────────────────────────────
export function buildReviewSchemas(block: any, settings: Settings, siteUrl: string) {
  if (!block.testimonials || !Array.isArray(block.testimonials) || block.testimonials.length === 0) {
    return []
  }

  const ratings = block.testimonials
    .map((t: any) => t.rating)
    .filter((r: any) => r && r > 0)

  if (ratings.length === 0) return []

  const avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: settings.companyName,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
        ratingCount: ratings.length,
      },
      review: block.testimonials
        .filter((t: any) => t.quote)
        .slice(0, 5)
        .map((t: any) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: t.name,
          },
          reviewRating: t.rating
            ? {
                '@type': 'Rating',
                ratingValue: t.rating,
                bestRating: '5',
              }
            : undefined,
          reviewBody: t.quote,
        })),
    },
  ]
}

// ─────────────────────────────────────────────────────────────
// Service Schema
// ─────────────────────────────────────────────────────────────
export function buildServiceSchema(service: any, settings: Settings, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/diensten/${service.slug}#service`,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: settings.companyName,
      url: siteUrl,
    },
    areaServed: settings.address?.city
      ? {
          '@type': 'City',
          name: settings.address.city,
        }
      : undefined,
  }
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function translateDay(dutch: string): string {
  const days: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }
  return days[dutch] || dutch
}

function capitalize(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function extractPlainText(richText: any): string {
  if (typeof richText === 'string') return richText

  if (!richText || !richText.root || !richText.root.children) return ''

  const extract = (node: any): string => {
    if (node.text) return node.text
    if (node.children) return node.children.map(extract).join(' ')
    return ''
  }

  return richText.root.children.map(extract).join(' ').trim()
}
