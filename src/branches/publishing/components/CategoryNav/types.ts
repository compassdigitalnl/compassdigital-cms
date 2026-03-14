export interface CategoryNavCategory {
  id: string | number
  title: string
  slug: string
  /**
   * Number of articles in this category (optional)
   */
  count?: number
}

export interface CategoryNavProps {
  /**
   * Array of categories to display
   */
  categories: CategoryNavCategory[]

  /**
   * Currently active category slug (null for "all")
   */
  activeCategory: string | null

  /**
   * Callback when a category is selected
   */
  onCategoryChange: (slug: string | null) => void

  /**
   * Show an "Alle" (All) button at the start
   * @default true
   */
  showAll?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}
