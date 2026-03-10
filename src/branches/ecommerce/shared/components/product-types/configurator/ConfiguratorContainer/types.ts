import type { Product } from '@/payload-types'

export interface ConfiguratorContainerProps {
  product: Product
  className?: string
}

/** Raw step data from the product's configuratorConfig field */
export interface RawConfiguratorStep {
  title?: string
  description?: string
  required?: boolean
  options?: RawConfiguratorOption[]
}

/** Raw option data from the product's configuratorConfig field */
export interface RawConfiguratorOption {
  name?: string
  description?: string
  price?: number | string
  image?: unknown
  recommended?: boolean
}

/** Shape of the configuratorConfig field on a Product */
export interface ConfiguratorConfig {
  configuratorSteps?: RawConfiguratorStep[]
}
