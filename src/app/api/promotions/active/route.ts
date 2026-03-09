/**
 * Active Promotions API
 *
 * Publieke endpoint voor het ophalen van actieve promoties (voor frontend banners).
 * Retourneert alleen veilige velden (geen interne data).
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getActivePromotions } from '@/features/promotions/lib/promotion-engine'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const drizzle = (payload.db as any).drizzle

    const promotions = await getActivePromotions(drizzle)

    // Retourneer alleen publieke velden
    const publicPromotions = promotions.map((promo) => ({
      title: promo.title,
      type: promo.type,
      value: promo.value,
      flashSaleLabel: promo.flashSaleLabel,
      bannerText: promo.bannerText,
      bannerColor: promo.bannerColor,
      endDate: promo.endDate,
    }))

    return NextResponse.json({
      promotions: publicPromotions,
    })
  } catch (error: any) {
    console.error('[API] Active promotions error:', error)
    return NextResponse.json(
      { promotions: [], error: error.message },
      { status: 500 },
    )
  }
}
