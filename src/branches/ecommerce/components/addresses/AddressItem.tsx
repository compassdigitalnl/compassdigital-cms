'use client'

import React from 'react'
import { MapPin } from 'lucide-react'

interface AddressItemProps {
  address: any
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export const AddressItem: React.FC<AddressItemProps> = ({
  address,
  isSelected,
  onClick,
  className,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'border-teal-700 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">{address?.name || 'Adres'}</div>
          {address?.street && (
            <div className="text-sm text-gray-600">
              {address.street} {address.houseNumber}
            </div>
          )}
          {address?.postalCode && address?.city && (
            <div className="text-sm text-gray-600">
              {address.postalCode} {address.city}
            </div>
          )}
        </div>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
