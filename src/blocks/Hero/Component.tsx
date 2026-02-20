'use client'
import React from 'react'
import Link from 'next/link'
import type { HeroBlock } from '@/payload-types'
import { OptimizedBackgroundImage } from '@/components/OptimizedImage'
import { SectionLabel } from '@/components/SectionLabel'

export const HeroBlockComponent: React.FC<HeroBlock> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  style,
  layout = 'centered',
  sectionLabel,
  badge,
  titleAccent,
  stats,
  backgroundImage,
  backgroundImageUrl,
}) => {
  const hasImage = style === 'image' && (backgroundImage || backgroundImageUrl)

  // Render title with accent
  const renderTitle = () => {
    if (!titleAccent || !title?.includes(titleAccent)) {
      return <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">{title}</h1>
    }

    const parts = title.split(titleAccent)
    return (
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        {parts[0]}
        <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
          {titleAccent}
        </span>
        {parts.slice(1).join(titleAccent)}
      </h1>
    )
  }

  // Two-column layout variant
  if (layout === 'two-column') {
    return (
      <section className="relative bg-gradient-to-br from-[#0A1628] via-[#0D1B2E] to-[#0A1628] py-20 px-4 overflow-hidden">
        {/* Decorative gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content container */}
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left column: Text content */}
            <div className="text-white">
              {sectionLabel && <SectionLabel label={sectionLabel} className="text-teal-400" />}

              {badge && (
                <div className="inline-block mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70">
                  {badge}
                </div>
              )}

              {renderTitle()}

              {subtitle && (
                <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                {primaryCTA?.text && (
                  <Link
                    href={primaryCTA.link || '#'}
                    className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {primaryCTA.text}
                  </Link>
                )}
                {secondaryCTA?.text && (
                  <Link
                    href={secondaryCTA.link || '#'}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    {secondaryCTA.text}
                  </Link>
                )}
              </div>
            </div>

            {/* Right column: Stats panel */}
            {stats && stats.length > 0 && (
              <div className="relative">
                {/* Glass morphism card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {/* Decorative accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-t-3xl" />

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {stats.slice(0, 4).map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                          {stat.number}
                          {stat.suffix && (
                            <span className="text-teal-400">{stat.suffix}</span>
                          )}
                        </div>
                        <div className="text-sm text-white/60 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative glow behind card */}
                <div className="absolute inset-0 bg-teal-500/10 rounded-3xl blur-2xl -z-10 transform translate-y-4" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
      </section>
    )
  }

  // Centered layout (original behavior - backwards compatible)
  if (hasImage) {
    return (
      <OptimizedBackgroundImage
        media={backgroundImage || backgroundImageUrl || ''}
        alt={title || 'Hero background'}
        overlay="dark"
        className="hero py-20 px-4"
      >
        <div className="container mx-auto max-w-4xl text-center text-white">
          {sectionLabel && <SectionLabel label={sectionLabel} className="text-white/80" />}
          <h1 className="text-5xl font-bold mb-6">{title}</h1>
          {subtitle && <p className="text-xl mb-8">{subtitle}</p>}

          <div className="flex gap-4 justify-center">
            {primaryCTA?.text && (
              <a
                href={primaryCTA.link}
                className="btn btn-primary px-6 py-3 text-white rounded-lg"
                style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
              >
                {primaryCTA.text}
              </a>
            )}
            {secondaryCTA?.text && (
              <a
                href={secondaryCTA.link}
                className="btn btn-secondary px-6 py-3 border-2 border-white rounded-lg bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
              >
                {secondaryCTA.text}
              </a>
            )}
          </div>
        </div>
      </OptimizedBackgroundImage>
    )
  }

  // Centered no-image variant
  return (
    <section className="hero relative py-20 px-4" data-style={style}>
      <div
        className={`container mx-auto max-w-4xl text-center relative z-10 ${hasImage ? 'text-white' : ''}`}
      >
        {sectionLabel && <SectionLabel label={sectionLabel} />}
        <h1 className="text-5xl font-bold mb-6">{title}</h1>
        {subtitle && <p className="text-xl mb-8">{subtitle}</p>}

        <div className="flex gap-4 justify-center">
          {primaryCTA?.text && (
            <a
              href={primaryCTA.link}
              className="btn btn-primary px-6 py-3 text-white rounded-lg"
              style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
            >
              {primaryCTA.text}
            </a>
          )}
          {secondaryCTA?.text && (
            <a
              href={secondaryCTA.link}
              className="btn btn-secondary px-6 py-3 border-2 rounded-lg transition-all duration-300 hover:text-white"
              style={{
                borderColor: hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)',
                color: hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)',
                backgroundColor: hasImage ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hasImage
                  ? 'white'
                  : 'var(--color-secondary, #8b5cf6)'
                e.currentTarget.style.color = hasImage
                  ? 'var(--color-primary, #3b82f6)'
                  : 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hasImage
                  ? 'rgba(255, 255, 255, 0.1)'
                  : ''
                e.currentTarget.style.color = hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)'
              }}
            >
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
