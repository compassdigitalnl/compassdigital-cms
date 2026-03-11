/**
 * B-23 SubscriptionOptions Component
 *
 * Frequency selector cards (weekly, monthly, quarterly, yearly)
 * with pricing and savings badges.
 * Uses theme variables for all colors.
 */
'use client'

import React, { useState } from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { SubscriptionOptionsBlock } from '@/payload-types'

export const SubscriptionOptionsComponent: React.FC<SubscriptionOptionsBlock> = ({
  title,
  options,
  variant = 'cards',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!options || options.length === 0) return null

  // List variant
  if (variant === 'list') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="py-12 md:py-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
            )}

            <div className="space-y-3">
              {options.map((option, index) => {
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={option.id || index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-grey bg-white hover:border-primary/30'
                    }`}
                  >
                    {/* Radio indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-primary' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{option.frequency}</span>
                        {option.savings && (
                          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">
                            {option.savings}
                          </span>
                        )}
                      </div>
                      {option.features && option.features.length > 0 && (
                        <div className="flex gap-3 mt-1">
                          {option.features.map((f, fIdx) => (
                            <span
                              key={f.id || fIdx}
                              className="text-xs text-grey-mid flex items-center gap-1"
                            >
                              <Icon name="Check" size={10} className="text-success" />
                              {f.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <span className="font-bold text-primary text-lg flex-shrink-0">
                      {option.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Cards variant (default)
  const gridClass =
    options.length <= 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'
      : options.length === 4
        ? 'grid grid-cols-2 md:grid-cols-4 gap-4'
        : 'grid grid-cols-2 md:grid-cols-3 gap-6'

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}

        <div className={gridClass}>
          {options.map((option, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={option.id || index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative text-center p-6 rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-grey bg-white hover:border-primary/30'
                }`}
              >
                {/* Savings badge */}
                {option.savings && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-success text-white text-[10px] font-bold whitespace-nowrap">
                    {option.savings}
                  </div>
                )}

                {/* Frequency icon */}
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
                  } transition-colors`}
                >
                  <Icon name="RefreshCw" size={22} />
                </div>

                {/* Frequency name */}
                <h3 className="font-bold text-gray-900 mb-1">{option.frequency}</h3>

                {/* Price */}
                <div className="text-2xl font-bold text-primary mb-3">{option.price}</div>

                {/* Features */}
                {option.features && option.features.length > 0 && (
                  <ul className="space-y-1 text-left">
                    {option.features.map((f, fIdx) => (
                      <li
                        key={f.id || fIdx}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                        {f.text}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="Check" size={14} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default SubscriptionOptionsComponent
