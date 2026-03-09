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
      return NextResponse.json({ requests: [] })
    }

    const companyId = typeof companyAccountId === 'object' ? companyAccountId.id : companyAccountId
    const companyRole = (user as any).companyRole || 'viewer'
    const canApprove = companyRole === 'admin' || companyRole === 'manager'

    // Admins/managers see all company requests; others see only their own
    const where: any = { company: { equals: companyId } }
    if (!canApprove) {
      where.requestedBy = { equals: user.id }
    }

    const result = await payload.find({
      collection: 'approval-requests',
      where,
      limit: 100,
      sort: '-createdAt',
      depth: 1,
    })

    const requests = result.docs.map((doc: any) => ({
      id: doc.id,
      orderReference: doc.orderReference,
      requestedBy: {
        id: typeof doc.requestedBy === 'object' ? doc.requestedBy.id : doc.requestedBy,
        name: typeof doc.requestedBy === 'object' ? doc.requestedBy.name || doc.requestedBy.email : '',
        email: typeof doc.requestedBy === 'object' ? doc.requestedBy.email : '',
        companyRole: typeof doc.requestedBy === 'object' ? doc.requestedBy.companyRole : undefined,
      },
      approver: doc.approver
        ? {
            id: typeof doc.approver === 'object' ? doc.approver.id : doc.approver,
            name: typeof doc.approver === 'object' ? doc.approver.name || doc.approver.email : '',
          }
        : null,
      status: doc.status,
      totalAmount: doc.totalAmount,
      reason: doc.reason || null,
      items: doc.items || [],
      note: doc.note || null,
      reviewNote: doc.reviewNote || null,
      reviewedAt: doc.reviewedAt || null,
      expiresAt: doc.expiresAt || null,
      createdAt: doc.createdAt,
    }))

    return NextResponse.json({ requests })
  } catch (err) {
    console.error('GET /api/account/approvals error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
