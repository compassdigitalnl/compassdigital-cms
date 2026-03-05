/**
 * Webhook Signature Verification
 *
 * Verifies that webhook requests are authentic using HMAC signatures
 * Prevents replay attacks and unauthorized access
 */

import crypto from 'crypto'
import type { NextRequest } from 'next/server'

/**
 * Signature verification result
 */
export interface SignatureVerificationResult {
  valid: boolean
  error?: string
  timestamp?: number
  age?: number // Age in seconds
}

/**
 * Webhook Signature Verifier
 */
export class WebhookSignatureVerifier {
  private secret: string
  private toleranceSeconds: number

  constructor(secret?: string, toleranceSeconds: number = 300) {
    this.secret = secret || process.env.WEBHOOK_SIGNING_SECRET || ''
    this.toleranceSeconds = toleranceSeconds // 5 minutes default
  }

  /**
   * Generate HMAC signature for payload
   *
   * @param payload - Webhook payload (JSON string or object)
   * @param timestamp - Unix timestamp in seconds
   * @returns HMAC-SHA256 signature
   */
  generateSignature(payload: string | object, timestamp: number): string {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
    const signedPayload = `${timestamp}.${payloadString}`
    return crypto.createHmac('sha256', this.secret).update(signedPayload).digest('hex')
  }

  /**
   * Verify webhook signature from request
   *
   * @param req - Next.js request
   * @param body - Request body (already parsed)
   * @returns Verification result
   */
  async verifyRequest(req: NextRequest, body: any): Promise<SignatureVerificationResult> {
    // Get signature from header
    const signatureHeader = req.headers.get('x-webhook-signature')
    if (!signatureHeader) {
      return {
        valid: false,
        error: 'Missing x-webhook-signature header',
      }
    }

    // Get timestamp from header
    const timestampHeader = req.headers.get('x-webhook-timestamp')
    if (!timestampHeader) {
      return {
        valid: false,
        error: 'Missing x-webhook-timestamp header',
      }
    }

    const timestamp = parseInt(timestampHeader, 10)
    if (isNaN(timestamp)) {
      return {
        valid: false,
        error: 'Invalid timestamp format',
      }
    }

    // Check timestamp tolerance (prevent replay attacks)
    const now = Math.floor(Date.now() / 1000)
    const age = now - timestamp

    if (age > this.toleranceSeconds) {
      return {
        valid: false,
        error: `Webhook timestamp too old (${age}s > ${this.toleranceSeconds}s)`,
        timestamp,
        age,
      }
    }

    if (age < -this.toleranceSeconds) {
      return {
        valid: false,
        error: `Webhook timestamp in the future (${-age}s)`,
        timestamp,
        age,
      }
    }

    // Generate expected signature
    const expectedSignature = this.generateSignature(body, timestamp)

    // Compare signatures (timing-safe)
    const valid = crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature),
    )

    if (!valid) {
      return {
        valid: false,
        error: 'Invalid signature',
        timestamp,
        age,
      }
    }

    return {
      valid: true,
      timestamp,
      age,
    }
  }

  /**
   * Create signature headers for outgoing webhook
   *
   * @param payload - Webhook payload
   * @returns Headers object
   */
  createHeaders(payload: string | object): Record<string, string> {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = this.generateSignature(payload, timestamp)

    return {
      'x-webhook-signature': signature,
      'x-webhook-timestamp': timestamp.toString(),
    }
  }
}

/**
 * Create webhook signature verifier instance
 */
export function createSignatureVerifier(secret?: string): WebhookSignatureVerifier {
  return new WebhookSignatureVerifier(secret)
}

/**
 * Verify webhook signature middleware
 *
 * Usage:
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const body = await req.json()
 *   const verification = await verifyWebhookSignature(req, body)
 *
 *   if (!verification.valid) {
 *     return Response.json(
 *       { error: verification.error },
 *       { status: 401 }
 *     )
 *   }
 *
 *   // Process webhook...
 * }
 * ```
 */
export async function verifyWebhookSignature(
  req: NextRequest,
  body: any,
  secret?: string,
): Promise<SignatureVerificationResult> {
  const verifier = createSignatureVerifier(secret)
  return verifier.verifyRequest(req, body)
}

/**
 * Generate webhook signature for testing
 *
 * Usage in tests:
 * ```typescript
 * const payload = { event: 'test' }
 * const headers = generateTestSignature(payload)
 *
 * fetch('/api/webhooks/test', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     ...headers,
 *   },
 *   body: JSON.stringify(payload),
 * })
 * ```
 */
export function generateTestSignature(
  payload: string | object,
  secret?: string,
): Record<string, string> {
  const verifier = createSignatureVerifier(secret)
  return verifier.createHeaders(payload)
}
