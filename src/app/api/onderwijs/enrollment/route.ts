import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import { generateEnrollmentNumber } from '@/branches/onderwijs/lib/courseUtils'

/**
 * Onderwijs Enrollment API
 *
 * POST /api/onderwijs/enrollment
 *
 * Maakt een inschrijving aan voor een cursus.
 * Valideert cursus bestaan + publicatiestatus en voorkomt duplicaten.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      courseId,
      firstName,
      lastName,
      email,
      password,
      paymentMethod,
      isNewAccount,
    } = body

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: 'Cursus is verplicht' },
        { status: 400 },
      )
    }

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (voornaam, achternaam, e-mail)' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Validate course exists and is published
    let course: any
    try {
      course = await payload.findByID({
        collection: 'courses',
        id: courseId,
      })
    } catch {
      return NextResponse.json(
        { error: 'Cursus niet gevonden' },
        { status: 404 },
      )
    }

    if (course.status !== 'published') {
      return NextResponse.json(
        { error: 'Deze cursus is momenteel niet beschikbaar' },
        { status: 400 },
      )
    }

    // Find or create user
    let userId: number | null = null

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      userId = existingUsers.docs[0].id
    } else if (isNewAccount && password) {
      // Create new user
      try {
        const newUser = await payload.create({
          collection: 'users',
          data: {
            email,
            password,
            firstName,
            lastName,
            role: 'customer',
          },
        })
        userId = newUser.id
      } catch {
        // If user creation fails, continue without user account
        console.log(`[onderwijs/enrollment] Gebruiker aanmaken mislukt voor ${email}, doorgaan zonder account`)
      }
    }

    // Check for duplicate enrollment (same email + same course)
    if (userId) {
      const existingEnrollments = await payload.find({
        collection: 'enrollments',
        where: {
          and: [
            { user: { equals: userId } },
            { course: { equals: courseId } },
            {
              enrollmentStatus: {
                in: ['pending', 'active'],
              },
            },
          ],
        },
        limit: 1,
      })

      if (existingEnrollments.docs.length > 0) {
        return NextResponse.json(
          { error: 'Je bent al ingeschreven voor deze cursus' },
          { status: 400 },
        )
      }
    }

    // Generate enrollment number
    const enrollmentNumber = generateEnrollmentNumber()

    // Create enrollment
    const enrollmentData: Record<string, any> = {
      course: Number(courseId),
      enrollmentNumber,
      enrolledAt: new Date().toISOString(),
      enrollmentStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'ideal',
      amount: course.price || 0,
      progress: 0,
      completedLessons: 0,
    }

    if (userId) {
      enrollmentData.user = userId
    }

    const enrollment = await payload.create({
      collection: 'enrollments',
      data: enrollmentData,
    })

    console.log(
      `[onderwijs/enrollment] Inschrijving aangemaakt — enrollment ${enrollment.id}, ` +
        `nummer: ${enrollmentNumber}, student: ${firstName} ${lastName} (${email}), ` +
        `cursus: ${course.title} (ID: ${courseId}), betaalmethode: ${paymentMethod || 'ideal'}`,
    )

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      enrollmentNumber,
    })
  } catch (error) {
    console.error('[onderwijs/enrollment] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de inschrijving' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
