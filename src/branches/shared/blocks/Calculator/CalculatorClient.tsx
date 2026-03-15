'use client'

import React, { useState, useMemo } from 'react'
import type { SliderItem, SliderUnit } from './types'

/**
 * CalculatorClient — Interactive savings calculator
 *
 * Client component with slider state for live cost comparison.
 * Users adjust their current expenses and see how much they save
 * with CompassDigital.
 */

interface CalculatorClientProps {
  sliders: SliderItem[]
  ourMonthlyPrice: number
  ctaLabel?: string | null
  ctaLink?: string | null
}

/* ─── Value Formatting ──────────────────────────────────────────── */

function formatValue(value: number, unit: SliderUnit): string {
  switch (unit) {
    case 'euro':
      return `\u20AC${value.toLocaleString('nl-NL')}`
    case 'hours':
      return `${value}u`
    case 'percentage':
      return `${value}%`
    default:
      return `\u20AC${value.toLocaleString('nl-NL')}`
  }
}

function getEuroCost(value: number, unit: SliderUnit, hourlyRate: number): number {
  switch (unit) {
    case 'euro':
      return value
    case 'hours':
      return value * hourlyRate
    case 'percentage':
      return value
    default:
      return value
  }
}

/* ─── Component ─────────────────────────────────────────────────── */

export function CalculatorClient({
  sliders,
  ourMonthlyPrice,
  ctaLabel = 'Start nu en bespaar',
  ctaLink = '#contact',
}: CalculatorClientProps) {
  // Initialize slider values from defaults
  const [values, setValues] = useState<number[]>(() =>
    sliders.map((s) => s.defaultValue ?? s.minValue ?? 0),
  )

  const handleChange = (index: number, newValue: number) => {
    setValues((prev) => {
      const next = [...prev]
      next[index] = newValue
      return next
    })
  }

  // Calculate totals
  const currentTotal = useMemo(() => {
    return sliders.reduce((sum, slider, idx) => {
      const unit = (slider.unit || 'euro') as SliderUnit
      const hourlyRate = slider.hourlyRate ?? 75
      return sum + getEuroCost(values[idx], unit, hourlyRate)
    }, 0)
  }, [values, sliders])

  const savings = Math.max(0, currentTotal - ourMonthlyPrice)
  const yearlySavings = savings * 12

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* LEFT — Sliders */}
      <div className="space-y-6">
        {sliders.map((slider, idx) => {
          const unit = (slider.unit || 'euro') as SliderUnit
          const min = slider.minValue ?? 0
          const max = slider.maxValue
          const step = slider.step ?? 5
          const value = values[idx]

          return (
            <div key={slider.id || idx}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-grey-dark">{slider.label}</label>
                <span className="text-sm font-bold text-teal">
                  {formatValue(value, unit)}
                  {unit === 'hours' && (
                    <span className="text-xs font-normal text-grey-mid ml-1">
                      = &euro;{(value * (slider.hourlyRate ?? 75)).toLocaleString('nl-NL')}
                    </span>
                  )}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handleChange(idx, Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal bg-grey-light"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-grey-mid">{formatValue(min, unit)}</span>
                <span className="text-xs text-grey-mid">{formatValue(max, unit)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* RIGHT — Results card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
        <div>
          {/* Current costs */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-grey-dark">Huidige kosten</span>
            <span className="text-lg font-semibold text-navy">
              &euro;{currentTotal.toLocaleString('nl-NL')}
              <span className="text-sm font-normal text-grey-mid"> /mnd</span>
            </span>
          </div>

          {/* Our price */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-grey-dark">CompassDigital</span>
            <span className="text-lg font-semibold text-teal">
              &euro;{ourMonthlyPrice.toLocaleString('nl-NL')}
              <span className="text-sm font-normal text-grey-mid"> /mnd</span>
            </span>
          </div>

          {/* Divider */}
          <hr className="border-grey-light my-4" />

          {/* Monthly savings */}
          <div className="text-center mb-2">
            <div className="text-3xl md:text-4xl font-bold text-green">
              &euro;{savings.toLocaleString('nl-NL')}
            </div>
            <div className="text-sm text-grey-mid mt-1">besparing per maand</div>
          </div>

          {/* Yearly savings */}
          <div className="text-center mt-4 py-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-900">
              &euro;{yearlySavings.toLocaleString('nl-NL')}
            </div>
            <div className="text-xs text-green">besparing per jaar</div>
          </div>
        </div>

        {/* CTA button */}
        <a
          href={ctaLink || '#contact'}
          className="btn btn-primary mt-6 block w-full text-center"
        >
          {ctaLabel || 'Start nu en bespaar'}
        </a>
      </div>
    </div>
  )
}
