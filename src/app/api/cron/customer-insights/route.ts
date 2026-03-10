import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { aggregateCustomerData } from '@/features/analytics/customer-insights/lib/data-aggregator'
import { calculateRFMScores } from '@/features/analytics/customer-insights/lib/rfm-calculator'
import { enrichWithCLV } from '@/features/analytics/customer-insights/lib/clv-calculator'
import { enrichWithChurnRisk } from '@/features/analytics/customer-insights/lib/churn-predictor'
import { saveCustomerMetrics } from '@/features/analytics/customer-insights/lib/metrics-writer'
import { calculateSegmentDistribution } from '@/features/analytics/customer-insights/lib/segment-engine'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    // Step 1: Aggregate raw order data per customer
    let customers = await aggregateCustomerData(db)

    if (customers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No customers with orders found',
        duration: Date.now() - startTime,
      })
    }

    // Step 2: Calculate RFM scores and assign segments
    customers = calculateRFMScores(customers)

    // Step 3: Calculate CLV (historical + predicted)
    customers = enrichWithCLV(customers)

    // Step 4: Calculate churn risk
    customers = enrichWithChurnRisk(customers)

    // Step 5: Save all metrics to database
    await saveCustomerMetrics(db, customers)

    // Step 6: Calculate summary stats
    const segments = calculateSegmentDistribution(customers)
    const highChurnCount = customers.filter((c) => c.churnRisk >= 0.5).length
    const avgClv = customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.clvPredicted, 0) / customers.length * 100) / 100
      : 0

    const duration = Date.now() - startTime

    console.log(
      `[cron/customer-insights] Processed ${customers.length} customers in ${duration}ms. ` +
      `High churn: ${highChurnCount}, Avg CLV: €${avgClv}`
    )

    return NextResponse.json({
      success: true,
      customersProcessed: customers.length,
      segments: segments.filter((s) => s.count > 0).map((s) => ({
        segment: s.segment,
        count: s.count,
        percentage: s.percentage,
      })),
      highChurnRiskCount: highChurnCount,
      avgPredictedCLV: avgClv,
      duration,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[cron/customer-insights] Error:', error)
    return NextResponse.json(
      { success: false, error: message || 'Internal server error' },
      { status: 500 }
    )
  }
}
