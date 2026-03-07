import React from 'react'
import Link from 'next/link'
import { Settings, FileText, MapPin, CreditCard, ArrowRight } from 'lucide-react'
import type { MagazineServiceLinksProps, ServiceLink } from './types'

const DEFAULT_LINKS: ServiceLink[] = [
  { icon: Settings, label: 'Abonnement wijzigen', href: '/account/subscriptions' },
  { icon: MapPin, label: 'Adres wijzigen', href: '/account/addresses' },
  { icon: CreditCard, label: 'Betaalgegevens', href: '/account/payment-methods' },
  { icon: FileText, label: 'Facturen bekijken', href: '/account/invoices' },
]

export const MagazineServiceLinks: React.FC<MagazineServiceLinksProps> = ({
  links,
  title = 'Direct regelen',
  className = '',
}) => {
  const items = links && links.length > 0 ? links : DEFAULT_LINKS

  return (
    <section className={className}>
      <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
        <Settings className="h-5 w-5 text-[var(--color-primary)]" />
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((link, i) => {
          const Icon = typeof link.icon === 'string' ? Settings : link.icon
          return (
            <Link
              key={i}
              href={link.href}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-5 py-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md,0_8px_24px_rgba(10,22,40,0.08))]"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'var(--color-primary-glow, rgba(0,150,136,0.08))' }}
              >
                <Icon className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
              <span className="flex-1 text-sm font-bold text-[var(--color-text-primary)]">
                {link.label}
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
