export interface ReviewBreakdownProps {
  rating: number
  reviewCount: number
  breakdown?: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
