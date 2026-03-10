import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  verifyTwoFactorToken,
  generateBackupCodes,
  hashBackupCode,
} from '@/lib/auth/twoFactor'

/**
 * POST /api/auth/2fa/verify
 *
 * Verify the first TOTP code to activate 2FA.
 * Called after /setup — confirms the user has correctly configured their authenticator.
 *
 * Body: { code: string }
 * Returns: { success: true, backupCodes: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { code } = await request.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is verplicht' }, { status: 400 })
    }

    // Get the pending secret
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
    })

    const pendingSecret = (fullUser as any).twoFactorPendingSecret
    if (!pendingSecret) {
      return NextResponse.json(
        { error: 'Geen 2FA setup gevonden. Start opnieuw via /api/auth/2fa/setup' },
        { status: 400 },
      )
    }

    // Verify the code
    const isValid = verifyTwoFactorToken(code.replace(/\s/g, ''), pendingSecret)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Ongeldige code. Probeer opnieuw.' },
        { status: 400 },
      )
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes()
    const hashedBackupCodes = backupCodes.map(hashBackupCode)

    // Activate 2FA
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: pendingSecret,
        twoFactorBackupCodes: hashedBackupCodes,
        twoFactorPendingSecret: null,
      } as any,
      overrideAccess: true,
    })

    console.log(`✅ 2FA activated for user ${user.email}`)

    return NextResponse.json({
      success: true,
      backupCodes, // Return plain codes ONCE — user must save them
      message: 'Tweefactorauthenticatie is succesvol geactiveerd. Bewaar je backup codes veilig!',
    })
  } catch (error: unknown) {
    console.error('2FA verify error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verifiëren van 2FA' },
      { status: 500 },
    )
  }
}
