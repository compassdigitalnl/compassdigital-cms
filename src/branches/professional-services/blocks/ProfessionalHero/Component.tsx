/**
 * ProfessionalHeroComponent - Hero block for professional services sites
 */

import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { ProfessionalHeroProps, Media } from './types'

export const ProfessionalHeroComponent: React.FC<ProfessionalHeroProps> = ({
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

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null ? (heroImage as Media).url : null

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/90 py-16 md:py-20 lg:py-24">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white backdrop-blur-sm">
                {badgeIcon && <Icon name={badgeIcon as any} size={16} />}
                <span>{badge}</span>
              </div>
            )}

            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                {parseTitle(title)}
              </h1>
            )}

            {description && (
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}

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

            {trustText && (
              <div className="flex items-center gap-4 pt-4">
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

                <div className="text-white">
                  <div className="font-semibold">{trustText}</div>
                  {trustSubtext && <div className="text-sm text-white/70">{trustSubtext}</div>}
                </div>
              </div>
            )}
          </div>

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

            {floatingBadges && floatingBadges.length > 0 && (
              <>
                {floatingBadges.map((floatingBadge, index) => {
                  const colorClasses = {
                    green: 'bg-success text-white',
                    amber: 'bg-warning text-white',
                    blue: 'bg-blue-500 text-white',
                    teal: 'bg-primary text-white',
                  }
                  const currentColor = floatingBadge.color || 'teal'
                  const colorClass = colorClasses[currentColor] || colorClasses.teal

                  const positionClasses = {
                    'bottom-left': 'bottom-4 left-4',
                    'top-right': 'top-4 right-4',
                  }
                  const currentPosition = floatingBadge.position || 'bottom-left'
                  const positionClass =
                    positionClasses[currentPosition] || positionClasses['bottom-left']

                  return (
                    <div
                      key={index}
                      className={`absolute ${positionClass} ${colorClass} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}
                    >
                      {floatingBadge.icon && <Icon name={floatingBadge.icon as any} size={24} />}
                      <div>
                        <div className="font-bold">{floatingBadge.title}</div>
                        {floatingBadge.subtitle && (
                          <div className="text-sm opacity-90">{floatingBadge.subtitle}</div>
                        )}
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
