import type { Page, Product } from '@/payload-types'
import type { ButtonProps } from '@/branches/shared/components/ui/primitives/button'
import type React from 'react'

export type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Product | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  style?: React.CSSProperties
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>
}
