import React from 'react'
import Link from 'next/link'
import type { CTABlock } from '@/payload-types'

/**
 * B03 - CTA Block Component
 *
 * Call-to-action section with 3 variants and 3 background styles.
 *
 * @see docs/refactoring/sprint-9/shared/b03-cta.html
 */

export const CTABlockComponent: React.FC<CTABlock> = ({
  title,
  description,
  buttons = [],
  variant = 'centered',
  style = 'dark',
}) => {
  const bgStyles = {
    dark: 'bg-gradient-to-br from-navy to-navy-light text-white',
    light: 'bg-white text-navy border border-grey',
    gradient: 'bg-gradient-to-r from-teal to-teal-dark text-white',
  }

  const buttonStyles = {
    primary: 'bg-teal text-white hover:bg-teal-dark',
    secondary: 'bg-transparent border-2 border-current hover:bg-white/10',
    ghost: 'text-current hover:underline',
  }

  return (
    <section className={`cta-block py-12 md:py-16 rounded-2xl ${bgStyles[style as keyof typeof bgStyles]}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`${
            variant === 'split'
              ? 'flex flex-col md:flex-row justify-between items-center gap-6'
              : 'text-center max-w-3xl mx-auto'
          }`}
        >
          <div className={variant === 'split' ? 'flex-1' : ''}>
            <h2 className="font-display text-2xl md:text-3xl mb-3">{title}</h2>
            {description && <p className="text-sm md:text-base opacity-90">{description}</p>}
          </div>
          {buttons && buttons.length > 0 && (
            <div
              className={`flex gap-3 flex-wrap ${
                variant === 'centered' ? 'justify-center mt-6' : variant === 'split' ? '' : 'justify-center mt-6'
              }`}
            >
              {buttons.map((btn, idx) => {
                if (!btn || typeof btn !== 'object' || !('label' in btn) || !('link' in btn)) {
                  return null
                }
                const buttonStyle = 'style' in btn ? btn.style : 'primary'
                return (
                  <Link
                    key={idx}
                    href={btn.link}
                    className={`inline-block px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                      buttonStyles[buttonStyle as keyof typeof buttonStyles]
                    }`}
                  >
                    {btn.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTABlockComponent
