'use client'

/**
 * useLibrary Hook
 *
 * Provides library data fetching and reading progress management.
 * - useLibraryMagazines(): fetches available magazines from API
 * - useRecentlyRead(): reads recently read editions from localStorage
 * - saveReadingProgress(): saves progress for a specific edition
 */

import { useState, useEffect, useCallback } from 'react'

// === Types ===

interface LibraryMagazine {
  id: string
  name: string
  slug: string
  coverUrl?: string
  tagline?: string
  totalEditions: number
  digitalEditions: number
}

interface RecentlyReadEntry {
  magazineSlug: string
  magazineName: string
  editionIndex: number
  editionTitle: string
  coverUrl?: string
  currentPage: number
  totalPages: number
  lastRead: string
}

interface ReadingProgress {
  currentPage: number
  totalPages: number
  lastRead: string
}

// === Constants ===

const PROGRESS_KEY_PREFIX = 'library-progress-'
const RECENTLY_READ_KEY = 'library-recently-read'
const MAX_RECENTLY_READ = 10

// === useLibraryMagazines ===

interface UseLibraryMagazinesReturn {
  magazines: LibraryMagazine[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useLibraryMagazines(): UseLibraryMagazinesReturn {
  const [magazines, setMagazines] = useState<LibraryMagazine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMagazines = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/library/magazines', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Kon tijdschriften niet laden')
      }

      const data = await response.json()
      setMagazines(data.magazines || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
      setMagazines([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMagazines()
  }, [fetchMagazines])

  return { magazines, isLoading, error, refetch: fetchMagazines }
}

// === useRecentlyRead ===

interface UseRecentlyReadReturn {
  recentlyRead: RecentlyReadEntry[]
  isLoading: boolean
}

export function useRecentlyRead(): UseRecentlyReadReturn {
  const [recentlyRead, setRecentlyRead] = useState<RecentlyReadEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_READ_KEY)
      if (stored) {
        const parsed: RecentlyReadEntry[] = JSON.parse(stored)
        // Sort by most recently read
        const sorted = parsed
          .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())
          .slice(0, MAX_RECENTLY_READ)
        setRecentlyRead(sorted)
      }
    } catch {
      // localStorage may be unavailable or data corrupted
      setRecentlyRead([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { recentlyRead, isLoading }
}

// === saveReadingProgress ===

interface SaveProgressOptions {
  magazineSlug: string
  magazineName: string
  editionIndex: number
  editionTitle: string
  coverUrl?: string
  currentPage: number
  totalPages: number
}

export function saveReadingProgress({
  magazineSlug,
  magazineName,
  editionIndex,
  editionTitle,
  coverUrl,
  currentPage,
  totalPages,
}: SaveProgressOptions): void {
  try {
    const now = new Date().toISOString()

    // 1. Save individual edition progress
    const progressKey = `${PROGRESS_KEY_PREFIX}${magazineSlug}-${editionIndex}`
    const progress: ReadingProgress = {
      currentPage,
      totalPages,
      lastRead: now,
    }
    localStorage.setItem(progressKey, JSON.stringify(progress))

    // 2. Update "recently read" list
    let recentlyRead: RecentlyReadEntry[] = []
    try {
      const stored = localStorage.getItem(RECENTLY_READ_KEY)
      if (stored) {
        recentlyRead = JSON.parse(stored)
      }
    } catch {
      recentlyRead = []
    }

    // Remove existing entry for this edition (if any)
    recentlyRead = recentlyRead.filter(
      (entry) =>
        !(entry.magazineSlug === magazineSlug && entry.editionIndex === editionIndex),
    )

    // Add new entry at the start
    const newEntry: RecentlyReadEntry = {
      magazineSlug,
      magazineName,
      editionIndex,
      editionTitle,
      coverUrl,
      currentPage,
      totalPages,
      lastRead: now,
    }
    recentlyRead.unshift(newEntry)

    // Trim to max size
    recentlyRead = recentlyRead.slice(0, MAX_RECENTLY_READ)

    localStorage.setItem(RECENTLY_READ_KEY, JSON.stringify(recentlyRead))
  } catch {
    // localStorage may be full or unavailable
  }
}

// === getReadingProgress ===

export function getReadingProgress(
  magazineSlug: string,
  editionIndex: number,
): ReadingProgress | null {
  try {
    const key = `${PROGRESS_KEY_PREFIX}${magazineSlug}-${editionIndex}`
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore
  }
  return null
}
