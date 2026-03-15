export interface FeatureValue {
  type: 'check' | 'dash' | 'value'
  value?: string
  highlighted?: boolean
}

export interface FeatureRow {
  label: string
  values: FeatureValue[]
}

export interface FeatureCategory {
  name: string
  rows: FeatureRow[]
}

export interface PricingFeatureTableProps {
  title?: string
  subtitle?: string
  planNames: string[]
  highlightedPlanIndex?: number
  categories: FeatureCategory[]
  className?: string
}
