'use client'

import { useState, useEffect } from 'react'

interface EcommerceSettingsData {
  freeShippingThreshold: number
  shippingCost: number
  deliveryTime: string
  returnDays: number
  vatPercentage: number
  minimumOrderAmount: number | null
  showPricesExclVAT: boolean
  enableGuestCheckout: boolean
  requireAccountForPurchase: boolean
  features: {
    enableQuickOrder: boolean
    enableOrderLists: boolean
    enableReviews: boolean
    enableWishlist: boolean
    enableStockNotifications: boolean
    enableLiveChat: boolean
  }
  shippingMethods: any[]
  paymentOptions: any[]
}

const DEFAULTS: EcommerceSettingsData = {
  freeShippingThreshold: 150,
  shippingCost: 6.95,
  deliveryTime: 'Besteld voor 16:00, morgen in huis',
  returnDays: 30,
  vatPercentage: 21,
  minimumOrderAmount: null,
  showPricesExclVAT: true,
  enableGuestCheckout: false,
  requireAccountForPurchase: true,
  features: {
    enableQuickOrder: true,
    enableOrderLists: true,
    enableReviews: false,
    enableWishlist: true,
    enableStockNotifications: false,
    enableLiveChat: false,
  },
  shippingMethods: [],
  paymentOptions: [],
}

let _cache: EcommerceSettingsData | null = null
let _fetchPromise: Promise<EcommerceSettingsData> | null = null

async function fetchSettings(): Promise<EcommerceSettingsData> {
  if (_cache) return _cache

  if (!_fetchPromise) {
    _fetchPromise = fetch('/api/globals/e-commerce-settings?depth=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return DEFAULTS
        const result: EcommerceSettingsData = {
          freeShippingThreshold: data.freeShippingThreshold ?? DEFAULTS.freeShippingThreshold,
          shippingCost: data.shippingCost ?? DEFAULTS.shippingCost,
          deliveryTime: data.deliveryTime ?? DEFAULTS.deliveryTime,
          returnDays: data.returnDays ?? DEFAULTS.returnDays,
          vatPercentage: data.vatPercentage ?? DEFAULTS.vatPercentage,
          minimumOrderAmount: data.minimumOrderAmount ?? null,
          showPricesExclVAT: data.showPricesExclVAT ?? DEFAULTS.showPricesExclVAT,
          enableGuestCheckout: data.enableGuestCheckout ?? DEFAULTS.enableGuestCheckout,
          requireAccountForPurchase: data.requireAccountForPurchase ?? DEFAULTS.requireAccountForPurchase,
          features: {
            enableQuickOrder: data.features?.enableQuickOrder ?? DEFAULTS.features.enableQuickOrder,
            enableOrderLists: data.features?.enableOrderLists ?? DEFAULTS.features.enableOrderLists,
            enableReviews: data.features?.enableReviews ?? DEFAULTS.features.enableReviews,
            enableWishlist: data.features?.enableWishlist ?? DEFAULTS.features.enableWishlist,
            enableStockNotifications: data.features?.enableStockNotifications ?? DEFAULTS.features.enableStockNotifications,
            enableLiveChat: data.features?.enableLiveChat ?? DEFAULTS.features.enableLiveChat,
          },
          shippingMethods: (data.shippingMethods || [])
            .filter((m: any) => m.isActive)
            .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
          paymentOptions: (data.paymentOptions || [])
            .filter((p: any) => p.isActive)
            .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        }
        _cache = result
        return result
      })
      .catch(() => DEFAULTS)
  }

  return _fetchPromise
}

/**
 * Client-side hook to fetch e-commerce settings.
 * Caches after first fetch — safe to call from multiple components.
 */
export function useEcommerceSettings() {
  const [settings, setSettings] = useState<EcommerceSettingsData>(DEFAULTS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchSettings().then((data) => {
      setSettings(data)
      setIsLoaded(true)
    })
  }, [])

  return { settings, isLoaded }
}
