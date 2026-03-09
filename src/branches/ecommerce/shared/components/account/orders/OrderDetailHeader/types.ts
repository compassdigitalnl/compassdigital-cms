import type { OrderDetail } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/OrderDetailTemplate/types'

export interface OrderDetailHeaderProps {
  order: OrderDetail
  onReorder?: () => void
  onDownloadInvoice?: () => void
}
