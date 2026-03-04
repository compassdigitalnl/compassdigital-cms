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

type TopBarData = {
  enabled?: boolean | null
  backgroundColor?: string | null
  textColor?: string | null
  leftMessages?: any[]
  rightLinks?: any[]
}

type Props = {
  topBar: TopBarData
  theme: Theme1 | null
  header?: Header
}

export function TopBar({ topBar, theme, header }: Props) {
  if (!topBar.enabled) return null

  const bgColor = topBar.backgroundColor || theme?.navy || '#0A1628'
  const textColor = topBar.textColor || '#FFFFFF'
  const containerClass = getContainerMaxWidth('default' as any) // Use default container width
  const primaryColor = theme?.teal || '#26A69A'

  // Language config from header global
  const enableLanguageSwitcher = (header as any)?.enableLanguageSwitcher === true
  const languages = (header as any)?.languages as Array<{ code: string; label: string; flag?: string; isDefault?: boolean }> | undefined

  return (
    <div className="topbar" style={{ backgroundColor: bgColor }}>
      <div className={`${containerClass} mx-auto px-4 h-9 flex items-center justify-between text-xs font-medium`}>
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
          {enableLanguageSwitcher && (topBar.rightLinks?.length ?? 0) > 0 && (
            <div className="w-px h-3.5 mx-1.5" style={{ backgroundColor: textColor + '2A' }} />
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
