'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { BeforeAfterSliderProps } from './types'

/**
 * BeforeAfterSlider - Interactive before/after image comparison
 *
 * Drag the handle to reveal before/after images.
 * Used by: construction (project detail), beauty (treatments), real estate.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Voor',
  afterLabel = 'Na',
  beforeAlt = 'Voor',
  afterAlt = 'Na',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    updatePosition(e.clientX)
  }, [isDragging, updatePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    updatePosition(e.touches[0].clientX)
  }, [isDragging, updatePosition])

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] cursor-col-resize select-none overflow-hidden rounded-xl ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      role="slider"
      aria-label="Vergelijk voor en na"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      {/* After image (full width, background) */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt={afterAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image src={beforeImage} alt={beforeAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-lg backdrop-blur-sm">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-navy">
            <path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {afterLabel}
      </div>
    </div>
  )
}

export default BeforeAfterSlider
