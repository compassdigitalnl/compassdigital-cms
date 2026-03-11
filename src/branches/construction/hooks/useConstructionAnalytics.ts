'use client'

import { useEffect } from 'react'
import { trackConstructionEvent } from '@/branches/construction/lib/analytics'

/**
 * Hook to track page views for construction pages.
 * Use in client components that wrap construction detail pages.
 */
export function useConstructionPageView(
  type: 'project' | 'service',
  slug: string,
  title: string,
) {
  useEffect(() => {
    trackConstructionEvent(
      type === 'project' ? 'project_view' : 'service_view',
      { slug, title },
    )
  }, [type, slug, title])
}
