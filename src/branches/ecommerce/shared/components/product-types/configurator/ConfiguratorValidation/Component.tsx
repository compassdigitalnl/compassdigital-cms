'use client'

import React from 'react'
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react'
import type { ConfiguratorValidationProps } from './types'

/**
 * PC06: ConfiguratorValidation
 *
 * Required field warnings and validation messages
 * Features:
 * - Required field warnings
 * - "Complete stap X eerst" messages
 * - Blocking vs non-blocking errors
 * - Info, warning, error states
 * - Dismissible option
 */

export const ConfiguratorValidation: React.FC<ConfiguratorValidationProps> = ({
  step,
  selection,
  error,
  className = '',
}) => {
  // Determine validation state
  const isRequired = step.required
  const hasSelection = selection !== null
  const hasError = error !== null

  // Don't show anything if step is complete and valid
  if (!isRequired && hasSelection && !hasError) {
    return null
  }

  // Show error if present
  if (hasError) {
    return (
      <div
        className={`
          configurator-validation
          p-4 rounded-lg border-l-4 border-red-500 bg-red-50
          ${className}
        `}
      >
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-red-900 mb-1">Fout</p>
            <p className="text-[13px] text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show required warning if no selection
  if (isRequired && !hasSelection) {
    return (
      <div
        className={`
          configurator-validation
          p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50
          ${className}
        `}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-yellow-900 mb-1">Verplichte stap</p>
            <p className="text-[13px] text-yellow-800">
              Selecteer een optie om verder te gaan naar de volgende stap.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show info if optional and no selection
  if (!isRequired && !hasSelection) {
    return (
      <div
        className={`
          configurator-validation
          p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50
          ${className}
        `}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-blue-900 mb-1">Optionele stap</p>
            <p className="text-[13px] text-blue-800">
              Deze stap is optioneel. Je kunt verdergaan zonder een selectie te maken.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
