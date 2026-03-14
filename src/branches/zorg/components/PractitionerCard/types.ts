export interface PractitionerCardProps {
  practitioner: {
    id: number
    name: string
    slug: string
    role?: string
    avatar?: { url: string; alt?: string } | null
    experience?: number
    specialties?: Array<{ specialty: string }>
    bookable?: boolean
    _status?: string
  }
  className?: string
}
