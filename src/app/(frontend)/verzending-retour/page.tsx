import Link from 'next/link'
import {
  Truck,
  Route,
  Undo2,
  ShoppingCart,
  Package,
  Home,
  Clock,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'

export const metadata = {
  title: 'Verzending & Retour - Plastimed',
  description: 'Informatie over verzendkosten, levertijden en ons retourbeleid.',
}

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Breadcrumb
            items={[{ label: 'Home', href: '/' }, { label: 'Verzending & retour' }]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-navy-900 mb-2">
          Verzending & Retour
        </h1>
        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Alles over onze bezorging, verzendkosten en retourbeleid. Besteld voor 16:00?
          Morgen in uw praktijk.
        </p>

        {/* Shipping Costs */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <Truck className="w-6 h-6 text-teal-600" />
            Verzendkosten
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 p-3">
                    Verzendmethode
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 p-3">
                    Bestelwaarde
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 p-3">
                    Kosten
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 p-3">
                    Levertijd
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="p-3 text-sm">Standaard (PostNL)</td>
                  <td className="p-3 text-sm">≥ €150 excl. BTW</td>
                  <td className="p-3 text-sm font-bold text-green-700">Gratis</td>
                  <td className="p-3 text-sm">Volgende werkdag</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 text-sm">Standaard (PostNL)</td>
                  <td className="p-3 text-sm">&lt; €150 excl. BTW</td>
                  <td className="p-3 text-sm">€7,50</td>
                  <td className="p-3 text-sm">Volgende werkdag</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 text-sm">Spoed (voor 10:00)</td>
                  <td className="p-3 text-sm">Alle bedragen</td>
                  <td className="p-3 text-sm">€14,95</td>
                  <td className="p-3 text-sm">Volgende ochtend</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm">Afhalen Beverwijk</td>
                  <td className="p-3 text-sm">Alle bedragen</td>
                  <td className="p-3 text-sm font-bold text-green-700">Gratis</td>
                  <td className="p-3 text-sm">Binnen 2 uur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Delivery Process */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <Route className="w-6 h-6 text-teal-600" />
            Leveringsproces
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            {/* Timeline */}
            <div className="flex gap-0 mb-5">
              <div className="flex-1 text-center relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 relative z-10">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="absolute top-[18px] left-1/2 right-[-50%] h-1 bg-teal-600/30 z-0" />
                <div className="text-sm font-bold text-navy-900">Besteld</div>
                <div className="text-xs text-gray-500">Voor 16:00</div>
              </div>

              <div className="flex-1 text-center relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 relative z-10">
                  <Package className="w-4 h-4" />
                </div>
                <div className="absolute top-[18px] left-1/2 right-[-50%] h-1 bg-teal-600/30 z-0" />
                <div className="text-sm font-bold text-navy-900">Verwerkt</div>
                <div className="text-xs text-gray-500">Dezelfde dag</div>
              </div>

              <div className="flex-1 text-center relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 relative z-10">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="absolute top-[18px] left-1/2 right-[-50%] h-1 bg-teal-600/30 z-0" />
                <div className="text-sm font-bold text-navy-900">Verzonden</div>
                <div className="text-xs text-gray-500">Track & Trace</div>
              </div>

              <div className="flex-1 text-center relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 relative z-10">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-navy-900">Geleverd</div>
                <div className="text-xs text-gray-500">Volgende werkdag</div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-gray-100 rounded-xl p-5 flex gap-3">
              <Clock className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-navy-900 mb-0.5">Besteltijd</h4>
                <p className="text-xs text-gray-600 leading-snug">
                  Bestellingen voor 16:00 op werkdagen worden dezelfde dag verwerkt en
                  verzonden.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-5 flex gap-3">
              <Mail className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-navy-900 mb-0.5">
                  Track & Trace
                </h4>
                <p className="text-xs text-gray-600 leading-snug">
                  U ontvangt automatisch een e-mail met een trackinglink zodra uw pakket
                  is verzonden.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-5 flex gap-3">
              <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-navy-900 mb-0.5">Afleveradres</h4>
                <p className="text-xs text-gray-600 leading-snug">
                  Uw pakket wordt bezorgd op het afleveradres dat u bij uw account heeft
                  ingesteld.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-navy-900 mb-0.5">Niet thuis?</h4>
                <p className="text-xs text-gray-600 leading-snug">
                  PostNL biedt de mogelijkheid om uw pakket bij een PostNL-punt af te
                  halen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <Undo2 className="w-6 h-6 text-teal-600" />
            Retourbeleid
          </h2>

          {/* Return Steps */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="grid grid-cols-4 gap-3.5">
              <div className="text-center bg-gray-100 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <div className="text-sm font-bold text-navy-900">
                  Retour aanvragen
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Via uw account</div>
              </div>

              <div className="text-center bg-gray-100 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <div className="text-sm font-bold text-navy-900">Label ontvangen</div>
                <div className="text-xs text-gray-500 mt-0.5">Per e-mail</div>
              </div>

              <div className="text-center bg-gray-100 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <div className="text-sm font-bold text-navy-900">
                  Product versturen
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Via PostNL-punt</div>
              </div>

              <div className="text-center bg-gray-100 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <div className="text-sm font-bold text-navy-900">Geld terug</div>
                <div className="text-xs text-gray-500 mt-0.5">Binnen 5 werkdagen</div>
              </div>
            </div>
          </div>

          {/* Return Policy Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="text-base font-extrabold text-navy-900 mb-3">
              Wat kan wel en niet worden geretourneerd?
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  Ongebruikte producten in originele verpakking — binnen 14 dagen
                </div>
              </div>

              <div className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  Beschadigde of verkeerde leveringen — altijd, gratis retourlabel
                </div>
              </div>

              <div className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  Apparatuur met fabrieksgarantie — volgens garantievoorwaarden
                </div>
              </div>

              <div className="flex gap-2.5 text-sm leading-relaxed">
                <XCircle className="w-4 h-4 text-coral-500 flex-shrink-0 mt-0.5" />
                <div>Steriele producten — uitgesloten van retour i.v.m. hygiëne</div>
              </div>

              <div className="flex gap-2.5 text-sm leading-relaxed">
                <XCircle className="w-4 h-4 text-coral-500 flex-shrink-0 mt-0.5" />
                <div>Geopende hygiëne-artikelen — niet retourneerbaar</div>
              </div>

              <div className="flex gap-2.5 text-sm leading-relaxed">
                <XCircle className="w-4 h-4 text-coral-500 flex-shrink-0 mt-0.5" />
                <div>Op maat bestelde producten — speciaal voor u ingekocht</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-extrabold text-white mb-1.5">
            Vragen over uw bestelling?
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Ons klantenserviceteam staat voor u klaar op werkdagen van 08:30 tot 17:00.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Contact opnemen
          </Link>
        </div>
      </div>
    </div>
  )
}
