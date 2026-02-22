import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function BoekenPage() {
  const payload = await getPayload({ config })

  const servicesResult = await payload.find({
    collection: 'beautyServices',
    where: {
      _status: {
        equals: 'published',
      },
      bookable: {
        equals: true,
      },
    },
    limit: 50,
  })

  const stylistsResult = await payload.find({
    collection: 'stylists',
    where: {
      _status: {
        equals: 'published',
      },
      bookable: {
        equals: true,
      },
    },
    limit: 20,
  })

  const services = servicesResult.docs
  const stylists = stylistsResult.docs

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Progress bar */}
      <div className="border-b border-theme-border bg-white py-3.5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-theme-primary px-3.5 py-1.5 text-xs font-bold text-white">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold">
                1
              </div>
              Behandeling
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-theme-grey-mid">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-current text-[10px] font-extrabold">
                2
              </div>
              Stylist
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-theme-grey-mid">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-current text-[10px] font-extrabold">
                3
              </div>
              Datum & tijd
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-theme-grey-mid">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-current text-[10px] font-extrabold">
                4
              </div>
              Gegevens
            </div>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            {/* Step 1: Treatment selection */}
            <div className="overflow-hidden rounded-3xl border-[1.5px] border-theme-border bg-white shadow-sm">
              <div className="border-b border-theme-border p-5.5">
                <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-theme-primary">
                  Stap 1
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-theme-secondary">
                  Kies je behandeling
                </h2>
                <p className="text-xs text-theme-grey-mid">Selecteer de gewenste service</p>
              </div>
              <div className="space-y-1 p-5.5">
                {services.map((service: any) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] border-theme-border p-3 transition hover:border-theme-primary"
                  >
                    <input
                      type="radio"
                      name="service"
                      className="h-4.5 w-4.5 rounded-full border-2 border-theme-border"
                    />
                    <div className="text-lg">{service.icon || '✨'}</div>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold text-theme-secondary">{service.name}</div>
                      <p className="text-[10px] text-theme-grey-mid">{service.excerpt}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-['JetBrains_Mono'] text-xs font-bold text-theme-primary">
                        € {service.price}
                      </div>
                      <div className="text-[10px] text-theme-grey-mid">{service.duration} min</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="space-y-2.5">
            <div className="rounded-2xl border-[1.5px] border-theme-border bg-white p-5 shadow-sm">
              <h3 className="mb-2.5 flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-base font-extrabold text-theme-secondary">
                📋 Samenvatting
              </h3>
              <div className="space-y-1.5 border-b border-theme-border pb-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-theme-grey-mid">
                    <span className="text-theme-primary">✨</span> Behandeling
                  </span>
                  <span className="font-bold">Selecteer...</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-theme-grey-mid">
                    <span className="text-theme-primary">👤</span> Stylist
                  </span>
                  <span className="font-bold">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-theme-grey-mid">
                    <span className="text-theme-primary">📅</span> Datum & tijd
                  </span>
                  <span className="font-bold">—</span>
                </div>
              </div>
              <div className="flex justify-between border-t-2 border-[#0A1628] pt-2.5 font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                <span>Totaal</span>
                <span className="text-theme-primary">€ 0,00</span>
              </div>
              <button className="mt-2.5 flex h-11.5 w-full items-center justify-center gap-1.5 rounded-xl bg-theme-primary font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white shadow-lg shadow-theme-primary/30 transition hover:bg-theme-secondary">
                📅 Bevestig boeking
              </button>
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-theme-grey-mid">
                  <span className="text-theme-primary">✓</span> Gratis annuleren tot 24u
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-theme-grey-mid">
                  <span className="text-theme-primary">✓</span> Direct bevestiging per email
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-theme-grey-mid">
                  <span className="text-theme-primary">✓</span> Veilige betaling
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl bg-theme-secondary p-3.5 text-white">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-theme-primary/15">
                <span className="text-base text-theme-primary">📞</span>
              </div>
              <div>
                <div className="text-[10px] text-white/30">Liever telefonisch?</div>
                <div className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                  020 - 789 01 23
                </div>
                <div className="text-[10px] text-theme-primary">Di-Za 09:00-21:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
