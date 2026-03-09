import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id: memberId } = await params
    const body = await req.json()
    const { companyRole: newRole } = body

    if (!newRole) {
      return NextResponse.json({ error: 'Nieuwe rol is verplicht' }, { status: 400 })
    }

    // Prevent non-admins from assigning admin role
    if (newRole === 'admin' && companyRole !== 'admin') {
      return NextResponse.json({ error: 'Alleen admins kunnen de admin-rol toewijzen' }, { status: 403 })
    }

    // Verify target user belongs to same company
    const targetUser = await payload.findByID({ collection: 'users', id: Number(memberId) })
    const userCompanyId = (user as any).companyAccount
    const targetCompanyId = (targetUser as any).companyAccount

    const userCid = typeof userCompanyId === 'object' ? userCompanyId?.id : userCompanyId
    const targetCid = typeof targetCompanyId === 'object' ? targetCompanyId?.id : targetCompanyId

    if (userCid !== targetCid) {
      return NextResponse.json({ error: 'Gebruiker behoort niet tot jouw bedrijf' }, { status: 403 })
    }

    await (payload.update as any)({
      collection: 'users',
      id: Number(memberId),
      data: { companyRole: newRole },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/account/team/[id] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id: memberId } = await params

    // Cannot remove yourself
    if (Number(memberId) === user.id) {
      return NextResponse.json({ error: 'Je kunt jezelf niet verwijderen uit het team' }, { status: 400 })
    }

    // Verify target belongs to same company
    const targetUser = await payload.findByID({ collection: 'users', id: Number(memberId) })
    const userCompanyId = (user as any).companyAccount
    const targetCompanyId = (targetUser as any).companyAccount

    const userCid = typeof userCompanyId === 'object' ? userCompanyId?.id : userCompanyId
    const targetCid = typeof targetCompanyId === 'object' ? targetCompanyId?.id : targetCompanyId

    if (userCid !== targetCid) {
      return NextResponse.json({ error: 'Gebruiker behoort niet tot jouw bedrijf' }, { status: 403 })
    }

    // Remove company association (don't delete the user)
    await (payload.update as any)({
      collection: 'users',
      id: Number(memberId),
      data: {
        companyAccount: null as any,
        companyRole: 'viewer',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/account/team/[id] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
