import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { jwtVerify } from 'jose'

export async function GET(request: NextRequest) {
  const steps: string[] = []

  try {
    const payload = await getPayload({ config })

    // Step 1: Extract token from cookie
    const cookieToken = request.cookies.get('payload-token')?.value
    const authHeader = request.headers.get('Authorization')
    const headerToken = authHeader?.startsWith('JWT ') ? authHeader.slice(4) : null

    const token = headerToken || cookieToken
    steps.push(`1. Token source: ${headerToken ? 'header' : cookieToken ? 'cookie' : 'NONE'}`)
    steps.push(`   Token length: ${token?.length || 0}`)

    if (!token) {
      return NextResponse.json({ steps, error: 'No token found' })
    }

    // Step 2: Verify JWT
    const secretKey = new TextEncoder().encode(payload.secret)
    steps.push(`2. Secret length: ${payload.secret.length}`)

    const { payload: decoded } = await jwtVerify(token, secretKey)
    steps.push(`3. JWT decoded OK: ${JSON.stringify(decoded)}`)

    // Step 3: Find collection
    const collection = payload.collections[decoded.collection as string]
    steps.push(`4. Collection found: ${!!collection}, slug: ${decoded.collection}`)
    if (!collection) {
      return NextResponse.json({ steps, error: 'Collection not found' })
    }

    steps.push(`5. Auth config: useSessions=${collection.config.auth.useSessions}, verify=${collection.config.auth.verify}, depth=${collection.config.auth.depth}`)

    // Step 4: Find user
    try {
      const user = await payload.findByID({
        id: decoded.id as number,
        collection: decoded.collection as string,
        depth: collection.config.auth.depth,
      })
      steps.push(`6. User found: ${!!user}, email: ${(user as any)?.email}`)
      steps.push(`   _verified: ${(user as any)?._verified}`)
      steps.push(`   sessions count: ${(user as any)?.sessions?.length || 0}`)
      steps.push(`   session ids: ${JSON.stringify((user as any)?.sessions?.map((s: any) => s.id))}`)

      // Step 5: Session check
      if (collection.config.auth.useSessions) {
        const existingSession = ((user as any).sessions || []).find(
          (s: any) => s.id === decoded.sid,
        )
        steps.push(`7. Session check: sid=${decoded.sid}, found=${!!existingSession}`)
      } else {
        steps.push(`7. Sessions DISABLED - no check needed`)
      }
    } catch (findError: any) {
      steps.push(`6. FINDBYID ERROR: ${findError.message}`)
      steps.push(`   Cause: ${findError.cause?.message || 'none'}`)
    }

    return NextResponse.json({ steps })
  } catch (err: any) {
    steps.push(`ERROR: ${err.message}`)
    return NextResponse.json({ steps, error: err.message })
  }
}
