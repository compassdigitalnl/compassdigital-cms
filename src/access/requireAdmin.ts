import { NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { checkRole } from './utilities'
import type { User } from '@/payload-types'

/**
 * Require admin authentication for API routes.
 * Returns the authenticated user or a 401/403 NextResponse.
 *
 * Usage:
 *   const authResult = await requireAdmin()
 *   if (authResult instanceof NextResponse) return authResult
 *   const user = authResult // typed as User
 */
export async function requireAdmin(): Promise<User | NextResponse> {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await getHeaders()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    if (!checkRole(['admin'], user as User)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 },
      )
    }

    return user as User
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 },
    )
  }
}
