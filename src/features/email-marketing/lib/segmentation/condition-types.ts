import type { ConditionField, ConditionOperator } from './types'

export type FieldType = 'text' | 'number' | 'date' | 'select'

export interface ConditionFieldDefinition {
  field: ConditionField
  label: string
  group: string
  type: FieldType
  operators: ConditionOperator[]
  options?: { label: string; value: string }[]
}

/**
 * Alle beschikbare conditievelden, gegroepeerd per categorie.
 * Labels in het Nederlands.
 */
export const CONDITION_FIELDS: ConditionFieldDefinition[] = [
  // ─── Abonnee ───────────────────────────────────────────────
  {
    field: 'email',
    label: 'E-mailadres',
    group: 'Abonnee',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_set', 'is_not_set'],
  },
  {
    field: 'name',
    label: 'Naam',
    group: 'Abonnee',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_set', 'is_not_set'],
  },
  {
    field: 'created_at',
    label: 'Aangemeld op',
    group: 'Abonnee',
    type: 'date',
    operators: ['equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'status',
    label: 'Status',
    group: 'Abonnee',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { label: 'Actief', value: 'active' },
      { label: 'Uitgeschreven', value: 'unsubscribed' },
    ],
  },

  // ─── Bestelling ────────────────────────────────────────────
  {
    field: 'total_orders',
    label: 'Totaal bestellingen',
    group: 'Bestelling',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'total_revenue',
    label: 'Totale omzet',
    group: 'Bestelling',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'avg_order_value',
    label: 'Gemiddelde bestelwaarde',
    group: 'Bestelling',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'last_order_at',
    label: 'Laatste bestelling op',
    group: 'Bestelling',
    type: 'date',
    operators: ['equals', 'gt', 'gte', 'lt', 'lte', 'between', 'is_set', 'is_not_set'],
  },
  {
    field: 'days_since_last_order',
    label: 'Dagen sinds laatste bestelling',
    group: 'Bestelling',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },

  // ─── RFM & Segment ────────────────────────────────────────
  {
    field: 'rfm_segment',
    label: 'RFM Segment',
    group: 'RFM & Segment',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { label: 'Champions', value: 'champions' },
      { label: 'Loyaal', value: 'loyal' },
      { label: 'Potentieel', value: 'potential' },
      { label: 'Nieuw', value: 'new' },
      { label: 'Risico', value: 'at_risk' },
      { label: 'Slapend', value: 'hibernating' },
      { label: 'Verloren', value: 'lost' },
    ],
  },
  {
    field: 'recency_score',
    label: 'Recency score',
    group: 'RFM & Segment',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'frequency_score',
    label: 'Frequency score',
    group: 'RFM & Segment',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'monetary_score',
    label: 'Monetary score',
    group: 'RFM & Segment',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },

  // ─── Churn & CLV ──────────────────────────────────────────
  {
    field: 'churn_risk',
    label: 'Churn risico',
    group: 'Churn & CLV',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },
  {
    field: 'churn_label',
    label: 'Churn label',
    group: 'Churn & CLV',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { label: 'Laag', value: 'low' },
      { label: 'Gemiddeld', value: 'medium' },
      { label: 'Hoog', value: 'high' },
      { label: 'Kritiek', value: 'critical' },
    ],
  },
  {
    field: 'clv_predicted',
    label: 'Voorspelde CLV',
    group: 'Churn & CLV',
    type: 'number',
    operators: ['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'between'],
  },

  // ─── Lijst ────────────────────────────────────────────────
  {
    field: 'list_id',
    label: 'Lijst ID',
    group: 'Lijst',
    type: 'number',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
  },
]

/**
 * Veld definitie ophalen op basis van field key
 */
export function getFieldDefinition(field: ConditionField): ConditionFieldDefinition | undefined {
  return CONDITION_FIELDS.find((f) => f.field === field)
}

/**
 * Alle unieke groepsnamen ophalen
 */
export function getFieldGroups(): string[] {
  const groups = new Set<string>()
  CONDITION_FIELDS.forEach((f) => groups.add(f.group))
  return Array.from(groups)
}
