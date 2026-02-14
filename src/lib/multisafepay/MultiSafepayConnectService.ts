/**
 * MultiSafePay Connect Service
 *
 * Handles all MultiSafePay Partner/Affiliate operations:
 * - Affiliate/sub-merchant creation & management
 * - Payment processing with partner commissions
 * - Transaction reporting
 * - Custom pricing per client tier
 *
 * Documentation: https://docs.multisafepay.com/
 */

import MultiSafepay from '@multisafepay/api-wrapper'

// Initialize MultiSafePay client
const getMultiSafepay = () => {
  const apiKey = process.env.MULTISAFEPAY_API_KEY

  if (!apiKey) {
    throw new Error('MULTISAFEPAY_API_KEY not configured')
  }

  const environment = process.env.NODE_ENV === 'production' ? 'live' : 'test'

  return new MultiSafepay({
    apiKey,
    environment,
  })
}

export interface CreateAffiliateParams {
  clientId: string
  email: string
  businessName: string
  country?: string
  phone?: string
  address?: {
    street: string
    houseNumber: string
    zipCode: string
    city: string
    country: string
  }
}

export interface PaymentParams {
  affiliateId: string
  orderId: string
  amount: number // in cents (e.g., 10000 = €100)
  currency?: string
  description: string
  pricingTier: 'standard' | 'professional' | 'enterprise' | 'custom'
  customRates?: {
    idealFee?: number // EUR
    cardPercentage?: number // %
    cardFixed?: number // EUR
  }
  customer?: {
    email: string
    firstName?: string
    lastName?: string
  }
  redirectUrl?: string
  cancelUrl?: string
  notificationUrl?: string
  metadata?: Record<string, any>
}

/**
 * Pricing tiers configuration
 * Based on negotiated partner rates with your MultiSafePay contact
 */
const PRICING_TIERS = {
  standard: {
    ideal: 0.35, // €0.35 per transaction
    cardPercentage: 1.8, // 1.8%
    cardFixed: 0.25, // €0.25
    description: 'Standard rate for Starter plan',
  },
  professional: {
    ideal: 0.30, // €0.30 per transaction (better deal!)
    cardPercentage: 1.6, // 1.6%
    cardFixed: 0.25, // €0.25
    description: 'Discounted rate for Professional plan',
  },
  enterprise: {
    ideal: 0.28, // €0.28 per transaction (best deal!)
    cardPercentage: 1.5, // 1.5%
    cardFixed: 0.25, // €0.25
    description: 'Premium rate for Enterprise plan',
  },
}

// MultiSafePay Partner/Wholesale costs (to be negotiated with your contact!)
const PARTNER_COSTS = {
  ideal: 0.20, // €0.20 per transaction (negotiate with partner manager!)
  cardPercentage: 1.2, // 1.2% (negotiate!)
  cardFixed: 0.20, // €0.20 (negotiate!)
}

export class MultiSafepayConnectService {
  private client: any

  constructor() {
    this.client = getMultiSafepay()
  }

  /**
   * Create an affiliate/sub-merchant account
   *
   * Note: MultiSafePay uses "affiliates" instead of "sub-merchants"
   * This is their partner model for earning commissions
   */
  async createAffiliate(params: CreateAffiliateParams): Promise<any> {
    const { clientId, email, businessName, country = 'NL', phone, address } = params

    console.log(`[MultiSafePay Connect] Creating affiliate for: ${businessName}`)

    try {
      // Note: MultiSafePay affiliate creation might require manual approval
      // The exact API endpoint depends on your partner agreement
      // This is a conceptual implementation - adjust based on actual API

      const affiliate = {
        company_name: businessName,
        email,
        country,
        phone: phone || '',
        reference: clientId, // Store our client ID as reference
        // Address details if provided
        ...(address && {
          address1: `${address.street} ${address.houseNumber}`,
          zip_code: address.zipCode,
          city: address.city,
          country: address.country,
        }),
      }

      // Note: Actual implementation depends on MultiSafePay Partner API
      // May require direct API call as SDK might not support affiliates
      const response = await this.makePartnerAPICall('POST', '/affiliates', affiliate)

      console.log(`[MultiSafePay Connect] Affiliate created: ${response.id || response.affiliate_id}`)

      return {
        id: response.id || response.affiliate_id,
        status: response.status || 'pending',
        ...response,
      }

    } catch (error: any) {
      console.error('[MultiSafePay Connect] Error creating affiliate:', error)
      throw new Error(`Failed to create MultiSafePay affiliate: ${error.message}`)
    }
  }

