'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/utilities/cn'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Modern label styling with better hierarchy
        'flex items-center gap-2',
        'text-sm font-semibold text-gray-700',
        'leading-relaxed select-none',
        'mb-1.5', // Space between label and input

        // Disabled state
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',

        className,
      )}
      {...props}
    />
  )
}

export { Label }
