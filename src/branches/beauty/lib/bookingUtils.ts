/**
 * Booking Utilities for Beauty Branch
 */

export interface TimeSlot {
  time: string
  available: boolean
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 18,
  intervalMinutes: number = 30,
): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      if (h === endHour - 1 && m + intervalMinutes > 60) break
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({ time, available: true })
    }
  }
  return slots
}

export function calculateBookingPrice(
  basePrice: number,
  extras: { price: number }[] = [],
): number {
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0)
  return basePrice + extrasTotal
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}u ${m}min` : `${h} uur`
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function isSlotAvailable(
  slot: string,
  bookedSlots: string[],
  durationMinutes: number,
  intervalMinutes: number = 30,
): boolean {
  const slotsNeeded = Math.ceil(durationMinutes / intervalMinutes)
  const [slotH, slotM] = slot.split(':').map(Number)
  const slotStart = slotH * 60 + slotM

  for (let i = 0; i < slotsNeeded; i++) {
    const checkMinutes = slotStart + i * intervalMinutes
    const checkTime = `${String(Math.floor(checkMinutes / 60)).padStart(2, '0')}:${String(checkMinutes % 60).padStart(2, '0')}`
    if (bookedSlots.includes(checkTime)) return false
  }
  return true
}
