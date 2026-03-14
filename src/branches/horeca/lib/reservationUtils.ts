/**
 * Reservation Utilities for Horeca Branch
 */

export interface TimeSlot {
  time: string
  available: boolean
  period: 'lunch' | 'diner'
}

export function generateTimeSlots(
  lunchStart: number = 11,
  lunchEnd: number = 14,
  dinnerStart: number = 17,
  dinnerEnd: number = 22,
  intervalMinutes: number = 30,
): TimeSlot[] {
  const slots: TimeSlot[] = []

  // Lunch slots
  for (let h = lunchStart; h < lunchEnd; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({ time, available: true, period: 'lunch' })
    }
  }

  // Dinner slots
  for (let h = dinnerStart; h < dinnerEnd; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({ time, available: true, period: 'diner' })
    }
  }

  return slots
}

export function formatGuests(count: number): string {
  return count === 1 ? '1 gast' : `${count} gasten`
}

const OCCASION_LABELS: Record<string, string> = {
  regular: 'Gewoon diner',
  birthday: 'Verjaardag',
  anniversary: 'Jubileum',
  business: 'Zakelijk diner',
  romantic: 'Romantisch diner',
  group: 'Groepsdiner',
  other: 'Anders',
}

export function formatOccasion(occasion: string): string {
  return OCCASION_LABELS[occasion] || occasion
}

const PREFERENCE_LABELS: Record<string, string> = {
  window: 'Raam',
  terrace: 'Terras',
  inside: 'Binnen',
  quiet: 'Rustig hoekje',
  bar: 'Aan de bar',
}

export function getPreferenceLabel(pref: string): string {
  return PREFERENCE_LABELS[pref] || pref
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}
