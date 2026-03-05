import type { Media } from '@/payload-types'

export interface BranchWithMeta {
  id: number
  name: string
  slug: string
  description?: string | null
  icon?: string
  image?: Media | number | null
  productCount?: number
}

export interface BrancheArchiveTemplate1Props {
  branches: BranchWithMeta[]
  totalProductCount?: number
}
