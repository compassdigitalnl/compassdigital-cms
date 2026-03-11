'use client'

import { useEffect } from 'react'
import { trackProfessionalEvent } from '@/branches/professional-services/lib/analytics'

/**
 * Hook to track page views for professional services pages.
 * Use in client components that wrap professional services detail pages.
 */
export function useProfessionalPageView(
  type: 'case' | 'service',
  slug: string,
  title: string,
) {
  useEffect(() => {
    trackProfessionalEvent(
      type === 'case' ? 'case_view' : 'service_view',
      { slug, title },
    )
  }, [type, slug, title])
}
