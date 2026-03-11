'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface TestimonialItem {
  quote: string
  author: string
  role?: string | null
  company?: string | null
  avatar?: Media | number | null
  rating?: number | null
  id?: string | null
}

interface TestimonialsCarouselProps {
  title?: string
  subtitle?: string
  testimonials: TestimonialItem[]
}

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

/**
 * B-38 Testimonials Carousel (Client)
 *
 * Interactive slider with auto-advance and dot navigation.
 * Pauses on hover. Wrapping navigation.
 */
export function TestimonialsCarousel({ title, subtitle, testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return

    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [isPaused, next, testimonials.length])

  if (testimonials.length === 0) return null

  const current = testimonials[currentIndex]
  const avatarData = typeof current.avatar === 'object' ? (current.avatar as Media) : null

  return (
    <div
      className="mx-auto max-w-4xl px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {title && (
        <h2 className="mb-3 text-center font-display text-2xl text-navy md:text-3xl lg:text-4xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mb-10 text-center text-sm text-grey-dark md:text-base">{subtitle}</p>
      )}

      <div className="relative">
        {/* Testimonial card */}
        <div className="rounded-xl border border-grey bg-white p-8 text-center md:p-12">
          {current.rating && (
            <div className="mb-4 flex justify-center gap-0.5">{renderStars(current.rating)}</div>
          )}

          <blockquote className="mb-6 text-base leading-relaxed text-grey-dark md:text-lg">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            {avatarData?.url ? (
              <Image
                src={avatarData.url}
                alt={avatarData.alt || current.author}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-base font-bold text-teal">
                {getInitials(current.author)}
              </div>
            )}
            <div className="text-left">
              <div className="text-base font-bold text-navy">{current.author}</div>
              {(current.role || current.company) && (
                <div className="text-sm text-grey-mid">
                  {current.role}
                  {current.role && current.company && ', '}
                  {current.company}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-grey bg-white p-3 shadow-sm transition-all hover:shadow-md"
              aria-label="Vorige testimonial"
            >
              <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border border-grey bg-white p-3 shadow-sm transition-all hover:shadow-md"
              aria-label="Volgende testimonial"
            >
              <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot navigation */}
      {testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-teal' : 'w-2 bg-grey'
              }`}
              aria-label={`Ga naar testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
