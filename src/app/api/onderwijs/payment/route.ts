import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Onderwijs Payment API
 *
 * POST /api/onderwijs/payment
 *
 * Simuleert betalingsverwerking voor een inschrijving.
 * Update enrollment status en course studentCount.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { enrollmentId, paymentMethod, paymentDetails } = body

    // Validate required fields
    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Inschrijving ID is verplicht' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch enrollment
    let enrollment: any
    try {
      enrollment = await payload.findByID({
        collection: 'enrollments',
        id: enrollmentId,
        depth: 1,
      })
    } catch {
      return NextResponse.json(
        { error: 'Inschrijving niet gevonden' },
        { status: 404 },
      )
    }

    // Validate enrollment is pending
    if (enrollment.paymentStatus !== 'pending') {
      return NextResponse.json(
        { error: 'Deze inschrijving is al verwerkt' },
        { status: 400 },
      )
    }

    // Simulate payment processing
    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    // Update enrollment: payment completed + status active
    await payload.update({
      collection: 'enrollments',
      id: enrollmentId,
      data: {
        paymentStatus: 'completed',
        enrollmentStatus: 'active',
        paymentId,
        paymentMethod: paymentMethod || enrollment.paymentMethod || 'ideal',
      },
    })

    // Update course studentCount +1
    const courseId = typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course
    const courseSlug = typeof enrollment.course === 'object' ? enrollment.course.slug : undefined

    if (courseId) {
      try {
        const course = await payload.findByID({
          collection: 'courses',
          id: courseId,
        })
        await payload.update({
          collection: 'courses',
          id: courseId,
          data: {
            studentCount: (course.studentCount || 0) + 1,
          },
        })
      } catch (e) {
        console.error('[onderwijs/payment] Fout bij updaten studentCount:', e)
      }
    }

    console.log(
      `[onderwijs/payment] Betaling verwerkt — enrollment ${enrollmentId}, ` +
        `paymentId: ${paymentId}, methode: ${paymentMethod || 'ideal'}, ` +
        `cursus: ${courseId}`,
    )

    return NextResponse.json({
      success: true,
      enrollmentNumber: enrollment.enrollmentNumber,
      courseSlug: courseSlug || undefined,
    })
  } catch (error) {
    console.error('[onderwijs/payment] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwerken van de betaling' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
