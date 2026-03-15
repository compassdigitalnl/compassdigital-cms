import * as React from 'react'

import { cn } from '@/utilities/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - modern look with better spacing
        'flex h-11 w-full min-w-0 rounded-lg border-2 px-4 py-2.5 text-base font-medium',
        'bg-white/50 backdrop-blur-sm',
        'border-grey-light shadow-sm',
        'text-navy placeholder:text-grey-mid placeholder:font-normal',

        // Transitions - smooth and professional
        'transition-all duration-200 ease-out',

        // Focus state - gradient accent with glow
        'focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/20',
        'focus:bg-white focus:shadow-md',

        // Hover state
        'hover:border-grey-light hover:bg-white/80',

        // Invalid state
        'aria-invalid:border-coral aria-invalid:ring-4 aria-invalid:ring-coral/20',
        'aria-invalid:focus:border-coral aria-invalid:focus:ring-coral/20',

        // Disabled state
        'disabled:bg-grey-light disabled:border-grey-light disabled:text-grey-mid',
        'disabled:cursor-not-allowed disabled:opacity-60',

        // File input styles
        'file:border-0 file:bg-transparent file:text-sm file:font-semibold',
        'file:text-teal file:mr-4 file:py-1 file:px-3',
        'file:rounded-md file:hover:bg-teal-50 file:transition-colors',

        // Selection styles
        'selection:bg-teal selection:text-white',

        // Responsive
        'md:text-sm md:h-10',

        className,
      )}
      {...props}
    />
  )
}

export { Input }
