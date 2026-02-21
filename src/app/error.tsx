'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

import { Button } from '@/branches/shared/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Oeps!</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Er is iets misgegaan</h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We hebben een probleem ondervonden bij het laden van deze pagina. Dit kan een tijdelijk
          probleem zijn. Probeer het opnieuw of ga terug naar de homepage.
        </p>

        {/* Error Details (Only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mb-8 text-left bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <summary className="cursor-pointer font-semibold text-red-800 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
            )}
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="default" size="lg" onClick={() => reset()}>
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Probeer opnieuw
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Terug naar home
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Blijft het probleem zich voordoen?{' '}
            <Link href="/contact/" className="text-blue-600 hover:text-blue-700 underline">
              Neem contact op
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