  /**
   * Get affiliate status and details
   */
  async getAffiliate(affiliateId: string): Promise<any> {
    try {
      const response = await this.makePartnerAPICall('GET', `/affiliates/${affiliateId}`)
      return response
    } catch (error: any) {
      console.error('[MultiSafePay Connect] Error fetching affiliate:', error)
      throw new Error(`Failed to fetch affiliate: ${error.message}`)
    }
  }

  /**
   * Check if affiliate is active and can process payments
   */
  async isAffiliateActive(affiliateId: string): Promise<boolean> {
    try {
      const affiliate = await this.getAffiliate(affiliateId)
      return affiliate.status === 'active' || affiliate.status === 'approved'
    } catch {
      return false
    }
  }

  /**
   * Calculate platform commission based on pricing tier
   */
  private calculateCommission(
    amount: number,
    paymentMethod: 'ideal' | 'card',
    params: PaymentParams
  ): number {
    const { pricingTier, customRates } = params

    let clientCost: number
    let partnerCost: number

    if (paymentMethod === 'ideal') {
      // iDEAL fees (fixed per transaction)
      if (pricingTier === 'custom' && customRates?.idealFee) {
        clientCost = customRates.idealFee
      } else {
        clientCost = PRICING_TIERS[pricingTier].ideal
      }
      partnerCost = PARTNER_COSTS.ideal

      return clientCost - partnerCost

    } else {
      // Card fees (percentage + fixed)
      let clientPercentage: number
      let clientFixed: number

      if (pricingTier === 'custom' && customRates) {
        clientPercentage = customRates.cardPercentage || PRICING_TIERS.standard.cardPercentage
        clientFixed = customRates.cardFixed || PRICING_TIERS.standard.cardFixed
      } else {
        clientPercentage = PRICING_TIERS[pricingTier].cardPercentage
        clientFixed = PRICING_TIERS[pricingTier].cardFixed
      }

      const clientCostTotal = (amount * clientPercentage / 100) + clientFixed
      const partnerCostTotal = (amount * PARTNER_COSTS.cardPercentage / 100) + PARTNER_COSTS.cardFixed

      return clientCostTotal - partnerCostTotal
    }
  }

  /**
   * Create a payment order with affiliate commission
   */
  async createPaymentOrder(params: PaymentParams): Promise<any> {
    const {
      affiliateId,
      orderId,
      amount,
      currency = 'EUR',
      description,
      customer,
      redirectUrl,
      cancelUrl,
      notificationUrl,
      metadata = {},
    } = params

    console.log(`[MultiSafePay Connect] Creating payment order:`)
    console.log(`  Affiliate: ${affiliateId}`)
    console.log(`  Amount: €${(amount / 100).toFixed(2)}`)
    console.log(`  Order ID: ${orderId}`)

    try {
      const orderData = {
        type: 'redirect', // Redirect to payment page
        order_id: orderId,
        currency,
        amount, // in cents
        description,

        // Customer data
        customer: {
          email: customer?.email || 'noreply@example.com',
          firstname: customer?.firstName || '',
          lastname: customer?.lastName || '',
        },

        // Payment options
        payment_options: {
          notification_url: notificationUrl,
          redirect_url: redirectUrl,
          cancel_url: cancelUrl,
          close_window: false,
        },

        // Affiliate reference
        affiliate: {
          id: affiliateId,
        },

        // Custom metadata
        var1: metadata.var1 || '',
        var2: metadata.var2 || '',
        var3: metadata.var3 || '',
      }

      const order = await this.client.orders.create(orderData)

      console.log(`[MultiSafePay Connect] Order created: ${order.order_id}`)
      console.log(`  Payment URL: ${order.payment_url}`)

      return {
        orderId: order.order_id,
        paymentUrl: order.payment_url,
        status: order.status,
        ...order,
      }

    } catch (error: any) {
      console.error('[MultiSafePay Connect] Error creating order:', error)
      throw new Error(`Failed to create payment order: ${error.message}`)
    }
  }

