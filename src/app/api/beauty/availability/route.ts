import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const staffMemberId = searchParams.get('staffMemberId')
    const month = searchParams.get('date') // YYYY-MM format

    if (!month) {
      return NextResponse.json({ error: 'Missing date parameter (YYYY-MM)' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get service duration (default 60 min)
    let serviceDuration = 60
    if (serviceId) {
      try {
        const service = await payload.findByID({ collection: 'content-services', id: Number(serviceId) })
        if (service?.duration) serviceDuration = service.duration as number
      } catch { /* use default */ }
    }

    // Parse month
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0) // last day of month

    // Fetch existing bookings for this month
    const whereConditions: any[] = [
      { branch: { equals: 'beauty' } },
      { date: { greater_than_equal: startDate.toISOString().split('T')[0] } },
      { date: { less_than_equal: endDate.toISOString().split('T')[0] } },
    ]

    if (staffMemberId) {
      whereConditions.push({ staffMember: { equals: Number(staffMemberId) } })
    }

    const bookings = await payload.find({
      collection: 'content-bookings',
      where: { and: whereConditions },
      limit: 500,
      depth: 0,
    })

    // Build booked slots map: date -> time[]
    const bookedSlots: Record<string, string[]> = {}
    for (const booking of bookings.docs) {
      const d = (booking as any).date
      const t = (booking as any).time
      if (d && t) {
        if (!bookedSlots[d]) bookedSlots[d] = []
        bookedSlots[d].push(t)
      }
    }

    // Generate available dates
    const dates: Array<{ date: string; slots: Array<{ time: string; available: boolean }> }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Skip past dates
      if (d < today) continue

      // Skip Sundays (day 0)
      if (d.getDay() === 0) continue

      const dateStr = d.toISOString().split('T')[0]
      const dayBookedSlots = bookedSlots[dateStr] || []

      // Generate time slots (9:00 - 18:00, 30min intervals)
      const slots: Array<{ time: string; available: boolean }> = []
      const startHour = 9
      const endHour = d.getDay() === 6 ? 17 : 18 // Saturday closes earlier

      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          const available = !dayBookedSlots.includes(time)
          slots.push({ time, available })
        }
      }

      dates.push({ date: dateStr, slots })
    }

    return NextResponse.json({ dates })
  } catch (error) {
    console.error('[Beauty Availability] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
