import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface VendorProductCardProps {
  product: {
    id: number | string
    title: string
    slug: string
    price?: number | null
    salePrice?: number | null
    badge?: string | null
    brand?: { name: string } | string | null
    images?: Array<{ url?: string; alt?: string }> | null
  }
}

export function VendorProductCard({ product }: VendorProductCardProps) {
  const brandName =
    typeof product.brand === 'object' && product.brand !== null ? product.brand.name : null
  const image = product.images?.[0]
  const effectivePrice = product.salePrice || product.price

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="bg-white rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-md group"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Image */}
      <div className="h-30 relative flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)' }}>
        {image && typeof image === 'object' && image.url ? (
          <img src={image.url} alt={image.alt || product.title} className="w-full h-full object-contain p-3" />
        ) : (
          <span className="text-4xl opacity-30">📦</span>
        )}
        {product.badge && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-warning)' }}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        {brandName && (
          <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-primary)' }}>
            {brandName}
          </div>
        )}
        <h4
          className="text-sm font-bold line-clamp-2 leading-snug mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {product.title}
        </h4>

        <div className="flex items-center justify-between">
          {effectivePrice != null ? (
            <div
              className="text-base font-extrabold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              €{effectivePrice.toFixed(2).replace('.', ',')}
            </div>
          ) : (
            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Op aanvraag</div>
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
