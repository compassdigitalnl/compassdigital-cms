import type { ReactNode } from 'react'

export interface MiniCartContextValue {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  itemCount: number
}

export interface MiniCartProviderProps {
  children: ReactNode
  enableMiniCart?: boolean
}
