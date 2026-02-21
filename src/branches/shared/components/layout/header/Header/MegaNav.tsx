'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  Heart,
  ClipboardList,
  Truck,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react'

export function MegaNav() {
  const [megaOpen, setMegaOpen] = useState(false)

  return (
    <header className="bg-white border border-gray-200 rounded-2xl overflow-visible relative z-50">
      {/* Top Bar */}
      <div className="bg-navy-900 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-5 py-1.5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-teal-400" />
              Gratis verzending &gt;�150
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-teal-400" />
              Besteld voor 16:00 = morgen geleverd
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              Alle producten CE-gecertificeerd
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="tel:+31201234567"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              0251247233
            </Link>
            <Link
              href="mailto:info@example.com"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3" />
              info@example.com
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-5 h-16 flex items-center gap-6">
        <Link href="/" className="text-xl font-extrabold text-navy-900 flex-shrink-0">
          plasti<span className="text-teal-600">med</span>
        </Link>

        <nav className="flex gap-1 flex-1">
          <button
            onClick={() => setMegaOpen(!megaOpen)}
            className="px-3.5 py-5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600 flex items-center gap-1"
          >
            Producten
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/brands/"
            className="px-3.5 py-5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600"
          >
            Merken
          </Link>
          <Link
            href="/branches/"
            className="px-3.5 py-5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600"
          >
            Branches
          </Link>
          <Link
            href="/deals/"
            className="px-3.5 py-5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600"
          >
            Aanbiedingen
          </Link>
          <Link
            href="/knowledge/"
            className="px-3.5 py-5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600"
          >
            Kennisbank
          </Link>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek product, merk of artikel&"
            className="w-full h-10 pl-10 pr-3.5 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-teal-600 focus:ring-3 focus:ring-teal-100 outline-none transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all">
            <ClipboardList className="w-4.5 h-4.5 text-navy-900" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all relative">
            <Heart className="w-4.5 h-4.5 text-navy-900" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
              6
            </span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all">
            <User className="w-4.5 h-4.5 text-navy-900" />
          </button>
          <button className="h-10 px-3.5 flex items-center gap-2 bg-navy-900 border border-navy-900 text-white rounded-lg hover:bg-teal-600 hover:border-teal-600 transition-all">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-bold">�79,92</span>
          </button>
        </div>
      </div>

      {/* Mega Dropdown */}
      {megaOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 rounded-b-2xl shadow-2xl p-6 grid grid-cols-[200px_1fr_240px] gap-6 z-50">
          {/* Categories */}
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-teal-50 text-teal-600">
              <span>>�</span> Handschoenen
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-navy-900 hover:bg-teal-50 hover:text-teal-600">
              <span>>z</span> Diagnostiek
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-navy-900 hover:bg-teal-50 hover:text-teal-600">
              <span>>y</span> Verbandmiddelen
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-navy-900 hover:bg-teal-50 hover:text-teal-600">
              <span>=�</span> Injectiemateriaal
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href="#"
                className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  >�
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-900">Peha-soft Nitrile</div>
                  <div className="text-xs text-teal-600 font-bold">Vanaf �6,95</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Promo Block */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-5 text-white flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-wide text-teal-400 mb-1.5">
              Aanbieding
            </div>
            <h4 className="text-base font-extrabold mb-1">10% korting op handschoenen</h4>
            <p className="text-xs text-gray-400 mb-3 leading-snug">
              Geldig t/m 28 februari 2026. Automatisch in winkelwagen.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-400 hover:text-white"
            >
              Bekijk actie �
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
