'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

/**
 * B06 - Testimonials Carousel Component (Client)
 *
 * Client component for carousel state management.
 *
 * FEATURES:
 * - Prev/next navigation buttons
 * - Pagination dots for direct access
 * - Smooth transitions
 * - Wrapping navigation (last → first)
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

interface TestimonialsCarouselProps {
  title?: string
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ title, testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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

  const current = testimonials[currentIndex]
  const currentAvatar = typeof current.avatar === 'object' ? current.avatar : null

  return (
    <section className="testimonials-block py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        {title && (
          <h2 className="mb-10 text-center font-display text-3xl text-navy md:text-4xl">{title}</h2>
        )}

        <div className="relative">
          {/* Testimonial card */}
          <div className="rounded-xl border border-grey bg-white p-8 md:p-12">
            <div className="mb-4 flex gap-0.5">{renderStars(current.rating)}</div>
            <p className="mb-6 text-base leading-relaxed text-grey-dark md:text-lg">
              "{current.quote}"
            </p>
            <div className="flex items-center gap-4">
              {currentAvatar?.url ? (
                <Image
                  src={currentAvatar.url}
                  alt={currentAvatar.alt || current.author}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-glow text-base font-bold text-teal">
                  {getInitials(current.author).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-base font-bold text-navy">{current.author}</div>
                {current.role && <div className="text-sm text-grey-mid">{current.role}</div>}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-grey bg-white p-3 shadow-md transition-all hover:bg-grey-light hover:shadow-lg"
                aria-label="Previous testimonial"
              >
                <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border border-grey bg-white p-3 shadow-md transition-all hover:bg-grey-light hover:shadow-lg"
                aria-label="Next testimonial"
              >
                <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Pagination dots */}
        {testimonials.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-teal' : 'w-2 bg-grey'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
