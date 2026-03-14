/**
 * Beauty Analytics — lightweight event tracking via GA4 gtag()
 */

type BeautyEvent =
  | 'booking_form_start'
  | 'booking_form_step'
  | 'booking_form_submit'
  | 'booking_form_success'
  | 'treatment_view'
  | 'stylist_view'
  | 'portfolio_view'
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

export function trackBeautyEvent(event: BeautyEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'beauty',
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
