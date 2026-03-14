'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { ReadingProgressProps } from './types'

/**
 * ReadingProgress — Sticky reading progress bar at the top of the page
 *
 * Client component that calculates scroll progress as a percentage
 * and renders a thin gradient bar (#7c3aed -> #2563eb) at the top of the viewport.
 * Only visible when the user has scrolled down; hidden at the top.
 *
 * @example
 * ```tsx
 * // Place in article layout, typically right after the header
 * <ReadingProgress />
 * ```
 */
export const ReadingProgress: React.FC<ReadingProgressProps> = ({ className = '' }) => {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight

    if (docHeight <= 0) {
      setProgress(0)
      setVisible(false)
      return
    }

    const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))

    setProgress(scrollPercent)
    setVisible(scrollTop > 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Run once on mount to set initial state
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Leesvoortgang"
    >
      <div
        className="h-[3px] transition-[width] duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(to right, #7c3aed, #2563eb)',
        }}
      />
    </div>
  )
}

export default ReadingProgress
