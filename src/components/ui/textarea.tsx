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
        'border-gray-200 shadow-sm',
        'text-gray-900 placeholder:text-gray-400 placeholder:font-normal',
        'resize-y', // Allow vertical resize only

        // Transitions - smooth and professional
        'transition-all duration-200 ease-out',

        // Focus state - gradient accent with glow
        'focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20',
        'focus:bg-white focus:shadow-md',

        // Hover state
        'hover:border-gray-300 hover:bg-white/80',

        // Invalid state
        'aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20',
        'aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20',

        // Disabled state
        'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:resize-none',

        // Selection styles
        'selection:bg-blue-500 selection:text-white',

        // Responsive
        'md:text-sm',

        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
