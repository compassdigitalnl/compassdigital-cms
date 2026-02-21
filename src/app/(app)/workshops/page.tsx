import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  Award,
  ShieldCheck,
  Grid3x3,
  Monitor,
  Building,
  CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workshops & Trainingen',
  description:
    'Ontdek onze workshops en trainingen. Van beginners tot experts, wij bieden trainingen voor elk niveau.',
}

export default async function WorkshopsPage() {
  const payload = await getPayload({ config })

  // Get all workshops
  let workshopsData
  try {
    workshopsData = await payload.find({
      collection: 'workshops',
      depth: 2,
      limit: 100,
      sort: 'date',
      where: {
        status: {
          not_equals: 'cancelled',
        },
      },
    })
  } catch (e) {
    // Workshops collection might not exist if feature is disabled
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Workshops niet beschikbaar</h1>
        <p className="text-gray-600">Deze feature is momenteel niet actief.</p>
      </div>
    )
  }

  const allWorkshops = workshopsData.docs
  const featuredWorkshop = allWorkshops.find((w) => w.isFeatured)
  const regularWorkshops = allWorkshops.filter((w) => !w.isFeatured)

  // Calculate stats
  const totalWorkshops = allWorkshops.length
  const upcomingWorkshops = allWorkshops.filter((w) =>
    ['upcoming', 'open', 'almost-full'].includes(w.status),
  ).length
  const averageRating = 4.8 // Could be calculated from reviews

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" style={{ color: 'var(--color-text-muted)' }}>
            Home
          </Link>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            Workshops & Trainingen
          </span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Hero */}
        <div
          className="rounded-2xl p-12 mb-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute top-0 right-24 w-75 h-75 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/6 border border-white/8 px-3.5 py-1.5 rounded-full text-xs font-bold text-white/50 mb-2.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Professionele ontwikkeling
            </div>
            <h1
              className="text-3xl font-extrabold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Workshops & Trainingen
            </h1>
            <p className="text-white/45 max-w-md leading-relaxed">
              Van beginners tot experts: ontdek ons aanbod aan trainingen en workshops. Leer van de
              beste docenten in de branche.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-5">
              <div className="text-center px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                <div
                  className="text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {totalWorkshops}
                </div>
                <div className="text-xs text-white/35">Workshops</div>
              </div>
              <div className="text-center px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                <div
                  className="text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {upcomingWorkshops}
                </div>
                <div className="text-xs text-white/35">Aankomend</div>
              </div>
              <div className="text-center px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                <div
                  className="text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {averageRating}
                </div>
                <div className="text-xs text-white/35">Waardering</div>
              </div>
            </div>
          </div>

          {/* Visual Cards */}
          <div className="flex gap-3 relative">
            <div className="bg-white/6 border border-white/8 rounded-xl p-4 w-40 text-center">
              <div className="text-3xl mb-1.5">🎓</div>
              <div className="text-xs font-bold text-white">Certificaat</div>
              <div className="text-xs text-white/35">Na afloop</div>
            </div>
            <div className="bg-white/6 border border-white/8 rounded-xl p-4 w-40 text-center">
              <div className="text-3xl mb-1.5">🏥</div>
              <div className="text-xs font-bold text-white">Praktijk</div>
              <div className="text-xs text-white/35">Hands-on</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          {/* Filter Chips */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Beginner
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Award className="w-3.5 h-3.5" />
              Gevorderd
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Monitor className="w-3.5 h-3.5" />
              Online
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-semibold transition-all border-[1.5px] hover:border-current"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Building className="w-3.5 h-3.5" />
              Fysiek
            </button>
          </div>

          <div className="ml-auto text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            {totalWorkshops} workshops
          </div>
        </div>

        {/* Featured Workshop */}
        {featuredWorkshop && (
          <div
            className="bg-white rounded-2xl overflow-hidden mb-6 grid grid-cols-1 md:grid-cols-[420px_1fr] transition-all hover:shadow-lg border-[1.5px]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Image */}
            <div
              className="h-70 relative flex flex-col justify-end p-7"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), #00695C)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-15">
                {featuredWorkshop.emoji || '🎓'}
              </div>
              <div className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold text-white self-start mb-2 relative">
                <CheckCircle className="w-3 h-3" />
                Featured workshop
              </div>
              <div
                className="text-xl font-extrabold text-white leading-snug relative"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {featuredWorkshop.title}
              </div>
            </div>

            {/* Body */}
            <div className="p-7 flex flex-col">
              <div className="flex gap-4 mb-3.5 flex-wrap text-sm">
                {featuredWorkshop.date && (
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    {new Date(featuredWorkshop.date).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                )}
                {featuredWorkshop.durationDisplay && (
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    {featuredWorkshop.durationDisplay}
                  </div>
                )}
                {featuredWorkshop.locationCity && (
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    {featuredWorkshop.locationCity}
                  </div>
                )}
                {featuredWorkshop.maxParticipants && (
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <Users className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    Max {featuredWorkshop.maxParticipants} deelnemers
                  </div>
                )}
              </div>

              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {featuredWorkshop.excerpt || 'Meld je aan voor deze unieke workshop.'}
              </p>

              {/* Tags */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {featuredWorkshop.level && (
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {featuredWorkshop.level}
                  </span>
                )}
                {featuredWorkshop.category && (
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {featuredWorkshop.category}
                  </span>
                )}
                {featuredWorkshop.certificateAwarded && (
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                    }}
                  >
                    ✓ Certificaat
                  </span>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  {featuredWorkshop.isFree ? (
                    <div className="text-2xl font-extrabold" style={{ color: 'var(--color-success)' }}>
                      Gratis
                    </div>
                  ) : (
                    <div className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                      {featuredWorkshop.priceDisplay || `€${featuredWorkshop.price}`}
                    </div>
                  )}
                </div>
                {featuredWorkshop.registrationUrl && (
                  <a
                    href={featuredWorkshop.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Aanmelden
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularWorkshops.map((workshop) => {
            const spotsLeft =
              workshop.maxParticipants && workshop.currentParticipants
                ? workshop.maxParticipants - workshop.currentParticipants
                : null

            return (
              <div
                key={workshop.id}
                className="bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Image/Emoji */}
                <div
                  className="h-32 flex items-center justify-center text-5xl relative"
                  style={{
                    background:
                      workshop.locationType === 'online'
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : 'linear-gradient(135deg, var(--color-primary), #00695C)',
                  }}
                >
                  {workshop.emoji || '🎓'}
                  {workshop.status === 'almost-full' && (
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold" style={{ color: 'var(--color-warning)' }}>
                      Bijna vol!
                    </div>
                  )}
                  {workshop.status === 'full' && (
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold" style={{ color: 'var(--color-error)' }}>
                      Volgeboekt
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  {workshop.vendor && typeof workshop.vendor === 'object' && (
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--color-primary)' }}>
                      {workshop.vendor.name}
                    </div>
                  )}
                  <h3
                    className="text-base font-extrabold mb-2 line-clamp-2 leading-snug"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {workshop.title}
                  </h3>

                  {/* Meta */}
                  <div className="space-y-1.5 mb-3 text-xs">
                    {workshop.date && (
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        {new Date(workshop.date).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                    {workshop.durationDisplay && (
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        {workshop.durationDisplay}
                      </div>
                    )}
                    {workshop.locationCity && (
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {workshop.locationType === 'online' ? (
                          <Monitor className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        )}
                        {workshop.locationType === 'online' ? 'Online' : workshop.locationCity}
                      </div>
                    )}
                    {spotsLeft !== null && spotsLeft > 0 && (
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                        <Users className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        {spotsLeft} {spotsLeft === 1 ? 'plek' : 'plekken'} beschikbaar
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {workshop.isFree ? (
                        <div className="text-base font-extrabold" style={{ color: 'var(--color-success)' }}>
                          Gratis
                        </div>
                      ) : (
                        <div className="text-base font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                          {workshop.priceDisplay || `€${workshop.price}`}
                        </div>
                      )}
                    </div>
                    {workshop.registrationUrl && workshop.status !== 'full' && (
                      <a
                        href={workshop.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        Aanmelden
                      </a>
                    )}
                    {workshop.status === 'full' && (
                      <div className="px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                        Volgeboekt
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {regularWorkshops.length === 0 && !featuredWorkshop && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎓</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Geen workshops beschikbaar
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Kom later terug voor nieuwe trainingen en workshops.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
