export interface TOCEntry {
  pageNumber: number
  title: string
}

export interface FlipbookTableOfContentsProps {
  entries: TOCEntry[]
  onGoToPage: (page: number) => void
  currentPage: number
  isOpen: boolean
  onClose: () => void
  totalPages?: number
}
