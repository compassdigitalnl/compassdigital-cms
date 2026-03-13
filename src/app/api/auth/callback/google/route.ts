/**
 * Google OAuth2 - Callback Handler
 *
 * 1. Exchanges authorization code for tokens
 * 2. Gets Google user profile
 * 3. Finds or creates Payload user
 * 4. Generates Payload JWT and sets cookie
 * 5. Redirects to admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const adminUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`

  if (error || !code) {
    return NextResponse.redirect(`${adminUrl}/login?error=google_denied`)
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      console.error('[Google OAuth] Token exchange failed:', tokens)
      return NextResponse.redirect(`${adminUrl}/login?error=token_exchange`)
    }

    // 2. Get Google user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const profile = await profileResponse.json()

    if (!profile.email) {
      return NextResponse.redirect(`${adminUrl}/login?error=no_email`)
    }

    // 3. Check domain restriction
    const allowedDomains = process.env.GOOGLE_ALLOWED_DOMAINS
    if (allowedDomains) {
      const domains = allowedDomains.split(',').map((d) => d.trim().toLowerCase())
      const emailDomain = profile.email.split('@')[1].toLowerCase()
      if (!domains.includes(emailDomain)) {
        return NextResponse.redirect(`${adminUrl}/login?error=domain_not_allowed`)
      }
    }

    // 4. Find or create user in Payload
    const payload = await getPayload({ config })

    const { docs: existingUsers } = await payload.find({
      collection: 'users',
      where: { email: { equals: profile.email } },
      limit: 1,
      depth: 0,
    })

    let user = existingUsers[0]

    if (!user) {
      // Check if auto-creation is allowed
      if (process.env.GOOGLE_AUTO_CREATE_USERS !== 'true') {
        return NextResponse.redirect(`${adminUrl}/login?error=user_not_found`)
      }

      // Create new admin user from Google profile
      user = await payload.create({
        collection: 'users',
        data: {
          email: profile.email,
          firstName: profile.given_name || '',
          lastName: profile.family_name || '',
          name: profile.name || profile.email,
          password: require('crypto').randomBytes(32).toString('hex'), // Random password (unused with OAuth)
          roles: ['editor'],
          verified: true,
        },
      })
    }

    // 5. Check if user has admin access
    const roles = (user as any).roles || []
    if (!roles.includes('admin') && !roles.includes('editor') && !roles.includes('super-admin')) {
      return NextResponse.redirect(`${adminUrl}/login?error=no_admin_access`)
    }

    // 6. Generate Payload JWT token
    const payloadSecret = process.env.PAYLOAD_SECRET
    if (!payloadSecret) {
      return NextResponse.redirect(`${adminUrl}/login?error=server_config`)
    }

    const tokenData = {
      id: user.id,
      email: (user as any).email,
      collection: 'users',
      sid: randomUUID(),
    }

    const token = jwt.sign(tokenData, payloadSecret, {
      expiresIn: '14d',
    })

    // 7. Set cookie and redirect to admin
    const response = NextResponse.redirect(adminUrl)

    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60, // 14 days
    })

    return response
  } catch (err) {
    console.error('[Google OAuth] Error:', err)
    return NextResponse.redirect(`${adminUrl}/login?error=server_error`)
  }
}
