import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { TestimonialsCarousel } from './TestimonialsCarousel'
import type { TestimonialsBlockProps, TestimonialsVariant, TestimonialItem } from './types'
import type { Media } from '@/payload-types'

/**
 * B-38 Testimonials Block Component (Server)
 *
 * Customer testimonials with avatars, quotes, ratings, author details.
 * Grid: card layout. Featured: one large centered. Carousel: client component.
 */

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={`text-lg ${i < rating ? 'text-amber-400' : 'text-grey'}`}>
      &#9733;
    </span>
  ))
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  const avatarData = typeof testimonial.avatar === 'object' ? (testimonial.avatar as Media) : null

  return (
    <div className="rounded-xl border border-grey bg-white p-6 transition-all hover:shadow-md">
      {/* Rating */}
      {testimonial.rating && (
        <div className="mb-3 flex gap-0.5">{renderStars(testimonial.rating)}</div>
      )}

      {/* Quote */}
      <blockquote className="mb-4 text-sm leading-relaxed text-grey-dark">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {avatarData?.url ? (
          <Image
            src={avatarData.url}
            alt={avatarData.alt || testimonial.author}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-sm font-bold text-teal">
            {getInitials(testimonial.author)}
          </div>
        )}
        <div>
          <div className="text-sm font-bold text-navy">{testimonial.author}</div>
          {(testimonial.role || testimonial.company) && (
            <div className="text-xs text-grey-mid">
              {testimonial.role}
              {testimonial.role && testimonial.company && ', '}
              {testimonial.company}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const TestimonialsBlockComponent: React.FC<TestimonialsBlockProps> = ({
  title,
  subtitle,
  testimonials = [],
  variant = 'grid',
  columns = '3',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validTestimonials = (testimonials || []) as TestimonialItem[]
  if (validTestimonials.length === 0) return null

  const currentVariant = (variant || 'grid') as TestimonialsVariant

  // Carousel layout (client component)
  if (currentVariant === 'carousel') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="testimonials-block bg-white py-12 md:py-16"
      >
        <TestimonialsCarousel
          title={title || undefined}
          subtitle={subtitle || undefined}
          testimonials={validTestimonials}
        />
      </AnimationWrapper>
    )
  }

  // Featured layout
  if (currentVariant === 'featured') {
    const featured = validTestimonials[0]
    const featuredAvatar = typeof featured.avatar === 'object' ? (featured.avatar as Media) : null

    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="testimonials-block bg-white py-12 md:py-16"
      >
        <div className="mx-auto max-w-4xl px-6">
          {title && (
            <h2 className="mb-3 text-center font-display text-2xl text-navy md:text-3xl lg:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mb-10 text-center text-sm text-grey-dark md:text-base">{subtitle}</p>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-navy to-navy/80 p-8 text-white md:p-14">
            {featured.rating && (
              <div className="mb-4 flex gap-0.5 text-xl">{renderStars(featured.rating)}</div>
            )}
            <blockquote className="mb-8 font-display text-xl leading-relaxed md:text-2xl lg:text-3xl">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              {featuredAvatar?.url ? (
                <Image
                  src={featuredAvatar.url}
                  alt={featuredAvatar.alt || featured.author}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-lg font-bold">
                  {getInitials(featured.author)}
                </div>
              )}
              <div>
                <div className="text-lg font-bold">{featured.author}</div>
                {(featured.role || featured.company) && (
                  <div className="text-sm text-white/70">
                    {featured.role}
                    {featured.role && featured.company && ', '}
                    {featured.company}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Grid layout (default)
  const gridCols = columns === '2' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="testimonials-block bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <h2 className="mb-3 text-center font-display text-2xl text-navy md:text-3xl lg:text-4xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mb-10 text-center text-sm text-grey-dark md:text-base">{subtitle}</p>
        )}

        <div className={`grid gap-6 ${gridCols}`}>
          {validTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default TestimonialsBlockComponent
