import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type AppointmentFormData = {
  serviceId: number
  staffMemberId?: number
  date: string
  time: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate?: string
  insuranceProvider?: string
  complaint?: string
  hasReferral?: string
  remarks?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AppointmentFormData = await request.json()

    // Validate required fields
    if (
      !body.serviceId ||
      !body.date ||
      !body.time ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (serviceId, date, time, firstName, lastName, email, phone)' },
        { status: 400 },
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json({ error: 'Ongeldige datum (verwacht YYYY-MM-DD)' }, { status: 400 })
    }

    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(body.time)) {
      return NextResponse.json({ error: 'Ongeldige tijd (verwacht HH:MM)' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Create appointment in content-bookings
    const appointment = await payload.create({
      collection: 'content-bookings',
      data: {
        branch: 'zorg',
        status: 'new',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        date: body.date,
        time: body.time,
        service: body.serviceId,
        staffMember: body.staffMemberId || null,
        birthDate: body.birthDate || null,
        insuranceProvider: body.insuranceProvider || null,
        complaint: body.complaint || '',
        hasReferral: body.hasReferral || 'no',
        remarks: body.remarks || '',
      } as any,
    })

    console.log('[Zorg Appointment] New appointment created:', {
      id: appointment.id,
      date: body.date,
      time: body.time,
      patient: `${body.firstName} ${body.lastName}`,
      serviceId: body.serviceId,
    })

    return NextResponse.json({
      success: true,
      bookingId: appointment.id,
    })
  } catch (error) {
    console.error('[Zorg Appointment] Error:', error)
    return NextResponse.json({ error: 'Er is een fout opgetreden' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
