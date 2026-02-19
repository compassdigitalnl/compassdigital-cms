import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import BlogTemplate1 from './BlogTemplate1'
import BlogTemplate2 from './BlogTemplate2'
import BlogTemplate3 from './BlogTemplate3'
import type { BlogPost } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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
    title: `${post.title} | Blog`,
    description: post.excerpt || `Read ${post.title}`,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch blog post with depth for relationships
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Resolve author, categories, images
    limit: 1,
  })

  const post = posts[0] as BlogPost

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Get global template setting from Settings
  let settings
  let template = 'blogtemplate1' // Default fallback

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
    })
    // Safely get template setting with fallback
    template = (settings as any)?.defaultBlogTemplate || 'blogtemplate1'
  } catch (error) {
    console.error('⚠️ Error fetching settings, using default template:', error)
    template = 'blogtemplate1'
  }

  // Fetch related posts (same categories, exclude current)
  const categoryIds = post.categories
    ? post.categories
        .map((cat) => (typeof cat === 'object' && cat !== null ? cat.id : null))
        .filter((id) => id !== null)
    : []

  let relatedPosts: BlogPost[] = []
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
    })
    relatedPosts = docs as BlogPost[]
  }

  // Debug: Log template selection
  console.log('📝 Blog Post:', post.title)
  console.log('🎨 Global blog template setting:', (settings as any)?.defaultBlogTemplate)
  console.log('✅ Using template:', template)

  // Badge color and label based on template
  const getBadgeStyle = () => {
    if (template === 'blogtemplate2') {
      return { background: '#10B981', label: '📄 Blog Template 2 - Minimal' }
    } else if (template === 'blogtemplate3') {
      return { background: '#F59E0B', label: '✨ Blog Template 3 - Premium' }
    } else {
      return { background: '#3B82F6', label: '📰 Blog Template 1 - Magazine' }
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
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Blog
          </Link>
        </div>
      </div>

      {/* Blog Template Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {template === 'blogtemplate3' ? (
          <BlogTemplate3 post={post} />
        ) : template === 'blogtemplate2' ? (
          <BlogTemplate2 post={post} />
        ) : (
          <BlogTemplate1 post={post} relatedPosts={relatedPosts} />
        )}
      </div>
    </div>
  )
}
