export interface TeamSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onInviteClick: () => void
  canInvite: boolean
}
