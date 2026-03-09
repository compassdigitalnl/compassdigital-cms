import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateTwoFactorSecret, generateQRCode } from '@/lib/auth/twoFactor'

/**
 * POST /api/auth/2fa/setup
 *
 * Start 2FA setup: generates a TOTP secret and QR code.
 * User must be logged in. The secret is stored as "pending" until verified.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get current user from session
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Check if 2FA is already enabled
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
    })

    if ((fullUser as any).twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is al geactiveerd. Schakel het eerst uit om opnieuw in te stellen.' },
        { status: 400 },
      )
    }

    // Generate secret and QR code
    const { secret, otpauthUrl } = generateTwoFactorSecret(user.email)
    const qrCode = await generateQRCode(otpauthUrl)

    // Store pending secret (not yet active)
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { twoFactorPendingSecret: secret } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      qrCode,
      secret, // Manual entry fallback
      message: 'Scan de QR-code met je authenticator app en voer de code in om te bevestigen.',
    })
  } catch (error: any) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het instellen van 2FA' },
      { status: 500 },
    )
  }
}
