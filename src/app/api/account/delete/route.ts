import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * DELETE /api/account/delete
 * Soft-delete / anonymize the user's account
 */
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Anonymize the user instead of hard-deleting
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        firstName: 'Verwijderd',
        lastName: 'Account',
        email: `deleted-${user.id}@removed.local`,
        phone: '',
        _status: 'draft', // Soft-disable
      } as any,
    })

    // Also anonymize customer record if exists
    try {
      const { docs: customers } = await payload.find({
        collection: 'customers',
        where: { email: { equals: user.email } },
        depth: 0,
        limit: 1,
      })

      if (customers[0]) {
        await payload.update({
          collection: 'customers',
          id: customers[0].id,
          data: {
            firstName: 'Verwijderd',
            lastName: 'Account',
            email: `deleted-${user.id}@removed.local`,
            phone: '',
            company: '',
          } as any,
        })
      }
    } catch {
      // Customer anonymization is best-effort
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account', message: error.message },
      { status: 500 },
    )
  }
}
