export interface Invoice {
  id: string
  orderNumber: string
  invoiceNumber: string
  createdAt: string
  total: number
  paymentStatus: string
  invoicePDF?: any
}

export interface InvoiceStats {
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
}

export interface InvoicesTemplateProps {
  invoices: Invoice[]
  stats: InvoiceStats
  totalDocs: number
  totalPages: number
  page: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}
