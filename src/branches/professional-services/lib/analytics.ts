/**
 * Professional Services Analytics — lightweight event tracking via GA4 gtag()
 *
 * Sends custom events to Google Analytics when configured.
 * Falls back to console.log in development.
 */

type ProfessionalEvent =
  | 'consultation_form_start'
  | 'consultation_form_step'
  | 'consultation_form_submit'
  | 'consultation_form_success'
  | 'case_view'
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

export function trackProfessionalEvent(event: ProfessionalEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'professional_services',
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
