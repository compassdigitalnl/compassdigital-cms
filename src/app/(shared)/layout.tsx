import type { ReactNode } from 'react'
import './legal.css'

/**
 * Shared Branch Layout
 *
 * Wraps all shared routes: auth (login, register), legal pages, account, search, etc.
 * Includes legal.css for styling privacy/terms pages.
 */
export default function SharedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
