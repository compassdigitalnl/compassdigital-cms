/**
 * Stripe Connect Service
 *
 * Handles all Stripe Connect operations:
 * - Account creation & onboarding
 * - Payment processing with application fees
 * - Payout management
 * - Custom pricing per client
 *
 * Documentation: https://stripe.com/docs/connect
 */

import Stripe from 'stripe'

// Initialize Stripe with API key
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY

  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }

  return new Stripe(apiKey, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  })
}

export interface CreateAccountParams {
  clientId: string
  email: string
  businessName: string
  country?: string
}

export interface OnboardingLinkParams {
  accountId: string
  refreshUrl: string
  returnUrl: string
}

export interface PaymentParams {
  accountId: string
  amount: number // in cents (e.g., 10000 = €100)
  currency?: string
  pricingTier: 'standard' | 'professional' | 'enterprise' | 'custom'
  customFee?: {
    percentage: number
    fixed: number
  }
  metadata?: Record<string, string>
}

/**
 * Pricing tiers configuration
 */
const PRICING_TIERS = {
  standard: {
    percentage: 2.4, // 2.4%
    fixed: 25, // €0.25 in cents
    description: 'Standard rate for Starter plan',
  },
  professional: {
    percentage: 1.9, // 1.9%
    fixed: 25, // €0.25 in cents
    description: 'Discounted rate for Professional plan',
  },
  enterprise: {
    percentage: 1.6, // 1.6%
    fixed: 20, // €0.20 in cents
    description: 'Premium rate for Enterprise plan',
  },
}

export class StripeConnectService {
  private stripe: Stripe

  constructor() {
    this.stripe = getStripe()
  }

