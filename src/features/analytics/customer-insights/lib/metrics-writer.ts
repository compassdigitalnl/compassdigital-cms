import { sql } from 'drizzle-orm'
import type { CustomerMetrics } from './types'

/**
 * Upsert all customer metrics to the customer_metrics table.
 * Uses INSERT ... ON CONFLICT for efficient batch updates.
 */
export async function saveCustomerMetrics(drizzle: any, metrics: CustomerMetrics[]): Promise<void> {
  if (metrics.length === 0) return

  // Process in batches of 50 to avoid query size limits
  const batchSize = 50

  for (let i = 0; i < metrics.length; i += batchSize) {
    const batch = metrics.slice(i, i + batchSize)

    // Build values for batch upsert
    const values = batch.map((m) => sql`(
      ${m.userId},
      ${m.totalOrders},
      ${m.totalRevenue},
      ${m.avgOrderValue},
      ${m.firstOrderAt ? m.firstOrderAt : null}::timestamp with time zone,
      ${m.lastOrderAt ? m.lastOrderAt : null}::timestamp with time zone,
      ${m.daysSinceLastOrder},
      ${m.orderFrequencyDays},
      ${m.recencyScore},
      ${m.frequencyScore},
      ${m.monetaryScore},
      ${m.rfmSegment},
      ${m.clvHistorical},
      ${m.clvPredicted},
      ${m.churnRisk},
      ${m.churnLabel},
      NOW(),
      NOW()
    )`)

    const valuesClause = sql.join(values, sql`, `)

    await drizzle.execute(sql`
      INSERT INTO customer_metrics (
        user_id, total_orders, total_revenue, avg_order_value,
        first_order_at, last_order_at, days_since_last_order, order_frequency_days,
        recency_score, frequency_score, monetary_score, rfm_segment,
        clv_historical, clv_predicted, churn_risk, churn_label,
        updated_at, created_at
      ) VALUES ${valuesClause}
      ON CONFLICT (user_id) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        avg_order_value = EXCLUDED.avg_order_value,
        first_order_at = EXCLUDED.first_order_at,
        last_order_at = EXCLUDED.last_order_at,
        days_since_last_order = EXCLUDED.days_since_last_order,
        order_frequency_days = EXCLUDED.order_frequency_days,
        recency_score = EXCLUDED.recency_score,
        frequency_score = EXCLUDED.frequency_score,
        monetary_score = EXCLUDED.monetary_score,
        rfm_segment = EXCLUDED.rfm_segment,
        clv_historical = EXCLUDED.clv_historical,
        clv_predicted = EXCLUDED.clv_predicted,
        churn_risk = EXCLUDED.churn_risk,
        churn_label = EXCLUDED.churn_label,
        updated_at = NOW()
    `)
  }
}
