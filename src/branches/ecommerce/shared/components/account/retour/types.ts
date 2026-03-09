import type { RetourItem } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/RetourTemplate/types'

export type { RetourItem }
export type Step = 'select' | 'reason' | 'confirm' | 'done'

export const returnReasons = [
  { value: 'defect', label: 'Product is defect / beschadigd' },
  { value: 'wrong_item', label: 'Verkeerd product ontvangen' },
  { value: 'not_as_described', label: 'Product wijkt af van beschrijving' },
  { value: 'no_longer_needed', label: 'Niet meer nodig' },
  { value: 'too_many', label: 'Te veel besteld' },
  { value: 'other', label: 'Anders' },
]
