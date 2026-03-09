'use client'

import React from 'react'
import { Building2, Mail, Phone } from 'lucide-react'
import type { QuoteContactInfoProps } from './types'

export default function QuoteContactInfo({ companyName, contactPerson, email, phone, notes }: QuoteContactInfoProps) {
  if (!companyName && !contactPerson && !email) return null

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--white)', border: '1px solid var(--grey)', boxShadow: 'var(--sh-sm)' }}
    >
      <h3 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
        <Building2 className="w-4 h-4 inline mr-2" />
        Contactgegevens
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {companyName && (
          <div>
            <span className="font-medium" style={{ color: 'var(--grey-mid)' }}>Bedrijf</span>
            <p style={{ color: 'var(--navy)' }}>{companyName}</p>
          </div>
        )}
        {contactPerson && (
          <div>
            <span className="font-medium" style={{ color: 'var(--grey-mid)' }}>Contactpersoon</span>
            <p style={{ color: 'var(--navy)' }}>{contactPerson}</p>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" style={{ color: 'var(--grey-mid)' }} />
            <span style={{ color: 'var(--navy)' }}>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" style={{ color: 'var(--grey-mid)' }} />
            <span style={{ color: 'var(--navy)' }}>{phone}</span>
          </div>
        )}
      </div>
      {notes && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--grey)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--grey-mid)' }}>Opmerkingen</span>
          <p className="text-sm mt-1" style={{ color: 'var(--navy)' }}>{notes}</p>
        </div>
      )}
    </div>
  )
}
