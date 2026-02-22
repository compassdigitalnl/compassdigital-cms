import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HorecaHomePage() {
  const payload = await getPayload({ config })

  // Fetch featured menu items
  const menuResult = await payload.find({
    collection: 'menuItems',
    where: {
      _status: {
        equals: 'published',
      },
      featured: {
        equals: true,
      },
    },
    limit: 6,
    sort: 'sortOrder',
  })

  // Fetch upcoming events
  const eventsResult = await payload.find({
    collection: 'events',
    where: {
      _status: {
        equals: 'published',
      },
      featured: {
        equals: true,
      },
    },
    limit: 3,
  })

  const menuItems = menuResult.docs
  const events = eventsResult.docs

  return (
    <div className="bg-[#FAFAF8]">
      {/* Topbar */}
      <div className="bg-theme-secondary py-2 text-xs text-white/35">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="hidden gap-4 md:flex">
            <span className="flex items-center gap-1">📍 Herengracht 420, Amsterdam</span>
            <span className="flex items-center gap-1">⏰ Di-Za 12:00-22:30</span>
            <span className="flex items-center gap-1">📞 020 - 123 45 67</span>
          </div>
          <div className="flex gap-2">
            <Link href="#" className="font-semibold text-white/35 transition hover:text-theme-primary">
              🎁 Cadeaubon
            </Link>
            <Link href="#" className="font-semibold text-white/35 transition hover:text-theme-primary">
              📸 @bistrodegracht
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-theme-secondary">
        <div className="container mx-auto flex h-[72px] items-center justify-between px-6">
          <Link href="/" className="font-['Playfair_Display'] text-2xl font-bold text-white">
            Bistro <em className="text-theme-primary">de Gracht</em>
          </Link>
          <nav className="hidden gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-theme-primary transition hover:bg-theme-primary/10"
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
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Reserveren
            </Link>
            <Link
              href="/over-ons"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Over ons
            </Link>
            <Link
              href="/evenementen"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Evenementen
            </Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="tel:0201234567"
              className="hidden items-center gap-1.5 text-xs font-semibold text-white/35 md:flex"
            >
              📞 020 - 123 45 67
            </Link>
            <Link
              href="/reserveren"
              className="flex h-[42px] items-center gap-1.5 rounded-lg bg-theme-primary px-5 font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary transition hover:bg-white"
            >
              📅 Reserveer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-theme-secondary to-theme-secondary-light pb-24 pt-20">
        <div className="absolute -right-20 -top-24 h-[600px] w-[600px] rounded-full bg-gradient-radial from-theme-primary/6 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent"></div>
        <div className="container relative z-10 mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-theme-primary/25 bg-theme-primary/10 px-3.5 py-1.5 text-xs font-bold text-theme-primary">
              🏆 Beste Bistro Amsterdam 2025
            </div>
            <h1 className="mb-2.5 font-['Playfair_Display'] text-5xl font-bold leading-tight text-white">
              Waar <em className="text-theme-primary">smaak</em> en sfeer samenkomen
            </h1>
            <p className="mb-5 max-w-md text-base leading-relaxed text-white/35">
              Ontdek onze seizoensgebonden menukaart met lokale ingrediënten. Van intieme diners
              tot gezellige groepsarrangementen — welkom in ons grachtenpand.
            </p>
            <div className="mb-6 flex gap-2">
              <Link
                href="/reserveren"
                className="flex h-12 items-center gap-2 rounded-xl bg-theme-primary px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-theme-secondary transition hover:bg-white"
              >
                📅 Reserveer een tafel
              </Link>
              <Link
                href="/menukaart"
                className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-white/12 bg-transparent px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white transition hover:border-theme-primary hover:text-theme-primary"
              >
                📖 Bekijk menukaart
              </Link>
            </div>
            <div className="flex gap-3.5">
              <div className="rounded-lg border border-white/6 bg-white/3 p-3">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-white/25">
                  Lunch
                </div>
                <div className="text-xs font-bold text-white">12:00 – 15:00</div>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/3 p-3">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-white/25">
                  Diner
                </div>
                <div className="text-xs font-bold text-white">17:30 – 22:30</div>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/3 p-3">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-white/25">
                  Brunch (zo)
                </div>
                <div className="text-xs font-bold text-white">10:00 – 14:00</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-center">
            <div className="relative flex aspect-[3/4] w-full max-w-md items-center justify-center rounded-3xl border border-white/6 bg-gradient-to-br from-theme-primary/8 to-theme-primary/3 text-9xl">
              🍽️
              <div className="absolute -left-2 bottom-10 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF8E1]">
                  <span className="text-base text-[#F59E0B]">⭐</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-theme-secondary">4.9 / 5.0</div>
                  <div className="text-[10px] text-theme-grey-mid">486 reviews</div>
                </div>
              </div>
              <div className="absolute -right-2 top-10 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-primary/12">
                  <span className="text-base text-theme-primary">🏆</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-theme-secondary">Michelin Bib</div>
                  <div className="text-[10px] text-theme-grey-mid">Gourmand 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu highlights */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-theme-primary/12 px-3.5 py-1.5 text-xs font-bold text-theme-primary">
              🍴 De menukaart
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-theme-secondary">
              Proef onze favorieten
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-sm text-theme-grey-dark">
              Seizoensgebonden gerechten met de beste lokale ingrediënten, elke week vers
              samengesteld door onze chef.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.length > 0 ? (
              menuItems.map((item: any) => (
                <div
                  key={item.id}
                  className="cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white transition hover:-translate-y-1 hover:border-theme-primary hover:shadow-md"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 text-6xl">
                    {item.icon || '🍽️'}
                    {item.featured && (
                      <div className="absolute left-2 top-2 rounded bg-theme-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        👨‍🍳 Chef's keuze
                      </div>
                    )}
                    {item.vegetarian && (
                      <div className="absolute left-2 top-2 rounded bg-[#00C853] px-2 py-0.5 text-[10px] font-bold text-white">
                        🌱 Vegetarisch
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="mb-0.5 flex items-start justify-between gap-2">
                      <div className="font-['Playfair_Display'] text-base font-bold text-theme-secondary">
                        {item.name}
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € {item.price}
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs leading-relaxed text-theme-grey-dark">
                      {item.description}
                    </p>
                    <div className="flex gap-1">
                      {item.vegetarian && (
                        <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                          Vegetarisch
                        </span>
                      )}
                      {item.glutenFree && (
                        <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                          Glutenvrij
                        </span>
                      )}
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        {item.category === 'starters' && 'Voorgerecht'}
                        {item.category === 'mains' && 'Hoofdgerecht'}
                        {item.category === 'desserts' && 'Dessert'}
                        {item.category === 'drinks' && 'Drank'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback examples
              <>
                <div className="cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white transition hover:-translate-y-1 hover:border-theme-primary">
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#ffeaa7] to-[#fdcb6e] text-6xl">
                    🥘
                    <div className="absolute left-2 top-2 rounded bg-theme-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      👨‍🍳 Chef's keuze
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="mb-0.5 flex justify-between">
                      <div className="font-['Playfair_Display'] text-base font-bold">
                        Ossobuco alla Milanese
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € 28,50
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs text-theme-grey-dark">
                      Langzaam gegaard kalfsvlees met gremolata, risotto alla milanese en
                      seizoensgroenten.
                    </p>
                    <div className="flex gap-1">
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Glutenvrij
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Hoofdgerecht
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white transition hover:-translate-y-1 hover:border-theme-primary">
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] text-6xl">
                    🥗
                    <div className="absolute left-2 top-2 rounded bg-[#00C853] px-2 py-0.5 text-[10px] font-bold text-white">
                      🌱 Vegetarisch
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="mb-0.5 flex justify-between">
                      <div className="font-['Playfair_Display'] text-base font-bold">
                        Geroosterde Biet & Burrata
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € 14,50
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs text-theme-grey-dark">
                      Rode biet uit de oven, romige burrata, walnoten, granaatappel en
                      balsamicoreductie.
                    </p>
                    <div className="flex gap-1">
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Vegetarisch
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Voorgerecht
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-theme-border bg-white transition hover:-translate-y-1 hover:border-theme-primary">
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#fab1a0] to-[#e17055] text-6xl">
                    🍰
                    <div className="absolute left-2 top-2 rounded bg-theme-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      Nieuw
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="mb-0.5 flex justify-between">
                      <div className="font-['Playfair_Display'] text-base font-bold">
                        Crème Brûlée Tonkaboon
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € 11,50
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs text-theme-grey-dark">
                      Klassieke crème brûlée met tonkaboon, gekarameliseerde suiker en vers
                      seizoensfruit.
                    </p>
                    <div className="flex gap-1">
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Glutenvrij
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Dessert
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4.5 text-center">
            <Link
              href="/menukaart"
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-secondary px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-primary transition hover:bg-theme-primary hover:text-theme-secondary"
            >
              📖 Volledige menukaart bekijken
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <div className="container mx-auto mb-8 px-6">
        <div className="grid overflow-hidden rounded-3xl bg-theme-secondary lg:grid-cols-2">
          <div className="flex flex-col justify-center p-11">
            <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-theme-primary/25 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary">
              ✨ Online reserveren
            </div>
            <h2 className="mb-1 font-['Playfair_Display'] text-3xl font-bold text-white">
              Reserveer uw tafel
            </h2>
            <p className="mb-4 text-xs text-white/35">
              Boek online in een paar klikken of bel ons direct. Speciale wensen? Laat het ons
              weten bij uw reservering.
            </p>
            <div className="mb-4 flex gap-3">
              <div className="flex items-center gap-1 text-[11px] text-white/30">
                <span className="text-theme-primary">✓</span> Direct bevestiging
              </div>
              <div className="flex items-center gap-1 text-[11px] text-white/30">
                <span className="text-theme-primary">✓</span> Gratis annuleren
              </div>
              <div className="flex items-center gap-1 text-[11px] text-white/30">
                <span className="text-theme-primary">✓</span> Dieetwensen welkom
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/reserveren"
                className="flex h-11 items-center gap-1.5 rounded-xl bg-theme-primary px-5 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-theme-secondary transition hover:bg-white"
              >
                📅 Reserveer online
              </Link>
              <a
                href="tel:0201234567"
                className="flex h-11 items-center gap-1.5 rounded-xl border-[1.5px] border-white/12 bg-transparent px-5 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white transition hover:border-theme-primary"
              >
                📞 020 - 123 45 67
              </a>
            </div>
          </div>
          <div className="relative hidden min-h-[280px] items-center justify-center overflow-hidden bg-theme-primary/4 text-9xl lg:flex">
            <div className="absolute inset-0 bg-gradient-radial from-theme-primary/8 to-transparent"></div>
            🍷
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-theme-secondary px-6 pb-6 pt-12 text-white/30">
        <div className="container mx-auto">
          <div className="mb-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="mb-2 inline-block font-['Playfair_Display'] text-2xl font-bold text-white">
                Bistro <em className="text-theme-primary">de Gracht</em>
              </Link>
              <p className="mb-2.5 text-xs leading-relaxed">
                Een culinaire beleving aan de Amsterdamse grachten. Seizoensgebonden menu,
                uitgebreide wijnkaart en een warm onthaal.
              </p>
            </div>
            <div>
              <h4 className="mb-2.5 font-['Playfair_Display'] text-base font-bold text-white">
                Navigatie
              </h4>
              <div className="flex flex-col gap-1.5">
                <Link href="/menukaart" className="text-xs transition hover:text-theme-primary">
                  Menukaart
                </Link>
                <Link href="/reserveren" className="text-xs transition hover:text-theme-primary">
                  Reserveren
                </Link>
                <Link href="/over-ons" className="text-xs transition hover:text-theme-primary">
                  Over ons
                </Link>
                <Link href="/evenementen" className="text-xs transition hover:text-theme-primary">
                  Evenementen
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-2.5 font-['Playfair_Display'] text-base font-bold text-white">
                Contact
              </h4>
              <div className="flex flex-col gap-1.5">
                <a href="#" className="flex items-center gap-1 text-xs transition hover:text-theme-primary">
                  📍 Herengracht 420
                </a>
                <a
                  href="tel:0201234567"
                  className="flex items-center gap-1 text-xs transition hover:text-theme-primary"
                >
                  📞 020 - 123 45 67
                </a>
                <a
                  href="mailto:info@bistrodegracht.nl"
                  className="flex items-center gap-1 text-xs transition hover:text-theme-primary"
                >
                  ✉️ info@bistrodegracht.nl
                </a>
                <a href="#" className="flex items-center gap-1 text-xs transition hover:text-theme-primary">
                  📸 @bistrodegracht
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-2.5 font-['Playfair_Display'] text-base font-bold text-white">
                Openingstijden
              </h4>
              <div className="text-xs leading-relaxed">
                Di t/m Za: 12:00 – 22:30
                <br />
                Zondag: 10:00 – 21:00
                <br />
                Maandag: Gesloten
                <br />
                <br />
                <strong className="text-theme-primary">Keuken sluit 21:30</strong>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/6 pt-4.5 text-xs">
            <span>© 2026 Bistro de Gracht · KvK 87654321</span>
            <span>Privacy · Voorwaarden</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
