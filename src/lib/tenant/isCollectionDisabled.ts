/**
 * Check if a collection slug is in DISABLED_COLLECTIONS.
 * Used to conditionally exclude relationship fields that reference disabled collections.
 */
const _disabledSet = new Set(
  (process.env.DISABLED_COLLECTIONS || '').split(',').map((s) => s.trim()).filter(Boolean),
)

export function isCollectionDisabled(slug: string): boolean {
  return _disabledSet.has(slug)
}

export function isCollectionEnabled(slug: string): boolean {
  return !_disabledSet.has(slug)
}

/**
 * Filter a relationTo array, removing disabled collections.
 * Returns null if all collections are disabled (field should be omitted).
 */
export function filterRelationTo(slugs: string[]): string[] | null {
  const enabled = slugs.filter((s) => !_disabledSet.has(s))
  return enabled.length > 0 ? enabled : null
}
