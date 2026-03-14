export interface EnrollmentSidebarProps {
  course: {
    id: string | number
    title: string
    slug: string
    thumbnail?: {
      url?: string
      alt?: string
    } | string | null
    price: number
    originalPrice?: number | null
    discountPercentage?: number | null
    discountEndsAt?: string | null
    duration?: number | null
    totalLessons?: number | null
    certificate?: boolean | null
    includes?: Array<{ text: string }> | null
  }
}
