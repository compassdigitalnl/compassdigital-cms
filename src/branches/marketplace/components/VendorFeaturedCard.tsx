import Link from 'next/link'
import { Star, Package, MapPin } from 'lucide-react'

interface VendorFeaturedCardProps {
  vendor: {
    id: number | string
    name: string
    slug: string
    shortName?: string | null
    tagline?: string | null
    bannerColor?: string | null
    isPremium?: boolean | null
    logo?: { url?: string; alt?: string } | null
    stats?: {
      productCount?: number | null
      rating?: number | null
      reviewCount?: number | null
    } | null
    contact?: { country?: string | null } | null
    categories?: Array<{ id: number | string; name: string }> | null
  }
}

export function VendorFeaturedCard({ vendor }: VendorFeaturedCardProps) {
  const logo = vendor.logo && typeof vendor.logo === 'object' ? vendor.logo : null

  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg border-[1.5px]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Banner */}
      <div
        className="h-24 relative flex items-center justify-center"
        style={{
          background: vendor.bannerColor
            ? `linear-gradient(135deg, ${vendor.bannerColor}, ${vendor.bannerColor}dd)`
            : 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
        }}
      >
        {vendor.isPremium && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/12 px-2.5 py-1 rounded-full text-xs font-bold text-white">
            <Star className="w-3 h-3" style={{ color: 'var(--color-warning)' }} />
            Premium partner
          </div>
        )}
        <div
          className="w-18 h-18 bg-white rounded-2xl flex items-center justify-center font-extrabold shadow-lg border-3 border-white absolute -bottom-7 left-5 overflow-hidden"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
          }}
        >
          {logo?.url ? (
            <img src={logo.url} alt={logo.alt || vendor.name} className="w-full h-full object-contain p-1.5" />
          ) : (
            vendor.shortName || vendor.name.substring(0, 8)
          )}
        </div>
      </div>

      {/* Body */}
      <div className="pt-10 px-5 pb-4">
        <div
          className="text-lg font-extrabold mb-0.5"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
        >
          {vendor.name}
        </div>
        <div className="text-sm mb-2.5 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {vendor.tagline}
        </div>

        {/* Meta */}
        <div className="flex gap-3 mb-3 flex-wrap text-xs">
          {vendor.stats?.productCount ? (
            <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Package className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              {vendor.stats.productCount} producten
            </div>
          ) : null}
          {vendor.contact?.country && (
            <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              {vendor.contact.country}
            </div>
          )}
          {vendor.stats?.rating ? (
            <div className="flex items-center gap-1 font-bold" style={{ color: 'var(--color-warning)' }}>
              ★ {vendor.stats.rating.toFixed(1)}
              {vendor.stats.reviewCount ? (
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>
                  ({vendor.stats.reviewCount})
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Categories */}
        {vendor.categories && vendor.categories.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {vendor.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
