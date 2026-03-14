import React from 'react'
import type { VehicleSpecsProps } from './types'

interface SpecRow {
  label: string
  value: string | number | boolean | null | undefined
  format?: (v: any) => string
}

interface SpecGroup {
  title: string
  icon: React.ReactNode
  rows: SpecRow[]
}

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

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ specs, className = '' }) => {
  const groups: SpecGroup[] = [
    {
      title: 'Algemeen',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      ),
      rows: [
        { label: 'Merk', value: specs.brand },
        { label: 'Model', value: specs.model },
        { label: 'Bouwjaar', value: specs.year },
        { label: 'Carrosserie', value: specs.bodyType, format: (v: string) => BODY_TYPE_LABELS[v] || v },
      ],
    },
    {
      title: 'Motor',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
      ),
      rows: [
        { label: 'Brandstof', value: specs.fuelType, format: (v: string) => FUEL_LABELS[v] || v },
        { label: 'Transmissie', value: specs.transmission, format: (v: string) => TRANSMISSION_LABELS[v] || v },
        { label: 'Vermogen', value: specs.power, format: (v: number) => `${v} pk` },
        { label: 'Motorinhoud', value: specs.engineCapacity, format: (v: number) => `${new Intl.NumberFormat('nl-NL').format(v)} cc` },
      ],
    },
    {
      title: 'Registratie',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
        </svg>
      ),
      rows: [
        { label: 'Kenteken', value: specs.licensePlate },
        {
          label: 'APK geldig tot',
          value: specs.apkExpiry,
          format: (v: string) =>
            new Date(v).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
        },
        { label: 'Aantal eigenaren', value: specs.previousOwners },
        { label: 'NAP check', value: specs.napCheck, format: (v: boolean) => (v ? 'Goedgekeurd' : 'Niet beschikbaar') },
      ],
    },
    {
      title: 'Afmetingen',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      ),
      rows: [
        { label: 'Gewicht', value: specs.weight, format: (v: number) => `${new Intl.NumberFormat('nl-NL').format(v)} kg` },
        { label: 'Deuren', value: specs.doors },
        { label: 'Zitplaatsen', value: specs.seats },
        { label: 'Kleur', value: specs.color },
      ],
    },
  ]

  // Filter groups that have at least one row with a value
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => row.value != null && row.value !== ''),
    }))
    .filter((group) => group.rows.length > 0)

  if (filteredGroups.length === 0) return null

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      <div className="p-5 md:p-6">
        <h3 className="mb-5 text-lg font-bold text-[var(--color-base-1000)]">Specificaties</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                {group.icon}
                {group.title}
              </div>
              <div className="space-y-2">
                {group.rows.map((row) => {
                  const displayValue = row.format ? row.format(row.value) : String(row.value)
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-lg bg-[var(--color-base-50,#f9fafb)] px-3 py-2 text-sm"
                    >
                      <span className="text-[var(--color-base-600)]">{row.label}</span>
                      <span className="font-medium text-[var(--color-base-1000)]">{displayValue}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VehicleSpecs
