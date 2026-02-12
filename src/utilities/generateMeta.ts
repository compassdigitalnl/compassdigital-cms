import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Product }): Promise<Metadata> => {
  const { doc } = args || {}

  const title = doc?.meta?.title || doc?.title || 'Website'
  const description = doc?.meta?.description
  const url = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug || ''

  // Use custom canonical URL if set, otherwise auto-generate
  const autoCanonicalUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/${url}`.replace(/\/$/, '')
  const canonicalUrl = (doc?.meta as any)?.canonicalUrl || autoCanonicalUrl

  // Check for custom uploaded OG image
  const customOgImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  // Generate dynamic OG image URL if no custom image is set
  const dynamicOgImage = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/og?title=${encodeURIComponent(title)}${description ? `&description=${encodeURIComponent(description)}` : ''}&siteName=${encodeURIComponent(process.env.SITE_NAME || 'Website')}`

  // Use custom image if available, otherwise use dynamic OG image
  const ogImage = customOgImage || dynamicOgImage

  return {
    title,
    description,
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    // Robots meta tags (respect noIndex/noFollow settings)
    robots: {
      index: !(doc?.meta as any)?.noIndex,
      follow: !(doc?.meta as any)?.noFollow,
      googleBot: {
        index: !(doc?.meta as any)?.noIndex,
        follow: !(doc?.meta as any)?.noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Open Graph
    openGraph: mergeOpenGraph({
      type: 'website',
      locale: 'nl_NL',
      siteName: 'Website',
      title,
      ...(description ? { description } : {}),
      url: canonicalUrl,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    }),
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      ...(ogImage
        ? {
            images: [ogImage],
          }
        : {}),
    },
  }
}
