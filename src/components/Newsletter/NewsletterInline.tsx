'use client'

import { Send, Shield } from 'lucide-react'
import { useState } from 'react'

export function NewsletterInline() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md">
      <h4 className="text-base font-extrabold text-navy-900 mb-1">Nieuwsbrief</h4>
      <p className="text-sm text-gray-500 mb-3">
        Ontvang wekelijks aanbiedingen en producttips.
      </p>
      <form className="flex gap-1.5 mb-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Uw e-mailadres"
          className="flex-1 h-11 px-3.5 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-teal-600 focus:ring-3 focus:ring-teal-100 outline-none transition-all"
        />
        <button
          type="submit"
          className="h-11 px-4 bg-teal-600 text-white font-bold text-sm rounded-lg hover:bg-navy-900 transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          Aanmelden
        </button>
      </form>
      <div className="flex items-center gap-1 text-[11px] text-gray-500">
        <Shield className="w-3 h-3" />
        Geen spam, uitschrijven wanneer u wilt
      </div>
    </div>
  )
}
