import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ChevronRight,
  Star,
  Package,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  MapPinned,
  Calendar,
  Users,
  Award,
  Truck,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payload = await getPayload({ config })

  const vendor = await payload.find({
    collection: 'vendors',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  if (!vendor.docs[0]) {
    return {
      title: 'Leverancier niet gevonden',
    }
  }

  const v = vendor.docs[0]

  return {
    title: v.meta?.title || `${v.name} — Leverancier`,
    description: v.meta?.description || v.tagline || `Ontdek ${v.name}, een van onze partners.`,
    openGraph: {
      title: v.meta?.title || v.name,
      description: v.meta?.description || v.tagline,
      images: v.meta?.image
        ? [
            {
              url:
                typeof v.meta.image === 'string'
                  ? v.meta.image
                  : v.meta.image.url || '/og-image.jpg',
            },
          ]
        : undefined,
    },
  }
}

export default async function VendorDetailPage({ params }: Props) {
  const payload = await getPayload({ config })

  const vendorData = await payload.find({
    collection: 'vendors',
    where: { slug: { equals: params.slug } },
    depth: 2,
    limit: 1,
  })

  if (!vendorData.docs[0]) {
    notFound()
  }

  const vendor = vendorData.docs[0]

  // Get vendor reviews
  const reviewsData = await payload.find({
    collection: 'vendor-reviews',
    where: {
      vendor: { equals: vendor.id },
      isApproved: { equals: true },
    },
    depth: 0,
    limit: 10,
    sort: '-createdAt',
  })

  const reviews = reviewsData.docs

  // Get vendor workshops (if feature enabled)
  let workshops: any[] = []
  try {
    const workshopsData = await payload.find({
      collection: 'workshops',
      where: {
        vendor: { equals: vendor.id },
        status: { in: ['upcoming', 'open', 'almost-full'] },
      },
      depth: 0,
      limit: 5,
      sort: 'date',
    })
    workshops = workshopsData.docs
  } catch (e) {
    // Workshops collection might not exist
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" style={{ color: 'var(--color-text-muted)' }}>
            Home
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <Link href="/vendors" style={{ color: 'var(--color-text-muted)' }}>
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
            className="h-50 rounded-2xl relative overflow-hidden"
            style={{
              background: vendor.bannerColor
                ? `linear-gradient(135deg, ${vendor.bannerColor}, ${vendor.bannerColor}dd)`
                : 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 right-20 w-75 h-75 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
              }}
            />

            {vendor.isPremium && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-white">
                <Star className="w-3.5 h-3.5" style={{ color: 'var(--color-warning)' }} />
                Premium partner
              </div>
            )}
          </div>

          {/* Vendor Info */}
          <div className="flex gap-5 items-end px-6 -mt-12 relative z-10">
            {/* Logo */}
            <div
              className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center font-extrabold shadow-xl border-4 border-white flex-shrink-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.shortName || vendor.name.substring(0, 10)}
            </div>

            {/* Name & Tagline */}
            <div className="pb-1">
              <h1
                className="text-3xl font-extrabold mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {vendor.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {vendor.tagline}
              </p>
            </div>

            {/* Actions */}
            <div className="ml-auto flex gap-2 pb-1">
              {vendor.contact?.website && (
                <a
                  href={vendor.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all bg-white border-[1.5px] hover:border-current"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
              {vendor.contact?.email && (
                <a
                  href={`mailto:${vendor.contact.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-3 mb-7">
          <div
            className="bg-white rounded-xl p-4 text-center border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-2xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.stats?.productCount || 0}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Producten
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-4 text-center border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-2xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.stats?.rating?.toFixed(1) || '—'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Beoordeling
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-4 text-center border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-2xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.stats?.reviewCount || 0}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Reviews
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-4 text-center border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-2xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.stats?.establishedYear || '—'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Opgericht
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-4 text-center border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-2xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vendor.delivery?.deliveryTime || '—'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Levertijd
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7">
          {/* Main Content */}
          <div>
            {/* About Section */}
            <div
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
                    vendor.description ||
                    'Premium leverancier van hoogwaardige producten en diensten.',
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
                  <Award className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Categorieën
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {vendor.categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="flex flex-col items-center gap-1 p-4 border-[1.5px] rounded-xl text-center transition-all hover:-translate-y-0.5"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="text-2xl">{cat.emoji || '📦'}</div>
                      <div className="text-xs font-bold">{cat.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {vendor.stats?.productCount || 0} producten
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h2
                  className="text-lg font-extrabold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <Star className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Reviews ({vendor.stats?.reviewCount || 0})
                </h2>

                {/* Rating Summary */}
                <div className="flex gap-4 items-center pb-4 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div
                    className="text-5xl font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {vendor.stats?.rating?.toFixed(1) || '—'}
                  </div>
                  <div>
                    <div className="text-base" style={{ color: 'var(--color-warning)' }}>
                      ★★★★★
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Gebaseerd op {vendor.stats?.reviewCount || 0} reviews
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="py-3.5 border-b last:border-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold"
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            opacity: 0.1,
                          }}
                        >
                          <span style={{ opacity: 10 }}>{review.authorInitials || 'XX'}</span>
                        </div>
                        <div className="text-sm font-bold">{review.authorName}</div>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(review.reviewDate || review.createdAt).toLocaleDateString(
                          'nl-NL',
                          { year: 'numeric', month: 'long', day: 'numeric' },
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : ''}`}
                          style={{ color: 'var(--color-warning)' }}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <div className="text-sm font-bold mb-1">{review.title}</div>
                    )}
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Info */}
            <div
              className="bg-white rounded-2xl p-6 mb-4 border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h3
                className="text-base font-extrabold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                {vendor.contact?.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <a
                      href={`mailto:${vendor.contact.email}`}
                      className="hover:underline"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {vendor.contact.email}
                    </a>
                  </div>
                )}
                {vendor.contact?.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <a
                      href={`tel:${vendor.contact.phone}`}
                      className="hover:underline"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {vendor.contact.phone}
                    </a>
                  </div>
                )}
                {vendor.contact?.address && (
                  <div className="flex items-start gap-2">
                    <MapPinned className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      {vendor.contact.address}
                      {vendor.contact.country && <div>{vendor.contact.country}</div>}
                    </div>
                  </div>
                )}
                {vendor.contact?.website && (
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <a
                      href={vendor.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Bezoek website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            {vendor.certifications && vendor.certifications.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6 mb-4 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h3
                  className="text-base font-extrabold mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Certificeringen
                </h3>
                <div className="space-y-2">
                  {vendor.certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>{cert.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workshops Banner */}
            {workshops.length > 0 && (
              <Link
                href="/workshops"
                className="block bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 mb-4 text-white transition-transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #00695C)',
                }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 bg-white/12 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl"
                  >
                    🎓
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold mb-1">
                      <GraduationCap className="w-3 h-3" />
                      {workshops.length} workshop{workshops.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-base font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>
                      Workshops & Trainingen
                    </div>
                    <div className="text-sm opacity-60">
                      {vendor.name} organiseert trainingen
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" />
                </div>
              </Link>
            )}

            {/* Delivery Info */}
            {vendor.delivery && (
              <div
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h3
                  className="text-base font-extrabold mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Levering
                </h3>
                <div className="space-y-2 text-sm">
                  {vendor.delivery.deliveryTime && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Levertijd: {vendor.delivery.deliveryTime}
                      </span>
                    </div>
                  )}
                  {vendor.delivery.freeShippingFrom && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Gratis verzending vanaf €{vendor.delivery.freeShippingFrom}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
