import { requireFeature } from '@/lib/featureGuard'
import { ReactNode } from 'react'

export default function AddressesLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if addresses feature is enabled
  requireFeature('addresses')

  return <>{children}</>
}
