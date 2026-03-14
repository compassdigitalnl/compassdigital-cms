/**
 * Zorg Analytics — lightweight event tracking via GA4 gtag()
 */

type ZorgEvent =
  | 'appointment_form_start'
  | 'appointment_form_complete'
  | 'treatment_view'
  | 'practitioner_view'
  | 'insurance_check'
  | 'referral_view'

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function trackZorgEvent(event: ZorgEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'zorg',
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