  /**
   * Create a Connect Express account for a client
   */
  async createAccount(params: CreateAccountParams): Promise<Stripe.Account> {
    const { email, businessName, country = 'NL' } = params

    console.log(`[Stripe Connect] Creating account for: ${businessName}`)

    const account = await this.stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'company',
      company: {
        name: businessName,
      },
      metadata: {
        clientId: params.clientId,
      },
    })

    console.log(`[Stripe Connect] Account created: ${account.id}`)

    return account
  }

  /**
   * Create onboarding link for account setup
   */
  async createOnboardingLink(params: OnboardingLinkParams): Promise<Stripe.AccountLink> {
    const { accountId, refreshUrl, returnUrl } = params

    console.log(`[Stripe Connect] Creating onboarding link for: ${accountId}`)

    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    return accountLink
  }

  /**
   * Get account status and details
   */
  async getAccount(accountId: string): Promise<Stripe.Account> {
    return await this.stripe.accounts.retrieve(accountId)
  }

  /**
   * Check if account is fully onboarded
   */
  async isAccountEnabled(accountId: string): Promise<boolean> {
    const account = await this.getAccount(accountId)

    return (
      account.charges_enabled === true &&
      account.payouts_enabled === true &&
      account.details_submitted === true
    )
  }

  /**
   * Get account status for UI display
   */
  async getAccountStatus(accountId: string): Promise<{
    status: 'not_started' | 'pending' | 'enabled' | 'rejected' | 'restricted'
    chargesEnabled: boolean
    payoutsEnabled: boolean
    detailsSubmitted: boolean
    requirements: string[]
  }> {
    const account = await this.getAccount(accountId)

    let status: 'not_started' | 'pending' | 'enabled' | 'rejected' | 'restricted' = 'not_started'

    if (account.charges_enabled && account.payouts_enabled) {
      status = 'enabled'
    } else if (account.details_submitted) {
      status = 'pending'
    } else if (account.requirements?.disabled_reason) {
      status = 'restricted'
    }

    return {
      status,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      requirements: account.requirements?.currently_due || [],
    }
  }

  /**
   * Calculate application fee based on pricing tier
   */
  private calculateApplicationFee(params: PaymentParams): number {
    const { amount, pricingTier, customFee } = params

    let feePercentage: number
    let feeFixed: number

    if (pricingTier === 'custom' && customFee) {
      feePercentage = customFee.percentage
      feeFixed = customFee.fixed * 100 // Convert EUR to cents
    } else {
      const tier = PRICING_TIERS[pricingTier]
      feePercentage = tier.percentage
      feeFixed = tier.fixed
    }

    // Calculate: (amount * percentage / 100) + fixed fee
    const percentageFee = Math.round((amount * feePercentage) / 100)
    const totalFee = percentageFee + feeFixed

    console.log(`[Stripe Connect] Fee calculation:`)
    console.log(`  Amount: €${(amount / 100).toFixed(2)}`)
    console.log(`  Tier: ${pricingTier}`)
    console.log(`  Rate: ${feePercentage}% + €${(feeFixed / 100).toFixed(2)}`)
    console.log(`  Application Fee: €${(totalFee / 100).toFixed(2)}`)

    return totalFee
  }

  /**
   * Create a payment with application fee (destination charge)
   */
  async createPayment(params: PaymentParams): Promise<Stripe.PaymentIntent> {
    const { accountId, amount, currency = 'eur', metadata = {} } = params

    // Calculate platform fee
    const applicationFee = this.calculateApplicationFee(params)

    console.log(`[Stripe Connect] Creating payment:`)
    console.log(`  Account: ${accountId}`)
    console.log(`  Amount: €${(amount / 100).toFixed(2)}`)
    console.log(`  Platform Fee: €${(applicationFee / 100).toFixed(2)}`)

    // Create PaymentIntent with destination charge
    // Money goes to connected account, platform takes fee
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFee,
      transfer_data: {
        destination: accountId,
      },
      metadata: {
        ...metadata,
        platformFee: (applicationFee / 100).toString(),
      },
    })

    return paymentIntent
  }

  /**
   * Create checkout session with Connect account
   */
  async createCheckoutSession(params: {
    accountId: string
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    successUrl: string
    cancelUrl: string
    pricingTier: 'standard' | 'professional' | 'enterprise' | 'custom'
    customFee?: {
      percentage: number
      fixed: number
    }
    metadata?: Record<string, string>
  }): Promise<Stripe.Checkout.Session> {
    const {
      accountId,
      lineItems,
      successUrl,
      cancelUrl,
      pricingTier,
      customFee,
      metadata = {},
    } = params

    // Calculate total amount from line items
    const totalAmount = lineItems.reduce((sum, item) => {
      const price = typeof item.price_data?.unit_amount === 'number'
        ? item.price_data.unit_amount * (item.quantity || 1)
        : 0
      return sum + price
    }, 0)

    // Calculate application fee
    const applicationFee = this.calculateApplicationFee({
      accountId,
      amount: totalAmount,
      pricingTier,
      customFee,
    })

    console.log(`[Stripe Connect] Creating checkout session:`)
    console.log(`  Account: ${accountId}`)
    console.log(`  Total: €${(totalAmount / 100).toFixed(2)}`)
    console.log(`  Platform Fee: €${(applicationFee / 100).toFixed(2)}`)

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: accountId,
        },
        metadata: {
          ...metadata,
          platformFee: (applicationFee / 100).toString(),
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    })

    return session
  }

  /**
   * Get balance for connected account
   */
  async getBalance(accountId: string): Promise<Stripe.Balance> {
    return await this.stripe.balance.retrieve({
      stripeAccount: accountId,
    })
  }

  /**
   * List payouts for connected account
   */
  async listPayouts(accountId: string, limit: number = 10): Promise<Stripe.ApiList<Stripe.Payout>> {
    return await this.stripe.payouts.list(
      { limit },
      { stripeAccount: accountId }
    )
  }

  /**
   * Get payment statistics for platform
   */
  async getPlatformStats(params: {
    accountId?: string
    startDate?: Date
    endDate?: Date
  }): Promise<{
    totalVolume: number
    totalFees: number
    transactionCount: number
  }> {
    const { accountId, startDate, endDate } = params

    // Build query
    const query: Stripe.ChargeListParams = {
      limit: 100,
    }

    if (startDate && endDate) {
      query.created = {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000)
      }
    } else if (startDate) {
      query.created = { gte: Math.floor(startDate.getTime() / 1000) }
    } else if (endDate) {
      query.created = { lte: Math.floor(endDate.getTime() / 1000) }
    }

    // Get charges
    const charges = await this.stripe.charges.list(query)

    // Filter by account if specified
    let relevantCharges = charges.data
    if (accountId) {
      relevantCharges = charges.data.filter(
        (charge) => charge.transfer_data?.destination === accountId
      )
    }

    // Calculate stats
    const stats = relevantCharges.reduce(
      (acc, charge) => {
        acc.totalVolume += charge.amount
        acc.totalFees += charge.application_fee_amount || 0
        acc.transactionCount += 1
        return acc
      },
      { totalVolume: 0, totalFees: 0, transactionCount: 0 }
    )

    return stats
  }

  /**
   * Delete connected account (for testing/cleanup)
   */
  async deleteAccount(accountId: string): Promise<Stripe.DeletedAccount> {
    console.log(`[Stripe Connect] Deleting account: ${accountId}`)
    return await this.stripe.accounts.del(accountId)
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
export function formatFee(tier: keyof typeof PRICING_TIERS | 'custom', customFee?: { percentage: number; fixed: number }): string {
  if (tier === 'custom' && customFee) {
    return `${customFee.percentage}% + €${customFee.fixed.toFixed(2)}`
  }

  const info = PRICING_TIERS[tier]
  return `${info.percentage}% + €${(info.fixed / 100).toFixed(2)}`
}
