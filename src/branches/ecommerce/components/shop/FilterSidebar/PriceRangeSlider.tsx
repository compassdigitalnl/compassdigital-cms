'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { PriceRangeSliderProps } from './types'

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  onApply,
  currency = '€',
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'min' | 'max' | null>(null)
  const localValueRef = useRef<[number, number]>(localValue)
  const { displayPrice } = usePriceMode()

  // Keep ref in sync with state
  useEffect(() => {
    localValueRef.current = localValue
  }, [localValue])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const percentToValue = (percent: number): number => {
    const raw = (percent / 100) * (max - min) + min
    return Math.round(raw / step) * step
  }

  const valueToPercent = (val: number): number => {
    if (max === min) return 0
    return ((val - min) / (max - min)) * 100
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingRef.current || !trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = percentToValue(percent)
    const current = localValueRef.current

    if (draggingRef.current === 'min' && newValue < current[1] - step) {
      const next: [number, number] = [newValue, current[1]]
      setLocalValue(next)
      localValueRef.current = next
    } else if (draggingRef.current === 'max' && newValue > current[0] + step) {
      const next: [number, number] = [current[0], newValue]
      setLocalValue(next)
      localValueRef.current = next
    }
  }, [min, max, step])

  const handleMouseUp = useCallback(() => {
    if (draggingRef.current) {
      onChange(localValueRef.current)
      draggingRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onChange, handleMouseMove])

  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = thumb
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const minPercent = valueToPercent(localValue[0])
  const maxPercent = valueToPercent(localValue[1])

  const formatPrice = (val: number): string => {
    const adjusted = displayPrice(val) ?? val
    return `${currency} ${adjusted.toFixed(2).replace('.', ',')}`
  }

  // Parse user input back to number
  const parseInput = (input: string): number | null => {
    const cleaned = input.replace(currency, '').replace(',', '.').trim()
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : num
  }

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInput(e.target.value)
    if (num !== null && num >= min && num < localValue[1]) {
      const snapped = Math.round(num / step) * step
      setLocalValue([snapped, localValue[1]])
    }
  }

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInput(e.target.value)
    if (num !== null && num <= max && num > localValue[0]) {
      const snapped = Math.round(num / step) * step
      setLocalValue([localValue[0], snapped])
    }
  }

  const handleInputBlur = () => {
    onChange(localValue)
  }

  return (
    <div className="price-range-slider">
      {/* Price Inputs */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          defaultValue={formatPrice(localValue[0])}
          key={`min-${localValue[0]}`}
          onBlur={(e) => { handleMinInput(e as any); handleInputBlur() }}
          className="w-[90px] px-2.5 py-2 border-[1.5px] border-[var(--color-border)] rounded-lg text-[13px] text-center text-[var(--color-text-primary)] font-semibold font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          aria-label="Minimum prijs"
        />
        <span className="text-[13px] text-[var(--color-text-muted)]">—</span>
        <input
          type="text"
          defaultValue={formatPrice(localValue[1])}
          key={`max-${localValue[1]}`}
          onBlur={(e) => { handleMaxInput(e as any); handleInputBlur() }}
          className="w-[90px] px-2.5 py-2 border-[1.5px] border-[var(--color-border)] rounded-lg text-[13px] text-center text-[var(--color-text-primary)] font-semibold font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          aria-label="Maximum prijs"
        />
      </div>

      {/* Slider Track */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-gray-200 rounded-full mb-4 cursor-pointer"
        role="presentation"
      >
        {/* Active Fill */}
        <div
          className="absolute h-full bg-[var(--color-primary)] rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min Thumb */}
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-white border-[2.5px] border-[var(--color-primary)] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-2 z-10"
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMouseDown('min')}
          aria-label="Minimum prijs slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue[0]}
          aria-valuetext={formatPrice(localValue[0])}
          role="slider"
        />

        {/* Max Thumb */}
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-white border-[2.5px] border-[var(--color-primary)] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-2 z-10"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMouseDown('max')}
          aria-label="Maximum prijs slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
          aria-valuetext={formatPrice(localValue[1])}
          role="slider"
        />
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={onApply}
        className="btn btn-outline-primary btn-sm w-full"
      >
        Toepassen
      </button>
    </div>
  )
}
