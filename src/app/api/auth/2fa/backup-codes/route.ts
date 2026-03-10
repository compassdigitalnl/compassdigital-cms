import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { verifyTwoFactorToken, generateBackupCodes, hashBackupCode } from '@/lib/auth/twoFactor'

/**
 * POST /api/auth/2fa/backup-codes
 *
 * Regenerate backup codes. Requires a valid TOTP code.
 * Replaces all existing backup codes.
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
    if (!code) {
      return NextResponse.json({ error: 'Code is verplicht' }, { status: 400 })
    }

    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
    }) as any

    if (!fullUser.twoFactorEnabled || !fullUser.twoFactorSecret) {
      return NextResponse.json({ error: '2FA is niet ingeschakeld' }, { status: 400 })
    }

    // Verify TOTP code
    const isValid = verifyTwoFactorToken(code.replace(/\s/g, ''), fullUser.twoFactorSecret)
    if (!isValid) {
      return NextResponse.json({ error: 'Ongeldige code' }, { status: 400 })
    }

    // Generate new backup codes
    const backupCodes = generateBackupCodes()
    const hashedBackupCodes = backupCodes.map(hashBackupCode)

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { twoFactorBackupCodes: hashedBackupCodes } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      backupCodes,
      message: 'Nieuwe backup codes gegenereerd. Bewaar ze veilig!',
    })
  } catch (error: unknown) {
    console.error('2FA backup codes error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 },
    )
  }
}
