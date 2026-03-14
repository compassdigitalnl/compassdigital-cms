'use client'

import React, { useState, useMemo } from 'react'
import type { FinancingCalculatorProps } from './types'

const LOAN_TERMS = [12, 24, 36, 48, 60, 72]

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  vehiclePrice,
  className = '',
}) => {
  const defaultPrice = vehiclePrice ? vehiclePrice / 100 : 20000

  const [aankoopprijs, setAankoopprijs] = useState(defaultPrice)
  const [aanbetalingPerc, setAanbetalingPerc] = useState(10)
  const [looptijd, setLooptijd] = useState(48)
  const [rente, setRente] = useState(4.9)

  const aanbetaling = (aankoopprijs * aanbetalingPerc) / 100
  const leenbedrag = aankoopprijs - aanbetaling

  // Annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const maandbedrag = useMemo(() => {
    if (leenbedrag <= 0 || looptijd <= 0) return 0
    const maandRente = rente / 100 / 12
    if (maandRente === 0) return leenbedrag / looptijd
    const factor = Math.pow(1 + maandRente, looptijd)
    return (leenbedrag * (maandRente * factor)) / (factor - 1)
  }, [leenbedrag, looptijd, rente])

  const totaalBedrag = maandbedrag * looptijd
  const totaalRente = totaalBedrag - leenbedrag

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      <div
        className="rounded-t-xl p-5"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-base-800))' }}
      >
        <h3 className="text-lg font-bold text-white">Financiering berekenen</h3>
        <p className="mt-1 text-sm text-white/70">Bereken uw maandelijkse termijn</p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {/* Aankoopprijs */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
            Aankoopprijs
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-base-500)]">
              &euro;
            </span>
            <input
              type="number"
              value={aankoopprijs}
              onChange={(e) => setAankoopprijs(Number(e.target.value))}
              min={0}
              step={500}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] py-3 pl-8 pr-4 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Aanbetaling */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
            Aanbetaling: {aanbetalingPerc}% ({formatCurrency(aanbetaling)})
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={aanbetalingPerc}
            onChange={(e) => setAanbetalingPerc(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-base-500)]">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Looptijd */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Looptijd</label>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {LOAN_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setLooptijd(term)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  looptijd === term
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                }`}
              >
                {term} mnd
              </button>
            ))}
          </div>
        </div>

        {/* Rente */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
            Rente: {rente.toFixed(1)}%
          </label>
          <input
            type="range"
            min={1}
            max={12}
            step={0.1}
            value={rente}
            onChange={(e) => setRente(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-base-500)]">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl bg-[var(--color-base-50,#f9fafb)] p-5">
          <div className="mb-1 text-sm text-[var(--color-base-600)]">Geschat maandbedrag</div>
          <div className="mb-4 text-3xl font-extrabold text-[var(--color-primary)]">
            {formatCurrency(maandbedrag)}
            <span className="ml-1 text-sm font-normal text-[var(--color-base-500)]">/ maand</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[var(--color-base-600)]">
              <span>Leenbedrag</span>
              <span className="font-medium text-[var(--color-base-1000)]">{formatCurrency(leenbedrag)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-base-600)]">
              <span>Totaal rente</span>
              <span className="font-medium text-[var(--color-base-1000)]">{formatCurrency(totaalRente)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-base-200)] pt-2 text-[var(--color-base-600)]">
              <span>Totaalbedrag</span>
              <span className="font-bold text-[var(--color-base-1000)]">{formatCurrency(totaalBedrag)}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs leading-relaxed text-[var(--color-base-500)]">
          Dit is een indicatief voorbeeld, geen financieringsaanbod. De werkelijke rente en voorwaarden
          kunnen afwijken. Neem contact op voor een persoonlijke offerte.
        </p>
      </div>
    </div>
  )
}

export default FinancingCalculator
