import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { verifyTwoFactorToken } from '@/lib/auth/twoFactor'

/**
 * POST /api/auth/2fa/disable
 *
 * Disable 2FA for the current user.
 * Requires a valid TOTP code as confirmation.
 *
 * Body: { code: string }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { code } = await request.json()
    if (!code) {
      return NextResponse.json({ error: 'Code is verplicht om 2FA uit te schakelen' }, { status: 400 })
    }

    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
    }) as any

    if (!fullUser.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA is niet ingeschakeld' }, { status: 400 })
    }

    // Verify code before disabling
    const isValid = verifyTwoFactorToken(code.replace(/\s/g, ''), fullUser.twoFactorSecret)
    if (!isValid) {
      return NextResponse.json({ error: 'Ongeldige code. 2FA is niet uitgeschakeld.' }, { status: 400 })
    }

    // Disable 2FA and clear all secrets
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: [],
        twoFactorPendingSecret: null,
      } as any,
      overrideAccess: true,
    })

    console.log(`🔓 2FA disabled for user ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Tweefactorauthenticatie is uitgeschakeld.',
    })
  } catch (error: any) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het uitschakelen van 2FA' },
      { status: 500 },
    )
  }
}
