import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  ShieldCheck,
  Star,
  Award,
  Lock,
  Truck,
} from 'lucide-react'
import type { Footer as FooterType, Setting } from '@/payload-types'

// Social platform icon map
const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  tiktok: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.56a8.27 8.27 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.03z" />
    </svg>
  ),
}

// Trust badge icon map
const trustIcons: Record<string, React.FC<{ className?: string }>> = {
  check: Check,
  'shield-check': ShieldCheck,
  star: Star,
  award: Award,
  lock: Lock,
  truck: Truck,
}

function getLinkHref(link: any): string {
  if (link.type === 'external' && link.externalUrl) return link.externalUrl
  if (link.type === 'page' && link.page) {
    const slug = typeof link.page === 'object' ? link.page.slug : null
    return slug ? `/${slug}` : '#'
  }
  return '#'
}

export async function SiteFooter() {
  let footer: FooterType | null = null
  let settings: Setting | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    footer = await payload.findGlobal({ slug: 'footer' })
    settings = await payload.findGlobal({ slug: 'settings' })
  } catch {
    // Silently fail — render minimal footer
  }

  // Extract data with fallbacks
  const logoType = footer?.logoType || 'text'
  const logoText = footer?.logoText || (settings as any)?.companyName || 'Sityzr'
  const logoAccent = footer?.logoAccent || ''
  const tagline = footer?.tagline || (settings as any)?.tagline || ''
  const socialLinks = (footer?.socialLinks as any[]) || []
  const columns = (footer?.columns as any[]) || []
  const showContact = footer?.showContactColumn !== false
  const contactHeading = footer?.contactHeading || 'Contact'
  const phone = footer?.phone || (settings as any)?.phone || ''
  const email = footer?.email || (settings as any)?.email || ''
  const address =
    footer?.address ||
    (settings?.address
      ? [settings.address.street, settings.address.city].filter(Boolean).join(', ')
      : '')
  const openingHours = footer?.openingHours || ''
  const trustBadges = (footer?.trustBadges as any[]) || []
  const copyrightText = footer?.copyrightText || `\u00a9 ${new Date().getFullYear()} — Alle rechten voorbehouden`
  const legalLinks = (footer?.legalLinks as any[]) || []

  // Count columns for grid
  const totalCols = 1 + columns.length + (showContact ? 1 : 0)
  const gridCols =
    totalCols <= 2
      ? 'grid-cols-1 md:grid-cols-2'
      : totalCols <= 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <footer className="bg-navy-900 rounded-3xl overflow-hidden text-gray-400 mt-12">
      {/* Top Section */}
      <div className={`p-8 md:p-12 grid ${gridCols} gap-9 border-b border-white/5`}>
        {/* Brand Column */}
        <div>
          <div className="text-2xl font-extrabold text-white mb-2.5">
            {logoText}
            {logoAccent && (
              <span className="text-[var(--color-primary-light)]">{logoAccent}</span>
            )}
          </div>
          {tagline && <p className="text-sm leading-relaxed mb-3.5">{tagline}</p>}
          {socialLinks.length > 0 && (
            <div className="flex gap-1.5">
              {socialLinks.map((social: any, i: number) => {
                const Icon = socialIcons[social.platform]
                if (!Icon) return null
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Dynamic Navigation Columns */}
        {columns.map((col: any, i: number) => (
          <div key={i}>
            <h4 className="text-white font-extrabold text-sm mb-3.5">{col.heading}</h4>
            {col.links?.length > 0 && (
              <ul className="space-y-2">
                {col.links.map((link: any, j: number) => (
                  <li key={j}>
                    <Link
                      href={getLinkHref(link)}
                      className="text-sm hover:text-[var(--color-primary-light)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Contact Column */}
        {showContact && (phone || email || address || openingHours) && (
          <div>
            <h4 className="text-white font-extrabold text-sm mb-3.5">{contactHeading}</h4>
            <div className="space-y-2">
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm hover:text-[var(--color-primary-light)] transition-colors">
                  <Phone className="w-4 h-4 text-[var(--color-primary-light)] shrink-0" />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm hover:text-[var(--color-primary-light)] transition-colors">
                  <Mail className="w-4 h-4 text-[var(--color-primary-light)] shrink-0" />
                  {email}
                </a>
              )}
              {address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--color-primary-light)] shrink-0" />
                  {address}
                </div>
              )}
              {openingHours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[var(--color-primary-light)] shrink-0" />
                  {openingHours}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      {trustBadges.length > 0 && (
        <div className="px-8 md:px-12 py-5 border-b border-white/5 flex flex-wrap gap-6">
          {trustBadges.map((badge: any, i: number) => {
            const Icon = trustIcons[badge.icon] || Check
            return (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <Icon className="w-3.5 h-3.5 text-green-500" />
                {badge.text}
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom: Copyright & Legal */}
      <div className="px-8 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
        <span>{copyrightText}</span>
        {legalLinks.length > 0 && (
          <div className="flex gap-4">
            {legalLinks.map((link: any, i: number) => (
              <Link
                key={i}
                href={getLinkHref(link)}
                className="hover:text-[var(--color-primary-light)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
