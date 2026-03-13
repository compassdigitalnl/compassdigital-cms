import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'

  // Fetch settings to check if sitemap is enabled and get exclusions
  let sitemapEnabled = true
  let excludeSlugs: string[] = []

  try {
    const settings = await payload.findGlobal({ slug: 'settings' })
    sitemapEnabled = settings.sitemapEnabled !== false
    excludeSlugs = settings.sitemapExclude?.map((entry: { slug: string }) => entry.slug) || []
  } catch (error) {
    console.log('Settings not available, using defaults')
  }

  if (!sitemapEnabled) {
    return []
  }

  const entries: MetadataRoute.Sitemap = []

  // ─── 1. Pages ──────────────────────────────────────────────
  try {
    const pages = await payload.find({
      collection: 'pages',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const pageEntries: MetadataRoute.Sitemap = pages.docs
      .filter((page) => !excludeSlugs.includes(page.slug))
      .map((page) => ({
        url: page.slug === 'home' ? siteUrl : `${siteUrl}/${page.slug}`,
        lastModified: new Date(page.updatedAt),
        changeFrequency: page.slug === 'home' ? 'weekly' : 'monthly',
        priority: page.slug === 'home' ? 1.0 : 0.8,
      }))

    entries.push(...pageEntries)
  } catch (error) {
    console.error('Error fetching pages for sitemap:', error)
  }

  // ─── 2. Blog Posts ─────────────────────────────────────────
  try {
    const posts = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    entries.push(...postEntries)
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // ─── 3. Content Cases (unified) ────────────────────────────
  try {
    const cases = await payload.find({
      collection: 'content-cases',
      where: { _status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    })

    const caseEntries: MetadataRoute.Sitemap = cases.docs
      .filter((c): c is { id: number; slug: string; updatedAt: string } =>
        typeof c === 'object' && 'slug' in c && typeof c.slug === 'string'
      )
      .map((c) => ({
        url: `${siteUrl}/cases/${c.slug}`,
        lastModified: new Date(c.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

    entries.push(...caseEntries)
  } catch (error) {
    console.log('Content cases not accessible, skipping')
  }

  // ─── 4. Content Services (unified) ───────────────────────
  try {
    const services = await payload.find({
      collection: 'content-services',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true, updatedAt: true },
    })

    const serviceEntries: MetadataRoute.Sitemap = services.docs
      .filter((s): s is { id: number; slug: string; updatedAt: string } =>
        typeof s === 'object' && 'slug' in s && typeof s.slug === 'string'
      )
      .map((s) => ({
        url: `${siteUrl}/diensten/${s.slug}`,
        lastModified: new Date(s.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

    entries.push(...serviceEntries)
  } catch (error) {
    console.log('Content services not accessible, skipping')
  }

  // ─── 10. Products (for e-commerce) ────────────────────────
  try {
    const products = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 1000,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const productEntries: MetadataRoute.Sitemap = products.docs.map((p) => ({
      url: `${siteUrl}/shop/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    entries.push(...productEntries)
  } catch (error) {
    console.log('Products collection not accessible, skipping')
  }

  // Technology Hub section removed — was based on old 'projects' collection

  return entries
}
