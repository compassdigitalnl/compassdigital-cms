'use client'

import React from 'react'
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { BookingAvailabilityStatusProps } from './types'

export const BookingAvailabilityStatus: React.FC<BookingAvailabilityStatusProps> = ({
  status,
  spotsLeft,
  totalSpots,
  message,
  showIcon = true,
  variant = 'inline',
  className = '',
}) => {
  const statusConfig = {
    available: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      defaultMessage: 'Beschikbaar',
    },
    limited: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      defaultMessage: spotsLeft
        ? `Nog ${spotsLeft} ${spotsLeft === 1 ? 'plek' : 'plekken'} beschikbaar`
        : 'Beperkte beschikbaarheid',
    },
    full: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      defaultMessage: 'Volgeboekt',
    },
    unavailable: {
      icon: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      defaultMessage: 'Niet beschikbaar',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const displayMessage = message || config.defaultMessage

  const variantClasses = {
    inline: 'inline-flex items-center gap-1.5',
    badge: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.borderColor} ${config.bgColor}`,
    banner: `flex items-center gap-2 p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`,
  }

  return (
    <div className={`booking-availability-status ${variantClasses[variant]} ${className}`}>
      {showIcon && <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />}
      <span className={`text-sm font-semibold ${config.color}`}>
        {displayMessage}
      </span>
      {totalSpots && spotsLeft !== undefined && variant === 'banner' && (
        <span className="ml-auto text-xs text-gray-500 font-mono">
          {spotsLeft}/{totalSpots}
        </span>
      )}
    </div>
  )
}

export default BookingAvailabilityStatus
