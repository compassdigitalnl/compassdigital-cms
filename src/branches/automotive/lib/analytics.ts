/**
 * Automotive Analytics — lightweight event tracking via GA4 gtag()
 */

type AutomotiveEvent =
  | 'vehicle_view'
  | 'vehicle_compare'
  | 'test_drive_request'
  | 'trade_in_start'
  | 'workshop_booking'
  | 'financing_calculator'
  | 'rdw_lookup'

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function trackAutomotiveEvent(event: AutomotiveEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'automotive',
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
