export interface CategoryHeroProps {
  // Category Data
  category: {
    name: string
    slug: string
    description?: string
    icon?: string // Lucide icon name (e.g., 'package', 'heart-pulse')
    badgeText?: string // Custom badge text (default: "PRODUCTCATEGORIE")
  }

  // Stats
  productCount: number
  brandCount?: number // Optional second stat

  // Optional Styling
  className?: string
}
