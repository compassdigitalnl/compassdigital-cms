export interface CategoryCardProps {
  category: {
    id: string | number
    name: string
    slug: string
    icon?: string | null
    color?: string | null
    courseCount?: number | null
    description?: string | null
  }
  className?: string
}
