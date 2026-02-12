'use client'

/**
 * AI-Enhanced Text Field Component
 * Can be used as a custom field component in Payload collections
 *
 * Usage in collection:
 * {
 *   name: 'title',
 *   type: 'text',
 *   admin: {
 *     components: {
 *       Field: AITextField
 *     }
 *   }
 * }
 */

import React from 'react'
import { useField } from '@payloadcms/ui'
import { AIContentGenerator } from '@/components/AI'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface AITextFieldProps {
  path: string
  label?: string
  required?: boolean
  placeholder?: string
  readOnly?: boolean
  admin?: {
    description?: string
    condition?: any
    className?: string
  }
}

export const AITextField: React.FC<AITextFieldProps> = ({
  path,
  label,
  required = false,
  placeholder = '',
  readOnly = false,
  admin,
}) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <Label htmlFor={path}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {!readOnly && (
          <AIContentGenerator
            fieldName={path}
            fieldLabel={label || path}
            value={value}
            onAccept={setValue}
            promptPlaceholder={`Genereer tekst voor ${label || path}...`}
            variant="secondary"
            size="sm"
            buttonText="AI"
          />
        )}
      </div>

      <Input
        id={path}
        type="text"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly}
        required={required}
        className={admin?.className}
      />

      {admin?.description && (
        <p className="text-xs text-muted-foreground">{admin.description}</p>
      )}
    </div>
  )
}
