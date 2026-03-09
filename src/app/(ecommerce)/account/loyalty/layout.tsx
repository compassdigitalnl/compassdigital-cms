import { requireFeature } from '@/lib/tenant/featureGuard'
import { ReactNode } from 'react'

export default function LoyaltyLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if loyalty feature is enabled
  requireFeature('loyalty')

  return <>{children}</>
}
