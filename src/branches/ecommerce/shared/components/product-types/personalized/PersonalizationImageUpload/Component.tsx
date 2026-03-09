'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { PersonalizationImageUploadProps } from '@/branches/ecommerce/shared/lib/product-types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * PP04: PersonalizationImageUpload
 *
 * Drag-drop file upload with image preview & crop
 * Features:
 * - Drag & drop zone
 * - File input fallback
 * - Image preview with thumbnail
 * - File type validation
 * - File size validation
 * - Remove uploaded image
 * - Guidelines display
 */

export const PersonalizationImageUpload: React.FC<PersonalizationImageUploadProps> = ({
  option,
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5 MB default
  acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const { formatPriceStr } = usePriceMode()
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Price modifier display
  const priceText = option.priceModifier
    ? option.priceModifier > 0
      ? ` (+€${formatPriceStr(option.priceModifier)})`
      : ` (€${formatPriceStr(option.priceModifier)})`
    : ''

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Ongeldig bestandstype. Toegestaan: ${acceptedFormats.join(', ')}`
    }

    // Check file size
    if (file.size > maxSize) {
      return `Bestand is te groot. Max: ${formatFileSize(maxSize)}`
    }

    return null
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onChange(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Handle remove
  const handleRemove = () => {
    onChange(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle click to open file input
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`personalization-image-upload ${className}`}>
      {/* Label */}
      <label className="block mb-2">
        <span className="text-[15px] font-bold text-gray-900">
          {option.fieldName}
          {option.required && <span className="text-red-600 ml-1">*</span>}
        </span>
        {priceText && (
          <span className="text-[13px] text-[var(--color-primary)] font-semibold ml-2">{priceText}</span>
        )}
      </label>

      {/* Upload Zone or Preview */}
      {!value || !previewUrl ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
            ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]' : 'border-gray-300 bg-gray-50 hover:border-[var(--color-primary-light)] hover:bg-gray-100'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {/* Upload Icon */}
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" strokeWidth={2} />
            <p className="text-[15px] font-semibold text-gray-700 mb-1">
              Sleep een afbeelding hierheen
            </p>
            <p className="text-[13px] text-gray-500 mb-3">
              of klik om een bestand te selecteren
            </p>
            <div className="text-[11px] text-gray-400">
              <p>Max bestandsgrootte: {formatFileSize(maxSize)}</p>
              <p>Toegestane formaten: JPG, PNG, WEBP</p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative border-2 border-gray-300 rounded-lg p-4 bg-white">
          {/* Preview Image */}
          <div className="relative w-full h-48 mb-3 bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>

          {/* File Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{value.name}</p>
              <p className="text-[12px] text-gray-500">{formatFileSize(value.size)}</p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-danger btn-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              Verwijder
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-[13px] text-red-600 mt-2 font-semibold">{error}</p>
      )}

      {/* Guidelines */}
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-[12px] font-semibold text-blue-900 mb-1 flex items-center gap-1">
          <ImageIcon className="w-4 h-4" />
          Afbeeldingsrichtlijnen:
        </p>
        <ul className="text-[11px] text-blue-800 space-y-0.5 ml-5 list-disc">
          <li>Minimale resolutie: 800×800 pixels</li>
          <li>Gebruik een hoge-kwaliteit afbeelding voor het beste resultaat</li>
          <li>Afbeelding wordt gecentreerd en bijgesneden indien nodig</li>
        </ul>
      </div>

      {/* Helper Text */}
      {!option.required && (
        <p className="text-[12px] text-gray-500 mt-2">Optioneel</p>
      )}
    </div>
  )
}
