import Link from 'next/link'
import { Star, Handshake } from 'lucide-react'
import { VendorFeaturedCard } from '../components/VendorFeaturedCard'
import { VendorListCard } from '../components/VendorListCard'
import { VendorFilterChips } from '../components/VendorFilterChips'
import { VendorSearchToolbar } from '../components/VendorSearchToolbar'

interface VendorArchiveTemplateProps {
  vendors: any[]
  totalVendors: number
  totalProducts: number
  averageRating: number
  stockPercentage?: number
}

export function VendorArchiveTemplate({
  vendors,
  totalVendors,
  totalProducts,
  averageRating,
  stockPercentage,
}: VendorArchiveTemplateProps) {
  const featuredVendors = vendors.filter((v) => v.isFeatured).slice(0, 3)
  const regularVendors = vendors.filter((v) => !v.isFeatured)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-6 pb-16">
        {/* Hero */}
        <div
          className="rounded-2xl p-8 md:p-12 mb-7 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
          }}
        >
          <div
            className="absolute top-0 right-24 w-60 h-60 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
            }}
          />
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white mb-2 relative"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Onze leveranciers & partners
          </h1>
          <p className="text-white/45 max-w-xl mb-5 relative">
            Wij werken samen met toonaangevende leveranciers in de sector. Vind uw leverancier,
            bekijk hun assortiment en bestel direct via ons platform.
          </p>

          {/* Stats */}
          <div className="flex gap-4 md:gap-6 relative flex-wrap">
            {[
              { value: totalVendors, label: 'Leveranciers' },
              { value: `${totalProducts.toLocaleString('nl-NL')}+`, label: 'Producten' },
              ...(stockPercentage != null ? [{ value: `${stockPercentage}%`, label: 'Op voorraad' }] : []),
              { value: averageRating.toFixed(1), label: 'Gem. beoordeling' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 md:px-5 py-3 bg-white/5 border border-white/8 rounded-xl">
                <div
                  className="text-xl md:text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/35">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <VendorSearchToolbar totalCount={totalVendors} />

        {/* Filter Chips */}
        <VendorFilterChips />

        {/* Featured Partners */}
        {featuredVendors.length > 0 && (
          <>
            <div
              className="flex items-center gap-2 mb-3 text-base font-extrabold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Star className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
              Uitgelichte partners
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
              {featuredVendors.map((vendor) => (
                <VendorFeaturedCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </>
        )}

        {/* All Vendors Grid */}
        <div
          className="text-base font-extrabold mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Alle leveranciers
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-7">
          {regularVendors.map((vendor) => (
            <VendorListCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {regularVendors.length === 0 && featuredVendors.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Geen leveranciers gevonden
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Er zijn momenteel geen leveranciers beschikbaar.
            </p>
          </div>
        )}

        {/* CTA */}
        <div
          className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
          }}
        >
          <div
            className="absolute top-0 right-[30%] w-50 h-50 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
            }}
          />
          <h2
            className="text-xl md:text-2xl font-extrabold text-white mb-1.5 relative"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Zelf leverancier worden?
          </h2>
          <p className="text-sm text-white/45 mb-4 relative">
            Wij zijn altijd op zoek naar kwalitatieve partners. Meld u aan via ons
            partnerprogramma.
          </p>
          <Link
            href="/vendors/aanmelden"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 relative"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Handshake className="w-4 h-4" />
            Partner worden
          </Link>
        </div>
      </div>
    </div>
  )
}
