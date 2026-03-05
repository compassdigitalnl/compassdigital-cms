'use client'

import React, { useState } from 'react'
import {
  KeyRound,
  Download,
  Monitor,
  Smartphone,
  Laptop,
  Check,
  X,
  ChevronDown,
  Copy,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import type { LicenseCardProps } from './types'

function getDeviceIcon(deviceName: string) {
  const name = deviceName.toLowerCase()
  if (name.includes('macbook') || name.includes('laptop')) {
    return <Laptop className="w-4 h-4" />
  }
  if (name.includes('iphone') || name.includes('phone')) {
    return <Smartphone className="w-4 h-4" />
  }
  return <Monitor className="w-4 h-4" />
}

function getLicenseTypeLabel(type: LicenseCardProps['type']): string {
  switch (type) {
    case 'lifetime':
      return 'Levenslang'
    case 'professional':
      return 'Professional'
    case 'yearly':
      return 'Jaarlicentie'
    case 'ebook':
      return 'E-book'
    case 'templates':
      return 'Templates'
    default:
      return 'Personal'
  }
}

export function LicenseCard({
  id,
  productName,
  licenseKey,
  type,
  status,
  maxActivations,
  currentActivations,
  purchasedAt,
  expiresAt,
  activations,
  downloads,
  daysUntilExpiry,
  onDeactivateDevice,
  onDownloadLicense,
}: LicenseCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isExpiring = status === 'expiring'
  const isExpired = status === 'expired'

  const borderClass = isExpiring
    ? 'border-amber-400'
    : isExpired
      ? 'border-red-300'
      : 'border-gray-200 hover:border-teal-500'

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <div
      className={`bg-white border rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-150 ${borderClass}`}
    >
      {/* Card top row — clickable to expand */}
      <div
        className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 cursor-pointer"
        onClick={() => setIsOpen((v) => !v)}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isExpiring
              ? '#FFF8E1'
              : 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
          }}
        >
          <KeyRound
            className="w-5 h-5"
            style={{ color: isExpiring ? '#F59E0B' : 'var(--color-primary)' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm lg:text-base truncate">{productName}</div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="font-mono text-xs text-gray-500 truncate">{licenseKey}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 flex-shrink-0">
              {getLicenseTypeLabel(type)}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Gekocht {new Date(purchasedAt).toLocaleDateString('nl-NL')}
            {expiresAt && ` · Verloopt ${new Date(expiresAt).toLocaleDateString('nl-NL')}`}
          </div>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0 hidden sm:block">
          {isExpiring && daysUntilExpiry !== undefined ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
              <AlertTriangle className="w-3 h-3" />
              {daysUntilExpiry}d
            </span>
          ) : isExpired ? (
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">Verlopen</span>
          ) : (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Actief</span>
          )}
        </div>

        {/* Devices count */}
        {maxActivations > 0 && (
          <span className="text-xs font-semibold text-gray-500 flex-shrink-0 hidden md:block">
            {currentActivations}/{maxActivations} apparaten
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isExpiring ? (
            <button className="btn btn-sm btn-primary flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Verlengen</span>
            </button>
          ) : (
            <button
              onClick={() => onDownloadLicense(id)}
              className="btn btn-sm btn-outline-neutral flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}
        />
      </div>

      {/* Expanded details */}
      {isOpen && (
        <div className="px-4 pb-5 lg:px-5 border-t border-gray-100 pt-4 space-y-4">
          {/* License key section */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
              Licentiesleutel
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl">
              <span className="font-mono text-sm text-white flex-1 select-all">{licenseKey}</span>
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded text-white text-xs font-bold transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Gekopieerd' : 'Kopiëren'}
              </button>
            </div>
          </div>

          {/* Activations section */}
          {maxActivations > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Geactiveerde apparaten ({currentActivations} van {maxActivations})
                </div>
                {currentActivations < maxActivations && (
                  <button className="text-xs font-semibold text-teal-600 hover:underline">
                    + Apparaat activeren
                  </button>
                )}
              </div>

              {activations.length > 0 ? (
                <div className="space-y-1.5">
                  {activations.map((activation) => (
                    <div
                      key={activation.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg text-sm"
                    >
                      <span className="text-teal-600">{getDeviceIcon(activation.deviceName)}</span>
                      <span className="font-semibold text-gray-900 flex-1">{activation.deviceName}</span>
                      <span className="text-xs text-gray-400">
                        {activation.os} · {new Date(activation.activatedAt).toLocaleDateString('nl-NL')}
                      </span>
                      {activation.status === 'active' ? (
                        <>
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                            <Check className="w-3 h-3" />
                            Actief
                          </span>
                          <button
                            onClick={() => onDeactivateDevice(id, activation.id)}
                            className="text-xs font-semibold text-red-500 hover:underline"
                          >
                            Deactiveren
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <X className="w-3 h-3" />
                          Gedeactiveerd
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-400">Geen actieve apparaten</div>
              )}

              {currentActivations >= maxActivations && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <strong>Let op:</strong> Je hebt het maximale aantal activaties bereikt. Deactiveer eerst een apparaat om een nieuw apparaat te kunnen activeren.
                </div>
              )}
            </div>
          )}

          {/* Downloads section */}
          {downloads && downloads.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Downloadhistorie
              </div>
              <div className="space-y-1.5">
                {downloads.map((dl) => (
                  <div
                    key={dl.version}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="font-mono font-bold text-gray-900 text-xs">{dl.version}</span>
                    <span className="text-xs text-gray-400 flex-1">{dl.releasedAt}</span>
                    <a
                      href={dl.url}
                      className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      {dl.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
