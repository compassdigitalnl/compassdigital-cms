/**
 * Carrier integration types for Sendcloud and MyParcel.
 */

export interface ShipmentAddress {
  name: string
  companyName?: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string // ISO 3166-1 alpha-2 (NL, BE, DE, etc.)
  email?: string
  phone?: string
}

export interface ShipmentItem {
  description: string
  quantity: number
  weight: number // grams
  value: number // EUR cents
  sku?: string
}

export interface CreateShipmentParams {
  orderId: string
  orderNumber: string
  shippingMethodId?: number | string
  weight?: number // grams, total
  toAddress: ShipmentAddress
  fromAddress?: ShipmentAddress
  items?: ShipmentItem[]
  requestLabel?: boolean
}

export interface ShipmentResult {
  success: boolean
  shipmentId: string
  trackingNumber?: string
  trackingUrl?: string
  labelUrl?: string
  carrier?: string
  error?: string
}

export interface ShippingMethod {
  id: number | string
  name: string
  carrier: string
  minWeight?: number
  maxWeight?: number
  countries?: string[]
  price?: number
}

export interface CarrierProvider {
  name: string
  createShipment(params: CreateShipmentParams): Promise<ShipmentResult>
  getLabel(shipmentId: string): Promise<{ pdf: Buffer; filename: string }>
  getShippingMethods(): Promise<ShippingMethod[]>
  cancelShipment(shipmentId: string): Promise<boolean>
}
