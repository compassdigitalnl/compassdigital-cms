import type { Category } from '../hooks/useCategoryNavigation'

export type MegaNavProps = {
  isOpen: boolean
  onClose: () => void
  navTop: number
  categoryNav: {
    rootCategories: Category[]
    l2Categories: Category[]
    l3Categories: Category[]
    activeL1: string | null
    activeL2: string | null
    loading: boolean
    error: string | null
    handleL1Select: (id: string) => void
    handleL2Select: (id: string) => void
  }
  categorySettings?: {
    showCategoryIcons?: boolean
    showProductCount?: boolean
    maxCategories?: number
  }
  primaryColor: string
  secondaryColor: string
}
