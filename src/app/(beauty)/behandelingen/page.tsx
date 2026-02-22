import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BehandelingenPage() {
  const payload = await getPayload({ config })

  const servicesResult = await payload.find({
    collection: 'beautyServices',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    sort: 'category',
  })

  const services = servicesResult.docs

  // Group services by category
  const servicesByCategory = services.reduce((acc: any, service: any) => {
    const category = service.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {})

  const categoryLabels: Record<string, string> = {
    hair: '✂️ Hair',
    beauty: '✨ Beauty & Skincare',
    wellness: '💆 Wellness & Massage',
    nails: '💅 Nails',
    bridal: '💍 Bridal & Events',
    color: '🎨 Color Specialist',
  }

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] to-[#121F33] py-11 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,137,123,0.06),transparent_70%)]"></div>
        <div className="relative z-10">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-theme-primary/20 bg-theme-primary/10 px-3 py-1 text-[11px] font-bold text-theme-primary-light">
            ✨ Behandelingen & prijzen
          </div>
          <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-4xl font-extrabold text-white">
            Onze Behandelingen
          </h1>
          <p className="mx-auto max-w-lg text-sm text-white/30">
            Ontdek ons volledige aanbod. Van knippen & kleuren tot luxe facials en ontspannende
            massages.
          </p>
        </div>
      </section>

      {/* Services by category */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            {Object.entries(servicesByCategory).map(([category, categoryServices]: [string, any]) => (
              <div key={category} className="mb-6">
                <div className="mb-2.5 flex items-center gap-2 border-b-2 border-theme-border pb-1.5">
                  <span className="text-2xl">{categoryLabels[category]?.split(' ')[0]}</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-theme-secondary">
                    {categoryLabels[category]?.split(' ').slice(1).join(' ')}
                  </span>
                  <span className="text-xs font-semibold text-theme-grey-mid">
                    {categoryServices.length} behandelingen
                  </span>
                </div>

                <div className="space-y-1.5">
                  {categoryServices.map((service: any) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 rounded-2xl border-[1.5px] border-theme-border bg-white p-3.5 transition hover:border-theme-primary"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-theme-primary/12 text-xl">
                        {service.icon || '✨'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-theme-secondary">
                          {service.name}
                          {service.tags?.includes('popular') && (
                            <span className="rounded bg-theme-primary/12 px-1.5 py-0.5 text-[9px] font-bold text-theme-primary">
                              POPULAIR
                            </span>
                          )}
                          {service.tags?.includes('new') && (
                            <span className="rounded bg-[#FCE7F3] px-1.5 py-0.5 text-[9px] font-bold text-[#EC4899]">
                              NIEUW
                            </span>
                          )}
                        </div>
                        <p className="hidden text-[11px] text-theme-grey-mid sm:block">{service.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-theme-grey-mid">
                          ⏱️ {service.duration} min
                        </span>
                        <span className="min-w-[65px] text-right font-['JetBrains_Mono'] text-base font-bold text-theme-primary">
                          € {service.price}
                        </span>
                        <Link
                          href="/boeken"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-primary text-white transition hover:bg-theme-secondary"
                        >
                          📅
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-2.5">
            <div className="rounded-2xl border-[1.5px] border-theme-border bg-white p-4.5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-theme-secondary">
                🎁 Cadeaubon
              </h3>
              <div className="mb-2 rounded-2xl bg-theme-secondary p-3.5 text-center text-white">
                <div className="mb-1 text-3xl">🎁</div>
                <div className="mb-0.5 font-['Plus_Jakarta_Sans'] text-sm font-extrabold">
                  Cadeaubon kopen
                </div>
                <p className="mb-2 text-[11px] text-white/30">
                  Het perfecte cadeau voor elke gelegenheid
                </p>
                <button className="flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-theme-primary font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-white transition hover:bg-white hover:text-theme-secondary">
                  💳 Bestel nu
                </button>
              </div>
            </div>

            <div className="flex items-start gap-1.5 rounded-lg bg-theme-grey-light p-2.5 text-[11px] leading-relaxed text-theme-grey-mid">
              <span className="text-theme-primary">ℹ️</span>
              Alle prijzen zijn inclusief BTW. Annuleren tot 24 uur van tevoren gratis mogelijk.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
