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
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Progress bar */}
      <div className="border-b border-[#E8ECF1] bg-white py-3.5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-[#00897B] px-3.5 py-1.5 text-xs font-bold text-white">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold">
                1
              </div>
              Behandeling
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#94A3B8]">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-current text-[10px] font-extrabold">
                2
              </div>
              Stylist
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#94A3B8]">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-current text-[10px] font-extrabold">
                3
              </div>
              Datum & tijd
            </div>
            <div className="h-0.5 w-6 rounded bg-[#E8ECF1]"></div>
            <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#94A3B8]">
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
            <div className="overflow-hidden rounded-3xl border-[1.5px] border-[#E8ECF1] bg-white shadow-sm">
              <div className="border-b border-[#E8ECF1] p-5.5">
                <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-[#00897B]">
                  Stap 1
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0A1628]">
                  Kies je behandeling
                </h2>
                <p className="text-xs text-[#94A3B8]">Selecteer de gewenste service</p>
              </div>
              <div className="space-y-1 p-5.5">
                {services.map((service: any) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] border-[#E8ECF1] p-3 transition hover:border-[#00897B]"
                  >
                    <input
                      type="radio"
                      name="service"
                      className="h-4.5 w-4.5 rounded-full border-2 border-[#E8ECF1]"
                    />
                    <div className="text-lg">{service.icon || '✨'}</div>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold text-[#0A1628]">{service.name}</div>
                      <p className="text-[10px] text-[#94A3B8]">{service.excerpt}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#00897B]">
                        € {service.price}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">{service.duration} min</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="space-y-2.5">
            <div className="rounded-2xl border-[1.5px] border-[#E8ECF1] bg-white p-5 shadow-sm">
              <h3 className="mb-2.5 flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#0A1628]">
                📋 Samenvatting
              </h3>
              <div className="space-y-1.5 border-b border-[#E8ECF1] pb-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#94A3B8]">
                    <span className="text-[#00897B]">✨</span> Behandeling
                  </span>
                  <span className="font-bold">Selecteer...</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#94A3B8]">
                    <span className="text-[#00897B]">👤</span> Stylist
                  </span>
                  <span className="font-bold">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#94A3B8]">
                    <span className="text-[#00897B]">📅</span> Datum & tijd
                  </span>
                  <span className="font-bold">—</span>
                </div>
              </div>
              <div className="flex justify-between border-t-2 border-[#0A1628] pt-2.5 font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                <span>Totaal</span>
                <span className="text-[#00897B]">€ 0,00</span>
              </div>
              <button className="mt-2.5 flex h-11.5 w-full items-center justify-center gap-1.5 rounded-xl bg-[#00897B] font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-white shadow-lg shadow-[#00897B]/30 transition hover:bg-[#0A1628]">
                📅 Bevestig boeking
              </button>
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <span className="text-[#00897B]">✓</span> Gratis annuleren tot 24u
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <span className="text-[#00897B]">✓</span> Direct bevestiging per email
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <span className="text-[#00897B]">✓</span> Veilige betaling
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl bg-[#0A1628] p-3.5 text-white">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#00897B]/15">
                <span className="text-base text-[#00897B]">📞</span>
              </div>
              <div>
                <div className="text-[10px] text-white/30">Liever telefonisch?</div>
                <div className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
                  020 - 789 01 23
                </div>
                <div className="text-[10px] text-[#00897B]">Di-Za 09:00-21:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
