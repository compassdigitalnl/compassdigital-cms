import type { RetourItem } from '../types'

export interface RetourConfirmationProps {
  items: RetourItem[]
  onSubmit: () => void
  onPrev: () => void
  submitting: boolean
}
