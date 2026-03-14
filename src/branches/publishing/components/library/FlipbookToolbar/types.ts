export interface FlipbookToolbarProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  onToggleTOC: () => void
  magazineName: string
  editionTitle: string
}
