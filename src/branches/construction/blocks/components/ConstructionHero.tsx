/**
 * ConstructionHeroComponent - Hero block for construction sites
 *
 * Features:
 * - Badge with optional icon
 * - Title with {highlight} syntax support
 * - Primary and secondary CTAs
 * - Trust element with avatars
 * - Hero image or emoji fallback
 * - Floating badges (optional)
 */

import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { ConstructionHeroBlock, Media } from '@/payload-types'

export const ConstructionHeroComponent: React.FC<ConstructionHeroBlock> = ({
  badge,
  badgeIcon,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustText,
  trustSubtext,
  avatars,
  heroImage,
  heroEmoji,
  floatingBadges,
}) => {
  // Parse title with {highlight} syntax
  const parseTitle = (text: string) => {
    if (!text) return text

    const parts = text.split(/\{highlight\}(.*?)\{\/highlight\}/g)
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-primary">
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Get hero image URL
  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null ? (heroImage as Media).url : null

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/90 py-16 md:py-20 lg:py-24">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white backdrop-blur-sm">
                {badgeIcon && <Icon name={badgeIcon as any} size={16} />}
                <span>{badge}</span>
              </div>
            )}

            {/* Title */}
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                {parseTitle(title)}
              </h1>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}

            {/* CTAs */}
            {primaryCTA && (
              <div className="flex flex-wrap gap-4">
                <Link
                  href={primaryCTA.link || '/'}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  {primaryCTA.text}
                  {primaryCTA.icon && <Icon name={primaryCTA.icon as any} size={20} />}
                </Link>

                {secondaryCTA?.text && (
                  <Link
                    href={secondaryCTA.link || '/'}
                    className="btn btn-outline-neutral inline-flex items-center gap-2 backdrop-blur-sm"
                  >
                    {secondaryCTA.text}
                    {secondaryCTA.icon && <Icon name={secondaryCTA.icon as any} size={20} />}
                  </Link>
                )}
              </div>
            )}

            {/* Trust Element */}
            {trustText && (
              <div className="flex items-center gap-4 pt-4">
                {/* Avatar Stack */}
                {avatars && avatars.length > 0 && (
                  <div className="flex -space-x-3">
                    {avatars.map((avatar, index) => {
                      const colorClasses = {
                        teal: 'bg-primary text-white',
                        blue: 'bg-blue-500 text-white',
                        purple: 'bg-purple-500 text-white',
                        amber: 'bg-warning text-white',
                      }
                      const currentColor = avatar.color || 'teal'
                      const colorClass = colorClasses[currentColor] || colorClasses.teal

                      return (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-sm font-semibold border-2 border-white`}
                        >
                          {avatar.initials}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Trust Text */}
                <div className="text-white">
                  <div className="font-semibold">{trustText}</div>
                  {trustSubtext && <div className="text-sm text-white/70">{trustSubtext}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            {heroImageUrl ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImageUrl}
                  alt={title || 'Hero image'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : heroEmoji ? (
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-9xl">{heroEmoji}</span>
              </div>
            ) : null}

            {/* Floating Badges */}
            {floatingBadges && floatingBadges.length > 0 && (
              <>
                {floatingBadges.map((badge, index) => {
                  const colorClasses = {
                    green: 'bg-success text-white',
                    amber: 'bg-warning text-white',
                    blue: 'bg-blue-500 text-white',
                    teal: 'bg-primary text-white',
                  }
                  const currentColor = badge.color || 'teal'
                  const colorClass = colorClasses[currentColor] || colorClasses.teal

                  const positionClasses = {
                    'bottom-left': 'bottom-4 left-4',
                    'top-right': 'top-4 right-4',
                  }
                  const currentPosition = badge.position || 'bottom-left'
                  const positionClass = positionClasses[currentPosition] || positionClasses['bottom-left']

                  return (
                    <div
                      key={index}
                      className={`absolute ${positionClass} ${colorClass} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}
                    >
                      {badge.icon && <Icon name={badge.icon as any} size={24} />}
                      <div>
                        <div className="font-bold">{badge.title}</div>
                        {badge.subtitle && <div className="text-sm opacity-90">{badge.subtitle}</div>}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
