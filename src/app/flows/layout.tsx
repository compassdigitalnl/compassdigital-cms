import type { ReactNode } from 'react'

/**
 * Standalone layout for the visual Flow Editor.
 * No header/footer/sidebar — just a full-screen canvas.
 */
export default function FlowsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
