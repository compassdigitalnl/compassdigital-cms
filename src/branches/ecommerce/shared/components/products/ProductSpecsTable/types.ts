export interface SpecRow {
  label: string // Spec label (e.g., "SKU", "Material")
  value: string | React.ReactNode // Spec value (string or custom component)
  icon?: string // Lucide icon name for label
  copyable?: boolean // Show copy button (default: false)
  highlight?: boolean // Highlight this row (default: false)
  mono?: boolean // Use monospace font for value (codes, SKUs)
}

export interface SpecGroup {
  title: string // Group title (e.g., "Product Information")
  icon?: string // Lucide icon name for group header
  specs: SpecRow[] // Array of spec rows in this group
  defaultCollapsed?: boolean // Start collapsed (default: false)
}

export type SpecsVariant = 'default' | 'compact' | 'simple'

export interface ProductSpecsTableProps {
  groups: SpecGroup[] // Array of spec groups
  variant?: SpecsVariant // Visual style (default: 'default')
  enableCollapse?: boolean // Allow collapsing groups (default: true)
  className?: string // Additional CSS classes
  onCopy?: (value: string) => void // Callback when value is copied
}
