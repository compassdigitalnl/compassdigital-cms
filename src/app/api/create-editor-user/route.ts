// v2 - trigger redeploy
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * TEMPORARY ENDPOINT - ONE-TIME USE ONLY!
 * Creates an editor user for testing.
 * DELETE THIS FILE AFTER USE!
 *
 * Usage:
 * GET /api/create-editor-user?secret=mygeneratedsecret&email=editor@compassdigital.nl&password=Editor1234!
 */

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Security check - require PAYLOAD_SECRET
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = req.nextUrl.searchParams.get('email') || 'editor@compassdigital.nl'
  const password = req.nextUrl.searchParams.get('password') || 'Editor1234!'
  const name = req.nextUrl.searchParams.get('name') || 'Editor User'

  try {
    const payload = await getPayload({ config })

    // Check if user already exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        success: false,
        message: `User with email ${email} already exists`,
        user: { id: existing.docs[0].id, email: existing.docs[0].email, roles: existing.docs[0].roles },
      })
    }

    // Create the editor user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        roles: ['editor'],
      },
    })

    return NextResponse.json({
      success: true,
      message: `Editor user created! DELETE THIS ENDPOINT NOW!`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
      },
      loginUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
      credentials: {
        email,
        password,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
