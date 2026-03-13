/**
 * Predefined Automation Flows (#44 + #46)
 *
 * Ready-to-use automation flows for common e-commerce scenarios.
 * Each flow includes trigger configuration, steps, and exit conditions.
 *
 * Flows reference predefined templates by name — the seed function
 * resolves them to actual template IDs after seeding templates.
 */

export interface PredefinedFlowStep {
  name: string
  type: 'send_email' | 'wait' | 'condition' | 'add_tag' | 'remove_tag' | 'add_to_list' | 'remove_from_list' | 'exit'
  // For send_email
  templateName?: string // Resolved to emailTemplate ID during seeding
  // For wait
  waitDuration?: { value: number; unit: 'hours' | 'days' | 'weeks' }
  // For condition
  condition?: { field: string; operator: string; value: string }
  // For tags
  tagName?: string
  // For exit
  exitReason?: string
}

export interface PredefinedFlow {
  name: string
  description: string
  entryTrigger: {
    eventType: string
    customEventName?: string
  }
  entryConditions?: Array<{ field: string; operator: string; value: string }>
  steps: PredefinedFlowStep[]
  exitConditions?: Array<{ eventType: string; customEventName?: string }>
  settings: {
    allowReentry: boolean
    maxEntriesPerUser?: number
  }
  tags: string[]
}

export const predefinedFlows: PredefinedFlow[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. REVIEW REQUEST FLOW (#44)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Review Request Flow',
    description: 'Automatisch review verzoek na bestelling: wacht 7 dagen → review email → wacht 5 dagen → herinnering',
    entryTrigger: {
      eventType: 'order.placed',
    },
    steps: [
      {
        name: 'Wacht na levering',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'review-requested',
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Request',
      },
      {
        name: 'Wacht op review',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Review Herinnering',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'review-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Review flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['review', 'post-purchase', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 2. WELKOM-SERIE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Welkom-Serie',
    description: 'Welkomstreeks voor nieuwe subscribers: welkom email → wacht 3 dagen → tips/aanbevelingen',
    entryTrigger: {
      eventType: 'user.signup',
    },
    steps: [
      {
        name: 'Stuur welkomstmail',
        type: 'send_email',
        templateName: 'Welkom',
      },
      {
        name: 'Tag: welcomed',
        type: 'add_tag',
        tagName: 'welcomed',
      },
      {
        name: 'Wacht 3 dagen',
        type: 'wait',
        waitDuration: { value: 3, unit: 'days' },
      },
      {
        name: 'Tag: onboarding-complete',
        type: 'add_tag',
        tagName: 'onboarding-complete',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Welkom-serie afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['welcome', 'onboarding', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 3. ABANDONED CART
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Verlaten Winkelwagen',
    description: 'Automatische herinnering bij verlaten winkelwagen: wacht 1 uur → email → wacht 1 dag → herinnering',
    entryTrigger: {
      eventType: 'cart.abandoned',
    },
    steps: [
      {
        name: 'Wacht 1 uur',
        type: 'wait',
        waitDuration: { value: 1, unit: 'hours' },
      },
      {
        name: 'Stuur winkelwagen herinnering',
        type: 'send_email',
        templateName: 'Verlaten Winkelwagen',
      },
      {
        name: 'Tag: cart-reminder-sent',
        type: 'add_tag',
        tagName: 'cart-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Winkelwagen herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'order.placed' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 3,
    },
    tags: ['abandoned-cart', 'recovery', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 4. RE-ENGAGEMENT / WIN-BACK
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Re-Engagement Flow',
    description: 'Win inactieve klanten terug: trigger na 60 dagen inactiviteit → win-back email → wacht 7 dagen → tag',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'customer.inactive',
    },
    entryConditions: [
      { field: 'days_since_last_order', operator: 'greater_than', value: '60' },
    ],
    steps: [
      {
        name: 'Stuur win-back email',
        type: 'send_email',
        templateName: 'Win-Back',
      },
      {
        name: 'Tag: win-back-sent',
        type: 'add_tag',
        tagName: 'win-back-sent',
      },
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Tag: at-risk',
        type: 'add_tag',
        tagName: 'at-risk',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Re-engagement flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'order.placed' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['re-engagement', 'win-back', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 5. OFFERTE FOLLOW-UP
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Offerte Follow-up',
    description: 'Automatische herinnering bij openstaande offerte: wacht 2 dagen → check status → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'quote.created',
    },
    steps: [
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Check offerte status',
        type: 'condition',
        condition: { field: 'quote_status', operator: 'equals', value: 'quoted' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Offerte Klaar (Klant)',
      },
      {
        name: 'Tag: quote-reminder-sent',
        type: 'add_tag',
        tagName: 'quote-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Offerte follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'quote.accepted' },
      { eventType: 'custom.event', customEventName: 'quote.rejected' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 5,
    },
    tags: ['quote', 'follow-up', 'b2b', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 6. GOEDKEURING HERINNERING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Goedkeuring Herinnering',
    description: 'Herinnering bij openstaande goedkeuring: wacht 1 dag → check pending → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'approval.created',
    },
    steps: [
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Check approval status',
        type: 'condition',
        condition: { field: 'approval_status', operator: 'equals', value: 'pending' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Goedkeuring Gevraagd',
      },
      {
        name: 'Tag: approval-reminder-sent',
        type: 'add_tag',
        tagName: 'approval-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Goedkeuring herinnering afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'approval.approved' },
      { eventType: 'custom.event', customEventName: 'approval.rejected' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['approval', 'reminder', 'b2b', 'predefined'],
  },
]
