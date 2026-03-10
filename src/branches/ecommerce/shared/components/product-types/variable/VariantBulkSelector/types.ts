import type { VariantValue } from '@/branches/ecommerce/shared/lib/product-types'

export type {
  VariantBulkSelectorProps,
  VariantValue,
} from '@/branches/ecommerce/shared/lib/product-types'

export interface VariantCombination {
  combination: VariantValue[]
  key: string
  label: string
  stock: number | undefined
  disabled: boolean | undefined
  priceModifier: number
}
