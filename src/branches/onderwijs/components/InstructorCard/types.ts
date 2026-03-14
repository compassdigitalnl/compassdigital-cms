export interface InstructorCardProps {
  instructor: {
    id: string | number
    name: string
    title?: string | null
    role?: string | null
    photo?: {
      url?: string
      alt?: string
    } | string | null
    bio?: string | null
    shortBio?: string | null
    rating?: number | null
    avgRating?: number | null
    totalStudents?: number | null
    courseCount?: number | null
  }
  className?: string
}
