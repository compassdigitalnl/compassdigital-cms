import type { ReactNode } from 'react'

/**
 * Ecommerce Branch Layout
 *
 * Wraps all ecommerce routes: shop, cart, checkout, my-account, etc.
 * Currently transparent - just renders children.
 * Can be extended with ecommerce-specific context providers.
 */
export default function EcommerceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
