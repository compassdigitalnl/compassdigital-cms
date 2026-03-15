import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import BlogTemplate1 from '@/branches/shared/templates/blog/BlogTemplate1'
import BlogTemplate2 from '@/branches/shared/templates/blog/BlogTemplate2'
import BlogTemplate3 from '@/branches/shared/templates/blog/BlogTemplate3'
import { ProjectCard } from '@/branches/shared/components/ProjectCard'
import type { BlogPost, BlogCategory } from '@/payload-types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 0,
    limit: 1,
  })

  const post = posts[0]

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.meta?.title || `${post.title} | Kennisbank`,
    description: post.meta?.description || post.excerpt || `Lees ${post.title}`,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category: categorySlug, slug } = await params
  const payload = await getPayload({ config })

  // Fetch the category
  const { docs: categories } = await payload.find({
    collection: 'blog-categories',
    where: {
      slug: { equals: categorySlug },
    },
    depth: 0,
    limit: 1,
  })

  const category = categories[0] as BlogCategory

  if (!category) {
    notFound()
  }

  // Fetch blog post with depth for relationships
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Resolve author, categories, images, products
    limit: 1,
  })

  const post = posts[0] as BlogPost

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Verify post belongs to this category
  const postCategoryIds = post.categories
    ? post.categories.map((cat) => (typeof cat === 'object' && cat !== null ? cat.id : cat))
    : []

  if (!postCategoryIds.includes(category.id)) {
    notFound()
  }

  // Get template from post or global settings
  let template = post.template || 'blogtemplate1'

  // If post doesn't have a template, try to get from global settings
  if (!post.template) {
    try {
      const settings = await payload.findGlobal({
        slug: 'settings',
        depth: 0,
      })
      template = (settings as any)?.defaultBlogTemplate || 'blogtemplate1'
    } catch (error) {
      console.error('⚠️ Error fetching settings, using default template:', error)
      template = 'blogtemplate1'
    }
  }

  // Fetch related posts
  // First try manual relatedPosts, then fallback to same category
  let relatedPosts: BlogPost[] = []

  if (post.relatedPosts && post.relatedPosts.length > 0) {
    // Use manually selected related posts
    const relatedIds = post.relatedPosts
      .map((p) => (typeof p === 'object' && p !== null ? p.id : p))
      .filter((id) => id !== null)

    if (relatedIds.length > 0) {
      const { docs } = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [
            {
              id: {
                in: relatedIds,
              },
            },
            {
              status: {
                equals: 'published',
              },
            },
          ],
        },
        limit: 3,
        depth: 1,
      })
      relatedPosts = docs as BlogPost[]
    }
  }

  // If no manual related posts, get posts from same categories
  if (relatedPosts.length === 0) {
    const categoryIds = post.categories
      ? post.categories
          .map((cat) => (typeof cat === 'object' && cat !== null ? cat.id : null))
          .filter((id) => id !== null)
      : []

    if (categoryIds.length > 0) {
      const { docs } = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [
            {
              id: {
                not_equals: post.id,
              },
            },
            {
              status: {
                equals: 'published',
              },
            },
            {
              categories: {
                in: categoryIds,
              },
            },
          ],
        },
        limit: 3,
        depth: 1,
        sort: '-publishedAt',
      })
      relatedPosts = docs as BlogPost[]
    }
  }

  // Fetch previous and next posts in the same category
  let prevPost: BlogPost | null = null
  let nextPost: BlogPost | null = null

  if (post.publishedAt) {
    // Get previous post (older, before current publishedAt)
    const { docs: prevDocs } = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            status: { equals: 'published' },
          },
          {
            categories: { in: [category.id] },
          },
          {
            publishedAt: { less_than: post.publishedAt },
          },
        ],
      },
      limit: 1,
      depth: 0,
      sort: '-publishedAt', // Get the most recent one before this
    })
    prevPost = prevDocs[0] as BlogPost | undefined || null

    // Get next post (newer, after current publishedAt)
    const { docs: nextDocs } = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            status: { equals: 'published' },
          },
          {
            categories: { in: [category.id] },
          },
          {
            publishedAt: { greater_than: post.publishedAt },
          },
        ],
      },
      limit: 1,
      depth: 0,
      sort: 'publishedAt', // Get the oldest one after this
    })
    nextPost = nextDocs[0] as BlogPost | undefined || null
  }

  // Increment view count (fire and forget)
  payload
    .update({
      collection: 'blog-posts',
      id: post.id,
      data: {
        viewCount: (post.viewCount || 0) + 1,
      },
    })
    .catch((err) => console.error('Failed to increment view count:', err))

  // Extract related cases and services from post (resolved at depth 2)
  const relatedCases = Array.isArray(post.relatedCases)
    ? post.relatedCases.filter((c: any) => typeof c === 'object' && c?.title).slice(0, 3)
    : []
  const relatedServices = Array.isArray(post.relatedServices)
    ? post.relatedServices.filter((s: any) => typeof s === 'object' && s?.value?.title).slice(0, 4)
    : []

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/blog/"
              className="text-grey-dark hover:text-teal-600 transition-colors"
            >
              Blog
            </Link>
            <span className="text-grey-mid">/</span>
            <Link
              href={`/blog/${categorySlug}`}
              className="text-grey-dark hover:text-teal-600 transition-colors"
            >
              {category.name}
            </Link>
            <span className="text-grey-mid">/</span>
            <span className="text-navy font-semibold line-clamp-1">{post.title}</span>
          </div>
          <Link
            href={`/blog/${categorySlug}`}
            className="inline-flex items-center gap-2 mt-2 text-grey-dark hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar {category.name}
          </Link>
        </div>
      </div>

      {/* Blog Template Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {template === 'blogtemplate3' ? (
          <BlogTemplate3 post={post} prevPost={prevPost} nextPost={nextPost} category={category} />
        ) : template === 'blogtemplate2' ? (
          <BlogTemplate2 post={post} prevPost={prevPost} nextPost={nextPost} category={category} />
        ) : (
          <BlogTemplate1 post={post} relatedPosts={relatedPosts} prevPost={prevPost} nextPost={nextPost} category={category} />
        )}
      </div>

      {/* Related Cases */}
      {relatedCases.length > 0 && (
        <div className="border-t border-grey-light bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-navy mb-6">Bekijk ook deze cases</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((project: any) => (
                <ProjectCard key={project.id} project={project} basePath="/cases" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="border-t border-grey-light bg-grey-light">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-navy mb-6">Gerelateerde diensten</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((s: any) => {
                const service = s.value
                const serviceUrl = s.relationTo === 'construction-services'
                  ? `/services/${service.slug}`
                  : `/dienstverlening/${service.slug}`
                return (
                  <Link
                    key={service.id}
                    href={serviceUrl}
                    className="flex items-center gap-3 rounded-xl border border-grey-light bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    {service.icon && <span className="text-xl">{service.icon}</span>}
                    <div>
                      <p className="font-semibold text-navy">{service.title}</p>
                      {service.shortDescription && (
                        <p className="mt-1 text-xs text-grey-mid line-clamp-2">{service.shortDescription}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
