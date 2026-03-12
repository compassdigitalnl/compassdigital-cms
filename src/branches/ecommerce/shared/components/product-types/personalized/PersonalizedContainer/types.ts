import type { Product } from '@/payload-types'

export interface PersonalizedContainerProps {
  product: Product
  className?: string
}

/** Raw personalization config from the product's personalizationConfig field */
export interface PersonalizationConfig {
  personalizationOptions?: RawPersonalizationOption[]
  baseProductionDays?: number
  rushAvailable?: boolean
  rushFee?: number
  availableFonts?: { fontName: string }[]
  presetColors?: { colorName: string; colorCode: string }[]
}

export interface RawPersonalizationOption {
  id?: string
  fieldName: string
  fieldType: 'text' | 'font' | 'color' | 'image'
  required?: boolean
  maxLength?: number | null
  priceModifier?: number | null
  productionTimeAdded?: number | null
  placeholder?: string
}
