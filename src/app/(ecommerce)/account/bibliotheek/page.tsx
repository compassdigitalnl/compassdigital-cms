'use client'

import React, { useState, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { AccountPageHeader } from '@/branches/ecommerce/shared/components/account/ui/AccountPageHeader'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui/AccountLoadingSkeleton'
import { LibraryOverview } from '@/branches/publishing/components/library/LibraryOverview'
import { NoSubscriptionUpsell } from '@/branches/publishing/components/library/NoSubscriptionUpsell'
import type {
  LibraryMagazineItem,
  RecentlyReadItem,
  LatestEditionItem,
} from '@/branches/publishing/components/library/LibraryOverview'

export default function BibliotheekPage() {
  // Feature gate: publishing must be enabled
  if (!isFeatureEnabled('publishing')) notFound()

  const { user, isLoading: authLoading } = useAccountAuth()
  const [magazines, setMagazines] = useState<LibraryMagazineItem[]>([])
  const [recentlyRead, setRecentlyRead] = useState<RecentlyReadItem[]>([])
  const [latestEditions, setLatestEditions] = useState<LatestEditionItem[]>([])
  const [hasDigitalAccess, setHasDigitalAccess] = useState<boolean | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const res = await fetch('/api/library', { credentials: 'include' })

        if (res.status === 401) {
          // Not authenticated — will be handled by useAccountAuth
          return
        }

        if (res.ok) {
          const data = await res.json()
          const mags: LibraryMagazineItem[] = (data.magazines || []).map((m: any) => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
            coverUrl: m.coverUrl,
            tagline: m.tagline,
            totalEditions: m.totalEditions,
            digitalEditions: m.digitalEditions,
          }))

          setMagazines(mags)
          setHasDigitalAccess(mags.length > 0)

          // Map recently read
          const recent: RecentlyReadItem[] = (data.recentlyRead || []).map(
            (r: any) => ({
              magazineSlug: r.magazineSlug,
              magazineName: r.magazineName,
              editionIndex: r.editionIndex,
              editionTitle: r.editionTitle,
              coverUrl: r.coverUrl,
              currentPage: r.currentPage,
              totalPages: r.totalPages,
            }),
          )
          setRecentlyRead(recent)

          // Build latest editions from magazines (newest first)
          const latest: LatestEditionItem[] = []
          for (const mag of data.magazines || []) {
            // The newest editions are typically at the end of the array
            // We get basic info from the overview API
            latest.push({
              magazineSlug: mag.slug,
              magazineName: mag.name,
              editionIndex: 0, // placeholder — actual index resolved on magazine detail page
              title: mag.name,
              coverUrl: mag.coverUrl,
            })
          }
          setLatestEditions(latest)
        } else {
          setHasDigitalAccess(false)
        }
      } catch (err) {
        console.error('Fout bij laden bibliotheek:', err)
        setHasDigitalAccess(false)
      } finally {
        setDataLoading(false)
      }
    }

    // Also load recently read from localStorage for instant display
    try {
      const stored = localStorage.getItem('library-recently-read')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentlyRead(
            parsed.slice(0, 5).map((r: any) => ({
              magazineSlug: r.magazineSlug,
              magazineName: r.magazineName,
              editionIndex: r.editionIndex,
              editionTitle: r.editionTitle,
              coverUrl: r.coverUrl,
              currentPage: r.currentPage,
              totalPages: r.totalPages,
            })),
          )
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return <AccountLoadingSkeleton variant="page" />
  }

  if (dataLoading || hasDigitalAccess === null) {
    return <AccountLoadingSkeleton variant="page" />
  }

  // If no digital access (no magazines with digital editions)
  if (!hasDigitalAccess || magazines.length === 0) {
    return (
      <div className="space-y-6">
        <AccountPageHeader
          title="Digitale Bibliotheek"
          subtitle="Lees uw tijdschriften online"
        />
        <NoSubscriptionUpsell />
      </div>
    )
  }

  return (
    <div>
      <LibraryOverview
        magazines={magazines}
        recentlyRead={recentlyRead}
        latestEditions={latestEditions}
      />
    </div>
  )
}
