import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Get a Lucide icon component by name string (pascal-case).
 * Returns `fallback` when the name doesn't match any icon.
 */
export function getIcon(name: string | undefined | null, fallback?: LucideIcon): LucideIcon | null {
  if (!name) return fallback ?? null
  const icons = LucideIcons as Record<string, LucideIcon | undefined>
  return icons[name] ?? fallback ?? null
}
