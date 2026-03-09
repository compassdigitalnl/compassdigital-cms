import { generateSecret, generateURI, generateSync, verifySync } from 'otplib'
import * as QRCode from 'qrcode'
import crypto from 'crypto'

const APP_NAME = 'CompassDigital'

/**
 * Generate a new TOTP secret for a user
 */
export function generateTwoFactorSecret(email: string): {
  secret: string
  otpauthUrl: string
} {
  const secret = generateSecret()
  const otpauthUrl = generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  })
  return { secret, otpauthUrl }
}

/**
 * Generate a QR code data URL from an otpauth URL
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl)
}

/**
 * Verify a TOTP token against a secret
 */
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  const result = verifySync({ token, secret })
  return result.valid
}

/**
 * Generate backup codes (10 codes, 8 characters each)
 */
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    // Format as XXXX-XXXX for readability
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

/**
 * Hash a backup code for storage (one-way)
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code.replace('-', '')).digest('hex')
}

/**
 * Verify a backup code against stored hashes. Returns the index if found, -1 otherwise.
 */
export function verifyBackupCode(code: string, hashedCodes: string[]): number {
  const hashed = hashBackupCode(code)
  return hashedCodes.indexOf(hashed)
}
