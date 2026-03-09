export interface OrderAddress {
  company?: string
  name?: string
  attention?: string
  street: string
  postalCode: string
  city: string
  country?: string
  kvk?: string
  vatNumber?: string
}

export interface OrderAddressesProps {
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  className?: string
}
