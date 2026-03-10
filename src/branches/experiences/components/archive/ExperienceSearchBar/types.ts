export interface ExperienceSearchBarProps {
  categories?: Array<{ label: string; value: string }>
  onSearch?: (filters: { category?: string; date?: string; groupSize?: string }) => void
  className?: string
}
