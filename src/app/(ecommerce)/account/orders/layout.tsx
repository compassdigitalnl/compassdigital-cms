import { requireFeature } from '@/lib/tenant/featureGuard'
import { ReactNode } from 'react'

export default function OrdersLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if checkout feature is enabled
  // (Orders require checkout to exist)
  requireFeature('checkout')

  return <>{children}</>
}
