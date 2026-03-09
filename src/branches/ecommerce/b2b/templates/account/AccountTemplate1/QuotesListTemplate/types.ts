import type { QuoteSummary } from '@/branches/ecommerce/b2b/components/account/quotes'

export interface QuotesListTemplateProps {
  quotes: QuoteSummary[]
  isLoading: boolean
}
