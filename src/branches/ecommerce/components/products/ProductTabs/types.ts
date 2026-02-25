export interface TabContent {
  id: string // Unique tab ID
  label: string // Tab label text
  badge?: string | number // Optional badge (e.g., review count "214")
  content: React.ReactNode // Tab panel content
  lazyLoad?: boolean // Load content on first click (default: false)
}

export type TabVariant = 'default' | 'pills' | 'boxed'

export interface ProductTabsProps {
  tabs: TabContent[] // Array of tab configurations
  defaultActiveTab?: string // ID of initially active tab (defaults to first tab)
  variant?: TabVariant // Visual style variant (default: 'default')
  enableMobileAccordion?: boolean // Convert to accordion on mobile <768px (default: true)
  enableKeyboardNav?: boolean // Arrow key navigation (default: true)
  className?: string // Additional CSS classes
  onTabChange?: (tabId: string) => void // Callback when tab changes
}
