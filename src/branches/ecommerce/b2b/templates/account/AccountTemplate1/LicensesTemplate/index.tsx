'use client'

import React from 'react'
import Link from 'next/link'
import { KeyRound } from 'lucide-react'
import { AccountLoadingSkeleton, AccountEmptyState } from '@/branches/ecommerce/shared/components/account/ui'
import { LicenseStatsBar, LicenseCard } from '@/branches/ecommerce/b2b/components/account/licenses'
import type { LicensesTemplateProps } from './types'

export default function LicensesTemplate({
  licenses,
  stats,
  onDeactivateDevice,
  onDownloadLicense,
  isLoading,
}: LicensesTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="table" />

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 text-navy">Mijn Licenties</h1>
        <p className="text-sm lg:text-base text-grey-mid">
          Beheer je softwarelicenties, apparaten en downloads
        </p>
      </div>

      {/* Stats */}
      <LicenseStatsBar
        activeLicenses={stats.activeLicenses}
        totalDevices={stats.totalDevices}
        actionRequired={stats.actionRequired}
        totalDownloads={stats.totalDownloads}
      />

      {/* License list or empty state */}
      {licenses.length === 0 ? (
        <AccountEmptyState
          icon={KeyRound}
          title="Geen licenties"
          description="Je hebt nog geen softwarelicenties aangeschaft."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-3">
          {licenses.map((license) => (
            <LicenseCard
              key={license.id}
              id={license.id}
              productName={license.productName}
              licenseKey={license.licenseKey}
              type={license.type}
              status={license.status}
              maxActivations={license.maxActivations}
              currentActivations={license.currentActivations}
              purchasedAt={license.purchasedAt}
              expiresAt={license.expiresAt}
              activations={license.activations}
              downloads={license.downloads}
              daysUntilExpiry={license.daysUntilExpiry}
              onDeactivateDevice={onDeactivateDevice}
              onDownloadLicense={onDownloadLicense}
            />
          ))}
        </div>
      )}
    </div>
  )
}
