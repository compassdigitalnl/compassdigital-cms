import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const companyRole = (user as any).companyRole
    if (companyRole !== 'admin' && companyRole !== 'manager') {
      return NextResponse.json({ error: 'Onvoldoende rechten' }, { status: 403 })
    }

    const companyAccountId = (user as any).companyAccount
    if (!companyAccountId) {
      return NextResponse.json({ error: 'Geen bedrijfsaccount gekoppeld' }, { status: 404 })
    }

    const companyId = typeof companyAccountId === 'object' ? companyAccountId.id : companyAccountId
    const body = await req.json()
    const { email, role, message } = body

    if (!email || !role) {
      return NextResponse.json({ error: 'E-mail en rol zijn verplicht' }, { status: 400 })
    }

    // Check if user already exists in this company
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
        companyAccount: { equals: companyId },
      },
      limit: 1,
    })

    if (existingUser.docs.length > 0) {
      return NextResponse.json({ error: 'Deze gebruiker is al lid van het team' }, { status: 409 })
    }

    // Check for existing pending invite
    const existingInvite = await payload.find({
      collection: 'company-invites',
      where: {
        email: { equals: email },
        company: { equals: companyId },
        status: { equals: 'pending' },
      },
      limit: 1,
    })

    if (existingInvite.docs.length > 0) {
      return NextResponse.json({ error: 'Er staat al een uitnodiging open voor dit e-mailadres' }, { status: 409 })
    }

    // Generate invite token and expiry (7 days)
    const inviteToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invite = await payload.create({
      collection: 'company-invites',
      data: {
        company: companyId,
        email,
        role,
        status: 'pending',
        token: inviteToken,
        expiresAt: expiresAt.toISOString(),
        invitedBy: user.id,
        message: message || undefined,
      },
    })

    return NextResponse.json({ success: true, invite: { id: invite.id } })
  } catch (err) {
    console.error('POST /api/account/team/invite error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const companyRole = (user as any).companyRole
    if (companyRole !== 'admin' && companyRole !== 'manager') {
      return NextResponse.json({ error: 'Onvoldoende rechten' }, { status: 403 })
    }

    const inviteId = req.nextUrl.searchParams.get('id')
    if (!inviteId) {
      return NextResponse.json({ error: 'Uitnodigings-ID ontbreekt' }, { status: 400 })
    }

    await payload.update({
      collection: 'company-invites',
      id: Number(inviteId),
      data: { status: 'revoked' },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/account/team/invite error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
