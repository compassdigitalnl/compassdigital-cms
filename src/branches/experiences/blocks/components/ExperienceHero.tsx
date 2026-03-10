import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ExperienceSearchBar } from '@/branches/experiences/components/archive/ExperienceSearchBar'
import { CategoryPills } from '@/branches/experiences/components/archive/CategoryPills'

export async function ExperienceHeroComponent(props: any) {
  const {
    subtitle,
    title,
    description,
    showSearchBar = true,
    showCategoryPills = true,
    trustBadges,
    backgroundImage,
    backgroundStyle = 'gradient',
    overlayOpacity = 60,
  } = props

  // Fetch categories for pills
  let categories: any[] = []
  if (showCategoryPills) {
    try {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'experience-categories',
        limit: 8,
        sort: 'name',
      })
      categories = result.docs.map((cat: any) => ({
        label: cat.name,
        slug: cat.slug,
        icon: cat.icon,
      }))
    } catch (e) {
      // fail silently
    }
  }

  // Resolve background image URL
  const bgImageUrl = typeof backgroundImage === 'object' && backgroundImage?.url
    ? backgroundImage.url
    : null

  const bgStyle: React.CSSProperties = backgroundStyle === 'image' && bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, var(--color-navy, #1a2b4a) 0%, #0f1a2e 100%)' }

  return (
    <section className="relative overflow-hidden" style={{ ...bgStyle, minHeight: '480px' }}>
      {/* Overlay for image backgrounds */}
      {backgroundStyle === 'image' && bgImageUrl && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${(overlayOpacity || 60) / 100})` }}
        />
      )}

      {/* Decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--color-teal, #00a39b) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center py-16 md:py-24 text-center">
        {/* Subtitle */}
        {subtitle && (
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              backgroundColor: 'rgba(0, 163, 155, 0.15)',
              color: 'var(--color-teal, #00a39b)',
              border: '1px solid rgba(0, 163, 155, 0.3)',
            }}
          >
            {subtitle}
          </span>
        )}

        {/* Title */}
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl"
          style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl">
            {description}
          </p>
        )}

        {/* Search bar */}
        {showSearchBar && (
          <div className="w-full max-w-2xl mb-6">
            <ExperienceSearchBar variant="hero" />
          </div>
        )}

        {/* Category pills */}
        {showCategoryPills && categories.length > 0 && (
          <div className="mb-8">
            <CategoryPills categories={categories} variant="light" />
          </div>
        )}

        {/* Trust badges */}
        {trustBadges && trustBadges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {trustBadges.map((badge: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                {badge.icon && <span>{badge.icon}</span>}
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
