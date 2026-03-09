import { requireFeature } from '@/lib/tenant/featureGuard'
import { ReactNode } from 'react'

export default function GiftVouchersLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if giftVouchers feature is enabled
  requireFeature('giftVouchers')

  return <>{children}</>
}
