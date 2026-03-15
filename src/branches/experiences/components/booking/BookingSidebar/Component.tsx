'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BookingSidebarProps } from './types'

const defaultGuarantees = [
  String.fromCodePoint(0x1F6E1) + '\uFE0F Geheel vrijblijvend',
  '\u23F1\uFE0F Binnen 2 uur reactie',
  '\u274C Kosteloos annuleren',
]

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`

export function BookingSidebar({
  price,
  priceType = 'per-person',
  priceNote,
  dates = [],
  personOptions = [],
  guarantees = defaultGuarantees,
  onRequestQuote,
  onBookNow,
  className = '',
}: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPersons, setSelectedPersons] = useState('')

  const pricePrefix = priceType === 'from' ? 'Vanaf ' : ''
  const priceSuffix = priceType === 'per-person' ? ' p.p.' : ''

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value)

  return (
    <div
      className={`bg-white border border-grey-light rounded-2xl overflow-hidden shadow-lg ${className}`}
    >
      {/* Header: Price */}
      <div className="bg-gradient-to-br from-[var(--color-navy)] to-[#1a2744] px-5 py-4">
        <div className="flex items-baseline gap-1.5">
          {pricePrefix && (
            <span className="text-white/70 text-sm">{pricePrefix}</span>
          )}
          <span className="text-white font-serif text-2xl font-bold">
            {formatPrice(price)}
          </span>
          {priceSuffix && (
            <span className="text-white/70 text-sm">{priceSuffix}</span>
          )}
        </div>
        {priceNote && (
          <p className="text-white/60 text-xs mt-1">{priceNote}</p>
        )}
      </div>

      {/* Body: Form Fields */}
      <div className="p-5 space-y-4">
        {/* Date Select */}
        <div>
          <label className="block text-[10px] font-bold text-grey-mid uppercase tracking-wider mb-1">
            Datum
          </label>
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none border border-grey-light rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy)] bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-[var(--color-teal)]"
              style={{
                backgroundImage: chevronSvg,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="">Kies een datum</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Person Count Select */}
        <div>
          <label className="block text-[10px] font-bold text-grey-mid uppercase tracking-wider mb-1">
            Aantal personen
          </label>
          <div className="relative">
            <select
              value={selectedPersons}
              onChange={(e) => setSelectedPersons(e.target.value)}
              className="w-full appearance-none border border-grey-light rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy)] bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-[var(--color-teal)]"
              style={{
                backgroundImage: chevronSvg,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="">Selecteer groepsgrootte</option>
              {personOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onRequestQuote}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--color-teal)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <span>{String.fromCodePoint(0x1F4E9)}</span>
          Offerte aanvragen
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onBookNow}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-grey-light text-[var(--color-navy)] font-bold text-sm hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
        >
          <span>{String.fromCodePoint(0x1F4C5)}</span>
          Direct reserveren
        </button>
      </div>

      {/* Footer: Guarantees */}
      {guarantees.length > 0 && (
        <div className="border-t border-grey-light px-5 py-3">
          <ul className="space-y-1.5">
            {guarantees.map((guarantee, index) => (
              <li key={index} className="text-xs text-grey-dark">
                {guarantee}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
