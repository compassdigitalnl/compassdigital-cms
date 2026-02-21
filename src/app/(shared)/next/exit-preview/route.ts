import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Exit Preview Mode
 *
 * This route is used by Payload CMS to exit draft/preview mode.
 * When a user clicks "Exit Preview" in the Payload admin, they are redirected here.
 */

export async function GET(request: NextRequest): Promise<Response> {
  const draft = draftMode()
  draft.disable()

  // Get the redirect URL from query params, or default to home
  const url = request.nextUrl.searchParams.get('redirect') || '/'

  // Redirect to the specified URL or home
  redirect(url)
}
