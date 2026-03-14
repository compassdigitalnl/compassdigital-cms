/**
 * Appointment Utilities for Zorg Branch
 */

export interface TimeSlot {
  time: string
  available: boolean
  period: 'ochtend' | 'middag'
}

/**
 * Generate time slots for a given date.
 * Morning: 08:00–12:00, Afternoon: 13:00–17:00.
 * Weekends are closed (returns empty array).
 */
export function generateTimeSlots(
  date: string,
  duration: number = 30,
  period?: 'ochtend' | 'middag',
): TimeSlot[] {
  // Check if date falls on weekend
  if (date) {
    const dayOfWeek = new Date(date).getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [] // Weekend — closed
    }
  }

  const slots: TimeSlot[] = []
  const intervalMinutes = duration

  // Morning slots (08:00–12:00)
  if (!period || period === 'ochtend') {
    for (let h = 8; h < 12; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        // Don't generate slots that would run past 12:00
        const totalMinutes = h * 60 + m + intervalMinutes
        if (totalMinutes > 12 * 60) break
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        slots.push({ time, available: true, period: 'ochtend' })
      }
    }
  }

  // Afternoon slots (13:00–17:00)
  if (!period || period === 'middag') {
    for (let h = 13; h < 17; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        // Don't generate slots that would run past 17:00
        const totalMinutes = h * 60 + m + intervalMinutes
        if (totalMinutes > 17 * 60) break
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        slots.push({ time, available: true, period: 'middag' })
      }
    }
  }

  return slots
}

/**
 * Format duration in minutes to a human-readable Dutch string.
 * 30 → "30 min", 60 → "1 uur", 90 → "1,5 uur"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  if (remaining === 0) {
    return `${hours} uur`
  }
  const fraction = remaining / 60
  // Format with comma as decimal separator (Dutch)
  const formatted = (hours + fraction).toLocaleString('nl-NL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
  return `${formatted} uur`
}

const INSURANCE_LABELS: Record<string, string> = {
  covered: 'Vergoed',
  partial: 'Gedeeltelijk vergoed',
  'not-covered': 'Niet vergoed',
}

/**
 * Format insurance coverage status to Dutch label.
 */
export function formatInsurance(status: string): string {
  return INSURANCE_LABELS[status] || status
}

const REFERRAL_LABELS: Record<string, string> = {
  no: 'Geen verwijzing nodig',
  gp: 'Huisartsverwijzing vereist',
  specialist: 'Specialistenverwijzing vereist',
}

/**
 * Format referral requirement to Dutch label.
 */
export function formatReferral(type: string): string {
  return REFERRAL_LABELS[type] || type
}

const INSURANCE_PROVIDERS: Record<string, string> = {
  cz: 'CZ',
  vgz: 'VGZ',
  zilveren_kruis: 'Zilveren Kruis',
  menzis: 'Menzis',
  ohra: 'OHRA',
  dsr: 'DSW',
  eno: 'ENO',
  zorg_en_zekerheid: 'Zorg en Zekerheid',
  salland: 'Salland Zorgverzekeringen',
  anderzorg: 'AnderZorg',
  interpolis: 'Interpolis',
  unive: 'Univé',
  asr: 'a.s.r.',
  national_nederlanden: 'Nationale-Nederlanden',
  ditzo: 'Ditzo',
  other: 'Overige',
}

/**
 * Get the full name of an insurance provider by code.
 */
export function getInsuranceLabel(provider: string): string {
  return INSURANCE_PROVIDERS[provider] || provider
}

/**
 * Format price with euro sign.
 * Supports range and "from" pricing.
 */
export function formatPrice(
  price?: number,
  priceFrom?: number,
  priceTo?: number,
): string {
  const fmt = (cents: number) =>
    new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)

  if (priceFrom && priceTo) {
    return `${fmt(priceFrom)} - ${fmt(priceTo)}`
  }
  if (priceFrom) {
    return `Vanaf ${fmt(priceFrom)}`
  }
  if (price) {
    return fmt(price)
  }
  return ''
}
