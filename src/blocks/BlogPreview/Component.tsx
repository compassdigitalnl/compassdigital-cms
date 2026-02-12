import React from 'react'
import type { BlogPreviewBlock } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { imageService } from '@/lib/images/ImageService'

export const BlogPreviewBlockComponent: React.FC<BlogPreviewBlock> = async ({
  heading,
  intro,
  limit = 6,
  category,
  layout,
  showExcerpt = true,
  showDate = true,
  showAuthor = false,
}) => {
  const payload = await getPayload({ config })

  // Build query with optional category filter
  const where: any = {
    status: { equals: 'published' },
  }

  if (category && typeof category === 'object' && 'id' in category) {
    where.categories = {
      contains: category.id,
    }
  }

  // Query blog posts
  const posts = await payload.find({
    collection: 'blog-posts',
    where,
    limit,
    sort: '-publishedAt',
    depth: 2, // Populate author and categories
  })

  // If no posts, show empty state
  if (!posts.docs || posts.docs.length === 0) {
    return (
      <section className="blog-preview py-16 px-4">
        <div className="container mx-auto text-center">
          {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
          {intro && <p className="mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}
          <p className="text-gray-500">Nog geen blog berichten beschikbaar.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="blog-preview py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}

        <div
          className={`grid gap-8 ${
            layout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}
        >
          {posts.docs.map((post) => {
            // Get featured image URL (uploaded or placeholder)
            const featuredImageUrl =
              typeof post.featuredImage === 'object' && post.featuredImage !== null
                ? post.featuredImage.url
                : imageService.getBlogImage(post.slug)

            // Get author name
            const authorName =
              typeof post.author === 'object' && post.author !== null
                ? (post.author as any).name || 'Auteur'
                : 'Auteur'

            // Format date
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog-card group block overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: 'var(--color-primary, #3b82f6)' }}
              >
                {/* Featured Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={featuredImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  {(showDate || showAuthor) && (
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                      {showDate && formattedDate && (
                        <time dateTime={post.publishedAt}>{formattedDate}</time>
                      )}
                      {showDate && showAuthor && formattedDate && <span>•</span>}
                      {showAuthor && <span>{authorName}</span>}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className="text-xl font-semibold mb-3 group-hover:underline"
                    style={{ color: 'var(--color-primary, #3b82f6)' }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {showExcerpt && post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                  )}

                  {/* Read More Link */}
                  <span
                    className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all"
                    style={{ color: 'var(--color-secondary, #8b5cf6)' }}
                  >
                    Lees meer
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Link (if more posts exist) */}
        {posts.totalDocs > limit && (
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-primary, #3b82f6)',
                color: 'white',
              }}
            >
              Bekijk alle blog berichten
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
