import React from 'react'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import type { AddressesWidgetProps } from './types'

export function AddressesWidget({ addresses }: AddressesWidgetProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 lg:mb-5">
        <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Adressen</h2>
        <Link
          href="/account/addresses"
          className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          Beheer
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {addresses.slice(0, 2).map((address) => (
          <div
            key={address.id}
            className="p-3 lg:p-4 rounded-xl"
            style={{ border: '1.5px solid var(--color-border)' }}
          >
            <div className="flex items-start justify-between mb-2 lg:mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-bold text-gray-900">{address.typeLabel}</span>
                {address.isDefault && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Standaard
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs lg:text-sm text-gray-900 leading-relaxed">
              <div className="font-semibold">{address.name}</div>
              <div>{address.street}</div>
              <div>
                {address.postalCode} {address.city}
              </div>
              {address.country && <div>{address.country}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
