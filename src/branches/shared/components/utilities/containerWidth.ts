/**
 * Container Width Utility
 *
 * Maps Theme.containerWidth setting to Tailwind max-width classes.
 * Ensures consistent container widths across all layout components.
 *
 * Usage:
 * ```tsx
 * import { getContainerMaxWidth } from '@/branches/shared/components/utilities/containerWidth'
 *
 * const containerClass = getContainerMaxWidth(theme?.containerWidth)
 * <div className={`${containerClass} mx-auto`}>...</div>
 * ```
 */

/**
 * Get Tailwind max-width class from Theme containerWidth setting
 *
 * @param containerWidth - Theme containerWidth value ('lg' | 'xl' | '2xl' | '7xl')
 * @returns Tailwind max-width class
 *
 * Mappings:
 * - 'lg'  → 'max-w-screen-lg'  (1024px) - Desktop
 * - 'xl'  → 'max-w-screen-xl'  (1280px) - Wide
 * - '2xl' → 'max-w-screen-2xl' (1536px) - Extra Wide (default)
 * - '7xl' → 'max-w-[1792px]'   (1792px) - Ultra Wide
 */
export function getContainerMaxWidth(containerWidth?: string | null): string {
  switch (containerWidth) {
    case 'lg':
      return 'max-w-screen-lg' // 1024px - Desktop
    case 'xl':
      return 'max-w-screen-xl' // 1280px - Wide
    case '2xl':
      return 'max-w-screen-2xl' // 1536px - Extra Wide
    case '7xl':
      return 'max-w-[1792px]' // 1792px - Ultra Wide (custom)
    default:
      return 'max-w-screen-2xl' // Default: 1536px
  }
}
