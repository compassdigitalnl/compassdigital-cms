'use client'

import React from 'react'
import { Star } from 'lucide-react'
import type { BranchTestimonialProps } from './types'

export const BranchTestimonial: React.FC<BranchTestimonialProps> = ({
  initials,
  quote,
  authorName,
  authorRole,
  rating = 5,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 rounded-[20px] border bg-white p-9 text-center sm:flex-row sm:text-left md:px-10 ${className}`}
      style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
    >
      {/* Avatar */}
      <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-theme-teal to-theme-teal-light font-heading text-[28px] font-extrabold text-white">
        {initials}
      </div>

      {/* Body */}
      <div className="flex-1">
        {/* Stars */}
        <div className="mb-1.5 flex items-center justify-center gap-0.5 sm:justify-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-theme-grey-mid'}`}
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="mb-2 text-base italic leading-relaxed text-theme-navy">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="text-sm font-bold text-theme-navy">{authorName}</div>
        <div className="text-[13px] text-theme-grey-mid">{authorRole}</div>
      </div>
    </div>
  )
}