  /**
   * Get order status
   */
  async getOrder(orderId: string): Promise<any> {
    try {
      const order = await this.client.orders.get(orderId)
      return order
    } catch (error: any) {
      console.error('[MultiSafePay Connect] Error fetching order:', error)
      throw new Error(`Failed to fetch order: ${error.message}`)
    }
  }

  /**
   * Get transaction statistics for an affiliate
   */
  async getAffiliateStats(params: {
    affiliateId: string
    startDate?: Date
    endDate?: Date
  }): Promise<{
    totalVolume: number
    totalCommission: number
    transactionCount: number
  }> {
    const { affiliateId, startDate, endDate } = params

    try {
      // This would query MultiSafePay's reporting API
      // Exact implementation depends on their partner API
      const response = await this.makePartnerAPICall('GET', `/affiliates/${affiliateId}/transactions`, {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
      })

      return {
        totalVolume: response.total_volume || 0,
        totalCommission: response.total_commission || 0,
        transactionCount: response.transaction_count || 0,
      }
    } catch (error: any) {
      console.error('[MultiSafePay Connect] Error fetching stats:', error)
      return {
        totalVolume: 0,
        totalCommission: 0,
        transactionCount: 0,
      }
    }
  }

  /**
   * Make direct API call to MultiSafePay Partner API
   * (For features not in the standard SDK)
   */
  private async makePartnerAPICall(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<any> {
    const apiKey = process.env.MULTISAFEPAY_API_KEY
    const environment = process.env.NODE_ENV === 'production' ? 'live' : 'test'
    const baseUrl = environment === 'live'
      ? 'https://api.multisafepay.com/v1/json'
      : 'https://testapi.multisafepay.com/v1/json'

    const url = `${baseUrl}${endpoint}`

    const options: RequestInit = {
      method,
      headers: {
        'api_key': apiKey!,
        'Content-Type': 'application/json',
      },
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error_info || `API call failed: ${response.statusText}`)
    }

    return await response.json()
  }
}

/**
 * Get pricing info for display
 */
export function getPricingTierInfo(tier: keyof typeof PRICING_TIERS) {
  return PRICING_TIERS[tier]
}

/**
 * Format fee for display
 */
export function formatMultiSafepayFee(
  tier: keyof typeof PRICING_TIERS | 'custom',
  customRates?: { idealFee?: number; cardPercentage?: number; cardFixed?: number }
): string {
  if (tier === 'custom' && customRates) {
    return `iDEAL €${customRates.idealFee?.toFixed(2)}, Cards ${customRates.cardPercentage}% + €${customRates.cardFixed?.toFixed(2)}`
  }

  const info = PRICING_TIERS[tier]
  return `iDEAL €${info.ideal.toFixed(2)}, Cards ${info.cardPercentage}% + €${info.cardFixed.toFixed(2)}`
}

/**
 * Calculate expected commission for display
 */
export function calculateExpectedCommission(
  amount: number,
  paymentMethod: 'ideal' | 'card',
  tier: keyof typeof PRICING_TIERS
): number {
  if (paymentMethod === 'ideal') {
    return PRICING_TIERS[tier].ideal - PARTNER_COSTS.ideal
  } else {
    const clientCost = (amount * PRICING_TIERS[tier].cardPercentage / 100) + PRICING_TIERS[tier].cardFixed
    const partnerCost = (amount * PARTNER_COSTS.cardPercentage / 100) + PARTNER_COSTS.cardFixed
    return clientCost - partnerCost
  }
}
