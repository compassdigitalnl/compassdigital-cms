import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const doc = await payload.findByID({
      collection: 'approval-requests',
      id: Number(id),
      depth: 1,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
    }

    // Verify same company — check companyOwner matches user's company owner
    const userData = user as any
    const userOwnerId = userData.companyRole === 'owner' ? user.id : (typeof userData.companyOwner === 'object' ? userData.companyOwner?.id : userData.companyOwner)
    const docOwnerId = typeof (doc as any).companyOwner === 'object' ? (doc as any).companyOwner?.id : (doc as any).companyOwner
    if (userOwnerId !== docOwnerId) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Get company budget info from owner
    let monthlyBudget = undefined
    if (userOwnerId) {
      const ownerDoc = userOwnerId === user.id ? userData : await payload.findByID({ collection: 'users', id: userOwnerId })
      monthlyBudget = (ownerDoc as any).company?.monthlyBudget || undefined
    }

    const requestedBy = (doc as any).requestedBy
    const approver = (doc as any).approver

    const request = {
      id: doc.id,
      orderReference: (doc as any).orderReference,
      requestedBy: {
        id: typeof requestedBy === 'object' ? requestedBy.id : requestedBy,
        name: typeof requestedBy === 'object' ? requestedBy.name || requestedBy.email : '',
        email: typeof requestedBy === 'object' ? requestedBy.email : '',
      },
      approver: approver
        ? {
            id: typeof approver === 'object' ? approver.id : approver,
            name: typeof approver === 'object' ? approver.name || approver.email : '',
          }
        : null,
      status: (doc as any).status,
      totalAmount: (doc as any).totalAmount,
      reason: (doc as any).reason || null,
      items: (doc as any).items || [],
      note: (doc as any).note || null,
      reviewNote: (doc as any).reviewNote || null,
      reviewedAt: (doc as any).reviewedAt || null,
      expiresAt: (doc as any).expiresAt || null,
      createdAt: doc.createdAt,
    }

    return NextResponse.json({ request, monthlyBudget, monthlyUsed: 0 })
  } catch (err) {
    console.error('GET /api/account/approvals/[id] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}

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
    if (companyRole !== 'owner' && companyRole !== 'admin' && companyRole !== 'manager') {
      return NextResponse.json({ error: 'Onvoldoende rechten' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, reviewNote } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 })
    }

    // Verify same company
    const doc = await payload.findByID({ collection: 'approval-requests', id: Number(id) })
    const userData = user as any
    const userOwnerId = userData.companyRole === 'owner' ? user.id : (typeof userData.companyOwner === 'object' ? userData.companyOwner?.id : userData.companyOwner)
    const docOwnerId = typeof (doc as any).companyOwner === 'object' ? (doc as any).companyOwner?.id : (doc as any).companyOwner
    if (userOwnerId !== docOwnerId) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    if ((doc as any).status !== 'pending') {
      return NextResponse.json({ error: 'Dit verzoek is al beoordeeld' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'approval-requests',
      id: Number(id),
      data: {
        status,
        approver: user.id,
        reviewNote: reviewNote || undefined,
        reviewedAt: new Date().toISOString(),
      },
      depth: 1,
    })

    const requestedBy = (updated as any).requestedBy
    const approver = (updated as any).approver

    return NextResponse.json({
      request: {
        id: updated.id,
        orderReference: (updated as any).orderReference,
        requestedBy: {
          id: typeof requestedBy === 'object' ? requestedBy.id : requestedBy,
          name: typeof requestedBy === 'object' ? requestedBy.name || requestedBy.email : '',
          email: typeof requestedBy === 'object' ? requestedBy.email : '',
        },
        approver: approver
          ? {
              id: typeof approver === 'object' ? approver.id : approver,
              name: typeof approver === 'object' ? approver.name || approver.email : '',
            }
          : null,
        status: (updated as any).status,
        totalAmount: (updated as any).totalAmount,
        reason: (updated as any).reason || null,
        items: (updated as any).items || [],
        note: (updated as any).note || null,
        reviewNote: (updated as any).reviewNote || null,
        reviewedAt: (updated as any).reviewedAt || null,
        expiresAt: (updated as any).expiresAt || null,
        createdAt: updated.createdAt,
      },
    })
  } catch (err) {
    console.error('PATCH /api/account/approvals/[id] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
