import React from 'react'
import { Icon } from '@/components/Icon'
import { SectionLabel } from '@/components/SectionLabel'
import type { FeaturesBlock as FeaturesBlockType } from '@/payload-types'

export const FeaturesBlock: React.FC<FeaturesBlockType> = ({
  sectionLabel,
  heading,
  intro,
  features,
  layout = 'grid-3',
  style = 'cards',
  backgroundStyle = 'light',
  showHoverEffect = true,
}) => {
  if (!features || features.length === 0) return null

  const gridClass = {
    horizontal: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0',
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    'grid-4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    'grid-5': 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6',
    'grid-6': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
  }[layout]

  const isTrustBar = style === 'trust-bar' || layout === 'horizontal'
  const isDark = backgroundStyle === 'dark'

  // Dark variant (Waarom wij sectie)
  if (isDark) {
    return (
      <section className="relative bg-gradient-to-br from-[#0A1628] via-[#0D1B2E] to-[#0A1628] py-16 md:py-20 overflow-hidden">
        {/* Decorative gradient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          {(sectionLabel || heading || intro) && (
            <div className="text-center mb-12 md:mb-16">
              {sectionLabel && <SectionLabel label={sectionLabel} className="text-teal-400" />}
              {heading && (
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  {heading}
                </h2>
              )}
              {intro && <p className="text-lg text-white/60 max-w-2xl mx-auto">{intro}</p>}
            </div>
          )}

          {/* Glass morphism cards grid */}
          <div className={gridClass}>
            {features.map((feature, index) => {
              const iconName = feature.iconType === 'lucide' ? feature.iconName : null
              const iconImage = feature.iconType === 'upload' ? feature.iconUpload : null

              return (
                <div
                  key={index}
                  className={`relative bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl p-6 ${showHoverEffect ? 'transition-all duration-300 hover:bg-white/[0.07] hover:border-teal-500/20 hover:-translate-y-1' : ''} group`}
                >
                  {/* Icon */}
                  {iconName && (
                    <div className="w-12 h-12 bg-teal-500/15 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-teal-500/25">
                      <Icon name={iconName} size={24} className="text-teal-400" />
                    </div>
                  )}
                  {iconImage && typeof iconImage === 'object' && iconImage.url && (
                    <div className="w-12 h-12 mb-4">
                      <img
                        src={iconImage.url}
                        alt=""
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>
                  {feature.description && (
                    <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                  )}
                  {feature.link && (
                    <a
                      href={feature.link}
                      className="inline-flex items-center gap-1 text-sm font-medium text-teal-400 mt-3 hover:text-teal-300 transition-colors"
                    >
                      Meer info <Icon name="ArrowRight" size={14} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Light variant (original behavior)
  return (
    <section className={`py-12 md:py-16 ${isTrustBar ? 'bg-white border-y border-gray-200' : ''}`}>
      <div className="container mx-auto px-4">
        {!isTrustBar && (sectionLabel || heading || intro) && (
          <div className="text-center mb-12">
            {sectionLabel && <SectionLabel label={sectionLabel} />}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {intro && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{intro}</p>}
          </div>
        )}

        <div className={gridClass}>
          {features.map((feature, index) => {
            const iconName = feature.iconType === 'lucide' ? feature.iconName : null
            const iconImage = feature.iconType === 'upload' ? feature.iconUpload : null

            if (isTrustBar) {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3 py-5 px-4 border-r last:border-r-0 border-gray-200 transition-colors hover:bg-teal-50/50"
                >
                  {iconName && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon name={iconName} size={20} className="text-teal-600" />
                    </div>
                  )}
                  {iconImage && typeof iconImage === 'object' && iconImage.url && (
                    <div className="flex-shrink-0 w-10 h-10">
                      <img src={iconImage.url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">{feature.name}</div>
                    {feature.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {/* Fix: Show full description instead of truncating */}
                        {feature.description}
                      </div>
                    )}
                  </div>
                </div>
              )
            }

            // Cards or Clean style
            const isCards = style === 'cards'
            const baseCardClass = `${isCards ? 'bg-white border border-gray-200 rounded-2xl p-6' : 'p-4'} ${
              showHoverEffect ? 'transition-all duration-300' : ''
            }`
            const hoverClass = showHoverEffect
              ? isCards
                ? 'hover:-translate-y-2 hover:shadow-lg hover:border-teal-500/30'
                : 'hover:bg-gray-50'
              : ''

            return (
              <div key={index} className={`${baseCardClass} ${hoverClass} group`}>
                {iconName && (
                  <div
                    className={`${isCards ? 'w-14 h-14 bg-teal-100' : 'w-12 h-12 bg-gray-100'} rounded-xl flex items-center justify-center mb-4 transition-colors ${showHoverEffect ? 'group-hover:bg-teal-200' : ''}`}
                  >
                    <Icon name={iconName} size={24} className="text-teal-600" />
                  </div>
                )}
                {iconImage && typeof iconImage === 'object' && iconImage.url && (
                  <div className="w-14 h-14 mb-4">
                    <img src={iconImage.url} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h3>
                {feature.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                )}
                {feature.link && (
                  <a
                    href={feature.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 mt-3 hover:text-teal-700 transition-colors"
                  >
                    Meer info <Icon name="ArrowRight" size={14} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
