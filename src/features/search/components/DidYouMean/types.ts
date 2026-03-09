export interface DidYouMeanProps {
  query: string
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}
