'use client'

import React from 'react'
import type { TestimonialsBlock } from '@/payload-types'

export const TestimonialsBlockComponent: React.FC<TestimonialsBlock> = ({
  heading,
  intro,
  source,
  manualTestimonials,
  layout,
}) => {
  const testimonials = source === 'manual' ? manualTestimonials : []

  return (
    <section className="testimonials py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}

        <div
          className={`grid gap-8 ${
            layout === 'grid-2'
              ? 'md:grid-cols-2'
              : layout === 'carousel'
                ? 'md:grid-cols-1'
                : 'md:grid-cols-3'
          }`}
        >
          {testimonials?.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card p-6 bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300"
              style={{ borderTop: '4px solid var(--color-accent, #ec4899)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-secondary, #8b5cf6)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <div className="flex mb-2">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--color-accent, #ec4899)' }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 italic text-gray-700">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm" style={{ color: 'var(--color-primary, #3b82f6)' }}>
                      {testimonial.role}
                    </p>
                  )}
                  {testimonial.company && (
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
