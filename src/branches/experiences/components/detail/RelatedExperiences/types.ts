export interface RelatedExperience {
  title: string
  slug: string
  category?: string
  thumbnail?: string
  duration?: string
  personRange?: string
  rating?: number
  pricePerPerson: number
}

export interface RelatedExperiencesProps {
  title?: string
  experiences: RelatedExperience[]
  className?: string
}
