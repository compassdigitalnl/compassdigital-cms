import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Verify user
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const companyAccountId = (user as any).companyAccount
    if (!companyAccountId) {
      return NextResponse.json({ error: 'Geen bedrijfsaccount gekoppeld' }, { status: 404 })
    }

    // Fetch company account
    const companyId = typeof companyAccountId === 'object' ? companyAccountId.id : companyAccountId
    const company = await payload.findByID({
      collection: 'company-accounts',
      id: companyId,
    })

    // Fetch all users in this company
    const teamUsers = await payload.find({
      collection: 'users',
      where: { companyAccount: { equals: companyId } },
      limit: 200,
      sort: 'name',
    })

    // Fetch pending invites
    const invites = await payload.find({
      collection: 'company-invites',
      where: {
        company: { equals: companyId },
        status: { in: ['pending'] },
      },
      limit: 50,
      sort: '-createdAt',
    })

    const members = teamUsers.docs.map((u: any) => ({
      id: u.id,
      name: u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
      email: u.email,
      companyRole: u.companyRole || 'viewer',
      lastLogin: u.lastLogin || null,
      status: u.status || 'active',
      monthlyBudgetLimit: u.monthlyBudgetLimit || null,
    }))

    const pendingInvites = invites.docs.map((i: any) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
      expiresAt: i.expiresAt,
      invitedBy: typeof i.invitedBy === 'object' ? i.invitedBy?.name || i.invitedBy?.email : null,
      createdAt: i.createdAt,
    }))

    return NextResponse.json({
      company: {
        id: company.id,
        companyName: (company as any).companyName,
        kvkNumber: (company as any).kvkNumber || null,
        vatNumber: (company as any).vatNumber || null,
        status: (company as any).status || 'active',
        memberCount: members.length,
      },
      members,
      invites: pendingInvites,
    })
  } catch (err) {
    console.error('GET /api/account/team error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
