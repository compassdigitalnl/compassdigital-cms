'use client'

import React, { useState } from 'react'
import * as LucideIcons from 'lucide-react'

// Meest gebruikte icons voor e-commerce/medical
const COMMON_ICONS = [
  // Medical
  'Stethoscope',
  'Heart',
  'Syringe',
  'Scissors',
  'Microscope',
  'Pill',
  'Activity',
  'Thermometer',
  'Cross',
  'Bandage',

  // E-commerce
  'Package',
  'ShoppingCart',
  'ShoppingBag',
  'Truck',
  'CreditCard',
  'DollarSign',
  'Tag',
  'Gift',
  'Percent',

  // Trust/USPs
  'Shield',
  'ShieldCheck',
  'Lock',
  'CheckCircle',
  'Star',
  'Award',
  'Trophy',
  'Clock',
  'Zap',
  'ThumbsUp',

  // Navigation
  'Home',
  'ChevronRight',
  'ChevronDown',
  'Menu',
  'X',
  'Search',
  'User',
  'Mail',
  'Phone',
  'MapPin',

  // General
  'Info',
  'AlertCircle',
  'Check',
  'Plus',
  'Minus',
  'ArrowRight',
  'ArrowLeft',
  'ExternalLink',
  'Download',
  'Upload',
]

interface IconPickerProps {
  value?: string
  onChange: (iconName: string) => void
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filteredIcons = showAll
    ? Object.keys(LucideIcons).filter(
        (name) =>
          name !== 'createLucideIcon' &&
          name.toLowerCase().includes(search.toLowerCase())
      )
    : COMMON_ICONS.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      )

  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<any>
    return Icon ? <Icon size={20} /> : null
  }

  return (
    <div className="icon-picker">
      <div className="icon-picker__search">
        <input
          type="text"
          placeholder="Zoek icon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="icon-picker__input"
        />
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="icon-picker__toggle"
        >
          {showAll ? 'Toon populaire' : 'Toon alle icons'}
        </button>
      </div>

      <div className="icon-picker__grid">
        {filteredIcons.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={`icon-picker__item ${value === iconName ? 'icon-picker__item--selected' : ''}`}
            title={iconName}
          >
            {getIcon(iconName)}
            <span className="icon-picker__label">{iconName}</span>
          </button>
        ))}
      </div>

      {value && (
        <div className="icon-picker__preview">
          <strong>Geselecteerd:</strong> {getIcon(value)} {value}
        </div>
      )}

      <style jsx>{`
        .icon-picker {
          padding: 12px;
          background: #fafbfc;
          border-radius: 8px;
        }

        .icon-picker__search {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .icon-picker__input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          font-size: 14px;
        }

        .icon-picker__input:focus {
          outline: none;
          border-color: #0969da;
        }

        .icon-picker__toggle {
          padding: 8px 16px;
          background: white;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-picker__toggle:hover {
          background: #f6f8fa;
        }

        .icon-picker__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px;
        }

        .icon-picker__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: white;
          border: 2px solid #e1e4e8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-picker__item:hover {
          border-color: #0969da;
          background: #f6f8fa;
        }

        .icon-picker__item--selected {
          border-color: #0969da;
          background: #ddf4ff;
        }

        .icon-picker__label {
          font-size: 11px;
          text-align: center;
          color: #57606a;
          word-break: break-word;
          max-width: 100%;
        }

        .icon-picker__preview {
          margin-top: 12px;
          padding: 12px;
          background: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
