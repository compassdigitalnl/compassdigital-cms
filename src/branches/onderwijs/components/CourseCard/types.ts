export interface CourseCardProps {
  course: {
    id: string | number
    title: string
    slug: string
    thumbnail?: {
      url?: string
      alt?: string
    } | string | null
    category?: {
      name?: string
      slug?: string
    } | string | null
    instructor?: {
      name?: string
      photo?: {
        url?: string
      } | string | null
    } | string | null
    level?: 'beginner' | 'gevorderd' | 'expert' | string | null
    price: number
    originalPrice?: number | null
    rating?: number | null
    reviewCount?: number | null
    studentCount?: number | null
    duration?: number | null
    totalLessons?: number | null
    featured?: boolean | null
    createdAt?: string | null
  }
  className?: string
}
