export interface ChefCardProps {
  member: {
    id: number
    name: string
    slug: string
    role?: string
    avatar?: { url: string; alt?: string } | null
    bio?: string
    specialties?: Array<{ specialty: string }>
    _status?: string
  }
  className?: string
}
