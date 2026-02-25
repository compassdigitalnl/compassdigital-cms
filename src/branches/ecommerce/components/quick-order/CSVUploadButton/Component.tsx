'use client'

import React, { useState, useRef } from 'react'
import { Upload, Loader, CheckCircle, XCircle } from 'lucide-react'
import type { CSVUploadButtonProps, CSVUploadState } from './types'

/**
 * CSVUploadButton Component
 *
 * File upload button for CSV files with loading, success, and error states.
 *
 * @example
 * ```tsx
 * <CSVUploadButton
 *   onFileSelect={async (file) => {
 *     const data = await uploadCSV(file)
 *     console.log('Uploaded:', data)
 *   }}
 * />
 * ```
 */
export function CSVUploadButton({
  label = 'CSV uploaden',
  accept = '.csv,text/csv',
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelect,
  onUploadComplete,
  onUploadError,
  disabled = false,
  className = '',
}: CSVUploadButtonProps) {
  const [state, setState] = useState<CSVUploadState>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setState('error')
      setFeedback(`Bestand te groot. Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
      if (onUploadError) {
        onUploadError(new Error('File too large'))
      }
      return
    }

    // Validate file type
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      setState('error')
      setFeedback('Alleen CSV-bestanden zijn toegestaan')
      if (onUploadError) {
        onUploadError(new Error('Invalid file type'))
      }
      return
    }

    setState('loading')
    setFeedback(null)

    try {
      if (onFileSelect) {
        await onFileSelect(file)
      }

      setState('success')
      setFeedback(`${file.name} succesvol geüpload`)

      // Reset after 3 seconds
      setTimeout(() => {
        setState('idle')
        setFeedback(null)
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      }, 3000)

      if (onUploadComplete) {
        onUploadComplete({ file })
      }
    } catch (error) {
      setState('error')
      setFeedback(error instanceof Error ? error.message : 'Upload mislukt')
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error('Upload failed'))
      }
    }
  }

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader className="csv-spinner" size={18} aria-hidden="true" />
      case 'success':
        return <CheckCircle size={18} aria-hidden="true" />
      case 'error':
        return <XCircle size={18} aria-hidden="true" />
      default:
        return <Upload size={18} aria-hidden="true" />
    }
  }

  const getLabel = () => {
    switch (state) {
      case 'loading':
        return 'Uploaden...'
      case 'success':
        return 'Geüpload!'
      case 'error':
        return 'Opnieuw proberen'
      default:
        return label
    }
  }

  return (
    <div className={`csv-upload-wrapper ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || state === 'loading'}
        className="csv-upload-input"
        aria-label="Upload CSV bestand"
        id="csv-upload-input"
      />
      <label
        htmlFor="csv-upload-input"
        className={`csv-upload-button ${state} ${disabled ? 'disabled' : ''}`}
        aria-disabled={disabled || state === 'loading'}
      >
        {getIcon()}
        {getLabel()}
      </label>

      {feedback && (
        <div className={`csv-upload-feedback ${state}`} role="alert">
          {state === 'success' && <CheckCircle size={16} aria-hidden="true" />}
          {state === 'error' && <XCircle size={16} aria-hidden="true" />}
          {feedback}
        </div>
      )}

      <style jsx>{`
        .csv-upload-wrapper {
          display: inline-block;
          position: relative;
        }

        .csv-upload-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .csv-upload-button {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          padding: var(--space-12) var(--space-20);
          background: white;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: all var(--transition);
          white-space: nowrap;
        }

        .csv-upload-button:hover:not(.disabled):not(.loading) {
          border-color: var(--teal);
          background: rgba(0, 137, 123, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
        }

        .csv-upload-button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .csv-upload-button:active:not(.disabled):not(.loading) {
          transform: translateY(0);
        }

        .csv-upload-button.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .csv-upload-button.success {
          border-color: var(--green);
          background: var(--green-light);
          color: var(--green);
        }

        .csv-upload-button.error {
          border-color: var(--coral);
          background: var(--coral-light);
          color: var(--coral);
        }

        .csv-upload-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .csv-upload-button :global(.csv-spinner) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .csv-upload-feedback {
          margin-top: var(--space-12);
          padding: var(--space-12) var(--space-16);
          border-radius: var(--radius-md);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }

        .csv-upload-feedback.success {
          background: var(--green-light);
          color: #166534;
          border: 1px solid #81C784;
        }

        .csv-upload-feedback.error {
          background: var(--coral-light);
          color: #DC2626;
          border: 1px solid #EF5350;
        }
      `}</style>
    </div>
  )
}
