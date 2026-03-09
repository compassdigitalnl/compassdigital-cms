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

    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const userData = user as any
    if (userData.accountType !== 'b2b') {
      return NextResponse.json({ error: 'Geen B2B account' }, { status: 404 })
    }

    // Determine the company owner
    const companyOwnerId = userData.companyRole === 'owner' ? user.id : userData.companyOwner
    if (!companyOwnerId) {
      return NextResponse.json({ error: 'Geen bedrijfsaccount gekoppeld' }, { status: 404 })
    }

    const ownerId = typeof companyOwnerId === 'object' ? companyOwnerId.id : companyOwnerId

    // Fetch company owner for budget data
    const ownerDoc = ownerId === user.id ? userData : await payload.findByID({ collection: 'users', id: ownerId })
    const company = (ownerDoc as any).company || {}

    // Build budget overview
    const budget = {
      monthlyBudget: company.monthlyBudget || undefined,
      quarterlyBudget: company.quarterlyBudget || undefined,
      monthlyUsed: 0,
      quarterlyUsed: 0,
      creditLimit: company.creditLimit || undefined,
      creditUsed: company.creditUsed || 0,
      paymentTerms: company.paymentTerms || '30',
    }

    // Get per-user budget info (only if admin/manager)
    const companyRole = userData.companyRole || 'viewer'
    let users: any[] = []

    if (companyRole === 'admin' || companyRole === 'manager' || companyRole === 'owner') {
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

      users = teamUsers.docs.map((u: any) => ({
        id: u.id,
        name: u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
        email: u.email,
        companyRole: u.companyRole || 'viewer',
        monthlyBudgetLimit: u.monthlyBudgetLimit || undefined,
        monthlyUsed: 0,
      }))
    }

    return NextResponse.json({ budget, users })
  } catch (err) {
    console.error('GET /api/account/budget error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
