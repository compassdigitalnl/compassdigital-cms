import React from 'react'
import { Star } from 'lucide-react'
import { MagazineCard } from '../MagazineCard/Component'
import type { FeaturedMagazinesProps } from './types'

export const FeaturedMagazines: React.FC<FeaturedMagazinesProps> = ({
  magazines,
  className = '',
}) => {
  if (magazines.length === 0) return null

  return (
    <section className={`${className}`} aria-labelledby="featured-magazines-title">
      <h2
        id="featured-magazines-title"
        className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
      >
        <Star className="h-5 w-5 text-theme-teal" />
        Uitgelichte titels
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {magazines.map((magazine) => (
          <MagazineCard key={magazine.id} {...magazine} />
        ))}
      </div>
    </section>
  )
}
