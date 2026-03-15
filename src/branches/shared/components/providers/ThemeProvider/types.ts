import type React from 'react'
import type { Theme1 } from '@/payload-types'

export type ThemeProviderProps = {
  theme: Theme1 | null
  children: React.ReactNode
}
