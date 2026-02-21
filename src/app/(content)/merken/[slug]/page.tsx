import Link from 'next/link'
import {
  Award,
  BookOpen,
  Grid3x3,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  ShoppingCart,
} from 'lucide-react'
import { Breadcrumb } from '@/branches/shared/components/Breadcrumb'

export const metadata = {
  title: 'Hartmann - Premium medische producten | Plastimed',
  description:
    'Al meer dan 200 jaar ontwikkelt Hartmann innovatieve oplossingen voor wondverzorging, hygiëne en bescherming. Ontdek het volledige assortiment bij Plastimed.',
}

export default function BrandDetailPage() {
  // In a real app, this would fetch brand data based on the slug param
  const brand = {
    name: 'Hartmann',
    partnerBadge: 'Officiële partner',
    description:
      'Al meer dan 200 jaar ontwikkelt Hartmann innovatieve oplossingen voor wondverzorging, hygiëne en bescherming. Ontdek het volledige assortiment bij Plastimed.',
    stats: [
      { number: '186', label: 'Producten' },
      { number: '6', label: 'Categorieën' },
      { number: '98%', label: 'Op voorraad' },
    ],
    story: [
      'Paul Hartmann AG is een van de oudste medische bedrijven ter wereld, opgericht in 1818 in Heidenheim, Duitsland. Het bedrijf is marktleider op het gebied van wondverzorging, incontinentie, desinfectie en bescherming.',
      'Bij Plastimed bieden wij het volledige Hartmann-assortiment aan, van de populaire Peha-soft handschoenen en Baktolan huidverzorging tot de professionele Zetuvit wondverbanden. Als officiële Hartmann-partner garanderen wij de laagste B2B-prijzen en directe beschikbaarheid.',
    ],
    categories: [
      { icon: '🧤', name: 'Handschoenen', count: 42 },
      { icon: '🩹', name: 'Wondverzorging', count: 56 },
      { icon: '🧴', name: 'Huidverzorging', count: 28 },
      { icon: '🧽', name: 'Desinfectie', count: 34 },
      { icon: '📋', name: 'Incontinentie', count: 18 },
      { icon: '🏥', name: 'Operatiebenodigdheden', count: 8 },
    ],
    products: [
      {
        icon: '🧤',
        badge: 'Bestseller',
        name: 'Peha-soft Nitrile Fino',
        price: '€8,25',
      },
      {
        icon: '🧴',
        badge: 'Staffelkorting',
        name: 'Baktolan Protect+ Pure',
        price: '€5,95',
      },
      { icon: '🩹', badge: null, name: 'Zetuvit Plus Wondverband', price: '€12,80' },
      { icon: '🧽', badge: null, name: 'Sterillium Classic Pure', price: '€9,45' },
    ],
    certifications: [
      'ISO 13485',
      'CE Markering',
      'OEKO-TEX',
      'FSC Gecertificeerd',
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Merken', href: '/merken' },
              { label: brand.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Brand Hero */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-12 mb-8 grid grid-cols-[1fr_auto] gap-10 items-center relative overflow-hidden">
          <div className="absolute top-[-50px] right-12 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl" />

          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-2.5">
              <Award className="w-3.5 h-3.5" />
              {brand.partnerBadge}
            </div>

            <h1 className="text-4xl font-extrabold text-white mb-2 relative">
              {brand.name}
            </h1>
            <p className="text-base text-gray-400 leading-relaxed max-w-lg mb-4 relative">
              {brand.description}
            </p>

            <div className="flex gap-5 relative">
              {brand.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-extrabold text-teal-400">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-36 h-20 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white relative">
            {brand.name}
          </div>
        </div>

        {/* Brand Story */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Over {brand.name}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-7">
            {brand.story.map((paragraph, i) => (
              <p key={i} className="text-base text-gray-600 leading-relaxed mb-2.5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <Grid3x3 className="w-6 h-6 text-teal-600" />
            Categorieën
          </div>

          <div className="grid grid-cols-4 gap-3">
            {brand.categories.map((cat, i) => (
              <Link
                key={i}
                href="#"
                className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center gap-1.5 hover:border-teal-600 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="text-3xl">{cat.icon}</div>
                <div className="text-sm font-bold text-navy-900">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.count} producten</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            Populairste {brand.name} producten
          </div>

          <div className="grid grid-cols-4 gap-3.5">
            {brand.products.map((product, i) => (
              <Link
                key={i}
                href="#"
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-transparent transition-all"
              >
                <div className="h-36 bg-gray-100 flex items-center justify-center text-5xl relative">
                  {product.badge && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white bg-amber-500">
                      {product.badge}
                    </div>
                  )}
                  {product.icon}
                </div>

                <div className="p-3.5">
                  <div className="text-xs font-bold uppercase tracking-wide text-teal-600 mb-0.5">
                    {brand.name}
                  </div>
                  <div className="text-sm font-bold text-navy-900 leading-snug mb-1.5">
                    {product.name}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-extrabold text-navy-900">
                      {product.price}
                    </div>
                    <button className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center hover:bg-navy-900 transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-navy-900 mb-4">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            Certificeringen
          </div>

          <div className="flex gap-3 flex-wrap">
            {brand.certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-900"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                {cert}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-10 text-center mb-12 relative overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white mb-1.5 relative">
            Alle {brand.stats[0].number} {brand.name} producten bekijken
          </h2>
          <p className="text-sm text-gray-400 mb-5 relative">
            Profiteer van B2B-prijzen, staffelkortingen en volgende-dag levering.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
          >
            <Grid3x3 className="w-4 h-4" />
            Bekijk alle producten
          </Link>
        </div>
      </div>
    </div>
  )
}
