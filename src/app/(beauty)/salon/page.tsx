import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BeautySalonPage() {
  const payload = await getPayload({ config })

  // Fetch featured services (max 4 for highlights)
  const servicesResult = await payload.find({
    collection: 'beautyServices',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 4,
    sort: '-createdAt',
  })

  // Fetch team members
  const stylistsResult = await payload.find({
    collection: 'stylists',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 4,
  })

  const services = servicesResult.docs
  const stylists = stylistsResult.docs

  return (
    <div className="bg-[#F5F7FA]">
      {/* Topbar */}
      <div className="bg-[#0A1628] py-2 text-xs text-white/35">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              📍 Keizersgracht 324, Amsterdam
            </span>
            <span className="flex items-center gap-1">⏰ Di-Za 09:00-21:00</span>
            <span className="flex items-center gap-1">📞 020 - 789 01 23</span>
          </div>
          <div className="flex gap-2">
            <Link href="#" className="font-semibold text-white/35 transition hover:text-[#00897B]">
              🎁 Cadeaubon
            </Link>
            <Link href="#" className="font-semibold text-white/35 transition hover:text-[#00897B]">
              📸 @studiobloom
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] to-[#121F33] pb-24 pt-20">
        <div className="absolute -right-16 -top-24 h-[500px] w-[500px] rounded-full bg-[#00897B]/8"></div>
        <div className="container relative z-10 mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#00897B]/20 bg-[#00897B]/10 px-3.5 py-1.5 text-xs font-bold text-[#26A69A]">
              🏆 Best beoordeelde salon Amsterdam 2025
            </div>
            <h1 className="mb-4 font-['Plus_Jakarta_Sans'] text-5xl font-extrabold leading-tight text-white">
              Waar <span className="text-[#26A69A]">schoonheid</span> tot bloei komt
            </h1>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/35">
              Hair, beauty & wellness in het hart van Amsterdam. Persoonlijke behandelingen door
              vakkundige stylisten met de beste producten. Ontspan, geniet en straal.
            </p>
            <div className="mb-6 flex gap-2">
              <Link
                href="/boeken"
                className="flex h-12 items-center gap-2 rounded-xl bg-[#00897B] px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white shadow-lg shadow-[#00897B]/30 transition hover:bg-white hover:text-[#0A1628]"
              >
                📅 Online boeken
              </Link>
              <Link
                href="#"
                className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-white/12 bg-transparent px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white transition hover:border-[#00897B] hover:text-[#00897B]"
              >
                🎁 Cadeaubon kopen
              </Link>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <span className="text-[#00897B]">✓</span> Gratis consultatie
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <span className="text-[#00897B]">✓</span> 100% vegan producten
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <span className="text-[#00897B]">✓</span> Avonduren Di-Vr
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-center">
            <div className="relative flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-3xl border border-white/6 bg-gradient-to-br from-[#00897B]/4 to-[#00897B]/2 text-8xl">
              💇‍♀️
              <div className="absolute -left-2 bottom-8 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF8E1]">
                  <span className="text-base text-[#F59E0B]">⭐</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0A1628]">4.9 / 5.0</div>
                  <div className="text-[10px] text-[#94A3B8]">380+ reviews</div>
                </div>
              </div>
              <div className="absolute -right-2 top-8 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00897B]/12">
                  <span className="text-base text-[#00897B]">❤️</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0A1628]">12.000+ klanten</div>
                  <div className="text-[10px] text-[#94A3B8]">Sinds 2016</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="container relative z-20 mx-auto -mt-10 mb-5 px-6">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border-[1.5px] border-[#E8ECF1] bg-white p-7 shadow-lg lg:grid-cols-4">
          <div className="border-r border-[#E8ECF1] pr-2 text-center last:border-r-0 lg:pr-0">
            <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#00897B]">
              8+
            </div>
            <div className="text-xs font-semibold text-[#94A3B8]">Jaar ervaring</div>
          </div>
          <div className="border-[#E8ECF1] pr-2 text-center lg:border-r lg:pr-0">
            <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#00897B]">
              12K+
            </div>
            <div className="text-xs font-semibold text-[#94A3B8]">Tevreden klanten</div>
          </div>
          <div className="border-r border-[#E8ECF1] pr-2 text-center last:border-r-0 lg:pr-0">
            <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#00897B]">
              6
            </div>
            <div className="text-xs font-semibold text-[#94A3B8]">Specialisten</div>
          </div>
          <div className="text-center">
            <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#00897B]">
              4.9
            </div>
            <div className="text-xs font-semibold text-[#94A3B8]">Google rating</div>
          </div>
        </div>
      </div>

      {/* Treatments highlights */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="mb-7 text-center">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#00897B]/15 bg-[#00897B]/12 px-3.5 py-1.5 text-xs font-bold text-[#00897B]">
              ✨ Populaire behandelingen
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-tight text-[#0A1628]">
              Onze diensten
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[#64748B]">
              Van knippen & kleuren tot luxe facials. Ontdek ons complete aanbod.
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service: any) => (
              <div
                key={service.id}
                className="cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-[#E8ECF1] bg-white transition hover:-translate-y-1 hover:border-[#00897B] hover:shadow-md"
              >
                <div className="relative flex h-40 items-center justify-center text-5xl">
                  {service.icon || '✨'}
                  {service.tags && service.tags.includes('popular') && (
                    <div className="absolute right-2 top-2 rounded bg-[#00897B]/12 px-2 py-0.5 text-[9px] font-bold text-[#00897B]">
                      POPULAIR
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="mb-0.5 font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#0A1628]">
                    {service.name}
                  </h3>
                  <p className="mb-1.5 text-xs leading-relaxed text-[#64748B]">
                    {service.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#00897B]">
                      € {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                      ⏱️ {service.duration} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/behandelingen"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00897B] hover:underline"
            >
              Bekijk alle behandelingen →
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="mb-7 text-center">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#00897B]/15 bg-[#00897B]/12 px-3.5 py-1.5 text-xs font-bold text-[#00897B]">
              👥 Ons team
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-tight text-[#0A1628]">
              Ontmoet onze stylisten
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-sm text-[#64748B]">
              Vakkundige professionals met passie voor beauty
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stylists.map((stylist: any) => (
              <div
                key={stylist.id}
                className="overflow-hidden rounded-2xl border-[1.5px] border-[#E8ECF1] bg-white text-center transition hover:border-[#00897B]"
              >
                <div className="relative flex h-48 items-center justify-center bg-[#F1F4F8] text-6xl">
                  {stylist.emoji || '💇‍♀️'}
                  {stylist.role === 'owner' && (
                    <div className="absolute right-2 top-2 rounded bg-[#00897B] px-2 py-0.5 text-[9px] font-bold text-white">
                      OWNER
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-[#0A1628]">
                    {stylist.name}
                  </h3>
                  <div className="mb-0.5 text-xs font-semibold text-[#00897B]">
                    {stylist.role === 'stylist' && 'Stylist'}
                    {stylist.role === 'color-specialist' && 'Color Specialist'}
                    {stylist.role === 'beauty-specialist' && 'Beauty Specialist'}
                    {stylist.role === 'nail-artist' && 'Nail Artist'}
                    {stylist.role === 'owner' && 'Salon Owner'}
                  </div>
                  {stylist.specialties && stylist.specialties.length > 0 && (
                    <p className="text-[11px] text-[#94A3B8]">
                      {stylist.specialties[0].specialty}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift card banner */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between rounded-3xl bg-gradient-to-br from-[#0A1628] to-[#121F33] p-9">
            <div className="flex items-center gap-4 text-white">
              <div className="text-5xl">🎁</div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold">
                  Cadeaubon kopen
                </h3>
                <p className="text-xs text-white/35">
                  Het perfecte cadeau voor elke gelegenheid
                </p>
              </div>
            </div>
            <button className="flex h-12 items-center gap-2 rounded-xl bg-[#00897B] px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white shadow-lg shadow-[#00897B]/30 transition hover:bg-white hover:text-[#0A1628]">
              💳 Bestel nu
            </button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="pb-14">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between rounded-3xl border-2 border-[#00897B] bg-white p-9">
            <div>
              <h3 className="mb-1 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0A1628]">
                Klaar voor een nieuwe look?
              </h3>
              <p className="text-xs text-[#64748B]">
                Boek vandaag nog je afspraak en laat jezelf verwennen
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/boeken"
                className="flex h-12 items-center gap-2 rounded-xl bg-[#00897B] px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white transition hover:bg-[#0A1628]"
              >
                📅 Online boeken
              </Link>
              <a
                href="tel:0207890123"
                className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#E8ECF1] bg-white px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-[#0A1628] transition hover:border-[#00897B] hover:text-[#00897B]"
              >
                📞 Bel ons
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
