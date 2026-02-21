import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import BlogTemplate1 from './BlogTemplate1'
import BlogTemplate2 from './BlogTemplate2'
import BlogTemplate3 from './BlogTemplate3'
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
    title: post.metaTitle || `${post.title} | Kennisbank`,
    description: post.metaDescription || post.excerpt || `Lees ${post.title}`,
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

  // Debug: Log template selection
  console.log('📝 Blog Post:', post.title)
  console.log('📂 Category:', category.name)
  console.log('🎨 Post template setting:', post.template)
  console.log('✅ Using template:', template)

  // Badge color and label based on template
  const getBadgeStyle = () => {
    if (template === 'blogtemplate2') {
      return { background: '#10B981', label: '📄 Blog Template 2 - Minimal' }
    } else if (template === 'blogtemplate3') {
      return { background: '#F59E0B', label: '✨ Blog Template 3 - Premium' }
    } else {
      return { background: '#3B82F6', label: '📰 Blog Template 1 - Enterprise' }
    }
  }

  const badgeStyle = getBadgeStyle()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DEBUG: Template Indicator */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          background: badgeStyle.background,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {badgeStyle.label}
      </div>

      {/* Breadcrumb Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/blog/"
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/blog/${categorySlug}`}
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              {category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold line-clamp-1">{post.title}</span>
          </div>
          <Link
            href={`/blog/${categorySlug}`}
            className="inline-flex items-center gap-2 mt-2 text-gray-600 hover:text-teal-600 transition-colors"
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
    </div>
  )
}
