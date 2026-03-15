import Link from 'next/link'
import {
  ChevronRight,
  Star,
  Package,
  ExternalLink,
  Grid3x3,
  GraduationCap,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { VendorStatsBar } from '../components/VendorStatsBar'
import { VendorTabs } from '../components/VendorTabs'
import { VendorProductCard } from '../components/VendorProductCard'
import { VendorSidebar } from '../components/VendorSidebar'
import { VendorReviewItem } from '../components/VendorReviewItem'

interface VendorDetailTemplateProps {
  vendor: any
  products: any[]
  reviews: any[]
  workshops: any[]
}

export function VendorDetailTemplate({
  vendor,
  products,
  reviews,
  workshops,
}: VendorDetailTemplateProps) {
  const logo = vendor.logo && typeof vendor.logo === 'object' ? vendor.logo : null
  const categoryCount =
    vendor.categories && Array.isArray(vendor.categories) ? vendor.categories.length : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" style={{ color: 'var(--color-text-muted)' }}>
            Home
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <Link href="/vendors/" style={{ color: 'var(--color-text-muted)' }}>
            Leveranciers
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{vendor.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Hero Banner */}
        <div className="mb-7">
          <div
            className="h-40 md:h-50 rounded-2xl relative overflow-hidden"
            style={{
              background: vendor.bannerColor
                ? `linear-gradient(135deg, ${vendor.bannerColor}, ${vendor.bannerColor}dd)`
                : 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
            }}
          >
            <div
              className="absolute top-0 right-20 w-75 h-75 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
              }}
            />
            {vendor.isPremium && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-white">
                <Star className="w-3.5 h-3.5" style={{ color: 'var(--color-warning)' }} />
                Premium partner{vendor.partnerSince ? ` sinds ${vendor.partnerSince}` : ''}
              </div>
            )}
          </div>

          {/* Vendor Info */}
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-end px-4 md:px-6 -mt-12 relative z-10">
            <div
              className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center font-extrabold shadow-xl border-4 border-white flex-shrink-0 overflow-hidden"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                color: 'var(--color-text-primary)',
              }}
            >
              {logo?.url ? (
                <img src={logo.url} alt={logo.alt || vendor.name} className="w-full h-full object-contain p-2" />
              ) : (
                vendor.shortName || vendor.name.substring(0, 10)
              )}
            </div>

            <div className="pb-1 flex-1">
              <h1
                className="text-2xl md:text-3xl font-extrabold mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                {vendor.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {vendor.tagline}
                {vendor.contact?.country && ` · ${vendor.contact.country}`}
                {vendor.stats?.establishedYear && ` · Sinds ${vendor.stats.establishedYear}`}
              </p>
            </div>

            <div className="flex gap-2 pb-1">
              {vendor.contact?.website && (
                <a
                  href={vendor.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold bg-white border-[1.5px] hover:border-current transition-all"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
              <Link
                href={`/shop/?vendor=${vendor.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Grid3x3 className="w-4 h-4" />
                Alle producten
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <VendorStatsBar
          productCount={vendor.stats?.productCount || 0}
          categoryCount={categoryCount}
          rating={vendor.stats?.rating || null}
          reviewCount={vendor.stats?.reviewCount || 0}
          stockAvailability={vendor.stats?.stockAvailability || null}
          deliveryTime={vendor.delivery?.deliveryTime || null}
        />

        {/* Tabs */}
        <VendorTabs
          productCount={products.length}
          reviewCount={reviews.length}
          workshopCount={workshops.length}
        />

        {/* Content Grid: Main + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7">
          {/* Main Content */}
          <div>
            {/* About Section */}
            <div
              id="vendor-overview"
              className="bg-white rounded-2xl p-6 mb-4 border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h2
                className="text-lg font-extrabold mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <Package className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                Over {vendor.name}
              </h2>
              <div
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
                dangerouslySetInnerHTML={{
                  __html:
                    (typeof vendor.description === 'string' ? vendor.description : '') ||
                    `${vendor.name} is een van onze betrouwbare leveranciers.`,
                }}
              />
            </div>

            {/* Categories */}
            {vendor.categories && vendor.categories.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6 mb-4 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h2
                  className="text-lg font-extrabold mb-3 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Categorieën
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {vendor.categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="flex flex-col items-center gap-1 p-4 border-[1.5px] rounded-xl text-center transition-all hover:-translate-y-0.5"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="text-2xl">{cat.emoji || '📦'}</div>
                      <div className="text-xs font-bold">{cat.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <div
                id="vendor-products"
                className="bg-white rounded-2xl p-6 mb-4 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h2
                  className="text-lg font-extrabold mb-3 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <Package className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Producten
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products.slice(0, 6).map((product: any) => (
                    <VendorProductCard key={product.id} product={product} />
                  ))}
                </div>
                {(vendor.stats?.productCount || 0) > 6 && (
                  <div className="text-center mt-4">
                    <Link
                      href={`/shop/?vendor=${vendor.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl border-[1.5px] transition-all hover:shadow-sm"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                    >
                      Bekijk alle {vendor.stats?.productCount} producten
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Workshops Banner */}
            {workshops.length > 0 && (
              <Link
                id="vendor-workshops"
                href="/workshops/"
                className="block rounded-2xl p-6 mb-4 text-white transition-transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #00695C)',
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/12 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
                    🎓
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold mb-1">
                      <Calendar className="w-3 h-3" />
                      {workshops.length} workshop{workshops.length !== 1 ? 's' : ''} beschikbaar
                    </div>
                    <div className="text-base font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>
                      Workshops & Trainingen
                    </div>
                    <div className="text-sm opacity-60">{vendor.name} organiseert trainingen</div>
                  </div>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </div>
              </Link>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div
                id="vendor-reviews"
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h2
                  className="text-lg font-extrabold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <Star className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Reviews ({vendor.stats?.reviewCount || reviews.length})
                </h2>

                {/* Rating Summary */}
                <div
                  className="flex gap-4 items-center pb-4 mb-4 border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div
                    className="text-5xl font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {vendor.stats?.rating?.toFixed(1) || '—'}
                  </div>
                  <div>
                    <div className="text-base" style={{ color: 'var(--color-warning)' }}>
                      {'★'.repeat(Math.round(vendor.stats?.rating || 0))}
                      {'☆'.repeat(5 - Math.round(vendor.stats?.rating || 0))}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Gebaseerd op {vendor.stats?.reviewCount || reviews.length} reviews
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.map((review: any) => (
                  <VendorReviewItem key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div id="vendor-info">
            <VendorSidebar vendor={vendor} />
          </div>
        </div>
      </div>
    </div>
  )
}
