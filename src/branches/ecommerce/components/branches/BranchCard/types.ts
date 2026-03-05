import type { LucideIcon } from 'lucide-react'
import type { Media } from '@/payload-types'

export interface BranchCardProps {
  id: number
  name: string
  slug: string
  description?: string | null
  icon?: LucideIcon
  image?: Media | number | null
  productCount?: number
  className?: string
}
