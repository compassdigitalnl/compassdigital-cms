import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('date') // YYYY-MM
    const serviceId = searchParams.get('serviceId')
    const staffMemberId = searchParams.get('staffMemberId')

    if (!month) {
      return NextResponse.json({ error: 'Ontbrekende parameter: date (YYYY-MM)' }, { status: 400 })
    }

    if (!serviceId) {
      return NextResponse.json({ error: 'Ontbrekende parameter: serviceId' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Fetch service to get duration
    let slotDuration = 30 // default 30 minutes
    try {
      const service = await payload.findByID({
        collection: 'content-services',
        id: Number(serviceId),
        depth: 0,
      })
      if (service && (service as any).duration) {
        slotDuration = (service as any).duration
      }
    } catch {
      // Service not found — use default slot duration
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0) // last day of month

    // Build query filters for existing bookings
    const whereConditions: any[] = [
      { branch: { equals: 'zorg' } },
      { date: { greater_than_equal: startDate.toISOString().split('T')[0] } },
      { date: { less_than_equal: endDate.toISOString().split('T')[0] } },
      { status: { not_equals: 'cancelled' } },
    ]

    if (staffMemberId) {
      whereConditions.push({ staffMember: { equals: Number(staffMemberId) } })
    }

    // Fetch existing bookings for the month
    const bookings = await payload.find({
      collection: 'content-bookings',
      where: { and: whereConditions },
      limit: 500,
      depth: 0,
    })

    // Build map of booked slots per date
    const bookedSlots: Record<string, string[]> = {}
    for (const booking of bookings.docs) {
      const d = (booking as any).date
      const t = (booking as any).time
      if (d && t) {
        if (!bookedSlots[d]) bookedSlots[d] = []
        bookedSlots[d].push(t)
      }
    }

    // Generate availability for each day
    const dates: Array<{ date: string; slots: Array<{ time: string; available: boolean }> }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Skip past dates
      if (d < today) continue

      // Skip weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = d.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const dateStr = d.toISOString().split('T')[0]
      const dayBooked = bookedSlots[dateStr] || []
      const slots: Array<{ time: string; available: boolean }> = []

      // Morning: 08:00 - 12:00
      for (let minutes = 8 * 60; minutes < 12 * 60; minutes += slotDuration) {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        slots.push({ time, available: !dayBooked.includes(time) })
      }

      // Afternoon: 13:00 - 17:00
      for (let minutes = 13 * 60; minutes < 17 * 60; minutes += slotDuration) {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        slots.push({ time, available: !dayBooked.includes(time) })
      }

      dates.push({ date: dateStr, slots })
    }

    return NextResponse.json({ dates })
  } catch (error) {
    console.error('[Zorg Availability] Error:', error)
    return NextResponse.json({ error: 'Er is een fout opgetreden' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
