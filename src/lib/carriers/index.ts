import type { CarrierProvider } from './types'
import { SendcloudProvider } from './sendcloud'
import { MyParcelProvider } from './myparcel'

export type { CarrierProvider, CreateShipmentParams, ShipmentResult, ShippingMethod, ShipmentAddress } from './types'
export { SendcloudProvider } from './sendcloud'
export { MyParcelProvider } from './myparcel'

/**
 * Get the carrier provider based on ecommerce settings.
 * Returns null if no carrier is configured.
 */
export function getCarrierProvider(settings: any): CarrierProvider | null {
  const provider = settings?.carrierIntegration?.provider
  const apiKey = settings?.carrierIntegration?.apiKey
  const apiSecret = settings?.carrierIntegration?.apiSecret

  if (!provider || provider === 'none' || !apiKey) {
    return null
  }

  switch (provider) {
    case 'sendcloud':
      if (!apiSecret) return null
      return new SendcloudProvider(apiKey, apiSecret)
    case 'myparcel':
      return new MyParcelProvider(apiKey)
    default:
      return null
  }
}
