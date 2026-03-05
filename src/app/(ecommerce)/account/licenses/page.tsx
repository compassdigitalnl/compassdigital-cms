'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import LicensesTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/LicensesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import { toast } from '@/lib/toast'
import type { LicenseItem, LicenseStats } from '@/branches/ecommerce/templates/account/AccountTemplate1/LicensesTemplate/types'

const EMPTY_STATS: LicenseStats = {
  activeLicenses: 0,
  totalDevices: 0,
  actionRequired: 0,
  totalDownloads: 0,
}

export default function LicensesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const [licenses, setLicenses] = useState<LicenseItem[]>([])
  const [stats, setStats] = useState<LicenseStats>(EMPTY_STATS)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/account/licenses', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setLicenses(data.docs || [])
        if (data.stats) setStats(data.stats)
      }
    } catch (err) {
      console.error('Error fetching licenses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeactivateDevice = async (licenseId: number, activationId: number) => {
    if (!confirm('Weet je zeker dat je dit apparaat wilt deactiveren?')) return
    try {
      const res = await fetch(`/api/account/licenses/${licenseId}/deactivate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activationId }),
      })
      if (res.ok) {
        fetchData()
        toast.success('Apparaat gedeactiveerd')
      } else {
        toast.error('Deactivatie mislukt. Probeer het later opnieuw.')
      }
    } catch {
      toast.error('Er is iets misgegaan')
    }
  }

  const handleDownloadLicense = (licenseId: number) => {
    const license = licenses.find((l) => l.id === licenseId)
    if (license && (license as any).downloadUrl) {
      window.open((license as any).downloadUrl, '_blank')
    } else {
      toast.info('Geen download beschikbaar', 'Deze licentie heeft geen downloadbestand')
    }
  }

  return (
    <LicensesTemplate
      licenses={licenses}
      stats={stats}
      onDeactivateDevice={handleDeactivateDevice}
      onDownloadLicense={handleDownloadLicense}
      isLoading={isLoading}
    />
  )
}
