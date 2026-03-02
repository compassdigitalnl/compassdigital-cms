'use client'

import React, { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import Image from 'next/image'
import type { PersonalizationLivePreviewProps } from '@/branches/ecommerce/lib/product-types'
import type { Media } from '@/payload-types'

/**
 * PP05: PersonalizationLivePreview
 *
 * Visual product preview with customization updates in real-time
 * Features:
 * - Product image display
 * - Text overlay for personalization
 * - Zoom controls (zoom in/out)
 * - Rotate control (optional)
 * - Updates in real-time as user changes personalization
 * - Responsive layout
 */

export const PersonalizationLivePreview: React.FC<PersonalizationLivePreviewProps> = ({
  product,
  personalization,
  className = '',
}) => {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  // Get product image
  const productImage =
    product.images && product.images.length > 0
      ? typeof product.images[0] === 'object'
        ? (product.images[0] as Media)
        : null
      : null

  const imageUrl = productImage?.url || '/placeholder-product.png'

  // Get personalization values (with type guards)
  const textValue = typeof personalization['Tekst']?.value === 'string' ? personalization['Tekst'].value : ''
  const fontValue = typeof personalization['Lettertype']?.value === 'string' ? personalization['Lettertype'].value : 'Arial'
  const colorValue = typeof personalization['Kleur']?.value === 'string' ? personalization['Kleur'].value : '#000000'

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  // Handle rotate
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className={`personalization-live-preview ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-bold text-gray-900">Live Preview</h3>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom uit"
          >
            <ZoomOut className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Zoom Percentage */}
          <span className="text-[13px] font-mono font-semibold text-gray-700 w-12 text-center">
            {zoom}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={handleRotate}
            className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 rounded-md transition-colors"
            title="Draai 90°"
          >
            <RotateCw className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative w-full h-[400px] border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
        {/* Product Image */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain"
            />

            {/* Text Overlay (Personalization) */}
            {textValue && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="text-center px-4 py-2 bg-white/80 rounded-lg shadow-lg"
                  style={{
                    fontFamily: `${fontValue}, sans-serif`,
                    color: colorValue,
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {textValue}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-[12px] font-semibold text-blue-900 mb-1">
          ℹ️ Preview Notitie:
        </p>
        <p className="text-[11px] text-blue-800">
          Dit is een indicatieve preview. Het eindresultaat kan enigszins afwijken afhankelijk van het product en de personalisatie-methode.
        </p>
      </div>
    </div>
  )
}
