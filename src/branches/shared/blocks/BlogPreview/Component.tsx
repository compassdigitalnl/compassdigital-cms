import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { BlogPreviewBlockProps, BlogPreviewLayout, BlogPostItem } from './types'

/**
 * B-32 BlogPreview Block Component (Server)
 *
 * Displays blog post cards in grid, list, or featured layout.
 * Featured: first post large + remaining posts small.
 */

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

function PostCard({
  post,
  showExcerpt,
  showDate,
  showAuthor,
  large = false,
}: {
  post: BlogPostItem
  showExcerpt: boolean
  showDate: boolean
  showAuthor: boolean
  large?: boolean
}) {
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block overflow-hidden rounded-xl border border-grey bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${large ? '' : ''}`}
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-teal/20 to-navy/10 ${large ? 'h-64 md:h-80' : 'h-48'}`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={large ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        )}
      </div>

      {/* Body */}
      <div className={`p-5 ${large ? 'md:p-8' : ''}`}>
        <h3 className={`font-display text-navy line-clamp-2 ${large ? 'mb-3 text-xl md:text-2xl' : 'mb-2 text-lg'}`}>
          {post.title}
        </h3>

        {showExcerpt && post.excerpt && (
          <p className={`text-grey-dark line-clamp-2 leading-relaxed ${large ? 'mb-4 text-base' : 'mb-3 text-sm'}`}>
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-grey-mid">
          {showDate && post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          {showDate && showAuthor && author?.name && (
            <span className="text-grey">|</span>
          )}
          {showAuthor && author?.name && <span>{author.name}</span>}
        </div>
      </div>
    </Link>
  )
}

function ListCard({
  post,
  showExcerpt,
  showDate,
  showAuthor,
}: {
  post: BlogPostItem
  showExcerpt: boolean
  showDate: boolean
  showAuthor: boolean
}) {
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 overflow-hidden rounded-xl border border-grey bg-white p-4 transition-all duration-200 hover:shadow-md md:gap-6"
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-teal/20 to-navy/10 md:h-32 md:w-40">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="160px"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="mb-1 font-display text-base text-navy line-clamp-2 md:text-lg">
          {post.title}
        </h3>
        {showExcerpt && post.excerpt && (
          <p className="mb-2 text-sm text-grey-dark line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-grey-mid">
          {showDate && post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          {showAuthor && author?.name && (
            <>
              <span className="text-grey">|</span>
              <span>{author.name}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export const BlogPreviewBlockComponent: React.FC<BlogPreviewBlockProps> = ({
  title,
  layout = 'grid',
  showExcerpt = true,
  showDate = true,
  showAuthor = false,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  // In a real implementation, posts would be fetched server-side based on source/category/limit.
  // This component receives them as a prop or fetches them internally.
  const posts: BlogPostItem[] = []

  if (posts.length === 0) {
    return null
  }

  const currentLayout = (layout || 'grid') as BlogPreviewLayout

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="blog-preview-block bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <h2 className="mb-8 text-center font-display text-2xl text-navy md:mb-12 md:text-3xl lg:text-4xl">
            {title}
          </h2>
        )}

        {/* Grid layout */}
        {currentLayout === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showExcerpt={showExcerpt ?? true}
                showDate={showDate ?? true}
                showAuthor={showAuthor ?? false}
              />
            ))}
          </div>
        )}

        {/* List layout */}
        {currentLayout === 'list' && (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <ListCard
                key={post.id}
                post={post}
                showExcerpt={showExcerpt ?? true}
                showDate={showDate ?? true}
                showAuthor={showAuthor ?? false}
              />
            ))}
          </div>
        )}

        {/* Featured layout */}
        {currentLayout === 'featured' && posts.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* First post large */}
            <div className="lg:col-span-2">
              <PostCard
                post={posts[0]}
                showExcerpt={showExcerpt ?? true}
                showDate={showDate ?? true}
                showAuthor={showAuthor ?? false}
                large
              />
            </div>
            {/* Remaining posts stacked */}
            <div className="flex flex-col gap-6">
              {posts.slice(1).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showExcerpt={showExcerpt ?? true}
                  showDate={showDate ?? true}
                  showAuthor={showAuthor ?? false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default BlogPreviewBlockComponent
