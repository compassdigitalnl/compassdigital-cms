import type { QuoteProduct } from '@/branches/ecommerce/b2b/components/account/quotes'
import type { QuoteFormData } from '@/branches/ecommerce/b2b/components/account/quotes'

export type { QuoteProduct, QuoteFormData }

export interface QuotesTemplateProps {
  products: QuoteProduct[]
  formData: QuoteFormData
  onQuantityChange: (id: string, quantity: number) => void
  onRemoveProduct: (id: string) => void
  onAddProduct?: (product: QuoteProduct) => void
  onFormChange: (field: keyof QuoteFormData, value: string | boolean) => void
  onSubmit: () => void
  isSubmitting?: boolean
  isLoading?: boolean
  contactPhone?: string
  contactEmail?: string
}
