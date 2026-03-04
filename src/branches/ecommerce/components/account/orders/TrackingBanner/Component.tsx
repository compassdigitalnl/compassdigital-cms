import React from 'react'
import { Truck, ChevronRight } from 'lucide-react'
import type { TrackingBannerProps } from './types'

export function TrackingBanner({ trackingUrl, trackingCode }: TrackingBannerProps) {
  return (
    <a
      href={trackingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm transition-all active:opacity-80 lg:hover:scale-[1.01]"
    >
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50">
          <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm lg:text-base font-bold mb-0.5 lg:mb-1 text-gray-900">
            Track & trace je bestelling
          </div>
          {trackingCode && (
            <div className="text-xs lg:text-sm text-gray-500">
              <span className="hidden lg:inline">Trackingnummer: </span>
              <span className="font-mono text-gray-900">{trackingCode}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 flex-shrink-0" />
      </div>
    </a>
  )
}
