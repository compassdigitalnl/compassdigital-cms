/**
 * Predefined Email Segments (#47)
 *
 * Ready-to-use customer segments for targeting email campaigns.
 * Each segment uses the condition format from EmailSegments collection.
 *
 * Condition structure matches src/features/email-marketing/lib/segmentation/types.ts:
 * - field: ConditionField (e.g., 'total_orders', 'days_since_last_order', 'rfm_segment')
 * - operator: ConditionOperator (e.g., 'gt', 'equals', 'between')
 * - value: string or number
 */

export interface PredefinedSegment {
  title: string
  slug: string
  description: string
  conditions: Array<{
    field: string
    operator: string
    value: string | number
    value2?: string | number // For 'between' operator
  }>
  conditionLogic: 'and' | 'or'
  tags: string[]
}

export const predefinedSegments: PredefinedSegment[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. GEKOCHT MAAR NIET GEREVIEWED
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Gekocht, niet gereviewed',
    slug: 'gekocht-niet-gereviewed',
    description: 'Klanten die minstens 1 bestelling hebben maar nog geen review hebben geschreven. Ideaal voor review request campagnes.',
    conditions: [
      { field: 'total_orders', operator: 'gte', value: 1 },
      { field: 'tag', operator: 'not_contains', value: 'has-reviewed' },
      { field: 'days_since_last_order', operator: 'gte', value: 7 },
    ],
    conditionLogic: 'and',
    tags: ['review', 'post-purchase', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 2. HERHAALAANKOPERS
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Herhaalaankopers',
    slug: 'herhaalaankopers',
    description: 'Klanten die 2 of meer bestellingen hebben geplaatst. Loyale klanten die gevoelig zijn voor herbestelling en upsell campagnes.',
    conditions: [
      { field: 'total_orders', operator: 'gte', value: 2 },
    ],
    conditionLogic: 'and',
    tags: ['loyalty', 'retention', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 3. INACTIEF 90 DAGEN
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Inactief 90+ dagen',
    slug: 'inactief-90-dagen',
    description: 'Klanten die al 90 dagen of langer niet hebben besteld. Doelgroep voor win-back en re-engagement campagnes.',
    conditions: [
      { field: 'total_orders', operator: 'gte', value: 1 },
      { field: 'days_since_last_order', operator: 'gte', value: 90 },
    ],
    conditionLogic: 'and',
    tags: ['inactive', 'win-back', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 4. VIP KLANTEN
  // ═══════════════════════════════════════════════════════════
  {
    title: 'VIP Klanten',
    slug: 'vip-klanten',
    description: 'Top klanten met hoge RFM-scores (recency, frequency, monetary). Ideaal voor exclusieve aanbiedingen en vroege toegang.',
    conditions: [
      { field: 'rfm_segment', operator: 'in', value: 'champions,loyal_customers' },
      { field: 'total_revenue', operator: 'gte', value: 500 },
    ],
    conditionLogic: 'and',
    tags: ['vip', 'high-value', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 5. NIEUWE KLANTEN (EERSTE AANKOOP)
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Nieuwe klanten',
    slug: 'nieuwe-klanten',
    description: 'Klanten met precies 1 bestelling in de afgelopen 30 dagen. Perfect voor welkom-serie en eerste-aankoop opvolging.',
    conditions: [
      { field: 'total_orders', operator: 'equals', value: 1 },
      { field: 'days_since_last_order', operator: 'lte', value: 30 },
    ],
    conditionLogic: 'and',
    tags: ['new-customer', 'onboarding', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 6. HOOG CHURN-RISICO
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Hoog churn-risico',
    slug: 'hoog-churn-risico',
    description: 'Klanten met een hoog risico om af te haken (churn label: high of critical). Prioriteit voor retentie-campagnes.',
    conditions: [
      { field: 'churn_label', operator: 'in', value: 'high,critical' },
    ],
    conditionLogic: 'and',
    tags: ['churn', 'at-risk', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 7. HOGE GEMIDDELDE BESTELWAARDE
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Hoge bestelwaarde',
    slug: 'hoge-bestelwaarde',
    description: 'Klanten met een gemiddelde bestelwaarde boven €100. Geschikt voor premium producten en upsell campagnes.',
    conditions: [
      { field: 'avg_order_value', operator: 'gte', value: 100 },
      { field: 'total_orders', operator: 'gte', value: 2 },
    ],
    conditionLogic: 'and',
    tags: ['high-aov', 'premium', 'predefined'],
  },
]
