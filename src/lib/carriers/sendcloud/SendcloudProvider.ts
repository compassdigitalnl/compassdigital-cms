import type {
  CarrierProvider,
  CreateShipmentParams,
  ShipmentResult,
  ShippingMethod,
} from '../types'

const SENDCLOUD_API = 'https://panel.sendcloud.sc/api/v2'

/**
 * Sendcloud carrier provider.
 * Docs: https://docs.sendcloud.sc/api/v2/
 *
 * Auth: Basic Auth with API key + secret
 */
export class SendcloudProvider implements CarrierProvider {
  name = 'sendcloud'
  private authHeader: string

  constructor(
    private apiKey: string,
    private apiSecret: string,
  ) {
    this.authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  }

  async createShipment(params: CreateShipmentParams): Promise<ShipmentResult> {
    try {
      const parcelData: any = {
        name: params.toAddress.name,
        company_name: params.toAddress.companyName || '',
        address: params.toAddress.street,
        house_number: params.toAddress.houseNumber,
        city: params.toAddress.city,
        postal_code: params.toAddress.postalCode,
        country: params.toAddress.country || 'NL',
        email: params.toAddress.email || '',
        telephone: params.toAddress.phone || '',
        order_number: params.orderNumber,
        weight: params.weight ? Math.round(params.weight / 1000 * 1000) : 1000, // grams → grams (min 1kg default)
        request_label: params.requestLabel !== false,
        apply_shipping_rules: true,
      }

      // Set shipping method if specified
      if (params.shippingMethodId) {
        parcelData.shipment = { id: Number(params.shippingMethodId) }
      }

      // Add parcel items for customs
      if (params.items && params.items.length > 0) {
        parcelData.parcel_items = params.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          weight: (item.weight / 1000).toFixed(3), // grams → kg
          value: (item.value / 100).toFixed(2), // cents → EUR
          sku: item.sku || '',
          origin_country: 'NL',
        }))
      }

      const res = await fetch(`${SENDCLOUD_API}/parcels`, {
        method: 'POST',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parcel: parcelData }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error?.message || data.message || JSON.stringify(data)
        console.error('[Sendcloud] Create parcel error:', errorMsg)
        return { success: false, shipmentId: '', error: errorMsg }
      }

      const parcel = data.parcel
      return {
        success: true,
        shipmentId: String(parcel.id),
        trackingNumber: parcel.tracking_number || undefined,
        trackingUrl: parcel.tracking_url || undefined,
        labelUrl: parcel.label?.normal_printer?.[0] || parcel.label?.label_printer || undefined,
        carrier: parcel.carrier?.code || 'sendcloud',
      }
    } catch (error: any) {
      console.error('[Sendcloud] Create shipment error:', error)
      return { success: false, shipmentId: '', error: error.message }
    }
  }

  async getLabel(shipmentId: string): Promise<{ pdf: Buffer; filename: string }> {
    const res = await fetch(`${SENDCLOUD_API}/labels/${shipmentId}`, {
      headers: { Authorization: this.authHeader },
    })

    if (!res.ok) {
      throw new Error(`Sendcloud label download failed: ${res.status}`)
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    return {
      pdf: buffer,
      filename: `sendcloud-label-${shipmentId}.pdf`,
    }
  }

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const res = await fetch(`${SENDCLOUD_API}/shipping_methods`, {
      headers: { Authorization: this.authHeader },
    })

    if (!res.ok) {
      throw new Error(`Sendcloud shipping methods failed: ${res.status}`)
    }

    const data = await res.json()
    const methods = data.shipping_methods || []

    return methods.map((m: any) => ({
      id: m.id,
      name: m.name,
      carrier: m.carrier || 'unknown',
      minWeight: m.min_weight ? m.min_weight * 1000 : undefined, // kg → grams
      maxWeight: m.max_weight ? m.max_weight * 1000 : undefined,
      countries: m.countries?.map((c: any) => c.iso_2) || [],
    }))
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    const res = await fetch(`${SENDCLOUD_API}/parcels/${shipmentId}/cancel`, {
      method: 'POST',
      headers: { Authorization: this.authHeader },
    })

    return res.ok
  }
}
