'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { FlipbookToolbar } from '../FlipbookToolbar/Component'
import { FlipbookTableOfContents } from '../FlipbookTableOfContents/Component'
import { useFlipbook } from '@/branches/publishing/hooks/useFlipbook'
import type { FlipbookViewerProps } from './types'

// Dynamically import HTMLFlipBook so it only loads on the client
const HTMLFlipBook = dynamic(() => import('react-pageflip').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary,#7c3aed)]" />
    </div>
  ),
}) as any

/**
 * FlipbookPage: a forwardRef wrapper for each page in the flipbook.
 * react-pageflip requires each direct child to be a forwardRef component.
 */
const FlipbookPage = React.forwardRef<
  HTMLDivElement,
  { pageNum: number; src: string | null; isLoading: boolean }
>((props, ref) => {
  const { pageNum, src, isLoading } = props

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full items-center justify-center bg-white"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {isLoading || !src ? (
        /* Skeleton/shimmer loading state */
        <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--color-base-100,#f8fafc)]">
          <div className="mb-2 h-3/4 w-4/5 animate-pulse rounded bg-[var(--color-base-200,#e2e8f0)]" />
          <span className="text-[11px] text-[var(--color-base-400,#94a3b8)]">
            Pagina {pageNum} laden...
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={`Pagina ${pageNum}`}
          className="h-full w-full object-contain"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        />
      )}

      {/* Page number watermark */}
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[var(--color-base-300,#cbd5e1)]">
        {pageNum}
      </span>
    </div>
  )
})
FlipbookPage.displayName = 'FlipbookPage'

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  magazineSlug,
  editionIndex,
  editionTitle,
  magazineName,
  pageCount,
  initialPage = 0,
}) => {
  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTOCOpen, setIsTOCOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 550, height: 733 })

  const {
    currentPage,
    setCurrentPage,
    pageUrls,
    loadingPages,
  } = useFlipbook({
    magazineSlug,
    editionIndex,
    pageCount,
    initialPage,
  })

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate flipbook dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return
      const container = containerRef.current
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight || window.innerHeight * 0.75

      if (isMobile) {
        // Single page mode: use full width
        const pageWidth = Math.min(containerWidth - 16, 500)
        const pageHeight = Math.round(pageWidth * (4 / 3))
        setDimensions({ width: pageWidth, height: Math.min(pageHeight, containerHeight - 60) })
      } else {
        // Double page: each page is half the container width
        const maxWidth = Math.min(containerWidth - 32, 1100)
        const pageWidth = Math.round(maxWidth / 2)
        const pageHeight = Math.round(pageWidth * (4 / 3))
        setDimensions({ width: pageWidth, height: Math.min(pageHeight, containerHeight - 60) })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [isMobile])

  // Handle page flip event
  const handleFlip = useCallback(
    (e: any) => {
      const newPage = e.data
      setCurrentPage(newPage)
    },
    [setCurrentPage],
  )

  // Navigate to specific page
  const goToPage = useCallback(
    (page: number) => {
      if (flipBookRef.current) {
        const pageFlip = flipBookRef.current.pageFlip()
        if (pageFlip) {
          pageFlip.flip(page)
        }
      }
    },
    [],
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flipBookRef.current) return
      const pageFlip = flipBookRef.current.pageFlip()
      if (!pageFlip) return

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          pageFlip.flipNext()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          pageFlip.flipPrev()
          break
        case 'Home':
          e.preventDefault()
          pageFlip.flip(0)
          break
        case 'End':
          e.preventDefault()
          pageFlip.flip(pageCount - 1)
          break
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen()
          }
          if (isTOCOpen) {
            setIsTOCOpen(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, isTOCOpen, pageCount])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        // Fullscreen not supported, ignore
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(() => {
        // Ignore
      })
    }
  }, [])

  // Listen for fullscreen change (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Build pages array
  const pages = useMemo(() => {
    return Array.from({ length: pageCount }, (_, i) => ({
      pageNum: i + 1,
      src: pageUrls[i] || null,
      isLoading: loadingPages.has(i),
    }))
  }, [pageCount, pageUrls, loadingPages])

  return (
    <div
      ref={containerRef}
      className={`
        relative flex flex-col
        ${isFullscreen ? 'h-screen bg-[var(--color-base-900,#0f172a)]' : 'min-h-[500px]'}
      `}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Table of Contents sidebar */}
      <FlipbookTableOfContents
        entries={[]} // TOC entries would come from the edition data
        onGoToPage={goToPage}
        currentPage={currentPage}
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        totalPages={pageCount}
      />

      {/* Flipbook area */}
      <div
        className={`
          flex flex-1 items-center justify-center
          ${isFullscreen ? 'bg-[var(--color-base-900,#0f172a)]' : 'bg-[var(--color-base-100,#f8fafc)]'}
          ${isTOCOpen ? 'ml-0 md:ml-64' : ''}
          transition-[margin] duration-300
        `}
      >
        {pageCount > 0 && (
          <HTMLFlipBook
            ref={flipBookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={280}
            maxWidth={600}
            minHeight={373}
            maxHeight={800}
            showCover={true}
            maxShadowOpacity={0.5}
            drawShadow={true}
            usePortrait={isMobile}
            mobileScrollSupport={false}
            onFlip={handleFlip}
            startPage={initialPage}
            flippingTime={600}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            clickEventForward={false}
            autoSize={true}
            startZIndex={0}
            disableFlipByClick={false}
            className="flipbook-viewer"
            style={{}}
            renderOnlyPageLengthChange={false}
          >
            {pages.map((page) => (
              <FlipbookPage
                key={page.pageNum}
                pageNum={page.pageNum}
                src={page.src}
                isLoading={page.isLoading}
              />
            ))}
          </HTMLFlipBook>
        )}
      </div>

      {/* Toolbar */}
      <FlipbookToolbar
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={goToPage}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onToggleTOC={() => setIsTOCOpen((prev) => !prev)}
        magazineName={magazineName}
        editionTitle={editionTitle}
      />
    </div>
  )
}
