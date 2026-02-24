import React from 'react'
import type { FeaturesBlock } from '@/payload-types'
import { FeaturesBlockComponent } from './Component.client'

/**
 * B02 - Features Block Component (Server)
 *
 * Features/USPs grid with Lucide icons.
 *
 * FEATURES:
 * - 3 layout variants (3-col, 4-col, list)
 * - 3 icon styles (glow, solid, outlined)
 * - Dynamic Lucide icon loading
 * - Responsive grid system
 * - Center/left alignment options
 *
 * @see docs/refactoring/sprint-9/shared/b02-features.html
 */

export const FeaturesBlockComponent: React.FC<FeaturesBlock> = ({
  title,
  description,
  features,
  variant = 'grid-3',
  iconStyle = 'glow',
  alignment = 'center',
}) => {
  return (
    <section className="features-block py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {(title || description) && (
          <div className={`mb-8 md:mb-12 ${alignment === 'center' ? 'text-center max-w-3xl mx-auto' : ''}`}>
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-grey-dark">{description}</p>
            )}
          </div>
        )}

        <FeaturesBlockComponent
          features={features || []}
          variant={variant}
          iconStyle={iconStyle}
          alignment={alignment}
        />
      </div>
    </section>
  )
}

export default FeaturesBlockComponent
