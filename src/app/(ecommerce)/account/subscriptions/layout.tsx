import { requireFeature } from '@/lib/featureGuard'
import { ReactNode } from 'react'

export default function SubscriptionLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if subscriptions feature is enabled
  requireFeature('subscriptions')

  return <>{children}</>
}
