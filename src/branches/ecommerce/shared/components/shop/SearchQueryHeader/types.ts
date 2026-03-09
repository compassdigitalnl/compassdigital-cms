export interface SearchQueryHeaderProps {
  query: string
  resultCount: number
  totalCount?: number
  didYouMean?: string
  onClearSearch?: () => void
  onDidYouMeanClick?: (suggestion: string) => void
  className?: string
}
