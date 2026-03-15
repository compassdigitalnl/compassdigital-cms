export interface SpecItem {
  icon?: string
  label: string
  value: string
}

export interface SpecsGridProps {
  specs: SpecItem[]
  columns?: 2 | 3 | 4
  className?: string
}
