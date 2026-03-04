import type { RetourItem } from '../types'

export interface RetourReasonFormProps {
  items: RetourItem[]
  onSetReason: (id: string, reason: string) => void
  onNext: () => void
  onPrev: () => void
}
