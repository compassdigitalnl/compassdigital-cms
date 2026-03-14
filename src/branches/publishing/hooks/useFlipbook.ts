'use client'

/**
 * useFlipbook Hook
 *
 * Manages flipbook state: current page, page URL loading, preloading, and progress saving.
 * Preloads the current page + next 2 pages for smooth reading.
 * Auto-saves reading progress to localStorage every 10 seconds.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseFlipbookOptions {
  magazineSlug: string
  editionIndex: number
  pageCount: number
  initialPage?: number
}

interface UseFlipbookReturn {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageUrls: Record<number, string>
  loadingPages: Set<number>
}

const PROGRESS_KEY_PREFIX = 'library-progress-'
const SAVE_INTERVAL = 10_000 // 10 seconds

function getProgressKey(magazineSlug: string, editionIndex: number): string {
  return `${PROGRESS_KEY_PREFIX}${magazineSlug}-${editionIndex}`
}

function buildPageUrl(magazineSlug: string, editionIndex: number, pageNum: number): string {
  return `/api/library/page-image?magazine=${encodeURIComponent(magazineSlug)}&edition=${editionIndex}&page=${pageNum}`
}

export function useFlipbook({
  magazineSlug,
  editionIndex,
  pageCount,
  initialPage = 0,
}: UseFlipbookOptions): UseFlipbookReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageUrls, setPageUrls] = useState<Record<number, string>>({})
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set())

  const currentPageRef = useRef(currentPage)
  const pageUrlsRef = useRef(pageUrls)
  const loadingPagesRef = useRef(new Set<number>())

  // Keep refs in sync
  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

  useEffect(() => {
    pageUrlsRef.current = pageUrls
  }, [pageUrls])

  /**
   * Preload a single page image by creating an Image object to trigger browser caching,
   * then store the URL in state.
   */
  const preloadPage = useCallback(
    (pageIndex: number) => {
      // Bounds check
      if (pageIndex < 0 || pageIndex >= pageCount) return
      // Already loaded or loading
      if (pageUrlsRef.current[pageIndex] || loadingPagesRef.current.has(pageIndex)) return

      const url = buildPageUrl(magazineSlug, editionIndex, pageIndex)

      loadingPagesRef.current.add(pageIndex)
      setLoadingPages(new Set(loadingPagesRef.current))

      const img = new Image()
      img.onload = () => {
        loadingPagesRef.current.delete(pageIndex)
        setLoadingPages(new Set(loadingPagesRef.current))
        setPageUrls((prev) => ({ ...prev, [pageIndex]: url }))
      }
      img.onerror = () => {
        loadingPagesRef.current.delete(pageIndex)
        setLoadingPages(new Set(loadingPagesRef.current))
        // Still store the URL so the component can show a broken image or retry
        setPageUrls((prev) => ({ ...prev, [pageIndex]: url }))
      }
      img.src = url
    },
    [magazineSlug, editionIndex, pageCount],
  )

  /**
   * Preload current page + next 2 pages + previous 1 page
   */
  useEffect(() => {
    const pagesToPreload = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ]
    pagesToPreload.forEach(preloadPage)
  }, [currentPage, preloadPage])

  /**
   * Auto-save reading progress to localStorage every SAVE_INTERVAL ms
   */
  useEffect(() => {
    const key = getProgressKey(magazineSlug, editionIndex)

    // Save immediately on mount if we have an initial page
    const saveProgress = () => {
      try {
        const data = {
          currentPage: currentPageRef.current,
          totalPages: pageCount,
          lastRead: new Date().toISOString(),
        }
        localStorage.setItem(key, JSON.stringify(data))
      } catch {
        // localStorage may be full or unavailable
      }
    }

    // Save on initial load if resuming
    if (initialPage > 0) {
      saveProgress()
    }

    const interval = setInterval(saveProgress, SAVE_INTERVAL)

    // Also save when unmounting
    return () => {
      clearInterval(interval)
      saveProgress()
    }
  }, [magazineSlug, editionIndex, pageCount, initialPage])

  /**
   * Save progress on page change (debounced by auto-save interval above,
   * but also save to update "recently read" in library)
   */
  useEffect(() => {
    try {
      const key = getProgressKey(magazineSlug, editionIndex)
      const data = {
        currentPage,
        totalPages: pageCount,
        lastRead: new Date().toISOString(),
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // Ignore
    }
  }, [currentPage, magazineSlug, editionIndex, pageCount])

  return {
    currentPage,
    setCurrentPage,
    pageUrls,
    loadingPages,
  }
}
