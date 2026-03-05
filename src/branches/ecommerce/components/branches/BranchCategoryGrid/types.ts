export interface BranchCategory {
  name: string
  slug: string
  icon: string
  iconBg: string
  productCount: number
}

export interface BranchCategoryGridProps {
  title?: string
  titleIcon?: string
  categories: BranchCategory[]
  branchSlug: string
  className?: string
}
