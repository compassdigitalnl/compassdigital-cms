import React from 'react'
import { Star } from 'lucide-react'
import { BrandCard } from '../BrandCard/Component'
import type { FeaturedBrandsProps } from './types'

export const FeaturedBrands: React.FC<FeaturedBrandsProps> = ({
  brands,
  className = '',
}) => {
  if (brands.length === 0) return null

  return (
    <section className={`${className}`} aria-labelledby="featured-brands-title">
      <h2
        id="featured-brands-title"
        className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
      >
        <Star className="h-5 w-5 text-theme-teal" />
        Uitgelichte merken
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} {...brand} variant="featured" />
        ))}
      </div>
    </section>
  )
}
