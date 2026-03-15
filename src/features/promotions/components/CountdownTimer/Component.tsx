'use client'

import { useState, useEffect } from 'react'
import type { CountdownTimerProps } from './types'

interface TimeLeft {
  dagen: number
  uren: number
  minuten: number
  seconden: number
}

function calculateTimeLeft(endDate: string): TimeLeft | null {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null

  return {
    dagen: Math.floor(diff / (1000 * 60 * 60 * 24)),
    uren: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minuten: Math.floor((diff / (1000 * 60)) % 60),
    seconden: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer({ endDate, label, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(endDate)
      setTimeLeft(tl)
      if (!tl) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (!timeLeft) {
    return (
      <div className={`inline-flex items-center gap-1 text-sm font-medium text-coral ${className}`}>
        Verlopen
      </div>
    )
  }

  const units = Object.entries(timeLeft) as [string, number][]

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {label && <span className="text-sm font-medium mr-1">{label}</span>}
      <div className="flex items-center gap-1">
        {units.map(([unit, value], index) => (
          <div key={unit} className="flex items-center">
            {index > 0 && <span className="text-lg font-bold mx-0.5">:</span>}
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums min-w-[2ch] text-center">
                {String(value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-grey-mid uppercase tracking-wide">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
