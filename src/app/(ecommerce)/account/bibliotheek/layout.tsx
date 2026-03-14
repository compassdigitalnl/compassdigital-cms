import { requireFeature } from '@/lib/tenant/featureGuard'
import { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitale Bibliotheek',
}

export default function BibliotheekLayout({ children }: { children: ReactNode }) {
  // Feature guard: Only accessible if publishing feature is enabled
  requireFeature('publishing')

  return <>{children}</>
}
