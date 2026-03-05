import React from 'react'
import type { SectionLabelProps } from './types'

/**
 * Section Label Component
 *
 * Renders a small uppercase label above section titles
 * Consistent styling across all homepage blocks
 *
 * Used in: Hero, CategoryGrid, ProductGrid, Features, Testimonials
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({ label, className = '' }) => {
  if (!label) return null

  return (
    <span
      className={`text-xs font-bold uppercase tracking-[0.1em] text-teal-600 mb-3 block ${className}`}
    >
      {label}
    </span>
  )
}
