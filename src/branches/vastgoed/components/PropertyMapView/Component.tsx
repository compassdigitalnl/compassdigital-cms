'use client'

import React, { useState } from 'react'
import type { PropertyMapViewProps, PropertyMapMarker } from './types'
import { formatPrice, formatArea } from '../../lib/propertyUtils'

const STATUS_COLORS: Record<string, string> = {
  beschikbaar: 'var(--color-primary)',
  'onder-bod': '#F59E0B',
  verkocht: '#64748B',
  verhuurd: '#64748B',
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  onPropertyClick,
  className = '',
}) => {
  const [activeView, setActiveView] = useState<'map' | 'draw'>('map')
  const [hoveredProperty, setHoveredProperty] = useState<PropertyMapMarker | null>(null)

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}
    >
      {/* Map controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-base-100)] px-4 py-3">
        <button
          onClick={() => setActiveView('map')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
            activeView === 'map'
              ? 'bg-[var(--color-primary)] text-white'
              : 'border border-[var(--color-base-200)] bg-[var(--color-base-50)] text-[var(--color-base-600)] hover:bg-[var(--color-base-100)]'
          }`}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" x2="8" y1="2" y2="18" />
            <line x1="16" x2="16" y1="6" y2="22" />
          </svg>
          Kaart
        </button>
        <button
          onClick={() => setActiveView('draw')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
            activeView === 'draw'
              ? 'bg-[var(--color-primary)] text-white'
              : 'border border-[var(--color-base-200)] bg-[var(--color-base-50)] text-[var(--color-base-600)] hover:bg-[var(--color-base-100)]'
          }`}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Gebied tekenen
        </button>

        <span className="ml-auto text-xs text-[var(--color-base-500)]">
          <strong className="font-bold text-[var(--color-base-1000)]">{properties.length}</strong>{' '}
          woningen op kaart
        </span>
      </div>

      {/* Map container — placeholder for map library integration */}
      <div className="relative flex h-[500px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10">
        {/* Placeholder content */}
        <div className="text-center">
          <svg
            className="mx-auto mb-3 h-16 w-16 text-[var(--color-primary)]/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" x2="8" y1="2" y2="18" />
            <line x1="16" x2="16" y1="6" y2="22" />
          </svg>
          <div className="text-sm font-semibold text-[var(--color-base-800)]">
            Interactieve kaart
          </div>
          <div className="text-xs text-[var(--color-base-500)]">
            Leaflet / Mapbox integratie
          </div>
        </div>

        {/* Hover card preview — shown when hoveredProperty is set */}
        {hoveredProperty && (
          <div className="absolute left-1/2 top-12 z-20 min-w-[200px] -translate-x-1/2 rounded-xl bg-[var(--color-base-0)] p-3 shadow-lg">
            <div className="mb-1 font-mono text-sm font-bold text-[var(--color-primary)]">
              {formatPrice(hoveredProperty.askingPrice, hoveredProperty.priceCondition)}
            </div>
            <div className="text-xs font-semibold text-[var(--color-base-1000)]">
              {hoveredProperty.title}
            </div>
            {hoveredProperty.city && (
              <div className="mb-2 text-[11px] text-[var(--color-base-500)]">
                {hoveredProperty.city}
              </div>
            )}
            <div className="flex gap-2 text-[11px] text-[var(--color-base-500)]">
              {hoveredProperty.bedrooms != null && <span>{hoveredProperty.bedrooms} slk</span>}
              {hoveredProperty.bathrooms != null && <span>{hoveredProperty.bathrooms} bdk</span>}
              {hoveredProperty.livingArea != null && (
                <span>{formatArea(hoveredProperty.livingArea)}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--color-base-50)] px-4 py-3 text-[11px] text-[var(--color-base-500)]">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          Beschikbaar
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
          Onder bod
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-base-500)]" />
          Verkocht
        </div>
      </div>
    </div>
  )
}
