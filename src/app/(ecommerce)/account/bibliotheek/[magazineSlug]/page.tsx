'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui/AccountLoadingSkeleton'
import { LibraryMagazineGrid } from '@/branches/publishing/components/library/LibraryMagazineGrid'
import { NoSubscriptionUpsell } from '@/branches/publishing/components/library/NoSubscriptionUpsell'
import type { LibraryMagazineGridEdition } from '@/branches/publishing/components/library/LibraryMagazineGrid'

interface MagazineInfo {
  name: string
  slug: string
  tagline?: string
  coverUrl?: string
}

export default function MagazineEditionsPage() {
  const params = useParams()
  const magazineSlug = params?.magazineSlug as string
  const { user, isLoading: authLoading } = useAccountAuth()

  const [magazine, setMagazine] = useState<MagazineInfo | null>(null)
  const [editions, setEditions] = useState<LibraryMagazineGridEdition[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user || !magazineSlug) return

    const fetchEditions = async () => {
      try {
        const res = await fetch(
          `/api/library/${encodeURIComponent(magazineSlug)}/editions`,
          { credentials: 'include' },
        )

        if (res.status === 401) {
          // Will be handled by useAccountAuth redirect
          return
        }

        if (res.status === 404) {
          setError('Magazine niet gevonden')
          return
        }

        if (!res.ok) {
          setError('Kon edities niet laden')
          return
        }

        const data = await res.json()

        setMagazine({
          name: data.magazine.name,
          slug: data.magazine.slug,
          tagline: data.magazine.tagline,
          coverUrl: data.magazine.coverUrl,
        })

        // Enrich editions with reading progress from localStorage
        const mappedEditions: LibraryMagazineGridEdition[] = (
          data.editions || []
        ).map((edition: any) => {
          // Check localStorage for progress
          let progress: number | undefined
          try {
            const key = `library-progress-${magazineSlug}-${edition.index}`
            const stored = localStorage.getItem(key)
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed.totalPages > 0) {
                progress = Math.round(
                  (parsed.currentPage / parsed.totalPages) * 100,
                )
              }
            }
          } catch {
            // Ignore localStorage errors
          }

          return {
            editionIndex: edition.index,
            title: edition.title,
            issueNumber: edition.issueNumber,
            year: edition.year,
            coverUrl: edition.coverUrl,
            pageCount: edition.pageCount,
            publishDate: edition.publishDate,
            isAvailable: edition.isAvailable,
            progress,
          }
        })

        setEditions(mappedEditions)
      } catch (err) {
        console.error('Fout bij laden edities:', err)
        setError('Er is een fout opgetreden')
      } finally {
        setDataLoading(false)
      }
    }

    fetchEditions()
  }, [user, magazineSlug])

  if (authLoading || !user) {
    return <AccountLoadingSkeleton variant="page" />
  }

  if (dataLoading) {
    return <AccountLoadingSkeleton variant="page" />
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <p className="text-grey-mid">{error}</p>
      </div>
    )
  }

  if (!magazine) {
    return <NoSubscriptionUpsell />
  }

  return (
    <LibraryMagazineGrid
      magazine={magazine}
      editions={editions}
    />
  )
}
