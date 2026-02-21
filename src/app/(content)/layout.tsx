import type { ReactNode } from 'react'

/**
 * Content Branch Layout
 *
 * Wraps all content routes: blog, faq, merken (brands), etc.
 * Currently transparent - just renders children.
 * Can be extended with content-specific context providers.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
