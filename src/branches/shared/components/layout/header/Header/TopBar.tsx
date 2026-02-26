'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Header, Theme1 } from '@/payload-types'
import { getContainerMaxWidth } from '@/branches/shared/components/utilities/containerWidth'
import {
  BadgeCheck,
  Truck,
  Shield,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  Lock,
  Zap,
  Gift,
  RefreshCw,
  Users,
  Globe,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<any>> = {
  BadgeCheck,
  Truck,
  Shield,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  Lock,
  Zap,
  Gift,
  RefreshCw,
  Users,
}

type Props = {
  topBar: NonNullable<Header['topBar']>
  theme: Theme1 | null
  header?: Header
}

export function TopBar({ topBar, theme, header }: Props) {
  if (!topBar.enabled) return null

  const bgColor = topBar.backgroundColor || theme?.secondaryColor || '#0A1628'
  const textColor = topBar.textColor || '#FFFFFF'
  const containerClass = getContainerMaxWidth(theme?.containerWidth)
  const primaryColor = theme?.primaryColor || '#26A69A'

  // B2B/B2C and language config from header global
  const enablePriceToggle = (header as any)?.enablePriceToggle === true
  const priceToggleConfig = (header as any)?.priceToggle
  const enableLanguageSwitcher = (header as any)?.enableLanguageSwitcher === true
  const languages = (header as any)?.languages as Array<{ code: string; label: string; flag?: string; isDefault?: boolean }> | undefined

  return (
    <div className="topbar" style={{ backgroundColor: bgColor }}>
      <div className={`${containerClass} mx-auto px-8 h-9 flex items-center justify-between text-xs font-medium`}>
        {/* Left Messages */}
        <div className="flex items-center gap-6">
          {topBar.leftMessages?.map((message: any, index: number) => {
            const Icon = message.icon ? iconMap[message.icon] : null
            const content = (
              <span className="flex items-center gap-1.5 whitespace-nowrap" style={{ color: textColor + '99' }}>
                {Icon && <Icon className="w-3.5 h-3.5" style={{ color: primaryColor }} />}
                {message.text}
              </span>
            )

            if (message.link) {
              return (
                <Link
                  key={index}
                  href={message.link}
                  className="hover:text-white transition-colors"
                >
                  {content}
                </Link>
              )
            }

            return <div key={index}>{content}</div>
          })}
        </div>

        {/* Right: Links + B2B Toggle + Language Switcher */}
        <div className="flex items-center gap-1">
          {topBar.rightLinks?.map((link: any, index: number) => (
            <div key={`link-${index}`} className="flex items-center">
              {index > 0 && (
                <div
                  className="w-px h-3.5 mx-0.5"
                  style={{ backgroundColor: textColor + '1A' }}
                />
              )}
              <Link
                href={link.link || '#'}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-white/10"
                style={{ color: textColor + 'CC' }}
              >
                {link.label}
              </Link>
            </div>
          ))}

          {/* Separator before toggles */}
          {(enablePriceToggle || enableLanguageSwitcher) && topBar.rightLinks?.length > 0 && (
            <div className="w-px h-3.5 mx-1.5" style={{ backgroundColor: textColor + '2A' }} />
          )}

          {/* B2B/B2C Toggle */}
          {enablePriceToggle && (
            <PriceToggle
              defaultMode={priceToggleConfig?.defaultMode || 'b2c'}
              b2cLabel={priceToggleConfig?.b2cLabel || 'Particulier'}
              b2bLabel={priceToggleConfig?.b2bLabel || 'Zakelijk'}
              textColor={textColor}
            />
          )}

          {/* Language Switcher */}
          {enableLanguageSwitcher && languages && languages.length > 0 && (
            <LanguageSwitcher
              languages={languages}
              textColor={textColor}
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PriceToggle({
  defaultMode,
  b2cLabel,
  b2bLabel,
  textColor,
}: {
  defaultMode: 'b2c' | 'b2b'
  b2cLabel: string
  b2bLabel: string
  textColor: string
}) {
  const [mode, setMode] = useState<'b2c' | 'b2b'>(defaultMode)

  useEffect(() => {
    const saved = localStorage.getItem('price-mode') as 'b2c' | 'b2b' | null
    if (saved) setMode(saved)
  }, [])

  const toggle = () => {
    const newMode = mode === 'b2c' ? 'b2b' : 'b2c'
    setMode(newMode)
    localStorage.setItem('price-mode', newMode)
    window.dispatchEvent(new CustomEvent('priceToggle', { detail: { mode: newMode } }))
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-white/10 border border-white/20"
      style={{ color: textColor + 'CC' }}
      aria-label={`Schakel naar ${mode === 'b2c' ? 'zakelijk' : 'particulier'} prijzen`}
    >
      <span style={{ opacity: mode === 'b2c' ? 1 : 0.5, fontWeight: mode === 'b2c' ? 700 : 400 }}>
        {b2cLabel}
      </span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: mode === 'b2b' ? 1 : 0.5, fontWeight: mode === 'b2b' ? 700 : 400 }}>
        {b2bLabel}
      </span>
    </button>
  )
}

function LanguageSwitcher({
  languages,
  textColor,
  primaryColor,
}: {
  languages: Array<{ code: string; label: string; flag?: string; isDefault?: boolean }>
  textColor: string
  primaryColor: string
}) {
  const [currentLang, setCurrentLang] = useState(
    () => languages.find((l) => l.isDefault)?.code || languages[0]?.code || 'NL',
  )

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language')
    if (saved) setCurrentLang(saved)
  }, [])

  const handleChange = (code: string) => {
    setCurrentLang(code)
    localStorage.setItem('preferred-language', code)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: code } }))
  }

  // Button group for 2-3 languages
  if (languages.length <= 3) {
    return (
      <div className="flex items-center gap-1">
        <Globe className="w-3.5 h-3.5" style={{ color: textColor + '80' }} />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className="px-1.5 py-0.5 rounded text-[11px] font-medium transition-all"
            style={{
              color: currentLang === lang.code ? textColor : textColor + '80',
              backgroundColor: currentLang === lang.code ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: `1px solid ${currentLang === lang.code ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            {lang.flag || lang.code}
          </button>
        ))}
      </div>
    )
  }

  // Dropdown for 4+ languages
  return (
    <div className="flex items-center gap-1">
      <Globe className="w-3.5 h-3.5" style={{ color: textColor + '80' }} />
      <select
        value={currentLang}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border border-white/20 rounded px-1.5 py-0.5 text-[11px] font-medium cursor-pointer outline-none"
        style={{ color: textColor + 'CC' }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ color: '#000' }}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
