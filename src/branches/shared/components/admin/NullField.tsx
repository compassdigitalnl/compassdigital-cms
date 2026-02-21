'use client'
import React from 'react'

/**
 * NullField Component
 *
 * A no-op field component for Payload CMS admin UI.
 * Used when you want to conditionally hide a field without breaking the form layout.
 *
 * Usage in collection config:
 * {
 *   type: 'ui',
 *   name: 'yourFieldName',
 *   admin: {
 *     components: {
 *       Field: '@/components/admin/NullField#NullField',
 *     },
 *   },
 * }
 */
export const NullField: React.FC = () => null
