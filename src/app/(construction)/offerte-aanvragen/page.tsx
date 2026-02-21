/**
 * Quote Request Page
 *
 * Multi-step form for requesting construction quotes.
 * Route: /offerte-aanvragen
 */

import type { Metadata } from 'next'
import { QuoteForm } from '@/branches/construction/components'

export const metadata: Metadata = {
  title: 'Offerte Aanvragen - Bouwbedrijf',
  description: 'Vraag vrijblijvend een offerte aan voor uw bouwproject. Wij reageren binnen 24 uur.',
}

export default function OfferteAanvragenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Offerte Aanvragen</h1>
            <p className="text-xl text-gray-300">
              Vul het formulier in en ontvang binnen 24 uur een vrijblijvende offerte op maat.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Vrijblijvend</h3>
              <p className="text-sm text-gray-600">Geen verplichtingen</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Snel</h3>
              <p className="text-sm text-gray-600">Reactie binnen 24 uur</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Betrouwbaar</h3>
              <p className="text-sm text-gray-600">Persoonlijk advies</p>
            </div>
          </div>

          {/* Quote Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <QuoteForm />
          </div>

          {/* USPs */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Direct persoonlijk contact</h3>
                <p className="text-gray-600">
                  Na uw aanvraag neemt één van onze specialisten persoonlijk contact met u op.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Offerte op maat</h3>
                <p className="text-gray-600">
                  Wij maken een offerte die perfect aansluit bij uw wensen en budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Geen verborgen kosten</h3>
                <p className="text-gray-600">
                  Transparante prijzen en duidelijke communicatie, zonder verrassingen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Vakmanschap gegarandeerd</h3>
                <p className="text-gray-600">
                  Ervaren vakmensen en hoogwaardige materialen voor een duurzaam resultaat.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-gray-100 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Liever direct contact?</h3>
            <p className="text-gray-600 mb-4">
              Bel of mail ons gerust voor vragen of een vrijblijvend gesprek.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+31201234567"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                020 123 4567
              </a>
              <a
                href="mailto:info@bouwbedrijf.nl"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@bouwbedrijf.nl
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
