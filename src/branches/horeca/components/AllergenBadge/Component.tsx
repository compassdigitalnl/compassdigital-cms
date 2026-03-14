import React from 'react'
import type { AllergenBadgeProps } from './types'

const ALLERGEN_ICONS: Record<string, string> = {
  gluten: '\uD83C\uDF3E',
  noten: '\uD83E\uDD5C',
  melk: '\uD83E\uDD5B',
  ei: '\uD83E\uDD5A',
  vis: '\uD83D\uDC1F',
  schaaldieren: '\uD83E\uDD90',
  soja: '\uD83E\uDED8',
  selderij: '\uD83C\uDF3F',
  mosterd: '\u24C2\uFE0F',
  sesam: '\u26AA',
  lupine: '\uD83C\uDF38',
  weekdieren: '\uD83D\uDC1A',
  vegetarisch: '\uD83C\uDF31',
  veganistisch: '\uD83C\uDF3F',
}

export const AllergenBadge: React.FC<AllergenBadgeProps> = ({ allergen, className = '' }) => {
  const normalized = allergen.toLowerCase().trim()
  const icon = ALLERGEN_ICONS[normalized]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[var(--color-base-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-base-700)] ${className}`}
      title={allergen}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span className="capitalize">{allergen}</span>
    </span>
  )
}

export default AllergenBadge
