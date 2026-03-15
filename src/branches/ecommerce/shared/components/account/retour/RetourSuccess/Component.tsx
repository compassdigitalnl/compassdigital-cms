import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function RetourSuccess() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green" />
      </div>
      <h2 className="text-xl font-extrabold text-navy mb-2">Retour aangevraagd</h2>
      <p className="text-sm text-grey-mid mb-6 max-w-md mx-auto">
        Je retour aanvraag is ontvangen. Je ontvangt binnen 24 uur een e-mail met verdere instructies.
      </p>
      <Link
        href="/account/orders"
        className="btn btn-primary inline-flex items-center"
      >
        Terug naar bestellingen
      </Link>
    </div>
  )
}
