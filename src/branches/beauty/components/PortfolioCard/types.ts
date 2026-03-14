export interface PortfolioCardProps {
  item: {
    id: number
    title: string
    slug: string
    shortDescription?: string
    featuredImage?: { url: string; alt?: string } | null
    gallery?: Array<{ image?: { url: string; alt?: string } | null }> | null
    _status?: string
  }
  className?: string
}
