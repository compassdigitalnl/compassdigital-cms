import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/licenses
 * Fetch licenses for the current user with activation details and stats
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch licenses for user
    const result = await payload.find({
      collection: 'licenses',
      where: {
        user: { equals: user.id },
      },
      depth: 2,
      sort: '-createdAt',
    })

    // Fetch activations for each license
    const licensesWithActivations = await Promise.all(
      result.docs.map(async (license: any) => {
        const activations = await payload.find({
          collection: 'license-activations',
          where: {
            license: { equals: license.id },
          },
          depth: 1,
          sort: '-createdAt',
        })
        return {
          ...license,
          activations: activations.docs,
        }
      }),
    )

    // Compute stats
    let activeLicenses = 0
    let totalDevices = 0
    let actionRequired = 0
    let totalDownloads = 0

    for (const license of licensesWithActivations as any[]) {
      if (license.status === 'active') {
        activeLicenses++
      }

      const activeActivations = (license.activations || []).filter(
        (a: any) => a.status === 'active',
      )
      totalDevices += activeActivations.length

      // Action required: license near max activations or expiring soon
      if (license.maxActivations && license.currentActivations >= license.maxActivations) {
        actionRequired++
      }

      totalDownloads += license.downloadCount ?? 0
    }

    return NextResponse.json({
      success: true,
      docs: licensesWithActivations,
      stats: {
        activeLicenses,
        totalDevices,
        actionRequired,
        totalDownloads,
      },
    })
  } catch (error: any) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses', message: error.message },
      { status: 500 },
    )
  }
}
