export interface SearchWidgetProps {
  onSearch?: (params: SearchParams) => void
  className?: string
}

export interface SearchParams {
  destination: string
  date: string
  travelers: number
}
