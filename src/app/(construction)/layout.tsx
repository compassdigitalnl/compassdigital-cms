import type { ReactNode } from 'react'

/**
 * Construction Branch Layout
 *
 * Wraps all construction routes: services, projects, quote requests.
 * Clean layout without additional wrappers - relies on root layout for header/footer.
 */
export default function ConstructionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
