import React from 'react'
import Image from 'next/image'
import type { TestimonialsBlock, Media } from '@/payload-types'
import { TestimonialsCarousel } from './TestimonialsCarousel'

/**
 * B06 - Testimonials Block Component (Server)
 *
 * Customer testimonials with avatars, quotes, ratings.
 *
 * FEATURES:
 * - Grid layout (3 columns, responsive)
 * - Featured layout (large hero testimonial)
 * - Carousel layout (client component with navigation)
 * - 5-star rating display
 * - Avatar images with initials fallback
 *
 * @see docs/refactoring/sprint-9/shared/b06-testimonials.html
 */

interface Testimonial {
  quote: string
  author: string
  role?: string
  avatar?: Media | string
  rating: number
}

export const TestimonialsBlockComponent: React.FC<TestimonialsBlock> = ({
  title,
  testimonials = [],
  variant = 'grid',
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-amber' : 'text-grey'}`}>
        ★
      </span>
    ))
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.slice(0, 2)
  }

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => {
    const avatarData = typeof testimonial.avatar === 'object' ? testimonial.avatar : null

    return (
      <div
        key={index}
        className="rounded-xl border border-grey bg-white p-6 transition-all hover:shadow-md"
      >
        {/* Rating stars */}
        <div className="mb-3 flex gap-0.5">{renderStars(testimonial.rating)}</div>

        {/* Quote */}
        <p className="mb-4 text-sm leading-relaxed text-grey-dark">"{testimonial.quote}"</p>

        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatarData?.url ? (
            <Image
              src={avatarData.url}
              alt={avatarData.alt || testimonial.author}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-glow text-sm font-bold text-teal">
              {getInitials(testimonial.author).toUpperCase()}
            </div>
          )}

          {/* Author details */}
          <div>
            <div className="text-sm font-bold text-navy">{testimonial.author}</div>
            {testimonial.role && <div className="text-xs text-grey-mid">{testimonial.role}</div>}
          </div>
        </div>
      </div>
    )
  }

  // Carousel layout
  if (variant === 'carousel') {
    return <TestimonialsCarousel title={title} testimonials={testimonials} />
  }

  // Featured layout
  if (variant === 'featured' && testimonials.length > 0) {
    const featured = testimonials[0]
    const featuredAvatar = typeof featured.avatar === 'object' ? featured.avatar : null

    return (
      <section className="testimonials-block py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          {title && (
            <h2 className="mb-10 text-center font-display text-3xl text-navy md:text-4xl">
              {title}
            </h2>
          )}
          <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-light p-10 text-white md:p-16">
            <div className="mb-6 flex gap-0.5 text-2xl">{renderStars(featured.rating)}</div>
            <blockquote className="mb-8 font-display text-2xl leading-relaxed md:text-3xl">
              "{featured.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              {featuredAvatar?.url ? (
                <Image
                  src={featuredAvatar.url}
                  alt={featuredAvatar.alt || featured.author}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-15 w-15 items-center justify-center rounded-full bg-teal text-xl font-bold">
                  {getInitials(featured.author).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-lg font-bold">{featured.author}</div>
                {featured.role && <div className="text-sm text-white/70">{featured.role}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Grid layout (default)
  return (
    <section className="testimonials-block py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <h2 className="mb-10 text-center font-display text-3xl text-navy md:text-4xl">{title}</h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsBlockComponent
