import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * POST /api/auth/2fa/check
 *
 * Check if a user has 2FA enabled (called during login flow).
 * Does NOT require authentication — only checks by email.
 *
 * Body: { email: string }
 * Returns: { twoFactorRequired: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is verplicht' }, { status: 400 })
    }

    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
      limit: 1,
      overrideAccess: true,
    })

    if (users.docs.length === 0) {
      // Don't reveal whether the user exists
      return NextResponse.json({ twoFactorRequired: false })
    }

    const user = users.docs[0] as any

    return NextResponse.json({
      twoFactorRequired: !!user.twoFactorEnabled,
    })
  } catch (error: unknown) {
    console.error('2FA check error:', error)
    return NextResponse.json({ twoFactorRequired: false })
  }
}
