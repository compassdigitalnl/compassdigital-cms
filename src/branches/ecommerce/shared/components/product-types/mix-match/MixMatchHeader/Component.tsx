'use client'

import React from 'react'
import { Package } from 'lucide-react'
import type { MixMatchHeaderProps } from './types'

export type { MixMatchHeaderProps }

export const MixMatchHeader: React.FC<MixMatchHeaderProps> = ({
  badgeText = 'Mix & Match',
  badgeIcon = <Package className="w-3 h-3" />,
  title,
  highlightedText,
  description,
  stats = [
    { value: '6', label: 'Items kiezen' },
    { value: '€24,95', label: 'Vaste boxprijs' },
    { value: '30+', label: 'Producten' },
  ],
  showStats = true,
  variant = 'default',
  className = '',
}) => {
  // Split title and insert highlighted text if provided
  const renderTitle = () => {
    if (!highlightedText) {
      return <h1 className="mmh-title">{title}</h1>
    }

    const parts = title.split(highlightedText)
    return (
      <h1 className="mmh-title">
        {parts[0]}
        <em className="text-[var(--color-primary-light)] not-italic">{highlightedText}</em>
        {parts[1]}
      </h1>
    )
  }

  return (
    <div className={`mm-header relative overflow-hidden ${className}`}>
      {/* Decorative glow */}
      <div
        className="absolute -top-20 -right-10 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <div className="mmh-container max-w-[1240px] mx-auto px-6">
        <div
          className={`mmh-inner relative z-10 flex items-center justify-between gap-12 ${
            variant === 'compact' ? 'py-6' : 'py-9'
          } md:flex-row flex-col md:items-center items-start`}
        >
          {/* Left content */}
          <div className="mmh-left flex-1">
            {/* Badge */}
            <div className="mmh-badge inline-flex items-center gap-1 bg-[var(--color-primary-glow)]0/10 border border-[var(--color-primary)]/20 px-3 py-1 rounded-full text-xs font-bold text-[var(--color-primary-light)] mb-1.5">
              {badgeIcon}
              {badgeText}
            </div>

            {/* Title */}
            {renderTitle()}

            {/* Description */}
            <p className="mmh-desc text-sm text-white/35 max-w-[480px] leading-relaxed mt-1">
              {description}
            </p>
          </div>

          {/* Right stats */}
          {showStats && stats && stats.length > 0 && (
            <div className="mmh-right hidden md:flex items-center gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`mmh-stat text-center px-4 ${
                    index < stats.length - 1 ? 'border-r border-white/5' : ''
                  }`}
                >
                  <div className="mmhs-num text-[28px] font-extrabold text-[var(--color-primary-light)] leading-none mb-0.5">
                    {stat.value}
                  </div>
                  <div className="mmhs-label text-[11px] text-white/30 whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .mm-header {
          background: linear-gradient(135deg, #0a1628, #121f33);
        }
        .mmh-title {
          font-family: var(--font-heading);
          font-size: 30px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        @media (max-width: 768px) {
          .mmh-title {
            font-size: 24px;
          }
          .mmh-desc {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default MixMatchHeader
