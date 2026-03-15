import * as React from 'react'

import { cn } from '@/utilities/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles - modern look with better spacing
        'flex w-full min-h-[120px] rounded-lg border-2 px-4 py-3 text-base font-medium',
        'bg-white/50 backdrop-blur-sm',
        'border-grey-light shadow-sm',
        'text-navy placeholder:text-grey-mid placeholder:font-normal',
        'resize-y', // Allow vertical resize only

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
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:resize-none',

        // Selection styles
        'selection:bg-teal selection:text-white',

        // Responsive
        'md:text-sm',

        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
