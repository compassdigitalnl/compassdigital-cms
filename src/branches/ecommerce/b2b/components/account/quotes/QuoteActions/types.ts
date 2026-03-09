export interface QuoteActionsProps {
  onReject: (reason: string) => void
  onCancel: () => void
  rejecting: boolean
}
