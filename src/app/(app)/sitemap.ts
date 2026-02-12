import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

// Force dynamic generation (fixes build errors with large queries)
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3015'

  try {
    // Fetch all pages (only necessary fields to reduce query size)
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
      pagination: false,
      depth: 0, // Don't fetch relationships
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Fetch all blog posts (only necessary fields)
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1000,
      pagination: false,
      depth: 0,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Fetch all cases (only necessary fields)
    const cases = await payload.find({
      collection: 'cases',
      limit: 1000,
      pagination: false,
      depth: 0,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Map pages to sitemap entries
    const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page: any) => ({
      url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: page.slug === 'home' ? 1.0 : 0.8,
    }))

    // Map blog posts to sitemap entries
    const blogEntries: MetadataRoute.Sitemap = blogPosts.docs.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Map cases to sitemap entries
    const caseEntries: MetadataRoute.Sitemap = cases.docs.map((caseItem: any) => ({
      url: `${baseUrl}/cases/${caseItem.slug}`,
      lastModified: new Date(caseItem.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Combine all entries
    return [
      // Home page (explicit entry for clarity)
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      // All pages
      ...pageEntries,
      // Blog archive page
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      // All blog posts
      ...blogEntries,
      // Cases archive page
      {
        url: `${baseUrl}/cases`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      // All cases
      ...caseEntries,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Fallback: return minimal sitemap if query fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ]
  }
}
