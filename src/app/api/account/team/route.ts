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

    const userData = user as any
    if (userData.accountType !== 'b2b') {
      return NextResponse.json({ error: 'Geen B2B account' }, { status: 404 })
    }

    // Determine the company owner (either self if owner, or the companyOwner field)
    const companyOwnerId = userData.companyRole === 'owner' ? user.id : userData.companyOwner
    if (!companyOwnerId) {
      return NextResponse.json({ error: 'Geen bedrijfsaccount gekoppeld' }, { status: 404 })
    }

    const ownerId = typeof companyOwnerId === 'object' ? companyOwnerId.id : companyOwnerId

    // Fetch company owner to get company details
    const ownerDoc = ownerId === user.id ? userData : await payload.findByID({ collection: 'users', id: ownerId })
    const company = (ownerDoc as any).company || {}

    // Fetch all users in this company (owner + team members referencing this owner)
    const teamUsers = await payload.find({
      collection: 'users',
      where: {
        or: [
          { id: { equals: ownerId } },
          { companyOwner: { equals: ownerId } },
        ],
      },
      limit: 200,
      sort: 'name',
    })

    // Fetch pending invites
    const invites = await payload.find({
      collection: 'company-invites',
      where: {
        companyOwner: { equals: ownerId },
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
      status: u.customerStatus || 'active',
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
        id: ownerId,
        companyName: company.name || '',
        kvkNumber: company.kvkNumber || null,
        vatNumber: company.vatNumber || null,
        status: company.status || 'active',
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
