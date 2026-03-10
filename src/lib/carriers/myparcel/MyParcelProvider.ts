import type {
  CarrierProvider,
  CreateShipmentParams,
  ShipmentResult,
  ShippingMethod,
} from '../types'

const MYPARCEL_API = 'https://api.myparcel.nl'

/**
 * MyParcel carrier provider.
 * Docs: https://developer.myparcel.nl/
 *
 * Auth: Bearer token with API key
 */
export class MyParcelProvider implements CarrierProvider {
  name = 'myparcel'

  constructor(private apiKey: string) {}

  private get headers() {
    return {
      Authorization: `bearer ${this.apiKey}`,
      'Content-Type': 'application/vnd.shipment+json;charset=utf-8',
    }
  }

  async createShipment(params: CreateShipmentParams): Promise<ShipmentResult> {
    try {
      // Package type: 1 = package, 2 = mailbox, 3 = letter, 4 = digital stamp
      const packageType = 1

      const shipmentData: any = {
        recipient: {
          cc: params.toAddress.country || 'NL',
          city: params.toAddress.city,
          street: params.toAddress.street,
          number: params.toAddress.houseNumber,
          postal_code: params.toAddress.postalCode.replace(/\s/g, ''),
          person: params.toAddress.name,
          company: params.toAddress.companyName || undefined,
          email: params.toAddress.email || undefined,
          phone: params.toAddress.phone || undefined,
        },
        options: {
          package_type: packageType,
          label_description: params.orderNumber,
        },
        carrier: 1, // 1 = PostNL (default)
        reference_identifier: params.orderNumber,
      }

      // Set carrier based on shipping method if specified
      if (params.shippingMethodId) {
        shipmentData.carrier = Number(params.shippingMethodId)
      }

      // Set weight
      if (params.weight) {
        shipmentData.physical_properties = {
          weight: params.weight, // grams
        }
      }

      // Custom items for international
      if (params.items && params.items.length > 0 && params.toAddress.country !== 'NL') {
        shipmentData.customs_declaration = {
          contents: 1, // Commercial goods
          invoice: params.orderNumber,
          weight: params.weight || 1000,
          items: params.items.map((item) => ({
            description: item.description,
            amount: item.quantity,
            weight: item.weight,
            item_value: { amount: item.value, currency: 'EUR' },
            country: 'NL',
          })),
        }
      }

      const res = await fetch(`${MYPARCEL_API}/shipments`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ data: { shipments: [shipmentData] } }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        const errorMsg = responseData.message || responseData.errors?.[0]?.message || JSON.stringify(responseData)
        console.error('[MyParcel] Create shipment error:', errorMsg)
        return { success: false, shipmentId: '', error: errorMsg }
      }

      const shipment = responseData.data?.ids?.[0]
      if (!shipment?.id) {
        return { success: false, shipmentId: '', error: 'No shipment ID returned' }
      }

      // Fetch full shipment details to get tracking
      const detailRes = await fetch(`${MYPARCEL_API}/shipments/${shipment.id}`, {
        headers: {
          Authorization: `bearer ${this.apiKey}`,
          Accept: 'application/json',
        },
      })

      let trackingNumber: string | undefined
      let trackingUrl: string | undefined

      if (detailRes.ok) {
        const detail = await detailRes.json()
        const s = detail.data?.shipments?.[0]
        trackingNumber = s?.barcode || undefined
        trackingUrl = trackingNumber
          ? `https://myparcel.me/track-trace/${trackingNumber}`
          : undefined
      }

      return {
        success: true,
        shipmentId: String(shipment.id),
        trackingNumber,
        trackingUrl,
        carrier: 'postnl',
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('[MyParcel] Create shipment error:', error)
      return { success: false, shipmentId: '', error: message }
    }
  }

  async getLabel(shipmentId: string): Promise<{ pdf: Buffer; filename: string }> {
    const res = await fetch(
      `${MYPARCEL_API}/shipment_labels/${shipmentId}?format=A4`,
      {
        headers: {
          Authorization: `bearer ${this.apiKey}`,
          Accept: 'application/pdf',
        },
      },
    )

    if (!res.ok) {
      throw new Error(`MyParcel label download failed: ${res.status}`)
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    return {
      pdf: buffer,
      filename: `myparcel-label-${shipmentId}.pdf`,
    }
  }

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const res = await fetch(`${MYPARCEL_API}/delivery_options`, {
      headers: {
        Authorization: `bearer ${this.apiKey}`,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      // Return default carrier list
      return [
        { id: 1, name: 'PostNL', carrier: 'postnl' },
        { id: 2, name: 'bpost', carrier: 'bpost' },
        { id: 3, name: 'CheapCargo', carrier: 'cheapcargo' },
        { id: 4, name: 'DPD', carrier: 'dpd' },
      ]
    }

    const data = await res.json()
    return (data.data?.delivery_options || []).map((m: any) => ({
      id: m.carrier_id || m.id,
      name: m.carrier?.name || m.name || 'Unknown',
      carrier: m.carrier?.name?.toLowerCase() || 'unknown',
    }))
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    const res = await fetch(`${MYPARCEL_API}/shipments/${shipmentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${this.apiKey}`,
      },
    })

    return res.ok
  }
}
