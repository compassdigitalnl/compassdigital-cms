import type { SegmentDefinition, SegmentCondition, SegmentGroup, ConditionField } from './types'
import { getFieldDefinition } from './condition-types'

// ─── Column Mapping ─────────────────────────────────────────────────────────
// Maps condition fields to actual SQL column references across the joined tables.

const COLUMN_MAP: Record<ConditionField, string> = {
  // Subscriber fields (email_subscribers table, aliased as "es")
  email: 'es.email',
  name: 'es.name',
  created_at: 'es.created_at',
  status: 'es.status',

  // Order / Revenue fields (customer_metrics table, aliased as "cm")
  total_orders: 'cm.total_orders',
  total_revenue: 'cm.total_revenue',
  avg_order_value: 'cm.avg_order_value',
  last_order_at: 'cm.last_order_at',
  days_since_last_order: 'cm.days_since_last_order',

  // RFM fields (customer_metrics)
  rfm_segment: 'cm.rfm_segment',
  recency_score: 'cm.recency_score',
  frequency_score: 'cm.frequency_score',
  monetary_score: 'cm.monetary_score',

  // Churn & CLV fields (customer_metrics)
  churn_risk: 'cm.churn_risk',
  churn_label: 'cm.churn_label',
  clv_predicted: 'cm.clv_predicted',

  // List membership — handled specially (sub-query)
  list_id: 'es_list.lists_id',

  // Tag — handled specially (sub-query)
  tag: 'es.id', // placeholder; tag conditions use EXISTS sub-query
}

// ─── Escaping ───────────────────────────────────────────────────────────────

function escapeValue(value: string | number): string {
  if (typeof value === 'number') return String(value)
  // Basic SQL injection prevention — escape single quotes
  return `'${String(value).replace(/'/g, "''")}'`
}

function escapeArray(values: (string | number)[]): string {
  return values.map(escapeValue).join(', ')
}

// ─── Single Condition → SQL Fragment ────────────────────────────────────────

function buildConditionSQL(condition: SegmentCondition): string {
  const fieldDef = getFieldDefinition(condition.field)
  const col = COLUMN_MAP[condition.field]

  if (!col) {
    throw new Error(`Onbekend conditieveld: ${condition.field}`)
  }

  // Special handling for list_id — uses a sub-query on the Payload many-to-many join table
  if (condition.field === 'list_id') {
    const values = Array.isArray(condition.value) ? condition.value : [condition.value]
    const escaped = escapeArray(values as (string | number)[])

    switch (condition.operator) {
      case 'equals':
      case 'in':
        return `es.id IN (SELECT "parent_id" FROM "email_subscribers_rels" WHERE "path" = 'lists' AND "email_lists_id" IN (${escaped}))`
      case 'not_equals':
      case 'not_in':
        return `es.id NOT IN (SELECT "parent_id" FROM "email_subscribers_rels" WHERE "path" = 'lists' AND "email_lists_id" IN (${escaped}))`
      default:
        return '1=1'
    }
  }

  // Special handling for tag — uses a sub-query
  if (condition.field === 'tag') {
    const val = escapeValue(condition.value as string)
    switch (condition.operator) {
      case 'equals':
      case 'contains':
        return `es.id IN (SELECT "parent_id" FROM "email_subscribers_tags" WHERE "tag" ILIKE ${val})`
      case 'not_equals':
      case 'not_contains':
        return `es.id NOT IN (SELECT "parent_id" FROM "email_subscribers_tags" WHERE "tag" ILIKE ${val})`
      default:
        return '1=1'
    }
  }

  // Standard operators
  switch (condition.operator) {
    case 'equals':
      return `${col} = ${escapeValue(condition.value as string | number)}`

    case 'not_equals':
      return `${col} != ${escapeValue(condition.value as string | number)}`

    case 'contains':
      return `${col} ILIKE ${escapeValue(`%${condition.value}%`)}`

    case 'not_contains':
      return `${col} NOT ILIKE ${escapeValue(`%${condition.value}%`)}`

    case 'gt':
      return fieldDef?.type === 'date'
        ? `${col} > ${escapeValue(condition.value as string)}::timestamptz`
        : `${col} > ${escapeValue(condition.value as string | number)}`

    case 'gte':
      return fieldDef?.type === 'date'
        ? `${col} >= ${escapeValue(condition.value as string)}::timestamptz`
        : `${col} >= ${escapeValue(condition.value as string | number)}`

    case 'lt':
      return fieldDef?.type === 'date'
        ? `${col} < ${escapeValue(condition.value as string)}::timestamptz`
        : `${col} < ${escapeValue(condition.value as string | number)}`

    case 'lte':
      return fieldDef?.type === 'date'
        ? `${col} <= ${escapeValue(condition.value as string)}::timestamptz`
        : `${col} <= ${escapeValue(condition.value as string | number)}`

    case 'between': {
      const start = escapeValue(condition.value as string | number)
      const end = escapeValue(condition.valueEnd as string | number)
      return fieldDef?.type === 'date'
        ? `${col} BETWEEN ${start}::timestamptz AND ${end}::timestamptz`
        : `${col} BETWEEN ${start} AND ${end}`
    }

    case 'in': {
      const values = Array.isArray(condition.value) ? condition.value : [condition.value]
      return `${col} IN (${escapeArray(values as (string | number)[])})`
    }

    case 'not_in': {
      const values = Array.isArray(condition.value) ? condition.value : [condition.value]
      return `${col} NOT IN (${escapeArray(values as (string | number)[])})`
    }

    case 'is_set':
      return `${col} IS NOT NULL`

    case 'is_not_set':
      return `${col} IS NULL`

    default:
      return '1=1'
  }
}

