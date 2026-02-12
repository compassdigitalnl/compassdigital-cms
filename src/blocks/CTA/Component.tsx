'use client'
import React from 'react'
import type { CTABlock } from '@/payload-types'

export const CTABlockComponent: React.FC<CTABlock> = ({ title, text, buttonText, buttonLink, style }) => {
  return (
    <section
      className="cta py-20 px-4 text-white"
      style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
    >
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        {text && <p className="text-xl mb-8">{text}</p>}
        <a
          href={buttonLink}
          className="btn px-8 py-4 bg-white rounded-lg font-semibold inline-block transition-all duration-300"
          style={{ color: 'var(--color-primary, #3b82f6)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary, #8b5cf6)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'var(--color-primary, #3b82f6)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {buttonText}
        </a>
      </div>
    </section>
  )
}
