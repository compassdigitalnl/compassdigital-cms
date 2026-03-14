/**
 * Horeca Analytics — lightweight event tracking via GA4 gtag()
 */

type HorecaEvent =
  | 'reservation_form_start'
  | 'reservation_form_step'
  | 'reservation_form_submit'
  | 'reservation_form_success'
  | 'menu_item_view'
  | 'event_view'
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

export function trackHorecaEvent(event: HorecaEvent, params?: EventParams) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'horeca',
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
