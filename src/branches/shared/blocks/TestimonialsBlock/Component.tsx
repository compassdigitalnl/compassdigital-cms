'use client'

import React from 'react'
import { SectionLabel } from '@/branches/shared/components/admin/SectionLabel'
import type { TestimonialsBlock } from '@/payload-types'

export const TestimonialsBlockComponent: React.FC<TestimonialsBlock> = ({
  sectionLabel,
  heading,
  intro,
  source: dataSource,
  manualTestimonials,
  layout,
}) => {
  const testimonials = dataSource === 'manual' ? manualTestimonials : []

  return (
    <section className="testimonials py-16 px-4 bg-white">
      <div className="container mx-auto">
        {(sectionLabel || heading || intro) && (
          <div className="text-center mb-12">
            {sectionLabel && <SectionLabel label={sectionLabel} />}
            {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
            {intro && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{intro}</p>}
          </div>
        )}

        <div
          className={`grid gap-6 ${
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
              className="testimonial-card p-6 bg-white border-2 border-gray-200 rounded-xl shadow hover:shadow-xl hover:border-teal-500 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex mb-3">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <span key={i} className="text-teal-500 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-6 italic text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-600 mt-0.5">{testimonial.role}</p>
                )}
                {testimonial.company && (
                  <p className="text-sm text-gray-600 mt-0.5">{testimonial.company}</p>
                )}
                {testimonial.source && (
                  <p className="text-xs text-gray-500 mt-2">{testimonial.source}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
