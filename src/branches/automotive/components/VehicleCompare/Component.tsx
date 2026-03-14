'use client'

import React from 'react'
import type { VehicleCompareProps, CompareVehicle } from './types'

const FUEL_LABELS: Record<string, string> = {
  benzine: 'Benzine',
  diesel: 'Diesel',
  elektrisch: 'Elektrisch',
  hybride: 'Hybride',
  lpg: 'LPG',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  automaat: 'Automaat',
  handgeschakeld: 'Handgeschakeld',
}

const BODY_TYPE_LABELS: Record<string, string> = {
  sedan: 'Sedan',
  hatchback: 'Hatchback',
  stationwagen: 'Stationwagen',
  suv: 'SUV',
  cabrio: 'Cabrio',
  coupe: 'Coup\u00e9',
  mpv: 'MPV',
  bestelwagen: 'Bestelwagen',
}

interface CompareRow {
  label: string
  key: keyof CompareVehicle
  format?: (value: any) => string
}

const COMPARE_ROWS: CompareRow[] = [
  {
    label: 'Prijs',
    key: 'price',
    format: (v: number) =>
      new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v / 100),
  },
  { label: 'Bouwjaar', key: 'year' },
  {
    label: 'Kilometerstand',
    key: 'mileage',
    format: (v: number) => `${new Intl.NumberFormat('nl-NL').format(v)} km`,
  },
  { label: 'Brandstof', key: 'fuelType', format: (v: string) => FUEL_LABELS[v] || v },
  { label: 'Transmissie', key: 'transmission', format: (v: string) => TRANSMISSION_LABELS[v] || v },
  { label: 'Vermogen', key: 'power', format: (v: number) => `${v} pk` },
  { label: 'Carrosserie', key: 'bodyType', format: (v: string) => BODY_TYPE_LABELS[v] || v },
  { label: 'Kleur', key: 'color' },
  { label: 'Deuren', key: 'doors' },
  { label: 'Zitplaatsen', key: 'seats' },
  {
    label: 'APK geldig tot',
    key: 'apkExpiry',
    format: (v: string) =>
      new Date(v).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
]

function areValuesDifferent(vehicles: CompareVehicle[], key: keyof CompareVehicle): boolean {
  const values = vehicles.map((v) => v[key]).filter((v) => v != null)
  if (values.length <= 1) return false
  return new Set(values.map(String)).size > 1
}

export const VehicleCompare: React.FC<VehicleCompareProps> = ({
  vehicles,
  onRemove,
  className = '',
}) => {
  if (vehicles.length === 0) {
    return (
      <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-8 text-center ${className}`}>
        <p className="text-sm text-[var(--color-base-500)]">Voeg voertuigen toe om te vergelijken</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Vehicle headers with images */}
          <thead>
            <tr className="border-b border-[var(--color-base-200)]">
              <th className="w-36 p-4 text-left text-sm font-medium text-[var(--color-base-500)]">
                Vergelijking
              </th>
              {vehicles.map((vehicle) => (
                <th key={vehicle.id} className="p-4 text-center">
                  <div className="relative">
                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(vehicle.id)}
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs transition-colors hover:bg-red-200"
                        title="Verwijderen"
                      >
                        &times;
                      </button>
                    )}
                    {vehicle.image ? (
                      <div className="mx-auto mb-2 h-24 w-36 overflow-hidden rounded-lg bg-[var(--color-base-100)]">
                        <img
                          src={vehicle.image}
                          alt={vehicle.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto mb-2 flex h-24 w-36 items-center justify-center rounded-lg bg-[var(--color-base-100)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-base-400)]">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="7" cy="17" r="2" />
                          <circle cx="17" cy="17" r="2" />
                        </svg>
                      </div>
                    )}
                    <h4 className="text-sm font-bold text-[var(--color-base-1000)] line-clamp-2">
                      {vehicle.title}
                    </h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Comparison rows */}
          <tbody>
            {COMPARE_ROWS.map((row) => {
              const isDifferent = areValuesDifferent(vehicles, row.key)
              return (
                <tr
                  key={row.key}
                  className="border-b border-[var(--color-base-100)] last:border-b-0"
                >
                  <td className="p-3 text-sm font-medium text-[var(--color-base-600)]">
                    {row.label}
                  </td>
                  {vehicles.map((vehicle) => {
                    const value = vehicle[row.key]
                    const displayValue =
                      value != null
                        ? row.format
                          ? row.format(value)
                          : String(value)
                        : '\u2013'

                    return (
                      <td
                        key={vehicle.id}
                        className={`p-3 text-center text-sm ${
                          isDifferent && value != null
                            ? 'font-semibold text-green-700 bg-green-50'
                            : 'text-[var(--color-base-1000)]'
                        }`}
                      >
                        {displayValue}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>

          {/* Action row */}
          <tfoot>
            <tr className="border-t border-[var(--color-base-200)]">
              <td className="p-3" />
              {vehicles.map((vehicle) => (
                <td key={vehicle.id} className="p-3 text-center">
                  <a
                    href={`/occasions/${vehicle.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white no-underline transition-opacity hover:opacity-90"
                  >
                    Bekijk details
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default VehicleCompare
