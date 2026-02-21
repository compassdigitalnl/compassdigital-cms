'use client'

import { useState } from 'react'
import { Search, Package, Truck, Undo2, User, ChevronDown, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumb'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  icon: string
  count: number
  questions: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    id: 'ordering',
    name: 'Bestellen & betalen',
    icon: '📦',
    count: 8,
    questions: [
      {
        question: 'Wat zijn de betaalmogelijkheden?',
        answer: 'U kunt betalen via iDEAL, bankoverschrijving, creditcard (Visa/Mastercard) of op rekening (alleen voor B2B-klanten met goedgekeurd account). Bij betaling op rekening heeft u de keuze uit 14 of 30 dagen betaaltermijn.',
      },
      {
        question: 'Hoe kan ik op rekening betalen?',
        answer: 'Betalen op rekening is beschikbaar voor zakelijke klanten. Na registratie via "Klant worden" en goedkeuring van uw aanvraag kunt u deze optie selecteren bij het afrekenen.',
      },
      {
        question: 'Kan ik een offerte aanvragen?',
        answer: 'Ja, voor grote bestellingen of specifieke wensen kunt u een offerte op maat aanvragen via onze offertepagina. U ontvangt binnen 24 uur een reactie op werkdagen.',
      },
      {
        question: 'Bieden jullie staffelprijzen aan?',
        answer: 'Ja, bij veel producten profiteert u automatisch van staffelprijzen bij grotere afnames. De staffelprijzen worden op de productpagina getoond. Voor nog grotere volumes kunt u een offerte aanvragen.',
      },
    ],
  },
  {
    id: 'shipping',
    name: 'Verzending & levering',
    icon: '🚚',
    count: 6,
    questions: [
      {
        question: 'Wat zijn de verzendkosten?',
        answer: 'Bestellingen boven €150 (excl. BTW) worden gratis verzonden. Onder €150 rekenen we €7,50 verzendkosten. Spoedleveringen (volgende dag voor 10:00) kosten €14,95.',
      },
      {
        question: 'Wanneer wordt mijn bestelling geleverd?',
        answer: 'Bestellingen voor 16:00 op werkdagen worden de volgende werkdag geleverd. U ontvangt een Track & Trace code per e-mail zodra uw pakket is verzonden.',
      },
      {
        question: 'Leveren jullie ook in België?',
        answer: 'Op dit moment leveren wij uitsluitend binnen Nederland. Voor leveringen in België kunt u contact met ons opnemen voor een maatwerkoplossing.',
      },
    ],
  },
  {
    id: 'returns',
    name: 'Retourneren',
    icon: '↩️',
    count: 5,
    questions: [
      {
        question: 'Kan ik een product retourneren?',
        answer: 'Ja, ongebruikte producten in originele verpakking kunnen binnen 14 dagen worden geretourneerd. Steriele en hygiëne-artikelen zijn uitgesloten van retour. Gebruik het retourformulier in uw account.',
      },
      {
        question: 'Hoe lang duurt een terugbetaling?',
        answer: 'Na ontvangst en controle van uw retourzending ontvangt u binnen 5 werkdagen uw geld terug op de oorspronkelijke betaalmethode. U ontvangt hiervan een bevestiging per e-mail.',
      },
    ],
  },
  {
    id: 'account',
    name: 'Mijn account',
    icon: '👤',
    count: 4,
    questions: [],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ordering')
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({
    'ordering-0': true, // First question open by default
  })

  const toggleQuestion = (key: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const activeCategoryData = faqData.find((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Veelgestelde vragen' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FAQ Hero */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-12 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

          <h1 className="text-4xl font-extrabold text-white mb-3 relative">
            Hoe kunnen we u helpen?
          </h1>
          <p className="text-gray-400 mb-6 relative">
            Zoek in onze kennisbank of bekijk de veelgestelde vragen per categorie.
          </p>

          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek een vraag…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-5 bg-white/10 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 outline-none focus:border-teal-600 focus:bg-white/15 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-3 mb-9">
          {faqData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`bg-white border-2 rounded-2xl p-5 text-center cursor-pointer transition-all ${
                activeCategory === category.id
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="text-sm font-bold text-navy-900">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} vragen</div>
            </button>
          ))}
        </div>

        {/* FAQ Layout */}
        <div className="grid grid-cols-[1fr_320px] gap-7 items-start pb-16">
          {/* Main FAQ Content */}
          <div>
            {activeCategoryData && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3 text-lg font-extrabold text-navy-900">
                  <Package className="w-5 h-5 text-teal-600" />
                  {activeCategoryData.name}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  {activeCategoryData.questions.map((item, index) => {
                    const key = `${activeCategory}-${index}`
                    const isOpen = openQuestions[key]

                    return (
                      <div
                        key={index}
                        className={`border-b border-gray-200 last:border-b-0 ${
                          isOpen ? 'bg-white' : ''
                        }`}
                      >
                        <button
                          onClick={() => toggleQuestion(key)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-navy-900 hover:text-teal-600 transition-colors"
                        >
                          <span className="text-base">{item.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-3 ${
                              isOpen ? 'rotate-180 text-teal-600' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5">
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                              {item.answer}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Was dit nuttig?</span>
                              <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-gray-600 hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all">
                                <ThumbsUp className="w-3 h-3" />
                                Ja
                              </button>
                              <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-gray-600 hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all">
                                <ThumbsDown className="w-3 h-3" />
                                Nee
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Popular Questions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-navy-900 mb-3">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Populaire vragen
              </div>

              <Link
                href="#"
                className="flex items-center gap-2 py-2 text-sm text-navy-900 hover:text-teal-600 border-b border-gray-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Wat zijn de verzendkosten?
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 py-2 text-sm text-navy-900 hover:text-teal-600 border-b border-gray-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Kan ik op rekening betalen?
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 py-2 text-sm text-navy-900 hover:text-teal-600 border-b border-gray-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Hoe maak ik een B2B account?
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 py-2 text-sm text-navy-900 hover:text-teal-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Leveren jullie spoedorders?
              </Link>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 text-center">
              <h4 className="text-lg font-extrabold text-white mb-2">
                Staat uw vraag er niet bij?
              </h4>
              <p className="text-sm text-gray-400 mb-4 leading-snug">
                Neem contact met ons op — wij helpen u graag verder.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Contact opnemen
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