// ─── Group → SQL Fragment ───────────────────────────────────────────────────

function buildGroupSQL(group: SegmentGroup): string {
  if (group.conditions.length === 0) return '1=1'

  const parts = group.conditions.map(buildConditionSQL)
  const joiner = group.logic === 'or' ? ' OR ' : ' AND '
  return `(${parts.join(joiner)})`
}

// ─── Definition → SQL WHERE Clause ─────────────────────────────────────────

/**
 * Converts the UI segment definition into a SQL WHERE clause.
 * Returns the clause string WITHOUT the "WHERE" keyword.
 */
export function buildSegmentSQL(definition: SegmentDefinition): string {
  if (!definition.groups || definition.groups.length === 0) return '1=1'

  const parts = definition.groups.map(buildGroupSQL)
  const joiner = definition.logic === 'or' ? ' OR ' : ' AND '
  return parts.join(joiner)
}

// ─── Base FROM clause (shared across count and select queries) ──────────────

const BASE_FROM = `
  FROM "email_subscribers" es
  LEFT JOIN "users" u ON es.email = u.email
  LEFT JOIN "customer_metrics" cm ON u.id = cm.user_id
`.trim()

// ─── Count Matching Subscribers ─────────────────────────────────────────────

/**
 * Runs COUNT(*) with the generated WHERE clause.
 * Uses drizzle's `execute` to run raw SQL.
 */
export async function countSegmentSubscribers(
  drizzle: any,
  definition: SegmentDefinition,
): Promise<number> {
  const where = buildSegmentSQL(definition)
  const query = `SELECT COUNT(DISTINCT es.id) as count ${BASE_FROM} WHERE ${where}`

  const result = await drizzle.execute({ sql: query, params: [] })
  const rows = result?.rows ?? result
  return Number(rows?.[0]?.count ?? 0)
}

// ─── Get Matching Subscriber IDs ────────────────────────────────────────────

/**
 * Returns subscriber IDs matching the segment definition.
 */
export async function getSegmentSubscriberIds(
  drizzle: any,
  definition: SegmentDefinition,
  limit?: number,
): Promise<number[]> {
  const where = buildSegmentSQL(definition)
  let query = `SELECT DISTINCT es.id ${BASE_FROM} WHERE ${where} ORDER BY es.id`

  if (limit && limit > 0) {
    query += ` LIMIT ${limit}`
  }

  const result = await drizzle.execute({ sql: query, params: [] })
  const rows = result?.rows ?? result
  return (rows ?? []).map((row: any) => Number(row.id))
}
