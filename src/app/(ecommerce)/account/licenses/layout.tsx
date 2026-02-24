import { requireFeature } from '@/lib/featureGuard'
import { ReactNode } from 'react'

export default function LicensesLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if licenses feature is enabled
  requireFeature('licenses')

  return <>{children}</>
}
