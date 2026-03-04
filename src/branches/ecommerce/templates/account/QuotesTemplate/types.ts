import type { QuoteProduct } from '@/branches/ecommerce/components/account/quotes'
import type { QuoteFormData } from '@/branches/ecommerce/components/account/quotes'

export type { QuoteProduct, QuoteFormData }

export interface QuotesTemplateProps {
  products: QuoteProduct[]
  formData: QuoteFormData
  onQuantityChange: (id: string, quantity: number) => void
  onRemoveProduct: (id: string) => void
  onFormChange: (field: keyof QuoteFormData, value: string | boolean) => void
  onSubmit: () => void
  isSubmitting?: boolean
  isLoading?: boolean
}
