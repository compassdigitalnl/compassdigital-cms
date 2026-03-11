/**
 * Shared animation props — present on every block that uses animationFields()
 */
export interface BlockAnimationProps {
  enableAnimation?: boolean | null
  animationType?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in' | null
  animationDuration?: 'fast' | 'normal' | 'slow' | null
  animationDelay?: number | null
}
