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

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', message },
      { status: 500 },
    )
  }
}
