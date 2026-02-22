import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ReserverenPage() {
  const payload = await getPayload({ config })

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-theme-secondary">
        <div className="container mx-auto flex h-[72px] items-center justify-between px-6">
          <Link href="/" className="font-['Playfair_Display'] text-2xl font-bold text-white">
            Bistro <em className="text-theme-primary">de Gracht</em>
          </Link>
          <nav className="hidden gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Home
            </Link>
            <Link
              href="/menukaart"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Menukaart
            </Link>
            <Link
              href="/reserveren"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-theme-primary transition hover:bg-theme-primary/10"
            >
              Reserveren
            </Link>
          </nav>
          <a
            href="tel:0201234567"
            className="flex items-center gap-1.5 text-sm font-bold text-white"
          >
            📞 020 - 123 45 67
          </a>
        </div>
      </header>

      {/* Page hero */}
      <section className="relative overflow-hidden bg-theme-secondary px-6 py-11 text-center">
        <div className="absolute inset-0 bg-gradient-radial from-theme-primary/6 to-transparent"></div>
        <div className="relative z-10">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-theme-primary/25 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary">
            📅 Online reserveren
          </div>
          <h1 className="mb-1 font-['Playfair_Display'] text-4xl font-bold text-white">
            Reserveer uw tafel
          </h1>
          <p className="mx-auto max-w-md text-sm text-white/30">
            Direct bevestiging · Gratis annuleren tot 24u vooraf · Dieetwensen welkom
          </p>
        </div>
      </section>

      {/* Reservation form layout */}
      <div className="container mx-auto grid gap-6 px-6 py-7 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div>
          <div className="overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white shadow-md">
            {/* Step 1: Date */}
            <div className="border-b border-theme-border p-5">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary">
                1
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                Kies een datum
              </span>
              <div className="ml-9 text-xs text-theme-grey-mid">
                Wij zijn geopend van dinsdag t/m zondag
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                  Februari 2026
                </div>
                <div className="flex gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] border-theme-border bg-white transition hover:border-theme-primary">
                    ‹
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] border-theme-border bg-white transition hover:border-theme-primary">
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                  <div
                    key={day}
                    className="py-1.5 text-[11px] font-bold text-theme-grey-mid"
                  >
                    {day}
                  </div>
                ))}
                {/* Example calendar grid */}
                {[...Array(35)].map((_, i) => {
                  const day = i - 2 // Start at day -2 (previous month)
                  const isOtherMonth = day < 1 || day > 28
                  const isToday = day === 21
                  const isSelected = day === 25
                  const isDisabled = day < 21 || day === 23 // Past days + Monday

                  return (
                    <div
                      key={i}
                      className={`aspect-square cursor-pointer rounded-lg border-[1.5px] text-xs font-semibold transition
                        ${isDisabled ? 'cursor-not-allowed border-transparent text-theme-grey' : ''}
                        ${isOtherMonth ? 'border-transparent text-theme-grey-mid' : ''}
                        ${!isDisabled && !isOtherMonth ? 'border-transparent hover:border-theme-primary hover:bg-theme-primary/10' : ''}
                        ${isToday ? 'border-theme-primary text-theme-primary' : ''}
                        ${isSelected ? 'border-theme-primary bg-theme-primary font-extrabold text-white' : ''}
                      `}
                    >
                      <div className="flex h-full items-center justify-center">
                        {day > 0 && day <= 28 ? day : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Time */}
            <div className="border-b border-theme-border p-5">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary">
                2
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                Kies een tijdstip
              </span>
              <div className="ml-9 text-xs text-theme-grey-mid">
                Woensdag 25 februari — beschikbare tijden
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <div className="mb-1 text-[11px] font-semibold text-theme-grey-mid">
                  🌤️ Lunch (12:00 – 15:00)
                </div>
                <div className="flex flex-wrap gap-1">
                  {['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'].map((time) => (
                    <button
                      key={time}
                      className={`rounded-lg border-[1.5px] border-theme-border px-3.5 py-2 text-xs font-bold transition hover:border-theme-primary hover:text-theme-primary
                        ${time === '14:30' ? 'cursor-not-allowed opacity-35 line-through' : ''}
                      `}
                      disabled={time === '14:30'}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold text-theme-grey-mid">
                  🌙 Diner (17:30 – 22:30)
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    '17:30',
                    '18:00',
                    '18:30',
                    '19:00',
                    '19:30',
                    '20:00',
                    '20:30',
                    '21:00',
                    '21:30',
                  ].map((time) => {
                    const isPopular = ['18:30', '19:00', '19:30'].includes(time)
                    const isSelected = time === '19:00'
                    const isBusy = time === '21:30'

                    return (
                      <button
                        key={time}
                        className={`relative rounded-lg border-[1.5px] px-3.5 py-2 text-xs font-bold transition
                          ${isBusy ? 'cursor-not-allowed border-theme-border opacity-35 line-through' : ''}
                          ${isSelected ? 'border-theme-primary bg-theme-primary text-white' : 'border-theme-border hover:border-theme-primary hover:text-theme-primary'}
                        `}
                        disabled={isBusy}
                      >
                        {time}
                        {isPopular && !isSelected && (
                          <span className="absolute -right-1 -top-1.5 text-[10px]">🔥</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Party size */}
            <div className="border-b border-theme-border p-5">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary">
                3
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                Aantal personen
              </span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, '15+', '20+'].map((size) => {
                  const isSelected = size === 2
                  return (
                    <button
                      key={size}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 font-['Plus_Jakarta_Sans'] text-base font-extrabold transition
                        ${isSelected ? 'border-theme-primary bg-theme-primary text-white' : 'border-theme-border hover:border-theme-primary'}
                      `}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4: Seating preference */}
            <div className="border-b border-theme-border p-5">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary">
                4
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                Tafelvoorkeur (optioneel)
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { icon: '🪟', name: 'Raam', desc: 'Grachtzicht' },
                  { icon: '🌳', name: 'Terras', desc: 'Buiten' },
                  { icon: '🏠', name: 'Binnen', desc: 'Gezellig' },
                  { icon: '🤫', name: 'Stil', desc: 'Apart' },
                  { icon: '🍷', name: 'Bar', desc: 'Bartafel' },
                  { icon: '🎉', name: 'Groep', desc: 'Privé' },
                ].map((pref, i) => (
                  <button
                    key={i}
                    className="rounded-lg border-[1.5px] border-theme-border p-3 text-center transition hover:border-theme-primary hover:bg-theme-primary/10"
                  >
                    <div className="mb-0.5 text-2xl">{pref.icon}</div>
                    <div className="text-xs font-bold">{pref.name}</div>
                    <div className="text-[10px] text-theme-grey-mid">{pref.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Contact details */}
            <div className="border-b border-theme-border p-5">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary">
                5
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                Uw gegevens
              </span>
            </div>
            <div className="p-5">
              <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold">
                    Naam <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <input
                    type="text"
                    className="h-11 w-full rounded-xl border-[1.5px] border-theme-border px-3 text-sm outline-none transition focus:border-theme-primary focus:ring-3 focus:ring-theme-primary/10"
                    placeholder="Uw naam"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold">
                    Telefoon <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <input
                    type="tel"
                    className="h-11 w-full rounded-xl border-[1.5px] border-theme-border px-3 text-sm outline-none transition focus:border-theme-primary focus:ring-3 focus:ring-theme-primary/10"
                    placeholder="06 12345678"
                  />
                </div>
              </div>
              <div className="mb-2.5">
                <label className="mb-1 block text-xs font-bold">
                  Email <span className="text-[#FF6B6B]">*</span>
                </label>
                <input
                  type="email"
                  className="h-11 w-full rounded-xl border-[1.5px] border-theme-border px-3 text-sm outline-none transition focus:border-theme-primary focus:ring-3 focus:ring-theme-primary/10"
                  placeholder="uw@email.nl"
                />
              </div>
              <div className="mb-2.5">
                <label className="mb-1 block text-xs font-bold">Gelegenheid (optioneel)</label>
                <select className="h-11 w-full appearance-none rounded-xl border-[1.5px] border-theme-border bg-white px-3 text-sm outline-none transition focus:border-theme-primary">
                  <option>Regulier diner</option>
                  <option>Verjaardag</option>
                  <option>Jubileum</option>
                  <option>Zakelijk</option>
                  <option>Romantisch</option>
                  <option>Groepsuitje</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold">
                  Bijzondere wensen (optioneel)
                </label>
                <textarea
                  className="w-full resize-none rounded-xl border-[1.5px] border-theme-border p-2.5 text-sm outline-none transition focus:border-theme-primary focus:ring-3 focus:ring-theme-primary/10"
                  rows={3}
                  placeholder="Allergieën, dieetwensen, etc."
                />
              </div>
            </div>

            {/* Submit */}
            <div className="p-5">
              <button className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-theme-primary font-['Plus_Jakarta_Sans'] text-base font-extrabold text-theme-secondary shadow-lg shadow-theme-primary/30 transition hover:-translate-y-0.5 hover:bg-theme-secondary hover:text-theme-primary">
                📅 Bevestig reservering
              </button>
              <p className="mt-1.5 text-center text-[11px] text-theme-grey-mid">
                U ontvangt direct een bevestiging per email
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Summary */}
          <div className="overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white shadow-sm">
            <div className="bg-theme-secondary p-4 text-center text-white">
              <h3 className="font-['Playfair_Display'] text-base font-bold">
                Uw reservering
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2.5 border-b border-theme-border pb-2 text-xs">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-theme-primary/12">
                  📅
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-theme-grey-mid">Datum</div>
                  <div className="font-bold">Woensdag 25 feb 2026</div>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-2.5 border-b border-theme-border pb-2 text-xs">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-theme-primary/12">
                  🕐
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-theme-grey-mid">Tijd</div>
                  <div className="font-bold">19:00 (diner)</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-theme-primary/12">
                  👥
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-theme-grey-mid">Personen</div>
                  <div className="font-bold">2 gasten</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="rounded-2xl border-[1.5px] border-theme-border bg-white p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold">
              ℹ️ Bevestiging
            </h4>
            <p className="text-xs leading-relaxed text-theme-grey-dark">
              U ontvangt direct een bevestiging per email. Annuleren kan tot 24 uur van
              tevoren kosteloos.
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-theme-secondary to-theme-secondary-light p-4 text-white">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-theme-primary/15">
              📞
            </div>
            <div>
              <div className="text-[10px] text-white/30">Liever telefonisch?</div>
              <div className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                020 - 123 45 67
              </div>
              <div className="text-[10px] text-theme-primary">Di-Za 09:00-21:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
