'use client'

/**
 * AI-Enhanced Textarea Field Component
 * Can be used as a custom field component in Payload collections
 *
 * Usage in collection:
 * {
 *   name: 'excerpt',
 *   type: 'textarea',
 *   admin: {
 *     components: {
 *       Field: AITextareaField
 *     }
 *   }
 * }
 */

import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import { AIContentGenerator, AIImproveButton } from '@/branches/shared/components/features/ai/AI'
import { Label } from '@/branches/shared/components/ui/label'
import { Textarea } from '@/branches/shared/components/ui/textarea'

interface AITextareaFieldProps {
  path: string
  label?: string
  required?: boolean
  placeholder?: string
  readOnly?: boolean
  rows?: number
  maxLength?: number
  admin?: {
    description?: string
    condition?: any
    className?: string
  }
}

export const AITextareaField: React.FC<AITextareaFieldProps> = ({
  path,
  label,
  required = false,
  placeholder = '',
  readOnly = false,
  rows = 4,
  maxLength,
  admin,
}) => {
  const { value, setValue } = useField<string>({ path })

  // Get all form fields for context
  const formFields = useFormFields(([fields]) => fields)

  // Extract relevant context (title, content, etc.)
  const context = React.useMemo(() => {
    const ctx: Record<string, any> = {}
    if (formFields.title?.value) ctx.title = formFields.title.value
    if (formFields.content?.value) ctx.content = formFields.content.value
    if (formFields.heading?.value) ctx.heading = formFields.heading.value
    return ctx
  }, [formFields])

  const charCount = (value || '').length

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
          <div className="flex gap-2">
            <AIContentGenerator
              fieldName={path}
              fieldLabel={label || path}
              value={value}
              onAccept={setValue}
              promptPlaceholder={`Genereer tekst voor ${label || path}...`}
              context={context}
              variant="secondary"
              size="sm"
              buttonText="AI Genereren"
            />
            {value && (
              <AIImproveButton
                currentContent={value}
                onImprove={setValue}
                improvementType="clarity"
                variant="ghost"
                size="sm"
              />
            )}
          </div>
        )}
      </div>

      <Textarea
        id={path}
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={admin?.className}
      />

      <div className="flex items-center justify-between">
        {admin?.description && (
          <p className="text-xs text-muted-foreground">{admin.description}</p>
        )}
        {maxLength && (
          <p className="text-xs text-muted-foreground">
            {charCount}/{maxLength} tekens
          </p>
        )}
      </div>
    </div>
  )
}
