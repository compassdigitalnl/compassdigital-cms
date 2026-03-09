/**
 * Example: API Routes for Authentication
 *
 * These examples show how to implement the backend API routes
 * that work with the AuthTemplate forms.
 *
 * Files to create:
 * - src/app/api/auth/login/route.ts
 * - src/app/api/auth/register/route.ts
 * - src/app/api/auth/guest/route.ts
 * - src/app/api/auth/oauth/[provider]/route.ts
 */

// ═════════════════════════════════════════════════════════════════════════════
// 1. LOGIN API ROUTE
// File: src/app/api/auth/login/route.ts
// ═════════════════════════════════════════════════════════════════════════════

/*
import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const payload = await getPayloadHMR({ config })
    const { email, password, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    // Authenticate with Payload CMS
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    // Set cookie with token
    const cookieStore = cookies()
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      token: result.token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Ongeldige inloggegevens' },
      { status: 401 }
    )
  }
}
*/

// ═════════════════════════════════════════════════════════════════════════════
// 2. REGISTER API ROUTE
// File: src/app/api/auth/register/route.ts
// ═════════════════════════════════════════════════════════════════════════════

/*
import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const payload = await getPayloadHMR({ config })
    const data = await request.json()

    // Validate input
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { success: false, message: 'Alle verplichte velden moeten ingevuld zijn' },
        { status: 400 }
      )
    }

    // Validate B2B fields if business account
    if (data.accountType === 'business') {
      if (!data.companyName || !data.kvkNumber) {
        return NextResponse.json(
          { success: false, message: 'Bedrijfsnaam en KVK-nummer zijn verplicht voor zakelijke accounts' },
          { status: 400 }
        )
      }

      // Validate KVK format (8 digits)
      if (!/^\d{8}$/.test(data.kvkNumber)) {
        return NextResponse.json(
          { success: false, message: 'KVK-nummer moet uit 8 cijfers bestaan' },
          { status: 400 }
        )
      }
    }

    // Check if email already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: data.email } },
      limit: 1,
    })

    if (existingUser.docs.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Dit e-mailadres is al geregistreerd' },
        { status: 409 }
      )
    }

    // Create user
    const user = await payload.create({
      collection: 'users',
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        accountType: data.accountType || 'private',
        companyName: data.companyName,
        kvkNumber: data.kvkNumber,
        vatNumber: data.vatNumber,
        role: data.accountType === 'business' ? 'business' : 'customer',
      },
    })

    // Optional: Send verification email
    // await sendVerificationEmail(user.email, user.id)

    // Auto-login after registration
    const loginResult = await payload.login({
      collection: 'users',
      data: { email: data.email, password: data.password },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: loginResult.token,
      message: 'Account succesvol aangemaakt',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Er is een fout opgetreden bij het aanmaken van uw account' },
      { status: 500 }
    )
  }
}
*/

// ═════════════════════════════════════════════════════════════════════════════
// 3. GUEST CHECKOUT API ROUTE
// File: src/app/api/auth/guest/route.ts
// ═════════════════════════════════════════════════════════════════════════════

/*
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Naam en e-mail zijn verplicht' },
        { status: 400 }
      )
    }

    // Create guest session ID
    const sessionId = randomUUID()

    // Store guest info in cookie
    const cookieStore = cookies()
    cookieStore.set('guest-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    // Store guest data (in memory, database, or Redis)
    // For production, use Redis or database
    // Example with Redis:
    // await redis.set(`guest:${sessionId}`, JSON.stringify({ name, email }), 'EX', 86400)

    return NextResponse.json({
      success: true,
      sessionId,
      guest: { name, email },
      message: 'Gast sessie aangemaakt',
    })
  } catch (error) {
    console.error('Guest checkout error:', error)
    return NextResponse.json(
      { success: false, message: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
*/

// ═════════════════════════════════════════════════════════════════════════════
// 4. OAUTH CALLBACK ROUTE
// File: src/app/api/auth/oauth/[provider]/route.ts
// ═════════════════════════════════════════════════════════════════════════════

/*
import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const provider = params.provider

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/login?error=oauth_failed`)
    }

    // Exchange code for access token
    let accessToken: string
    let userInfo: any

    switch (provider) {
      case 'google':
        // Exchange code for Google access token
        const googleTokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/oauth/google`,
            grant_type: 'authorization_code',
          }),
        })
        const googleTokenData = await googleTokenResponse.json()
        accessToken = googleTokenData.access_token

        // Get user info from Google
        const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        userInfo = await googleUserResponse.json()
        break

      case 'facebook':
        // Similar flow for Facebook
        // ...
        break

      case 'apple':
        // Similar flow for Apple
        // ...
        break

      default:
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/login?error=invalid_provider`)
    }

    // Find or create user in Payload
    const payload = await getPayloadHMR({ config })
    let user = await payload.find({
      collection: 'users',
      where: { email: { equals: userInfo.email } },
      limit: 1,
    })

    if (user.docs.length === 0) {
      // Create new user
      user = await payload.create({
        collection: 'users',
        data: {
          name: userInfo.name,
          email: userInfo.email,
          oauthProvider: provider,
          oauthId: userInfo.id,
          emailVerified: true, // OAuth emails are already verified
        },
      })
    }

    // Login user
    const loginResult = await payload.login({
      collection: 'users',
      data: { email: userInfo.email },
    })

    // Set cookie
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`)
    response.cookies.set('payload-token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/login?error=oauth_failed`)
  }
}
*/

export {}
