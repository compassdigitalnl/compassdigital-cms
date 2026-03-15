export interface BrandCategory {
  name: string
  slug: string
  icon?: string
  productCount: number
}

export interface BrandCategoriesProps {
  categories: BrandCategory[]
  brandSlug: string
  className?: string
}
