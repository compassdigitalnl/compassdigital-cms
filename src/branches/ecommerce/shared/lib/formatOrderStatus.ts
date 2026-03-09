export interface OrderStatusInfo {
  label: string
  color: string
  bg: string
  border: string
}

const statusMap: Record<string, OrderStatusInfo> = {
  pending: {
    label: 'In afwachting',
    color: 'var(--color-grey-mid)',
    bg: '#F5F7FA',
    border: '#E8ECF1',
  },
  paid: {
    label: 'Betaald',
    color: 'var(--color-primary)',
    bg: '#E0F2F1',
    border: '#80CBC4',
  },
  processing: {
    label: 'In behandeling',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-light)',
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
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
    border: '#A5D6A7',
  },
  cancelled: {
    label: 'Geannuleerd',
    color: 'var(--color-error)',
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
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-light)',
    border: '#FFE082',
  },
  paid: {
    label: 'Betaald',
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
    border: '#A5D6A7',
  },
  failed: {
    label: 'Mislukt',
    color: 'var(--color-error)',
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
