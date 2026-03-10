import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/account/licenses/[id]/deactivate
 * Deactivate a device activation for a license
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: licenseId } = await params
    const body = await request.json()
    const { activationId } = body

    if (!activationId) {
      return NextResponse.json(
        { error: 'activationId is required' },
        { status: 400 },
      )
    }

    // Verify the license belongs to the current user
    const license = await payload.findByID({
      collection: 'licenses',
      id: licenseId,
      depth: 0,
    })

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 },
      )
    }

    const licenseUserId = typeof (license as any).user === 'object' ? (license as any).user?.id : (license as any).user
    if (licenseUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: license does not belong to you' },
        { status: 403 },
      )
    }

    // Update the activation status
    await payload.update({
      collection: 'license-activations',
      id: activationId,
      data: {
        status: 'deactivated',
        deactivatedAt: new Date().toISOString(),
      },
    })

    // Update license currentActivations count
    const currentActivations = (license as any).currentActivations ?? 0
    if (currentActivations > 0) {
      await payload.update({
        collection: 'licenses',
        id: licenseId,
        data: {
          currentActivations: currentActivations - 1,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error deactivating device:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate device', message },
      { status: 500 },
    )
  }
}
