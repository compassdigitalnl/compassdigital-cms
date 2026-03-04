export interface OrderDetailItem {
  id: string
  product?: any
  title: string
  sku?: string
  ean?: string
  quantity: number
  price: number
  subtotal: number
}

export interface OrderDetail {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  paymentMethod: string
  paymentStatus: string
  trackingCode?: string | null
  trackingUrl?: string | null
  shippingProvider?: string | null
  items: OrderDetailItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    street: string
    houseNumber: string
    addition?: string
    postalCode: string
    city: string
    country?: string
    phone?: string
  }
  billingAddress: {
    sameAsShipping?: boolean
    firstName?: string
    lastName?: string
    company?: string
    street?: string
    houseNumber?: string
    addition?: string
    postalCode?: string
    city?: string
    country?: string
    kvk?: string
    vatNumber?: string
  }
  timeline?: Array<{
    event: string
    title?: string | null
    timestamp: string
    description?: string | null
    location?: string | null
  }>
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
}

export interface OrderDetailTemplateProps {
  order: OrderDetail
}
