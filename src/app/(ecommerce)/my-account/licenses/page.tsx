'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, KeyRound, Download, Monitor, Smartphone, Laptop, Check, X } from 'lucide-react'

export default function LicensesPage() {
  // TODO: Replace with real licenses data from API
  const [licenses] = useState([
    {
      id: 1,
      productName: 'Design Pro 2024',
      licenseKey: 'XXXX-XXXX-XXXX-AB42',
      type: 'professional',
      maxActivations: 3,
      currentActivations: 2,
      purchasedAt: '2024-01-15',
      expiresAt: '2025-01-15',
      activations: [
        {
          id: 1,
          deviceName: 'MacBook Pro',
          os: 'macOS 14',
          status: 'active',
          activatedAt: '2024-01-15',
        },
        {
          id: 2,
          deviceName: 'iMac Studio',
          os: 'macOS 13',
          status: 'active',
          activatedAt: '2024-02-01',
        },
      ],
    },
    {
      id: 2,
      productName: 'Premium Templates Bundle',
      licenseKey: 'XXXX-XXXX-XXXX-CD89',
      type: 'lifetime',
      maxActivations: 1,
      currentActivations: 1,
      purchasedAt: '2023-11-20',
      expiresAt: null,
      activations: [
        {
          id: 3,
          deviceName: 'MacBook Air',
          os: 'macOS 14',
          status: 'active',
          activatedAt: '2023-11-20',
        },
      ],
    },
  ])

  const handleDeactivateDevice = (licenseId: number, activationId: number) => {
    // TODO: Implement device deactivation API call
    if (confirm('Weet je zeker dat je dit apparaat wilt deactiveren?')) {
      console.log(`Deactivating device ${activationId} from license ${licenseId}`)
      alert('Apparaat gedeactiveerd')
    }
  }

  const handleDownloadLicense = (licenseId: number) => {
    // TODO: Implement license download
    console.log(`Downloading license ${licenseId}`)
    alert('Download functionaliteit nog niet beschikbaar')
  }

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes('macbook') || deviceName.toLowerCase().includes('laptop')) {
      return <Laptop className="w-4 h-4" />
    } else if (deviceName.toLowerCase().includes('iphone') || deviceName.toLowerCase().includes('phone')) {
      return <Smartphone className="w-4 h-4" />
    }
    return <Monitor className="w-4 h-4" />
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Licenties</h1>
        </div>
        <p className="text-sm text-gray-600">
          Beheer je software licenties en apparaat activaties
        </p>
      </div>

      {/* Licenses List */}
      <div className="space-y-4">
        {licenses.map((license) => (
          <div key={license.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* License Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <KeyRound className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{license.productName}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-mono">{license.licenseKey}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                        {license.type === 'lifetime' ? 'Lifetime' : license.type === 'professional' ? 'Professional' : 'Personal'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Gekocht op {new Date(license.purchasedAt).toLocaleDateString('nl-NL')}
                      {license.expiresAt && ` · Verloopt ${new Date(license.expiresAt).toLocaleDateString('nl-NL')}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadLicense(license.id)}
                  className="px-3 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Activations Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm">
                  Actieve apparaten ({license.currentActivations}/{license.maxActivations})
                </h4>
                {license.currentActivations < license.maxActivations && (
                  <button className="text-xs font-semibold text-teal-600 hover:underline">
                    + Apparaat activeren
                  </button>
                )}
              </div>

              {license.activations.length > 0 ? (
                <div className="space-y-2">
                  {license.activations.map((activation) => (
                    <div
                      key={activation.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-600">
                          {getDeviceIcon(activation.deviceName)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{activation.deviceName}</div>
                          <div className="text-xs text-gray-500">
                            {activation.os} · Geactiveerd {new Date(activation.activatedAt).toLocaleDateString('nl-NL')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activation.status === 'active' ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                            <Check className="w-3 h-3" />
                            Actief
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <X className="w-3 h-3" />
                            Gedeactiveerd
                          </span>
                        )}
                        {activation.status === 'active' && (
                          <button
                            onClick={() => handleDeactivateDevice(license.id, activation.id)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Deactiveren
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Geen actieve apparaten
                </div>
              )}

              {/* Activation Info */}
              {license.currentActivations >= license.maxActivations && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <strong>Let op:</strong> Je hebt het maximale aantal activaties bereikt. Deactiveer eerst een apparaat om een nieuw apparaat te kunnen activeren.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {licenses.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Geen licenties</h3>
          <p className="text-gray-600 text-sm mb-4">
            Je hebt nog geen software licenties aangeschaft
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors"
          >
            Bekijk producten
          </Link>
        </div>
      )}
    </div>
  )
}
