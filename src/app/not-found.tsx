import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '404 - Pagina niet gevonden',
  description: 'De pagina die u zoekt bestaat niet of is verplaatst.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[180px] font-extrabold text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-navy-900 mb-3">
            Oeps! Pagina niet gevonden
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            De pagina die u zoekt bestaat niet, is verplaatst of is tijdelijk niet beschikbaar.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-navy-900 transition-all"
            >
              <Home className="w-5 h-5" />
              Terug naar home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-navy-900 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              <Search className="w-5 h-5" />
              Bekijk producten
            </Link>
          </div>

          {/* Popular Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-500 mb-4">Populaire pagina's:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/shop"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Producten
              </Link>
              <Link
                href="/brands"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Merken
              </Link>
              <Link
                href="/faq"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Veelgestelde vragen
              </Link>
              <Link
                href="/contact"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/account"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Mijn account
              </Link>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Heeft u hulp nodig?</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">
              Neem contact op
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-teal-600 hover:text-teal-700 font-medium">
              Bekijk FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
