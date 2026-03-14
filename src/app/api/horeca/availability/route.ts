import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('date') // YYYY-MM
    const guests = Number(searchParams.get('guests')) || 2

    if (!month) {
      return NextResponse.json({ error: 'Missing date parameter (YYYY-MM)' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    // Fetch existing reservations
    const bookings = await payload.find({
      collection: 'content-bookings',
      where: {
        and: [
          { branch: { equals: 'horeca' } },
          { date: { greater_than_equal: startDate.toISOString().split('T')[0] } },
          { date: { less_than_equal: endDate.toISOString().split('T')[0] } },
        ],
      },
      limit: 500,
      depth: 0,
    })

    const bookedSlots: Record<string, string[]> = {}
    for (const booking of bookings.docs) {
      const d = (booking as any).date
      const t = (booking as any).time
      if (d && t) {
        if (!bookedSlots[d]) bookedSlots[d] = []
        bookedSlots[d].push(t)
      }
    }

    const dates: Array<{ date: string; slots: Array<{ time: string; available: boolean; period: string }> }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d < today) continue
      // Monday (1) = closed
      if (d.getDay() === 1) continue

      const dateStr = d.toISOString().split('T')[0]
      const dayBooked = bookedSlots[dateStr] || []
      const slots: Array<{ time: string; available: boolean; period: string }> = []

      // Lunch: 11:30 - 14:00
      for (let h = 11; h <= 13; h++) {
        for (let m = (h === 11 ? 30 : 0); m < 60; m += 30) {
          if (h === 13 && m >= 30) break
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          slots.push({ time, available: !dayBooked.includes(time), period: 'lunch' })
        }
      }

      // Dinner: 17:00 - 22:00 (Fri/Sat until 23:00)
      const dinnerEnd = (d.getDay() === 5 || d.getDay() === 6) ? 23 : 22
      for (let h = 17; h < dinnerEnd; h++) {
        for (let m = 0; m < 60; m += 30) {
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          slots.push({ time, available: !dayBooked.includes(time), period: 'diner' })
        }
      }

      dates.push({ date: dateStr, slots })
    }

    return NextResponse.json({ dates })
  } catch (error) {
    console.error('[Horeca Availability] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
