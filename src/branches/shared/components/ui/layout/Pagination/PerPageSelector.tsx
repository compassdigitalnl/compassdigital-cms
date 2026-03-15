'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PerPageSelectorProps {
  itemsPerPage: number
  options: number[]
  totalItems?: number
  onChange: (value: number) => void
  className?: string
}

export function PerPageSelector({
  itemsPerPage,
  options = [12, 24, 48, 96],
  totalItems,
  onChange,
  className,
}: PerPageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (value: number) => {
    onChange(value)
    setIsOpen(false)
  }

  // Filter options that make sense (don't show 96 if only 50 items total)
  const validOptions = totalItems
    ? options.filter((option) => option <= totalItems || option === itemsPerPage)
    : options

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2',
          'text-[13px] font-medium',
          'text-[var(--grey-dark)] hover:text-[var(--text)]',
          'bg-[var(--white)] border border-[var(--grey)]',
          'rounded-lg',
          'transition-all duration-200',
          'hover:border-[var(--teal)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/30 focus:border-[var(--teal)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Toon ${itemsPerPage} items per pagina`}
      >
        <span>
          Toon <strong className="text-[var(--text)]">{itemsPerPage}</strong>
        </span>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 py-1',
            'bg-[var(--white)] border border-[var(--grey)]',
            'rounded-lg shadow-[var(--shadow-md)]',
            'min-w-[140px]',
            'z-[var(--z-dropdown)]',
            'animate-in fade-in slide-in-from-top-2 duration-200',
          )}
          role="listbox"
          aria-label="Items per pagina"
        >
          {validOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full px-4 py-2.5 text-left',
                'text-[13px] font-medium',
                'transition-colors duration-150',
                {
                  'text-[var(--teal)] bg-[var(--teal)]/5': option === itemsPerPage,
                  'text-[var(--grey-dark)] hover:bg-[var(--bg)]': option !== itemsPerPage,
                },
              )}
              role="option"
              aria-selected={option === itemsPerPage}
            >
              {option} items
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
