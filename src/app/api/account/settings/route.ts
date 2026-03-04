import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * PATCH /api/account/settings
 * Update user profile or password
 */
export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: Record<string, any> = {}

    // Profile fields
    if (body.firstName !== undefined) updateData.firstName = body.firstName
    if (body.lastName !== undefined) updateData.lastName = body.lastName
    if (body.phone !== undefined) updateData.phone = body.phone

    // Password change
    if (body.password && body.passwordConfirm) {
      updateData.password = body.password
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
    })

    // Also update customer record if exists
    try {
      const { docs: customers } = await payload.find({
        collection: 'customers',
        where: { email: { equals: user.email } },
        depth: 0,
        limit: 1,
      })

      if (customers[0]) {
        const customerUpdate: Record<string, any> = {}
        if (body.firstName !== undefined) customerUpdate.firstName = body.firstName
        if (body.lastName !== undefined) customerUpdate.lastName = body.lastName
        if (body.phone !== undefined) customerUpdate.phone = body.phone
        if (body.company !== undefined) customerUpdate.company = body.company

        if (Object.keys(customerUpdate).length > 0) {
          await payload.update({
            collection: 'customers',
            id: customers[0].id,
            data: customerUpdate,
          })
        }
      }
    } catch {
      // Customer update is best-effort
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', message: error.message },
      { status: 500 },
    )
  }
}
