'use client'

import { useState, useEffect } from 'react'
import { CountdownTimer } from '@/features/promotions/components/CountdownTimer'
import type { PromotionBannerProps } from './types'

interface ActivePromotion {
  title: string
  bannerText?: string
  bannerColor?: string
  endDate?: string
}

export function PromotionBanner({
  text,
  color,
  endDate,
  showCountdown = false,
  className = '',
}: PromotionBannerProps) {
  const [promotions, setPromotions] = useState<ActivePromotion[]>([])
  const [loaded, setLoaded] = useState(false)

  // Als geen text prop, haal promoties op van de API
  useEffect(() => {
    if (text) {
      setLoaded(true)
      return
    }

    async function fetchPromotions() {
      try {
        const res = await fetch('/api/promotions/active')
        if (res.ok) {
          const data = await res.json()
          setPromotions(data.promotions ?? [])
        }
      } catch (err) {
        console.error('Fout bij ophalen promoties:', err)
      } finally {
        setLoaded(true)
      }
    }

    fetchPromotions()
  }, [text])

  // Render met props
  if (text) {
    const bgColor = color || '#EF4444'

    return (
      <div
        className={`w-full py-2 px-4 text-center text-white text-sm font-medium ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center justify-center gap-3">
          <span>{text}</span>
          {showCountdown && endDate && (
            <CountdownTimer endDate={endDate} className="text-white" />
          )}
        </div>
      </div>
    )
  }

  // Render met API data
  if (!loaded || promotions.length === 0) return null

  return (
    <div className={`flex flex-col ${className}`}>
      {promotions.map((promo, index) => {
        const bgColor = promo.bannerColor || '#EF4444'
        const displayText = promo.bannerText || promo.title

        return (
          <div
            key={index}
            className="w-full py-2 px-4 text-center text-white text-sm font-medium"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex items-center justify-center gap-3">
              <span>{displayText}</span>
              {promo.endDate && (
                <CountdownTimer endDate={promo.endDate} className="text-white" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
