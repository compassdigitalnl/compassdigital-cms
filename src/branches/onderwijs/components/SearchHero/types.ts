export interface SearchHeroProps {
  heading?: string
  subheading?: string
  categories: Array<{
    id: string | number
    name: string
    slug: string
  }>
  stats?: {
    courses?: string | number
    students?: string | number
    experts?: string | number
  }
  backgroundStyle?: 'dark' | 'light'
  showSearch?: boolean
  showStats?: boolean
  className?: string
}
