import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function RetourSuccess() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-2">Retour aangevraagd</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        Je retour aanvraag is ontvangen. Je ontvangt binnen 24 uur een e-mail met verdere instructies.
      </p>
      <Link
        href="/account/orders"
        className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-teal-700"
      >
        Terug naar bestellingen
      </Link>
    </div>
  )
}
