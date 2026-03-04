'use client'

import React, { useState } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import LicensesTemplate from '@/branches/ecommerce/templates/account/LicensesTemplate'
import type { LicenseItem, LicenseStats } from '@/branches/ecommerce/templates/account/LicensesTemplate/types'

// TODO: Replace with real licenses data from API
const MOCK_LICENSES: LicenseItem[] = [
  {
    id: 1,
    productName: 'Design Pro 2024',
    licenseKey: 'XXXX-XXXX-XXXX-AB42',
    type: 'professional',
    status: 'active',
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
    downloads: [
      { version: 'v4.2.0', releasedAt: '14 feb 2025', label: '.dmg (186 MB)', url: '#' },
      { version: 'v4.1.3', releasedAt: '10 jan 2025', label: '.dmg (182 MB)', url: '#' },
    ],
  },
  {
    id: 2,
    productName: 'Premium Templates Bundle',
    licenseKey: 'XXXX-XXXX-XXXX-CD89',
    type: 'lifetime',
    status: 'active',
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
]

const MOCK_STATS: LicenseStats = {
  activeLicenses: 2,
  totalDevices: 3,
  actionRequired: 0,
  totalDownloads: 2,
}

export default function LicensesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const [licenses] = useState<LicenseItem[]>(MOCK_LICENSES)
  const [stats] = useState<LicenseStats>(MOCK_STATS)

  const handleDeactivateDevice = (licenseId: number, activationId: number) => {
    // TODO: Implement device deactivation API call
    if (confirm('Weet je zeker dat je dit apparaat wilt deactiveren?')) {
      console.log(`Deactivating device ${activationId} from license ${licenseId}`)
    }
  }

  const handleDownloadLicense = (licenseId: number) => {
    // TODO: Implement license download
    console.log(`Downloading license ${licenseId}`)
    alert('Download functionaliteit nog niet beschikbaar')
  }

  return (
    <LicensesTemplate
      licenses={licenses}
      stats={stats}
      onDeactivateDevice={handleDeactivateDevice}
      onDownloadLicense={handleDownloadLicense}
    />
  )
}
