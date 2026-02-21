'use client'

import React from 'react'
import { useField, TextInput } from '@payloadcms/ui'
import * as LucideIcons from 'lucide-react'

// Meest gebruikte icons voor e-commerce/medical
const COMMON_ICONS = [
  // Medical
  'Stethoscope', 'Heart', 'Syringe', 'Scissors', 'Microscope',
  'Pill', 'Activity', 'Thermometer', 'Cross', 'Bandage',
  // E-commerce
  'Package', 'ShoppingCart', 'ShoppingBag', 'Truck', 'CreditCard',
  'DollarSign', 'Tag', 'Gift', 'Percent',
  // Trust/USPs
  'Shield', 'ShieldCheck', 'Lock', 'CheckCircle', 'Star',
  'Award', 'Trophy', 'Clock', 'Zap', 'ThumbsUp',
  // Navigation
  'Home', 'ChevronRight', 'Menu', 'Search', 'User',
  'Mail', 'Phone', 'MapPin',
]

export const IconPickerField: React.FC<any> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const [search, setSearch] = React.useState('')
  const [showAll, setShowAll] = React.useState(false)

  const filteredIcons = showAll
    ? Object.keys(LucideIcons).filter(
        (name) =>
          name !== 'createLucideIcon' &&
          name.toLowerCase().includes(search.toLowerCase()),
      ).slice(0, 100) // Limit for performance
    : COMMON_ICONS.filter((name) => name.toLowerCase().includes(search.toLowerCase()))

  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<any>
    return Icon ? <Icon size={18} /> : null
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Zoek icon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontSize: '14px',
            marginBottom: '8px',
          }}
        />
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          style={{
            padding: '6px 12px',
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {showAll ? 'Toon populaire' : 'Toon alle icons (100)'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '8px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px',
          background: 'var(--theme-elevation-0)',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        {filteredIcons.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => setValue(iconName)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 6px',
              background: value === iconName ? 'var(--theme-elevation-500)' : 'var(--theme-elevation-50)',
              border: `2px solid ${value === iconName ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: value === iconName ? 'white' : 'inherit',
            }}
            title={iconName}
          >
            {getIcon(iconName)}
            <span style={{ fontSize: '10px', textAlign: 'center', wordBreak: 'break-word' }}>
              {iconName}
            </span>
          </button>
        ))}
      </div>

      {value && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'var(--theme-elevation-50)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          <strong>Geselecteerd:</strong>
          {getIcon(value)}
          <span>{value}</span>
        </div>
      )}
    </div>
  )
}
