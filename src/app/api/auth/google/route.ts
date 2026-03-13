/**
 * Google OAuth2 - Initiate Login
 *
 * Redirects to Google's OAuth2 consent screen.
 * After consent, Google redirects back to /api/auth/google/callback
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env' },
      { status: 500 },
    )
  }

  // Allowed Google Workspace domains (optional, comma-separated)
  const allowedDomains = process.env.GOOGLE_ALLOWED_DOMAINS || ''

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    ...(allowedDomains ? { hd: allowedDomains.split(',')[0].trim() } : {}),
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
