'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

/**
 * useAccountAuth — wraps useAuth() with login redirect + loading state.
 * Use in all account pages to guard against unauthenticated access.
 */
export function useAccountAuth() {
  const { user, status, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Once auth has resolved and user is not logged in, redirect
    if (status === 'loggedOut') {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/account')}`)
    }
  }, [status, router, pathname])

  return {
    user: user ?? null,
    isLoading: status === undefined,
    isLoggedIn: status === 'loggedIn',
    logout,
  }
}
