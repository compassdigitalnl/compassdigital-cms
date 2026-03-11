/**
 * Construction Analytics — lightweight event tracking via GA4 gtag()
 *
 * Sends custom events to Google Analytics when configured.
 * Falls back to console.log in development.
 */

type ConstructionEvent =
  | 'quote_form_start'
  | 'quote_form_step'
  | 'quote_form_submit'
  | 'quote_form_success'
  | 'project_view'
  | 'service_view'
  | 'review_submit'
  | 'phone_click'
  | 'email_click'

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function trackConstructionEvent(event: ConstructionEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'construction',
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
