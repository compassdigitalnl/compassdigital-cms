'use client'

import Link from 'next/link'
import type { Header, Theme } from '@/payload-types'
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
  theme: Theme | null
}

export function TopBar({ topBar, theme }: Props) {
  if (!topBar.enabled) return null

  const bgColor = topBar.backgroundColor || theme?.secondaryColor || '#0A1628'
  const textColor = topBar.textColor || '#FFFFFF'

  return (
    <div className="topbar" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1320px] mx-auto px-8 h-9 flex items-center justify-between text-xs font-medium">
        {/* Left Messages */}
        <div className="flex items-center gap-6">
          {topBar.leftMessages?.map((message, index) => {
            const Icon = message.icon ? iconMap[message.icon] : null
            const content = (
              <span className="flex items-center gap-1.5 whitespace-nowrap" style={{ color: textColor + '99' }}>
                {Icon && <Icon className="w-3.5 h-3.5" style={{ color: theme?.primaryColor || '#26A69A' }} />}
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

        {/* Right Links */}
        <div className="flex items-center gap-1">
          {topBar.rightLinks?.map((link, index) => (
            <>
              {index > 0 && (
                <div
                  key={`sep-${index}`}
                  className="w-px h-3.5 mx-0.5"
                  style={{ backgroundColor: textColor + '1A' }}
                />
              )}
              <Link
                key={index}
                href={link.link || '#'}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-white/10"
                style={{ color: textColor + 'CC' }}
              >
                {link.label}
              </Link>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
