import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Treatment, Practitioner } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'FysioVitaal — Fysiotherapie & Revalidatie',
    description:
      'Persoonlijke fysiotherapie en revalidatie door BIG-geregistreerde therapeuten. Directe toegang — geen verwijzing nodig. Vergoed door alle zorgverzekeraars.',
  }
}

export default async function HospitalityHomePage() {
  const payload = await getPayload({ config })

  // Fetch treatments
  const { docs: treatments } = await payload.find({
    collection: 'treatments',
    depth: 1,
    limit: 6,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })

  // Fetch practitioners/team
  const { docs: practitioners } = await payload.find({
    collection: 'practitioners',
    depth: 0,
    limit: 4,
    where: {
      _status: { equals: 'published' },
    },
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] to-[#121F33] px-6 py-16 md:py-24">
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-teal-500/10 to-transparent blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-200">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Gespecialiseerde fysiotherapie
              </div>

              <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Weer <span className="text-teal-400">pijnvrij</span> bewegen begint hier
              </h1>

              <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-400">
                Persoonlijke fysiotherapie en revalidatie door BIG-geregistreerde therapeuten.
                Directe toegang — geen verwijzing nodig. Vergoed door alle zorgverzekeraars.
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/30 transition-all hover:bg-white hover:text-navy-900"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Afspraak maken
                </Link>
                <Link
                  href="tel:0203456789"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-extrabold text-white transition-all hover:border-teal-500 hover:text-teal-400"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Bel 020 - 345 67 89
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  BIG-geregistreerd
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Directe toegang
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Alle verzekeraars
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Binnen 48u terecht
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-64 w-full max-w-md items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500/5 to-teal-500/0 text-8xl md:h-80">
                  🧑‍⚕️
                </div>

                {/* Floating stats */}
                <div className="absolute -left-2 bottom-8 rounded-2xl bg-white p-3 shadow-xl md:p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-gray-900">9.4 / 10</div>
                      <div className="text-[10px] text-gray-500">Patiënttevredenheid</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-2 top-8 rounded-2xl bg-white p-3 shadow-xl md:p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                      <svg
                        className="h-4 w-4 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-gray-900">4.200+ patiënten</div>
                      <div className="text-[10px] text-gray-500">Succesvol behandeld</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Bar */}
      <section className="container mx-auto -mt-10 mb-12 max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg md:flex-row md:items-center md:p-6">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
            <div>
              <div className="text-sm font-bold text-gray-900">
                Vandaag nog terecht voor een intake
              </div>
              <div className="text-xs text-gray-500">
                Geen verwijzing nodig · Directe toegang fysiotherapie
              </div>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-extrabold text-white transition-all hover:bg-navy-900"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Direct inplannen
          </Link>
        </div>
      </section>

      {/* Treatments/Services Section */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-500/15 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Behandelingen
            </div>
            <h2 className="mb-2 font-display text-3xl font-extrabold text-gray-900">
              Gespecialiseerde zorg voor elk klacht
            </h2>
            <p className="mx-auto max-w-xl text-sm text-gray-600">
              Wij bieden een breed scala aan behandelingen, altijd op basis van de laatste
              wetenschappelijke inzichten.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {treatments.map((treatment: any) => (
              <Link
                key={treatment.id}
                href={`/behandelingen/${treatment.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-2xl">
                  {treatment.icon || '🏥'}
                </div>
                <h3 className="mb-1 font-display text-base font-extrabold text-gray-900">
                  {treatment.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-600">
                  {treatment.excerpt}
                </p>
                <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-gray-500">
                  {treatment.duration && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-2.5 w-2.5 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {treatment.duration} min
                    </span>
                  )}
                  {treatment.insurance === 'covered' && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-2.5 w-2.5 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Vergoed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:gap-2">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  Meer informatie
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {practitioners.length > 0 && (
        <section className="bg-white px-6 py-12">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-500/15 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Ons team
              </div>
              <h2 className="font-display text-3xl font-extrabold text-gray-900">
                Uw behandelteam
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {practitioners.map((practitioner: any) => (
                <div
                  key={practitioner.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-center transition-all hover:border-teal-500"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gray-100 text-6xl">
                    {practitioner.emoji || '👨‍⚕️'}
                    {practitioner.role === 'owner' && (
                      <div className="absolute right-2 top-2 rounded bg-teal-600 px-2 py-0.5 text-[9px] font-bold text-white">
                        Praktijkhouder
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-display text-sm font-extrabold text-gray-900">
                      {practitioner.name}
                    </h3>
                    <p className="mb-0.5 text-xs font-semibold text-teal-600">
                      {practitioner.title}
                    </p>
                    {practitioner.specializations && practitioner.specializations.length > 0 && (
                      <p className="text-[11px] text-gray-500">
                        {practitioner.specializations[0].specialization}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#0A1628] to-[#121F33] p-10 text-center md:flex-row md:text-left">
            <div className="text-white">
              <h2 className="mb-1 font-display text-2xl font-extrabold">
                Last van pijn of bewegingsbeperking?
              </h2>
              <p className="text-sm text-gray-400">
                Maak vandaag nog een afspraak. Geen verwijzing nodig, binnen 48 uur terecht.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/30 transition-all hover:bg-white hover:text-navy-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Afspraak maken
              </Link>
              <Link
                href="tel:0203456789"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-extrabold text-white transition-all hover:border-teal-500"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                020 - 345 67 89
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
