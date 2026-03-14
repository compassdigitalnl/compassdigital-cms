'use client'

import React, { useState, useMemo } from 'react'
import type { MortgageCalculatorProps } from './types'
import { calculateMortgage, formatPrice } from '../../lib/propertyUtils'

const DURATION_OPTIONS = [
  { label: '30 jaar', value: 30 },
  { label: '25 jaar', value: 25 },
  { label: '20 jaar', value: 20 },
]

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  defaultPrice,
  className = '',
}) => {
  const [purchasePrice, setPurchasePrice] = useState(defaultPrice || 0)
  const [ownContribution, setOwnContribution] = useState(0)
  const [duration, setDuration] = useState(30)
  const [interestRate, setInterestRate] = useState(3.8)

  const monthlyPayment = useMemo(() => {
    const principal = Math.max(0, purchasePrice - ownContribution)
    if (principal <= 0) return 0
    return calculateMortgage(principal, interestRate, duration)
  }, [purchasePrice, ownContribution, duration, interestRate])

  return (
    <div
      className={`rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-7 ${className}`}
    >
      {/* Header */}
      <div className="mb-1.5 flex items-center gap-2.5">
        <svg
          className="h-5 w-5 text-[var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="text-xl font-extrabold text-[var(--color-base-1000)]">
          Hypotheekberekening
        </h3>
      </div>
      <p className="mb-6 text-[13px] text-[var(--color-base-500)]">
        Bereken uw indicatieve maandlasten
      </p>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        {/* Koopprijs */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-base-500)]">
            Koopprijs
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-base-400)]">
              &euro;
            </span>
            <input
              type="number"
              value={purchasePrice || ''}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              placeholder="485.000"
              className="w-full rounded-lg border border-[var(--color-base-200)] py-2.5 pl-7 pr-3 font-mono text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        {/* Eigen inbreng */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-base-500)]">
            Eigen inbreng
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-base-400)]">
              &euro;
            </span>
            <input
              type="number"
              value={ownContribution || ''}
              onChange={(e) => setOwnContribution(Number(e.target.value))}
              placeholder="50.000"
              className="w-full rounded-lg border border-[var(--color-base-200)] py-2.5 pl-7 pr-3 font-mono text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        {/* Row: Looptijd + Rente */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-base-500)]">
              Looptijd
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-base-500)]">
              Rente
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="3.8"
                className="w-full rounded-lg border border-[var(--color-base-200)] py-2.5 pl-3 pr-7 font-mono text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-base-400)]">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result card */}
      <div
        className="mt-4 rounded-xl p-5"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, var(--color-primary)))',
        }}
      >
        <div className="text-xs text-white/70">Geschatte maandlasten</div>
        <div className="mt-1 font-mono text-[32px] font-bold text-white">
          {monthlyPayment > 0
            ? formatPrice(monthlyPayment)
            : '\u20AC 0'}
        </div>
        <div className="mt-1.5 text-[11px] text-white/60">
          Excl. opstalverzekering en VvE
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        Aanvraag starten
      </button>
    </div>
  )
}
