import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Contact & Afspraak — FysioVitaal',
    description:
      'Maak direct een afspraak of neem contact op. Geen verwijzing nodig — directe toegang fysiotherapie.',
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-theme-secondary to-theme-secondary-light px-6 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-theme-primary/10 via-transparent to-transparent" />
        <div className="container relative z-10 mx-auto max-w-4xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-theme-primary/20 bg-theme-primary/50/10 px-3 py-1 text-[11px] font-bold text-theme-primary-light">
            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Binnen 48 uur terecht
          </div>
          <h1 className="mb-1 font-display text-4xl font-extrabold text-white">
            Contact & Afspraak
          </h1>
          <p className="mx-auto max-w-lg text-sm text-gray-400">
            Maak direct een afspraak of neem contact op. Geen verwijzing nodig — directe toegang
            fysiotherapie.
          </p>
        </div>
      </section>

      {/* Contact Options Strip */}
      <section className="container mx-auto -mt-8 mb-10 max-w-6xl px-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="tel:0203456789"
            className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-theme-primary hover:shadow-lg"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10">
              <svg
                className="h-4.5 w-4.5 text-theme-primary"
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
            </div>
            <h3 className="mb-0.5 text-sm font-extrabold text-gray-900">Bellen</h3>
            <p className="mb-1 text-sm font-bold text-theme-primary">020 - 345 67 89</p>
            <p className="text-[10px] text-gray-500">Ma-Vr 07:30-20:00</p>
          </Link>

          <Link
            href="https://wa.me/31612345678"
            className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-theme-primary hover:shadow-lg"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <svg
                className="h-4.5 w-4.5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="mb-0.5 text-sm font-extrabold text-gray-900">WhatsApp</h3>
            <p className="mb-1 text-sm font-bold text-theme-primary">06 - 1234 5678</p>
            <p className="text-[10px] text-gray-500">Reactie binnen 1 uur</p>
          </Link>

          <Link
            href="mailto:info@fysiovitaal.nl"
            className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-theme-primary hover:shadow-lg"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <svg
                className="h-4.5 w-4.5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-0.5 text-sm font-extrabold text-gray-900">E-mail</h3>
            <p className="mb-1 text-sm font-bold text-theme-primary">info@fysiovitaal.nl</p>
            <p className="text-[10px] text-gray-500">Reactie binnen 4 uur</p>
          </Link>

          <div className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-theme-primary hover:shadow-lg">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <svg
                className="h-4.5 w-4.5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-0.5 text-sm font-extrabold text-gray-900">Videoconsult</h3>
            <p className="mb-1 text-sm font-bold text-theme-primary">Online afspraak</p>
            <p className="text-[10px] text-gray-500">Via beveiligde verbinding</p>
          </div>
        </div>
      </section>

      {/* Urgent Alert */}
      <div className="container mx-auto mb-8 max-w-6xl px-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white">
            <svg
              className="h-4.5 w-4.5 text-red-600"
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
          </div>
          <div>
            <h3 className="mb-1 text-sm font-extrabold text-red-900">
              Spoedgeval of acute pijn?
            </h3>
            <p className="text-xs leading-relaxed text-red-800">
              Bel direct <strong>020 - 345 67 89</strong>. Bij spoedeisende gevallen buiten
              openingstijden: bel uw huisarts of huisartsenpost.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto grid max-w-6xl gap-6 px-6 pb-12 md:grid-cols-[1fr_380px] md:items-start">
        {/* Contact Form */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-md">
          <div className="flex items-center gap-3 border-b border-gray-200 p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-primary/10">
              <svg
                className="h-4.5 w-4.5 text-theme-primary"
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
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-gray-900">
                Afspraak aanvragen
              </h2>
              <p className="text-xs text-gray-500">
                Vul het formulier in — wij bevestigen binnen 4 uur
              </p>
            </div>
          </div>

          <form className="space-y-4 p-6">
            {/* Type selector */}
            <div>
              <label className="mb-2 block text-[11px] font-bold text-gray-700">
                Type afspraak
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="rounded-xl border-2 border-theme-primary bg-theme-primary/5 p-3 text-center transition-all hover:bg-theme-primary/10"
                >
                  <div className="mb-0.5 text-xl">📋</div>
                  <div className="text-[11px] font-bold text-gray-900">Nieuwe patiënt</div>
                </button>
                <button
                  type="button"
                  className="rounded-xl border-2 border-gray-200 bg-white p-3 text-center transition-all hover:border-theme-primary hover:bg-theme-primary/5"
                >
                  <div className="mb-0.5 text-xl">🔄</div>
                  <div className="text-[11px] font-bold text-gray-900">Vervolgafspraak</div>
                </button>
                <button
                  type="button"
                  className="rounded-xl border-2 border-gray-200 bg-white p-3 text-center transition-all hover:border-theme-primary hover:bg-theme-primary/5"
                >
                  <div className="mb-0.5 text-xl">❓</div>
                  <div className="text-[11px] font-bold text-gray-900">Vraag stellen</div>
                </button>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="Uw voornaam"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="Uw achternaam"
                />
              </div>
            </div>

            {/* Contact fields */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Telefoon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="06 - 1234 5678"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                  placeholder="uw@email.nl"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-gray-700">
                Geboortedatum
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Verzekeraar
                </label>
                <select className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20">
                  <option>Selecteer verzekeraar</option>
                  <option>Zilveren Kruis</option>
                  <option>CZ</option>
                  <option>VGZ</option>
                  <option>Menzis</option>
                  <option>ONVZ</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-700">
                  Gewenste behandeling
                </label>
                <select className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20">
                  <option>Weet ik nog niet</option>
                  <option>Manuele therapie</option>
                  <option>Sportfysiotherapie</option>
                  <option>Kinderfysiotherapie</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-gray-700">
                Klacht omschrijving <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                placeholder="Beschrijf kort uw klacht, hoe lang u er last van heeft, en wat uw doel is…"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-gray-700">
                Voorkeur moment
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="rounded-lg border-2 border-theme-primary bg-theme-primary/5 px-3 py-1.5 text-xs font-bold text-gray-900"
                >
                  Ochtend (07:30-12:00)
                </button>
                <button
                  type="button"
                  className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-theme-primary"
                >
                  Middag (12:00-17:00)
                </button>
                <button
                  type="button"
                  className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-theme-primary"
                >
                  Avond (17:00-20:00)
                </button>
                <button
                  type="button"
                  className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-theme-primary"
                >
                  Zaterdag
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <svg
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-theme-primary"
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
              <span>
                Uw gegevens worden vertrouwelijk behandeld conform AVG en WGBO. Wij delen uw
                gegevens niet met derden.
              </span>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-theme-primary px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-theme-primary/30 transition-all hover:bg-theme-secondary"
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
            <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-gray-500">
              <svg
                className="h-2.5 w-2.5 text-green-500"
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
              Bevestiging binnen 4 werkuren · Geen verwijzing nodig
            </p>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-3">
          {/* Direct Contact */}
          <div className="rounded-2xl bg-gradient-to-br from-theme-secondary to-theme-secondary-light p-5 text-white">
            <h3 className="mb-4 flex items-center gap-1.5 font-display text-sm font-extrabold">
              <svg className="h-3.5 w-3.5 text-theme-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Direct contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400">Telefoon</div>
                  <div className="font-bold">020 - 345 67 89</div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400">WhatsApp</div>
                  <div className="font-bold">06 - 1234 5678</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400">E-mail</div>
                  <div className="font-bold">info@fysiovitaal.nl</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-extrabold text-gray-900">
              <svg className="h-3.5 w-3.5 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Locatie
            </h3>
            <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-gray-100 text-4xl">
              📍
            </div>
            <div className="mb-3 text-center">
              <Link href="#" className="inline-flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline">
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Route plannen in Google Maps
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-theme-primary/10">
                  <svg className="h-3.5 w-3.5 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Amsteldijk 80, 1074 JB Amsterdam</div>
                  <div className="text-[10px] text-gray-500">Gezondheidscentrum Rivierenwijk, 2e etage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-extrabold text-gray-900">
              <svg className="h-3.5 w-3.5 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Openingstijden
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Maandag</span>
                <span className="text-gray-500">07:30 – 20:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Dinsdag</span>
                <span className="text-gray-500">07:30 – 20:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Woensdag</span>
                <span className="text-gray-500">07:30 – 20:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Donderdag</span>
                <span className="text-gray-500">07:30 – 20:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Vrijdag</span>
                <span className="text-gray-500">07:30 – 20:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-900">Zaterdag</span>
                <span className="text-gray-500">09:00 – 13:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Zondag</span>
                <span className="text-red-500">Gesloten</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-theme-primary">
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Binnen 48 uur een afspraak beschikbaar
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
