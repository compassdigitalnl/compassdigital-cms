import Link from 'next/link'
import { Package, Star, Truck, ShieldCheck, ChevronRight } from 'lucide-react'

interface VendorListCardProps {
  vendor: {
    id: number | string
    name: string
    slug: string
    shortName?: string | null
    tagline?: string | null
    isVerified?: boolean | null
    logo?: { url?: string; alt?: string } | null
    stats?: {
      productCount?: number | null
      rating?: number | null
      reviewCount?: number | null
    } | null
    delivery?: { deliveryTime?: string | null } | null
  }
}

export function VendorListCard({ vendor }: VendorListCardProps) {
  const logo = vendor.logo && typeof vendor.logo === 'object' ? vendor.logo : null

  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="bg-white rounded-2xl p-5 flex gap-4 items-start transition-all hover:-translate-y-0.5 hover:shadow-md border-[1.5px]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Logo */}
      <div
        className="w-15 h-15 rounded-xl flex items-center justify-center font-extrabold flex-shrink-0 text-xs text-center leading-tight overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
        }}
      >
        {logo?.url ? (
          <img src={logo.url} alt={logo.alt || vendor.name} className="w-full h-full object-contain p-1" />
        ) : (
          vendor.shortName || vendor.name.substring(0, 10)
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div
            className="text-base font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            {vendor.name}
          </div>
          {vendor.isVerified && (
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Geverifieerd
            </div>
          )}
        </div>
        <div className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {vendor.tagline}
        </div>

        {/* Meta */}
        <div className="flex gap-3.5 flex-wrap text-xs">
          {vendor.stats?.productCount ? (
            <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Package className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              {vendor.stats.productCount} producten
            </div>
          ) : null}
          {vendor.stats?.rating ? (
            <div className="flex items-center gap-1 font-bold" style={{ color: 'var(--color-warning)' }}>
              <Star className="w-3.5 h-3.5 fill-current" />
              {vendor.stats.rating.toFixed(1)} ({vendor.stats.reviewCount || 0})
            </div>
          ) : null}
          {vendor.delivery?.deliveryTime && (
            <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Truck className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              {vendor.delivery.deliveryTime}
            </div>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 self-center transition-colors"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
      </div>
    </Link>
  )
}
