/**
 * Publishing Analytics — lightweight event tracking via GA4 gtag()
 */

type PublishingEvent =
  | 'article_view'
  | 'article_share'
  | 'magazine_view'
  | 'subscription_start'
  | 'library_open'
  | 'paywall_hit'
  | 'knowledge_base_search'

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function trackPublishingEvent(event: PublishingEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'publishing',
        ...params,
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, params || '')
    }
  } catch {
    // Never throw on analytics failures
  }
}
