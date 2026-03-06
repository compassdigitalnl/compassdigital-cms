'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import {
  Stethoscope, Heart, Syringe, Scissors, Microscope,
  Pill, Activity, Thermometer, Cross, Bandage,
  Package, ShoppingCart, ShoppingBag, Truck, CreditCard,
  DollarSign, Tag, Gift, Percent,
  Shield, ShieldCheck, Lock, CheckCircle, Star,
  Award, Trophy, Clock, Zap, ThumbsUp,
  Home, ChevronRight, Menu, Search, User,
  Mail, Phone, MapPin,
  // Extra commonly used
  Eye, Settings, Globe, Calendar, FileText,
  Image, Video, Music, Download, Upload,
  ExternalLink, Link, Bookmark, Bell, MessageCircle,
  BarChart, PieChart, TrendingUp, Layers, Grid,
  Coffee, Utensils, Wine, Leaf, Sun,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  // Medical
  Stethoscope, Heart, Syringe, Scissors, Microscope,
  Pill, Activity, Thermometer, Cross, Bandage,
  // E-commerce
  Package, ShoppingCart, ShoppingBag, Truck, CreditCard,
  DollarSign, Tag, Gift, Percent,
  // Trust/USPs
  Shield, ShieldCheck, Lock, CheckCircle, Star,
  Award, Trophy, Clock, Zap, ThumbsUp,
  // Navigation
  Home, ChevronRight, Menu, Search, User,
  Mail, Phone, MapPin,
  // Extra
  Eye, Settings, Globe, Calendar, FileText,
  Image, Video, Music, Download, Upload,
  ExternalLink, Link, Bookmark, Bell, MessageCircle,
  BarChart, PieChart, TrendingUp, Layers, Grid,
  Coffee, Utensils, Wine, Leaf, Sun,
}

const ICON_NAMES = Object.keys(ICON_MAP)

export const IconPickerField: React.FC<any> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const [search, setSearch] = React.useState('')
  const [manualInput, setManualInput] = React.useState(false)

  const filteredIcons = ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName]
    return Icon ? <Icon size={18} /> : null
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Zoek icon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          style={{
            padding: '6px 12px',
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {manualInput ? 'Kies uit grid' : 'Typ icon naam'}
        </button>
      </div>

      {manualInput ? (
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Lucide icon naam (bijv. ShoppingCart)"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '4px' }}>
            Zie lucide.dev/icons voor alle beschikbare icons.
          </p>
        </div>
      ) : (
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
      )}

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

export default IconPickerField
