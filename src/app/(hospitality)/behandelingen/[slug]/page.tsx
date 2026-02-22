import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Treatment } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'treatments',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const treatment = docs[0] as Treatment | undefined

  if (!treatment) {
    return {
      title: 'Behandeling niet gevonden',
    }
  }

  return {
    title: `${treatment.title} — FysioVitaal`,
    description: treatment.excerpt || treatment.meta?.description,
  }
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'treatments',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const treatment = docs[0] as Treatment | undefined

  if (!treatment) {
    return notFound()
  }

  // Fetch related treatments
  const { docs: relatedTreatments } = await payload.find({
    collection: 'treatments',
    where: {
      id: { not_equals: treatment.id },
      _status: { equals: 'published' },
    },
    limit: 4,
    depth: 0,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-theme-secondary to-theme-secondary-light px-6 py-12">
        <div className="pointer-events-none absolute -right-10 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-theme-primary/10 to-transparent blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/behandelingen" className="hover:text-gray-300">
              Behandelingen
            </Link>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-theme-primary-light">{treatment.title}</span>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-theme-primary/20 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary-light">
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                Specialisatie
              </div>
              <h1 className="mb-2 font-display text-4xl font-extrabold text-white">
                {treatment.title}
              </h1>
              <p className="mb-3 max-w-2xl text-sm text-gray-400">{treatment.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {treatment.duration && (
                  <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    <svg
                      className="h-3 w-3 text-theme-primary"
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
                    {treatment.duration} minuten
                  </span>
                )}
                {treatment.insurance === 'covered' && (
                  <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    <svg
                      className="h-3 w-3 text-theme-primary"
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
                <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                  <svg
                    className="h-3 w-3 text-theme-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Directe toegang
                </span>
              </div>
            </div>

            {treatment.successRate && (
              <div className="flex flex-col gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <div className="font-display text-2xl font-extrabold text-theme-primary-light">
                    {treatment.successRate}%
                  </div>
                  <div className="text-[10px] text-gray-500">Klachtenvrij na behandeling</div>
                </div>
                {treatment.averageTreatments && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="font-display text-2xl font-extrabold text-theme-primary-light">
                      {treatment.averageTreatments}
                    </div>
                    <div className="text-[10px] text-gray-500">Gem. behandelingen</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[1fr_360px] md:items-start">
        {/* Main Content */}
        <div>
          {/* Description */}
          <section className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-extrabold text-gray-900">
              <svg
                className="h-5 w-5 text-theme-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Wat is {treatment.title?.toLowerCase()}?
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              {typeof treatment.description === 'string' ? (
                <p>{treatment.description}</p>
              ) : (
                // Render rich text if available
                <div>{JSON.stringify(treatment.description)}</div>
              )}
            </div>
          </section>

          {/* Symptoms */}
          {treatment.symptoms && treatment.symptoms.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-extrabold text-gray-900">
                <svg
                  className="h-5 w-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Klachten die wij behandelen
              </h2>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {treatment.symptoms.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:border-theme-primary"
                  >
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-theme-primary"
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
                    {item.symptom}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Treatment Process */}
          {treatment.process && treatment.process.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-extrabold text-gray-900">
                <svg
                  className="h-5 w-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Het behandeltraject
              </h2>
              <div className="flex flex-col gap-2">
                {treatment.process.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-theme-primary"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-theme-primary font-display text-sm font-extrabold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="mb-0.5 font-display text-sm font-extrabold text-gray-900">
                        {item.step}
                      </h3>
                      <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Treatments */}
          {relatedTreatments.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-extrabold text-gray-900">
                <svg
                  className="h-5 w-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                Andere behandelingen
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {relatedTreatments.map((relatedTreatment: any) => (
                  <Link
                    key={relatedTreatment.id}
                    href={`/behandelingen/${relatedTreatment.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-theme-primary"
                  >
                    <div className="text-2xl">{relatedTreatment.icon || '🏥'}</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-extrabold text-gray-900">
                        {relatedTreatment.title}
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        {relatedTreatment.category || 'Behandeling'}
                      </p>
                    </div>
                    <svg
                      className="h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sticky top-24 flex flex-col gap-3">
          {/* Appointment Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-base font-extrabold text-gray-900">
              <svg
                className="h-4 w-4 text-theme-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Afspraak maken
            </h3>

            <form className="space-y-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Telefoon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="06 - 1234 5678"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="uw@email.nl"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Klacht / reden
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20">
                  <option>Nek-/rugklachten</option>
                  <option>Schouderklachten</option>
                  <option>Knieklachten</option>
                  <option>Sportblessure</option>
                  <option>Anders</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-theme-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-theme-primary/30 transition-all hover:bg-theme-secondary"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Afspraak aanvragen
              </button>
              <p className="text-center text-[10px] text-gray-500">
                Binnen 4 uur bevestiging · Geen verwijzing nodig
              </p>
            </form>
          </div>

          {/* Treatment Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-extrabold text-gray-900">
              <svg
                className="h-4 w-4 text-theme-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Behandelgegevens
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary/10">
                  <svg
                    className="h-3.5 w-3.5 text-theme-primary"
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
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500">Duur</div>
                  <div className="font-bold text-gray-900">
                    {treatment.duration} min
                    {treatment.intakeDuration && ` (intake ${treatment.intakeDuration} min)`}
                  </div>
                </div>
              </div>

              {treatment.averageTreatments && (
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                    <svg
                      className="h-3.5 w-3.5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-500">Gemiddeld traject</div>
                    <div className="font-bold text-gray-900">
                      {treatment.averageTreatments} behandelingen
                    </div>
                  </div>
                </div>
              )}

              {treatment.price && (
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-500">Tarief</div>
                    <div className="font-bold text-gray-900">€ {treatment.price.toFixed(2)}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                  <svg
                    className="h-3.5 w-3.5 text-amber-600"
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
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500">Vergoeding</div>
                  <div className="font-bold text-gray-900">
                    {treatment.insurance === 'covered'
                      ? 'Aanvullend verzekerd'
                      : treatment.insurance === 'partial'
                        ? 'Deels vergoed'
                        : 'Niet vergoed'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="rounded-2xl bg-gradient-to-br from-theme-secondary to-theme-secondary-light p-5 text-white">
            <div className="mb-2 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-theme-primary-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-[10px] text-gray-400">Vragen?</span>
            </div>
            <div className="mb-1 font-display text-base font-extrabold">020 - 345 67 89</div>
            <div className="text-[10px] text-theme-primary-light">Ma-Vr 07:30-20:00</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
