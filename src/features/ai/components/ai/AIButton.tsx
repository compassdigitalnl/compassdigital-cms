'use client'

/**
 * AI Button Component
 * Reusable button for triggering AI generation
 */

import React from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface AIButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const AIButton: React.FC<AIButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  children = 'Generate with AI',
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-2 font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white focus:ring-purple-500',
    secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    icon: 'bg-purple-100 hover:bg-purple-200 text-purple-700 focus:ring-purple-500 p-2 rounded-full',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${variant !== 'icon' ? sizeStyles[size] : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={iconSize[size]} className="animate-spin" />
      ) : (
        <Sparkles size={iconSize[size]} />
      )}
      {variant !== 'icon' && <span>{children}</span>}
    </button>
  )
}
