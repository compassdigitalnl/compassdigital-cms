import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireFeature } from '@/lib/featureGuard'
import {
  Search,
  Package,
  MapPin,
  Star,
  ChevronRight,
  ShieldCheck,
  Award,
  Leaf,
  Truck,
  GraduationCap,
  Grid3x3,
  Handshake,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leveranciers — Overzicht van onze partners',
  description:
    'Ontdek onze leveranciers en partners. Vind uw leverancier, bekijk hun assortiment en bestel direct via ons platform.',
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  requireFeature('vendors')

  const payload = await getPayload({ config })

  // Get all vendors
  const vendorsData = await payload.find({
    collection: 'vendors',
    depth: 2,
    limit: 100,
    sort: '-isFeatured,-isPremium,order,name',
  })

  const allVendors = vendorsData.docs
  const featuredVendors = allVendors.filter((v) => v.isFeatured).slice(0, 3)
  const regularVendors = allVendors.filter((v) => !v.isFeatured)

  // Calculate stats
  const totalVendors = allVendors.length
  const totalProducts = allVendors.reduce((sum, v) => sum + (v.stats?.productCount || 0), 0)
  const averageRating =
    allVendors.reduce((sum, v) => sum + (v.stats?.rating || 0), 0) / (totalVendors || 1)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" style={{ color: 'var(--color-text-muted)' }}>
            Home
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Leveranciers</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Hero */}
        <div
          className="rounded-2xl p-12 mb-7 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute top-0 right-24 w-60 h-60 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
            }}
          />

          <h1
            className="text-3xl font-extrabold text-white mb-2 relative"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Onze leveranciers & partners
          </h1>
          <p className="text-white/45 max-w-xl mb-5 relative">
            Wij werken samen met toonaangevende leveranciers in de sector. Vind uw leverancier,
            bekijk hun assortiment en bestel direct via ons platform.
          </p>

          {/* Stats */}
          <div className="flex gap-6 relative">
            <div className="text-center px-5 py-3 bg-white/5 border border-white/8 rounded-xl">
              <div
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {totalVendors}
              </div>
              <div className="text-xs text-white/35">Leveranciers</div>
            </div>
            <div className="text-center px-5 py-3 bg-white/5 border border-white/8 rounded-xl">
              <div
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {totalProducts.toLocaleString('nl-NL')}+
              </div>
              <div className="text-xs text-white/35">Producten</div>
            </div>
            <div className="text-center px-5 py-3 bg-white/5 border border-white/8 rounded-xl">
              <div
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-white/35">Gem. beoordeling</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px] max-w-[360px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Zoek leverancier op naam…"
              className="w-full h-11 pl-11 pr-4 rounded-xl text-sm border-2 transition-all focus:outline-none"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'white',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
          <select
            className="h-11 px-3.5 pr-9 rounded-xl text-sm font-semibold border-2 appearance-none bg-white cursor-pointer"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
          >
            <option>Sorteren: Aanbevolen</option>
            <option>Naam A-Z</option>
            <option>Meeste producten</option>
            <option>Hoogste beoordeling</option>
          </select>
          <div className="ml-auto text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            {totalVendors} leveranciers
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: '1.5px solid var(--color-primary)',
            }}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
            Alle
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Award className="w-3.5 h-3.5" />
            Premium partners
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            CE gecertificeerd
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Leaf className="w-3.5 h-3.5" />
            Duurzaam
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Truck className="w-3.5 h-3.5" />
            Direct leverbaar
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Met workshops
          </button>
        </div>

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
                <Link
                  key={vendor.id}
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
                      className="w-18 h-18 bg-white rounded-2xl flex items-center justify-center font-extrabold shadow-lg border-3 border-white absolute -bottom-7 left-5"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '14px',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {vendor.shortName || vendor.name.substring(0, 8)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pt-10 px-5 pb-4">
                    <div
                      className="text-lg font-extrabold mb-0.5"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {vendor.name}
                    </div>
                    <div
                      className="text-sm mb-2.5 line-clamp-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {vendor.tagline}
                    </div>

                    {/* Meta */}
                    <div className="flex gap-3 mb-3 flex-wrap text-xs">
                      {vendor.stats?.productCount && (
                        <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <Package className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                          {vendor.stats.productCount} producten
                        </div>
                      )}
                      {vendor.contact?.country && (
                        <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                          {vendor.contact.country}
                        </div>
                      )}
                      {vendor.stats?.rating && (
                        <div className="flex items-center gap-1 font-bold" style={{ color: 'var(--color-warning)' }}>
                          ★ {vendor.stats.rating.toFixed(1)}
                          {vendor.stats.reviewCount && (
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>
                              ({vendor.stats.reviewCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    {vendor.categories && vendor.categories.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {vendor.categories.slice(0, 3).map((cat: any) => (
                          <span
                            key={cat.id}
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
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
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.slug}`}
              className="bg-white rounded-2xl p-5 flex gap-4 items-start transition-all hover:-translate-y-0.5 hover:shadow-md border-[1.5px]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Logo */}
              <div
                className="w-15 h-15 rounded-xl flex items-center justify-center font-extrabold flex-shrink-0 text-xs text-center leading-tight"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {vendor.shortName || vendor.name.substring(0, 10)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div
                    className="text-base font-extrabold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {vendor.name}
                  </div>
                  {vendor.isVerified && (
                    <div
                      className="flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--color-success)' }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Geverifieerd
                    </div>
                  )}
                </div>
                <div
                  className="text-sm mb-2 line-clamp-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {vendor.tagline || 'Premium leverancier van hoogwaardige producten.'}
                </div>

                {/* Meta */}
                <div className="flex gap-3.5 flex-wrap text-xs">
                  {vendor.stats?.productCount && (
                    <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                      <Package className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      {vendor.stats.productCount} producten
                    </div>
                  )}
                  {vendor.stats?.rating && (
                    <div className="flex items-center gap-1 font-bold" style={{ color: 'var(--color-warning)' }}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {vendor.stats.rating.toFixed(1)} ({vendor.stats.reviewCount || 0})
                    </div>
                  )}
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
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-10 text-center relative overflow-hidden"
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
            className="text-2xl font-extrabold text-white mb-1.5 relative"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Zelf leverancier worden?
          </h2>
          <p className="text-sm text-white/45 mb-4 relative">
            Wij zijn altijd op zoek naar kwalitatieve partners. Neem contact op voor de
            mogelijkheden.
          </p>
          <Link
            href="/contact"
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
