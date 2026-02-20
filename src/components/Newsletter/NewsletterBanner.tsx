'use client'

import { Sparkles, Send } from 'lucide-react'
import { useState } from 'react'

export function NewsletterBanner() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-9 flex items-center justify-between gap-8 relative overflow-hidden">
      <div className="absolute top-[-30px] right-16 w-52 h-52 bg-white/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-bold text-white mb-2">
          <Sparkles className="w-3 h-3" />
          Blijf op de hoogte
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-1">
          Ontvang aanbiedingen & producttips
        </h3>
        <p className="text-sm text-white/60">
          Wekelijks het laatste nieuws, exclusieve kortingen en productlanceringen in uw inbox.
        </p>
      </div>

      <form className="flex gap-2 relative flex-shrink-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Uw e-mailadres"
          className="w-72 h-12 px-4 border-2 border-white/15 rounded-xl text-sm text-white bg-white/10 placeholder:text-white/35 focus:border-white focus:bg-white/15 outline-none transition-all"
        />
        <button
          type="submit"
          className="h-12 px-6 bg-white text-teal-600 font-bold text-sm rounded-xl hover:bg-navy-900 hover:text-white transition-all flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          Aanmelden
        </button>
      </form>
    </div>
  )
}
