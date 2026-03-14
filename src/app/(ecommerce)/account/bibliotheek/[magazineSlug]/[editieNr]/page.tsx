'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { FlipbookViewer } from '@/branches/publishing/components/library/FlipbookViewer'
import { Loader2 } from 'lucide-react'

interface EditionInfo {
  title: string
  pageCount: number
  magazineName: string
}

export default function FlipbookViewerPage() {
  const params = useParams()
  const magazineSlug = params?.magazineSlug as string
  const editieNr = params?.editieNr as string
  const editionIndex = parseInt(editieNr, 10)

  const { user, isLoading: authLoading } = useAccountAuth()
  const [edition, setEdition] = useState<EditionInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [initialPage, setInitialPage] = useState(0)

  useEffect(() => {
    if (!user || !magazineSlug || isNaN(editionIndex)) return

    const fetchEdition = async () => {
      try {
        const res = await fetch(
          `/api/library/${encodeURIComponent(magazineSlug)}/editions`,
          { credentials: 'include' },
        )

        if (!res.ok) {
          if (res.status === 401) return
          setError('Kon editie niet laden')
          return
        }

        const data = await res.json()
        const editions = data.editions || []

        // Find the edition by index
        const found = editions.find((e: any) => e.index === editionIndex)

        if (!found) {
          setError('Editie niet gevonden')
          return
        }

        if (!found.isAvailable) {
          setError('Deze editie is nog niet beschikbaar')
          return
        }

        setEdition({
          title: found.title,
          pageCount: found.pageCount || 0,
          magazineName: data.magazine.name,
        })

        // Restore reading progress from localStorage
        try {
          const key = `library-progress-${magazineSlug}-${editionIndex}`
          const stored = localStorage.getItem(key)
          if (stored) {
            const parsed = JSON.parse(stored)
            if (parsed.currentPage && parsed.currentPage > 0) {
              // useFlipbook uses 0-based page index
              setInitialPage(parsed.currentPage - 1)
            }
          }
        } catch {
          // Ignore localStorage errors
        }
      } catch (err) {
        console.error('Fout bij laden editie:', err)
        setError('Er is een fout opgetreden')
      } finally {
        setDataLoading(false)
      }
    }

    fetchEdition()
  }, [user, magazineSlug, editionIndex])

  // Show loading state covering the full viewport
  if (authLoading || dataLoading || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Magazine laden...</p>
        </div>
      </div>
    )
  }

  // Show error state covering the full viewport
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{error}</p>
          <a
            href={`/account/bibliotheek/${magazineSlug}`}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Terug naar edities
          </a>
        </div>
      </div>
    )
  }

  if (!edition) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <p className="text-white">Editie niet gevonden</p>
      </div>
    )
  }

  // Render the FlipbookViewer in a fixed overlay that covers the entire screen
  // This effectively hides the account sidebar and creates the fullscreen experience
  return (
    <div className="fixed inset-0 z-50">
      <FlipbookViewer
        magazineSlug={magazineSlug}
        editionIndex={editionIndex}
        editionTitle={edition.title}
        magazineName={edition.magazineName}
        pageCount={edition.pageCount}
        initialPage={initialPage}
      />
    </div>
  )
}
