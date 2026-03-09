import { requireFeature } from '@/lib/tenant/featureGuard'
import { ReactNode } from 'react'

export default function OrderListsLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if orderLists feature is enabled
  requireFeature('orderLists')

  return <>{children}</>
}
