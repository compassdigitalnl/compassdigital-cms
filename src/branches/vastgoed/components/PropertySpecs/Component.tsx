import React from 'react'
import type { PropertySpecsProps } from './types'
import { EnergyLabelBadge } from '../EnergyLabelBadge'
import { formatArea } from '../../lib/propertyUtils'

const HEATING_LABELS: Record<string, string> = {
  'cv-ketel': 'CV-ketel',
  stadsverwarming: 'Stadsverwarming',
  warmtepomp: 'Warmtepomp',
  vloerverwarming: 'Vloerverwarming',
  anders: 'Anders',
}

const GARDEN_ORIENTATION_LABELS: Record<string, string> = {
  noord: 'Noord',
  oost: 'Oost',
  zuid: 'Zuid',
  west: 'West',
  nvt: 'N.v.t.',
}

interface SpecRow {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

export const PropertySpecs: React.FC<PropertySpecsProps> = ({ property, className = '' }) => {
  const specs: SpecRow[] = []

  if (property.buildYear) {
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      label: 'Bouwjaar',
      value: property.buildYear,
    })
  }

  if (property.livingArea) {
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
      ),
      label: 'Woonoppervlakte',
      value: formatArea(property.livingArea),
    })
  }

  if (property.plotArea) {
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        </svg>
      ),
      label: 'Perceeloppervlakte',
      value: formatArea(property.plotArea),
    })
  }

  if (property.rooms || property.bedrooms) {
    const parts: string[] = []
    if (property.rooms) parts.push(`${property.rooms} kamers`)
    if (property.bedrooms) parts.push(`(${property.bedrooms} slaapkamers)`)
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 4h3a2 2 0 0 1 2 2v14" />
          <path d="M2 20h3" />
          <path d="M13 20h9" />
          <path d="M10 12v.01" />
          <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
        </svg>
      ),
      label: 'Kamers',
      value: parts.join(' '),
    })
  }

  if (property.energyLabel) {
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      label: 'Energielabel',
      value: (
        <EnergyLabelBadge
          label={property.energyLabel}
          size="sm"
          showExpiry={!!property.energyLabelExpiry}
          expiry={property.energyLabelExpiry}
        />
      ),
    })
  }

  if (property.heatingType) {
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
      label: 'Verwarming',
      value: HEATING_LABELS[property.heatingType] || property.heatingType,
    })
  }

  if (property.hasGarden) {
    const gardenParts: string[] = ['Ja']
    if (property.gardenArea) gardenParts.push(`${property.gardenArea} m²`)
    if (property.gardenOrientation && property.gardenOrientation !== 'nvt') {
      gardenParts.push(`(${GARDEN_ORIENTATION_LABELS[property.gardenOrientation] || property.gardenOrientation})`)
    }
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
          <path d="M7 16v6" />
          <path d="M13 19v3" />
          <path d="M18 10v.2A3 3 0 0 1 16.9 16v0H13v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
        </svg>
      ),
      label: 'Tuin',
      value: gardenParts.join(' '),
    })
  }

  if (property.hasGarage || property.hasParking) {
    const parkParts: string[] = []
    if (property.hasGarage) parkParts.push('Garage')
    if (property.hasParking) parkParts.push(property.parkingType || 'Parkeerplaats')
    specs.push({
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
      label: 'Parkeren',
      value: parkParts.join(', '),
    })
  }

  if (specs.length === 0) return null

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <div className="grid grid-cols-[1fr_1fr]">
        {specs.map((spec, index) => (
          <div key={index} className="contents">
            <div
              className={`flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--color-base-500)] ${
                index % 2 === 0 ? 'bg-[var(--color-base-50)]' : 'bg-[var(--color-base-0)]'
              }`}
            >
              <span className="text-[var(--color-base-400)]">{spec.icon}</span>
              {spec.label}
            </div>
            <div
              className={`flex items-center px-4 py-3 text-[13px] font-semibold text-[var(--color-base-1000)] ${
                index % 2 === 0 ? 'bg-[var(--color-base-50)]' : 'bg-[var(--color-base-0)]'
              }`}
            >
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
