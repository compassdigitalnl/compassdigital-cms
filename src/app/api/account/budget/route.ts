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

    const companyAccountId = (user as any).companyAccount
    if (!companyAccountId) {
      return NextResponse.json({ error: 'Geen bedrijfsaccount gekoppeld' }, { status: 404 })
    }

    const companyId = typeof companyAccountId === 'object' ? companyAccountId.id : companyAccountId
    const company = await payload.findByID({
      collection: 'company-accounts',
      id: companyId,
    })

    const companyData = company as any

    // Build budget overview
    // In a real implementation, monthlyUsed/quarterlyUsed would be calculated
    // from actual order totals for the current period. For now, return 0.
    const budget = {
      monthlyBudget: companyData.monthlyBudget || undefined,
      quarterlyBudget: companyData.quarterlyBudget || undefined,
      monthlyUsed: 0,
      quarterlyUsed: 0,
      creditLimit: companyData.creditLimit || undefined,
      creditUsed: companyData.creditUsed || 0,
      paymentTerms: companyData.paymentTerms || '30',
    }

    // Get per-user budget info (only if admin/manager)
    const companyRole = (user as any).companyRole || 'viewer'
    let users: any[] = []

    if (companyRole === 'admin' || companyRole === 'manager') {
      const teamUsers = await payload.find({
        collection: 'users',
        where: { companyAccount: { equals: companyId } },
        limit: 200,
        sort: 'name',
      })

      users = teamUsers.docs.map((u: any) => ({
        id: u.id,
        name: u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
        email: u.email,
        companyRole: u.companyRole || 'viewer',
        monthlyBudgetLimit: u.monthlyBudgetLimit || undefined,
        monthlyUsed: 0, // Would be calculated from orders
      }))
    }

    return NextResponse.json({ budget, users })
  } catch (err) {
    console.error('GET /api/account/budget error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
