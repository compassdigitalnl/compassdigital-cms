import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import jwt from 'jsonwebtoken'
import { verifyTwoFactorToken, verifyBackupCode } from '@/lib/auth/twoFactor'

/**
 * POST /api/auth/2fa/validate
 *
 * Validate a 2FA code during login.
 * Called after successful password auth when 2FA is enabled.
 *
 * Body: { email: string, code: string, isBackupCode?: boolean }
 * Returns: { success: true, token: string, user: object }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { email, code, isBackupCode } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email en code zijn verplicht' },
        { status: 400 },
      )
    }

    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
      limit: 1,
      overrideAccess: true,
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })
    }

    const user = users.docs[0] as any

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA is niet ingeschakeld voor dit account' },
        { status: 400 },
      )
    }

    const cleanCode = code.replace(/\s/g, '')

    if (isBackupCode) {
      // Verify backup code
      const backupCodes: string[] = user.twoFactorBackupCodes || []
      const index = verifyBackupCode(cleanCode, backupCodes)

      if (index === -1) {
        return NextResponse.json({ error: 'Ongeldige backup code' }, { status: 400 })
      }

      // Remove used backup code
      const updatedCodes = [...backupCodes]
      updatedCodes.splice(index, 1)

      await payload.update({
        collection: 'users',
        id: user.id,
        data: { twoFactorBackupCodes: updatedCodes } as any,
        overrideAccess: true,
      })

      console.log(`⚠️ Backup code used for ${email}. ${updatedCodes.length} codes remaining.`)
    } else {
      // Verify TOTP code
      const isValid = verifyTwoFactorToken(cleanCode, user.twoFactorSecret)
      if (!isValid) {
        return NextResponse.json({ error: 'Ongeldige verificatiecode' }, { status: 400 })
      }
    }

    // Generate JWT token (same as Payload login)
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      throw new Error('PAYLOAD_SECRET is not configured')
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        collection: 'users',
      },
      secret,
      { expiresIn: '14d' },
    )

    // Strip sensitive fields from response
    const { twoFactorSecret, twoFactorBackupCodes, twoFactorPendingSecret, password, ...safeUser } = user

    const response = NextResponse.json({
      success: true,
      token,
      user: safeUser,
      message: 'Succesvol ingelogd',
    })

    // Set the JWT cookie (same name as Payload uses)
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60, // 14 days
    })

    return response
  } catch (error: any) {
    console.error('2FA validate error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verifiëren' },
      { status: 500 },
    )
  }
}
