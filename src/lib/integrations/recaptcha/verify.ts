/**
 * reCAPTCHA v3 Server-Side Verification
 * Verifies reCAPTCHA tokens with Google's API
 */

type RecaptchaResponse = {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
  'error-codes'?: string[]
}

type VerificationResult = {
  success: boolean
  score?: number
  error?: string
}

/**
 * Verify a reCAPTCHA v3 token
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - The expected action name (optional)
 * @param minScore - Minimum acceptable score (0.0 to 1.0), default 0.5
 * @returns Verification result
 */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction: string = 'submit',
  minScore: number = 0.5
): Promise<VerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  // If reCAPTCHA is not configured, allow the request
  if (!secretKey) {
    console.warn('[reCAPTCHA] Secret key not configured - verification skipped')
    return { success: true }
  }

  // Validate inputs
  if (!token || typeof token !== 'string') {
    return {
      success: false,
      error: 'Invalid reCAPTCHA token',
    }
  }

  try {
    // Send verification request to Google
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    if (!response.ok) {
      console.error('[reCAPTCHA] Verification request failed:', response.status)
      return {
        success: false,
        error: 'reCAPTCHA verification request failed',
      }
    }

    const data: RecaptchaResponse = await response.json()

    // Log verification result
    console.log('[reCAPTCHA] Verification result:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      errors: data['error-codes'],
    })

    // Check for errors
    if (!data.success) {
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`,
      }
    }

    // Verify action matches (if provided)
    if (expectedAction && data.action !== expectedAction) {
      console.warn('[reCAPTCHA] Action mismatch:', {
        expected: expectedAction,
        received: data.action,
      })
      return {
        success: false,
        error: 'reCAPTCHA action mismatch',
      }
    }

    // Check score
    if (data.score < minScore) {
      console.warn('[reCAPTCHA] Score too low:', {
        score: data.score,
        minScore,
      })
      return {
        success: false,
        score: data.score,
        error: `reCAPTCHA score too low: ${data.score} < ${minScore}`,
      }
    }

    // Success!
    return {
      success: true,
      score: data.score,
    }
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    }
  }
}

/**
 * Check if reCAPTCHA is configured
 */
export function isRecaptchaConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY)
}
