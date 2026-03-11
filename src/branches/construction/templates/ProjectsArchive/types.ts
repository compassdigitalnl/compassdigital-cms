import type { ConstructionProject, ConstructionService } from '@/payload-types'

export interface ProjectsArchiveProps {
  projects: ConstructionProject[]
  categories: ConstructionService[]
  totalPages: number
  currentPage: number
  featuredProject?: ConstructionProject | null
}
