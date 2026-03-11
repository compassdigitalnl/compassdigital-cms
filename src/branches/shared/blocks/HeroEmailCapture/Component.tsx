import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { EmailCaptureForm } from './EmailCaptureForm'
import type { HeroEmailCaptureBlockProps, HeroEmailCaptureVariant } from './types'
import type { Media } from '@/payload-types'

/**
 * B-01d Hero Email Capture Block Component
 *
 * Hero variant with an integrated email signup form for lead generation.
 * 3 layout variants: centered, split, compact.
 */

const trustIconSvgs: Record<string, React.ReactNode> = {
  'shield-check': (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
  users: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
  star: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  ),
  clock: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  heart: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  ),
}

export const HeroEmailCaptureBlockComponent: React.FC<HeroEmailCaptureBlockProps> = ({
  badge,
  title,
  description,
  formLabel,
  submitButtonText,
  trustItems,
  heroImage,
  variant = 'centered',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'centered') as HeroEmailCaptureVariant
  const resolvedHeroImage =
    typeof heroImage === 'object' && heroImage !== null ? (heroImage as Media) : null

  // ── Centered variant ──────────────────────────────────────────────
  if (currentVariant === 'centered') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="hero-email-capture-block bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden rounded-2xl min-h-[500px] flex items-center py-16 md:py-24 lg:py-32"
      >
        {/* Decorative teal glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--color-primary-glow),_transparent_70%)] rounded-full pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-[720px] mx-auto px-6 text-center">
          {badge && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-teal/20 text-teal-light rounded-full px-4 py-1.5 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                {badge}
              </span>
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight text-white">
            {title}
          </h1>

          {description && (
            <p className="text-base text-white/70 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
          )}

          <div className="mb-6">
            <EmailCaptureForm
              formLabel={formLabel}
              submitButtonText={submitButtonText}
              variant="centered"
            />
          </div>

          {trustItems && trustItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {trustItems.map((item, idx) => {
                if (!item || typeof item !== 'object' || !item.text) return null
                return (
                  <div key={item.id || idx} className="flex items-center gap-1.5 text-xs text-white/60">
                    {item.icon && trustIconSvgs[item.icon] && (
                      <span className="text-teal-light">{trustIconSvgs[item.icon]}</span>
                    )}
                    <span>{item.text}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AnimationWrapper>
    )
  }

  // ── Split variant ─────────────────────────────────────────────────
  if (currentVariant === 'split') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="hero-email-capture-block bg-grey-light rounded-2xl py-12 md:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: text content + form */}
          <div>
            {badge && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full px-4 py-1.5 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                  {badge}
                </span>
              </div>
            )}

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight text-navy">
              {title}
            </h1>

            {description && (
              <p className="text-base text-navy/70 mb-8 leading-relaxed">
                {description}
              </p>
            )}

            <div className="mb-6">
              <EmailCaptureForm
                formLabel={formLabel}
                submitButtonText={submitButtonText}
                variant="split"
              />
            </div>

            {trustItems && trustItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {trustItems.map((item, idx) => {
                  if (!item || typeof item !== 'object' || !item.text) return null
                  return (
                    <div key={item.id || idx} className="flex items-center gap-1.5 text-xs text-navy/50">
                      {item.icon && trustIconSvgs[item.icon] && (
                        <span className="text-teal">{trustIconSvgs[item.icon]}</span>
                      )}
                      <span>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: hero image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-grey">
            {resolvedHeroImage?.url ? (
              <Image
                src={resolvedHeroImage.url}
                alt={resolvedHeroImage.alt || title || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-grey-dark text-sm">
                Geen afbeelding geselecteerd
              </div>
            )}
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // ── Compact variant ───────────────────────────────────────────────
  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="hero-email-capture-block bg-gradient-to-r from-teal to-teal-dark text-white rounded-2xl py-8"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Left: title + description */}
        <div className="flex-1 min-w-0">
          {badge && (
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-[11px] font-medium text-white mb-3">
              {badge}
            </span>
          )}
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl leading-tight text-white mb-1">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-white/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right: form */}
        <div className="w-full md:w-auto md:flex-shrink-0">
          <EmailCaptureForm
            formLabel={formLabel}
            submitButtonText={submitButtonText}
            variant="compact"
          />
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default HeroEmailCaptureBlockComponent
