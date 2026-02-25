'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const percentToValue = (percent: number): number => {
    return Math.round((percent / 100) * (max - min) + min)
  }

  const valueToPercent = (val: number): number => {
    return ((val - min) / (max - min)) * 100
  }

  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(thumb)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = percentToValue(percent)

    if (isDragging === 'min' && newValue < localValue[1] - step) {
      setLocalValue([newValue, localValue[1]])
    } else if (isDragging === 'max' && newValue > localValue[0] + step) {
      setLocalValue([localValue[0], newValue])
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      onChange(localValue)
      setIsDragging(null)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, localValue])

  const minPercent = valueToPercent(localValue[0])
  const maxPercent = valueToPercent(localValue[1])

  const formatPrice = (val: number): string => {
    return `${currency} ${val.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="price-range-slider">
      {/* Price Inputs Display */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={formatPrice(localValue[0])}
          readOnly
          className="flex-1 px-2.5 py-2 border-[1.5px] border-theme-border rounded-lg text-[13px] text-center text-theme-navy font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-theme-teal/20 focus:border-theme-teal"
          aria-label="Minimum prijs"
        />
        <span className="text-[13px] text-theme-grey-mid">—</span>
        <input
          type="text"
          value={formatPrice(localValue[1])}
          readOnly
          className="flex-1 px-2.5 py-2 border-[1.5px] border-theme-border rounded-lg text-[13px] text-center text-theme-navy font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-theme-teal/20 focus:border-theme-teal"
          aria-label="Maximum prijs"
        />
      </div>

      {/* Slider Track */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-theme-grey-light rounded-full mb-4 cursor-pointer"
        role="presentation"
      >
        {/* Active Fill */}
        <div
          className="absolute h-full bg-theme-teal rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min Thumb */}
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-white border-[2.5px] border-theme-teal rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 hover:shadow-lg hover:shadow-theme-teal/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-teal/30 focus:ring-offset-2"
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
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-white border-[2.5px] border-theme-teal rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 hover:shadow-lg hover:shadow-theme-teal/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-teal/30 focus:ring-offset-2"
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
        className="w-full px-4 py-2.5 border-[1.5px] border-theme-border bg-white rounded-lg text-[13px] font-semibold text-theme-navy hover:bg-theme-teal hover:border-theme-teal hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-teal/30 focus:ring-offset-2"
      >
        Toepassen
      </button>
    </div>
  )
}
