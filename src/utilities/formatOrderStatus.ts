export interface OrderStatusInfo {
  label: string
  color: string
  bg: string
  border: string
}

const statusMap: Record<string, OrderStatusInfo> = {
  pending: {
    label: 'In afwachting',
    color: '#94A3B8',
    bg: '#F5F7FA',
    border: '#E8ECF1',
  },
  paid: {
    label: 'Betaald',
    color: '#00897B',
    bg: '#E0F2F1',
    border: '#80CBC4',
  },
  processing: {
    label: 'In behandeling',
    color: '#F59E0B',
    bg: '#FFF8E1',
    border: '#FFE082',
  },
  shipped: {
    label: 'Onderweg',
    color: '#2196F3',
    bg: '#E3F2FD',
    border: '#90CAF9',
  },
  delivered: {
    label: 'Afgeleverd',
    color: '#00C853',
    bg: '#E8F5E9',
    border: '#A5D6A7',
  },
  cancelled: {
    label: 'Geannuleerd',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  refunded: {
    label: 'Terugbetaald',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
}

export function formatOrderStatus(status: string): OrderStatusInfo {
  return statusMap[status] || statusMap.pending
}

/**
 * Payment status labels
 */
const paymentStatusMap: Record<string, OrderStatusInfo> = {
  pending: {
    label: 'In afwachting',
    color: '#F59E0B',
    bg: '#FFF8E1',
    border: '#FFE082',
  },
  paid: {
    label: 'Betaald',
    color: '#00C853',
    bg: '#E8F5E9',
    border: '#A5D6A7',
  },
  failed: {
    label: 'Mislukt',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  refunded: {
    label: 'Terugbetaald',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
}

export function formatPaymentStatus(status: string): OrderStatusInfo {
  return paymentStatusMap[status] || paymentStatusMap.pending
}
