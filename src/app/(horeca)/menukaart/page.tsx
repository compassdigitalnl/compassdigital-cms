import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MenukaartPage() {
  const payload = await getPayload({ config })

  const menuResult = await payload.find({
    collection: 'menuItems',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    sort: 'category',
  })

  const menuItems = menuResult.docs

  // Group by category
  const itemsByCategory = menuItems.reduce((acc: any, item: any) => {
    const cat = item.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const categoryLabels: Record<string, string> = {
    starters: '🥗 Voorgerechten',
    mains: '🥘 Hoofdgerechten',
    desserts: '🍰 Desserts',
    drinks: '🍹 Dranken',
    wines: '🍷 Wijnen',
    lunch: '🥐 Lunch',
    specials: '✨ Specials',
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header (same as homepage) */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-theme-secondary">
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
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-theme-primary transition hover:bg-theme-primary/10"
            >
              Menukaart
            </Link>
            <Link
              href="/reserveren"
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/40 transition hover:bg-theme-primary/10 hover:text-theme-primary"
            >
              Reserveren
            </Link>
          </nav>
          <Link
            href="/reserveren"
            className="flex h-[42px] items-center gap-1.5 rounded-lg bg-theme-primary px-5 font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary transition hover:bg-white"
          >
            📅 Reserveer
          </Link>
        </div>
      </header>

      {/* Page hero */}
      <section className="relative overflow-hidden bg-theme-secondary px-6 py-12 text-center">
        <div className="absolute inset-0 bg-gradient-radial from-theme-primary/6 to-transparent"></div>
        <div className="relative z-10">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-theme-primary/25 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary">
            📖 Seizoensmenu Winter 2026
          </div>
          <h1 className="mb-1 font-['Playfair_Display'] text-4xl font-bold text-white">
            De Menukaart
          </h1>
          <p className="mx-auto max-w-md text-sm text-white/30">
            Elk gerecht wordt bereid met verse, lokale en seizoensgebonden ingrediënten.
            Allergieën? Spreek onze bediening aan.
          </p>
        </div>
      </section>

      {/* Menu layout */}
      <div className="container mx-auto grid gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div>
          {Object.keys(itemsByCategory).length > 0 ? (
            Object.entries(itemsByCategory).map(([category, items]: [string, any]) => (
              <div key={category} className="mb-8">
                <div className="mb-3.5 flex items-center gap-2.5 border-b-2 border-theme-border pb-2.5">
                  <span className="text-2xl">{categoryLabels[category]?.split(' ')[0]}</span>
                  <h2 className="flex-1 font-['Playfair_Display'] text-2xl font-bold text-theme-secondary">
                    {categoryLabels[category]?.split(' ').slice(1).join(' ')}
                  </h2>
                  <span className="rounded bg-theme-grey-light px-2 py-1 text-[11px] font-bold text-theme-grey-mid">
                    {items.length} {items.length === 1 ? 'gerecht' : 'gerechten'}
                  </span>
                </div>

                <div className="space-y-0">
                  {items.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 rounded-2xl p-3.5 transition hover:bg-[#FDF8F0]"
                      style={
                        index > 0
                          ? { borderTop: '1px solid var(--color-border)' }
                          : undefined
                      }
                    >
                      <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 text-4xl">
                        {item.icon || '🍽️'}
                        {item.featured && (
                          <div className="absolute -left-1 -top-1 rounded bg-theme-primary px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                            👨‍🍳
                          </div>
                        )}
                        {item.vegetarian && (
                          <div className="absolute -left-1 -top-1 rounded bg-[#00C853] px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                            🌱
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-0.5 flex items-start justify-between gap-2">
                          <div className="font-['Playfair_Display'] text-base font-bold leading-tight text-theme-secondary">
                            {item.name}
                          </div>
                          <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                            € {item.price}
                          </div>
                        </div>
                        <p className="mb-1.5 text-xs leading-relaxed text-theme-grey-dark">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.vegetarian && (
                            <span className="flex items-center gap-1 rounded bg-[#E8F5E9] px-1.5 py-0.5 text-[9px] font-bold text-[#00C853]">
                              Vegetarisch
                            </span>
                          )}
                          {item.vegan && (
                            <span className="flex items-center gap-1 rounded bg-[#E8F5E9] px-1.5 py-0.5 text-[9px] font-bold text-[#00C853]">
                              Veganistisch
                            </span>
                          )}
                          {item.glutenFree && (
                            <span className="flex items-center gap-1 rounded bg-[#FFF8E1] px-1.5 py-0.5 text-[9px] font-bold text-[#F59E0B]">
                              Glutenvrij
                            </span>
                          )}
                          {item.allergens && item.allergens.length > 0 && (
                            <span className="flex items-center gap-1 rounded bg-[#FFF0F0] px-1.5 py-0.5 text-[9px] font-bold text-[#FF6B6B]">
                              ⚠️ Allergenen
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Fallback voorbeelden
            <div className="mb-8">
              <div className="mb-3.5 flex items-center gap-2.5 border-b-2 border-theme-border pb-2.5">
                <span className="text-2xl">🥘</span>
                <h2 className="flex-1 font-['Playfair_Display'] text-2xl font-bold text-theme-secondary">
                  Hoofdgerechten
                </h2>
                <span className="rounded bg-theme-grey-light px-2 py-1 text-[11px] font-bold text-theme-grey-mid">
                  3 gerechten
                </span>
              </div>

              <div className="space-y-0">
                {/* Example dishes */}
                <div className="flex gap-3.5 rounded-2xl p-3.5 hover:bg-[#FDF8F0]">
                  <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffeaa7] to-[#fdcb6e] text-4xl">
                    🥘
                    <div className="absolute -left-1 -top-1 rounded bg-theme-primary px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                      👨‍🍳
                    </div>
                  </div>
                  <div className="flex-1">
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
                    <div className="flex gap-1.5">
                      <span className="rounded bg-[#FFF8E1] px-1.5 py-0.5 text-[9px] font-bold text-[#F59E0B]">
                        Glutenvrij
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Hoofdgerecht
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex gap-3.5 rounded-2xl p-3.5 hover:bg-[#FDF8F0]"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffccbc] to-[#ff8a65] text-4xl">
                    🐟
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex justify-between">
                      <div className="font-['Playfair_Display'] text-base font-bold">
                        Zeebaars met venkelcrème
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € 32,50
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs text-theme-grey-dark">
                      Verse zeebaars op een bedje van venkelcrème, confijt citroen en
                      geroosterde amandelen.
                    </p>
                    <div className="flex gap-1.5">
                      <span className="rounded bg-[#FFF8E1] px-1.5 py-0.5 text-[9px] font-bold text-[#F59E0B]">
                        Glutenvrij
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Hoofdgerecht
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex gap-3.5 rounded-2xl p-3.5 hover:bg-[#FDF8F0]"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] text-4xl">
                    🍝
                    <div className="absolute -left-1 -top-1 rounded bg-[#00C853] px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                      🌱
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex justify-between">
                      <div className="font-['Playfair_Display'] text-base font-bold">
                        Tagliatelle met paddestoelen
                      </div>
                      <div className="font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                        € 19,50
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs text-theme-grey-dark">
                      Verse tagliatelle met wilde paddestoelen, truffelolie, Parmezaan en
                      verse kruiden.
                    </p>
                    <div className="flex gap-1.5">
                      <span className="rounded bg-[#E8F5E9] px-1.5 py-0.5 text-[9px] font-bold text-[#00C853]">
                        Vegetarisch
                      </span>
                      <span className="rounded bg-theme-grey-light px-1.5 py-0.5 text-[9px] font-bold text-theme-grey-mid">
                        Hoofdgerecht
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Reservation CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-theme-secondary to-theme-secondary-light p-5 text-center text-white">
            <h3 className="mb-1 font-['Playfair_Display'] text-base font-bold">
              Reserveer uw tafel
            </h3>
            <p className="mb-2.5 text-[11px] text-white/35">
              Boek direct online of bel ons
            </p>
            <Link
              href="/reserveren"
              className="mb-1.5 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-theme-secondary transition hover:bg-white"
            >
              📅 Reserveren
            </Link>
            <p className="text-[11px] text-white/30">of bel 020 - 123 45 67</p>
          </div>

          {/* Allergy legend */}
          <div className="rounded-2xl border-[1.5px] border-theme-border bg-white p-5">
            <h3 className="mb-2.5 flex items-center gap-1.5 font-['Playfair_Display'] text-base font-bold text-theme-secondary">
              ℹ️ Allergenen
            </h3>
            <p className="mb-2 text-xs text-theme-grey-dark">
              Heeft u een allergie of dieetwens? Laat het ons weten bij uw bestelling.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="rounded bg-[#E8F5E9] px-2 py-1 text-[10px] font-bold text-[#00C853]">
                🌱 Vegetarisch
              </span>
              <span className="rounded bg-[#FFF8E1] px-2 py-1 text-[10px] font-bold text-[#F59E0B]">
                Glutenvrij
              </span>
              <span className="rounded bg-[#E3F2FD] px-2 py-1 text-[10px] font-bold text-[#2196F3]">
                Lactose
              </span>
              <span className="rounded bg-[#FFF0F0] px-2 py-1 text-[10px] font-bold text-[#FF6B6B]">
                Noten
              </span>
            </div>
          </div>

          {/* Download menu */}
          <button className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-theme-border bg-white font-['DM_Sans'] text-xs font-bold text-theme-grey-dark transition hover:border-theme-primary hover:text-theme-primary">
            📥 Download PDF menu
          </button>
        </div>
      </div>
    </div>
  )
}
