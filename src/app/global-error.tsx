'use client'

/**
 * Global Error Boundary
 * Catches React rendering errors in App Router and reports them to Sentry
 * Required for proper error reporting in Next.js App Router
 *
 * Note: This only catches errors in the app directory during rendering.
 * For API routes, use try/catch blocks with Sentry.captureException().
 */

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        {/* This is the default Next.js error component. You can customize this if needed. */}
        <NextError statusCode={500} />
      </body>
    </html>
  )
}
