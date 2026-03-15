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

  // ═══════════════════════════════════════════════════════════
  // BEAUTY BRANCH — BOOKING FLOWS (7–9)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 7. BEAUTY AFSPRAAK HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Beauty Afspraak Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor een bevestigde beauty afspraak',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'booking.confirmed',
    },
    steps: [
      {
        name: 'Tag: booking-confirmed',
        type: 'add_tag',
        tagName: 'beauty-booking-confirmed',
      },
      {
        name: 'Wacht tot dag voor afspraak',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Afspraak Herinnering',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'beauty-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['beauty', 'booking', 'reminder', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 8. BEAUTY NA-BEHANDELING REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Beauty Na-Behandeling Review Flow',
    description: 'Automatisch review verzoek 2 dagen na afgeronde beauty behandeling',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'booking.completed',
    },
    steps: [
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek (Na Behandeling)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'beauty-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek (Na Behandeling)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'beauty-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['beauty', 'review', 'post-treatment', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 9. BEAUTY EERSTE BEZOEK ONBOARDING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Beauty Eerste Bezoek Onboarding',
    description: 'Welkomstmail voor eerste bezoek aan de beauty salon',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'booking.confirmed',
    },
    entryConditions: [
      { field: 'isFirstVisit', operator: 'equals', value: 'true' },
    ],
    steps: [
      {
        name: 'Stuur welkomstmail',
        type: 'send_email',
        templateName: 'Eerste Bezoek Welkom',
      },
      {
        name: 'Tag: first-visit-welcomed',
        type: 'add_tag',
        tagName: 'beauty-first-visit-welcomed',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Welkomstmail verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['beauty', 'welcome', 'first-visit', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // HORECA BRANCH — RESERVATION FLOWS (10–12)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 10. HORECA RESERVERING HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Horeca Reservering Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor een bevestigde reservering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'reservation.confirmed',
    },
    steps: [
      {
        name: 'Tag: reservation-confirmed',
        type: 'add_tag',
        tagName: 'horeca-reservation-confirmed',
      },
      {
        name: 'Wacht tot dag voor reservering',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Reservering Herinnering',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'horeca-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'reservation.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['horeca', 'reservation', 'reminder', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 11. HORECA NA-BEZOEK REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Horeca Na-Bezoek Review Flow',
    description: 'Automatisch review verzoek 1 dag na afgerond restaurantbezoek',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'reservation.completed',
    },
    steps: [
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Bezoek (Horeca)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'horeca-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Bezoek (Horeca)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'horeca-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['horeca', 'review', 'post-visit', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 12. HORECA GROEPSRESERVERING FOLLOW-UP
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Horeca Groepsreservering Follow-up',
    description: 'Bevestigingsmail voor groepsreserveringen (8+ gasten)',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'reservation.confirmed',
    },
    entryConditions: [
      { field: 'guests', operator: 'greater_than_equal', value: '8' },
    ],
    steps: [
      {
        name: 'Stuur groepsinfo',
        type: 'send_email',
        templateName: 'Groepsreservering Ontvangen',
      },
      {
        name: 'Tag: group-reservation',
        type: 'add_tag',
        tagName: 'horeca-group-reservation',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Groepsinfo verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'reservation.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['horeca', 'group', 'reservation', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // ZORG BRANCH — APPOINTMENT FLOWS (13–15)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 13. ZORG AFSPRAAK HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zorg Afspraak Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor een bevestigde zorgafspraak',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'appointment.confirmed',
    },
    steps: [
      {
        name: 'Tag: appointment-confirmed',
        type: 'add_tag',
        tagName: 'zorg-appointment-confirmed',
      },
      {
        name: 'Wacht tot dag voor afspraak',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Afspraak Herinnering (Zorg)',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'zorg-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'appointment.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['zorg', 'appointment', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 14. ZORG NA-BEHANDELING REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zorg Na-Behandeling Review Flow',
    description: 'Automatisch review verzoek 2 dagen na afgeronde zorgbehandeling',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'appointment.completed',
    },
    steps: [
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Behandeling (Zorg)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'zorg-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Behandeling (Zorg)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'zorg-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['zorg', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 15. ZORG INTAKE FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zorg Intake Follow-up Flow',
    description: 'Automatische intake bevestiging voor patiënten met verwijzing',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'appointment.confirmed',
    },
    entryConditions: [
      { field: 'hasReferral', operator: 'not_equals', value: 'no' },
    ],
    steps: [
      {
        name: 'Stuur intake bevestiging',
        type: 'send_email',
        templateName: 'Intake Formulier Ontvangen (Zorg)',
      },
      {
        name: 'Tag: intake-sent',
        type: 'add_tag',
        tagName: 'zorg-intake-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Intake bevestiging verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'appointment.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['zorg', 'intake', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // PUBLISHING BRANCH — SUBSCRIPTION & CONTENT FLOWS (16–18)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 16. PUBLISHING NIEUWE ABONNEE ONBOARDING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Publishing Nieuwe Abonnee Onboarding Flow',
    description: 'Verwelkom nieuwe abonnees met onboarding en tips',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'subscription.activated',
    },
    steps: [
      {
        name: 'Tag: publishing-subscriber',
        type: 'add_tag',
        tagName: 'publishing-subscriber',
      },
      {
        name: 'Stuur welkomstmail',
        type: 'send_email',
        templateName: 'Abonnement Welkom (Publishing)',
      },
      {
        name: 'Wacht 3 dagen',
        type: 'wait',
        waitDuration: { value: 3, unit: 'days' },
      },
      {
        name: 'Tag: publishing-onboarded',
        type: 'add_tag',
        tagName: 'publishing-onboarded',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Onboarding flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'subscription.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['publishing', 'subscription', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 17. PUBLISHING NIEUWE EDITIE NOTIFICATIE FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Publishing Nieuwe Editie Notificatie Flow',
    description: 'Notificeer abonnees wanneer een nieuwe magazine editie beschikbaar is',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'magazine.edition.published',
    },
    steps: [
      {
        name: 'Stuur editie notificatie',
        type: 'send_email',
        templateName: 'Nieuwe Magazine Editie (Publishing)',
      },
      {
        name: 'Tag: publishing-edition-notified',
        type: 'add_tag',
        tagName: 'publishing-edition-notified',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Editie notificatie verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 100,
    },
    tags: ['publishing', 'magazine', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 18. PUBLISHING PREMIUM CONTENT ALERT FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Publishing Premium Content Alert Flow',
    description: 'Notificeer premium abonnees over nieuwe exclusieve content',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'article.published.premium',
    },
    steps: [
      {
        name: 'Stuur premium artikel notificatie',
        type: 'send_email',
        templateName: 'Premium Artikel Beschikbaar (Publishing)',
      },
      {
        name: 'Tag: publishing-premium-alerted',
        type: 'add_tag',
        tagName: 'publishing-premium-alerted',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Premium content alert verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 100,
    },
    tags: ['publishing', 'premium', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // AUTOMOTIVE BRANCH — WORKSHOP & VEHICLE FLOWS (19–21)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 19. AUTOMOTIVE WERKPLAATS HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Automotive Werkplaats Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor een bevestigde werkplaatsafspraak',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'workshop.booking.confirmed',
    },
    steps: [
      {
        name: 'Tag: automotive-booking-confirmed',
        type: 'add_tag',
        tagName: 'automotive-booking-confirmed',
      },
      {
        name: 'Wacht tot dag voor afspraak',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Werkplaatsafspraak Herinnering (Automotive)',
      },
      {
        name: 'Tag: automotive-reminder-sent',
        type: 'add_tag',
        tagName: 'automotive-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'workshop.booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['automotive', 'workshop', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 20. AUTOMOTIVE NA-BEZOEK REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Automotive Na-Bezoek Review Flow',
    description: 'Automatisch review verzoek 2 dagen na afgerond werkplaatsbezoek',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'workshop.booking.completed',
    },
    steps: [
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Request',
      },
      {
        name: 'Tag: automotive-review-requested',
        type: 'add_tag',
        tagName: 'automotive-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Review Herinnering',
      },
      {
        name: 'Tag: automotive-review-reminder-sent',
        type: 'add_tag',
        tagName: 'automotive-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['automotive', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 21. AUTOMOTIVE PROEFRIT FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Automotive Proefrit Follow-up Flow',
    description: 'Automatische bevestiging na een proefrit-aanvraag',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'test.drive.requested',
    },
    steps: [
      {
        name: 'Stuur bevestiging',
        type: 'send_email',
        templateName: 'Proefrit Aanvraag Ontvangen (Automotive)',
      },
      {
        name: 'Tag: automotive-test-drive-requested',
        type: 'add_tag',
        tagName: 'automotive-test-drive-requested',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Proefrit bevestiging verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['automotive', 'test-drive', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // TOERISME BRANCH — TRAVEL FLOWS (22–24)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 22. TOERISME REIS HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Reis Herinnering Flow',
    description: 'Automatische herinneringen 7 dagen en 1 dag voor vertrek na bevestigde boeking',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'booking.confirmed',
    },
    steps: [
      {
        name: 'Tag: booking-confirmed',
        type: 'add_tag',
        tagName: 'toerisme-booking-confirmed',
      },
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur reisherinnering (7 dagen)',
        type: 'send_email',
        templateName: 'Reisherinnering (7 dagen)',
      },
      {
        name: 'Wacht 6 dagen',
        type: 'wait',
        waitDuration: { value: 6, unit: 'days' },
      },
      {
        name: 'Stuur reisherinnering (1 dag)',
        type: 'send_email',
        templateName: 'Reisherinnering (1 dag)',
      },
      {
        name: 'Tag: reminders-sent',
        type: 'add_tag',
        tagName: 'toerisme-reminders-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Reisherinneringen verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['toerisme', 'herinnering', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 23. TOERISME NA-REIS REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Na-Reis Review Flow',
    description: 'Automatisch review verzoek 3 dagen na afronding van de reis',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'booking.completed',
    },
    steps: [
      {
        name: 'Wacht 3 dagen',
        type: 'wait',
        waitDuration: { value: 3, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Na-Reis Review Verzoek',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'toerisme-review-requested',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Na-reis review flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['toerisme', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 24. TOERISME VROEGBOEKKORTING NOTIFICATIE FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Vroegboekkorting Notificatie Flow',
    description: 'Automatische notificatie bij beschikbare vroegboekkorting op een reis',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'tour.early_bird',
    },
    steps: [
      {
        name: 'Stuur vroegboekkorting notificatie',
        type: 'send_email',
        templateName: 'Vroegboekkorting Notificatie',
      },
      {
        name: 'Tag: early-bird-notified',
        type: 'add_tag',
        tagName: 'toerisme-early-bird-notified',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Vroegboekkorting notificatie verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['toerisme', 'promotional', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // VASTGOED BRANCH — VIEWING & VALUATION FLOWS (25–27)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 25. VASTGOED BEZICHTIGING HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Vastgoed Bezichtiging Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor een bevestigde bezichtiging',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'viewing.confirmed',
    },
    steps: [
      {
        name: 'Tag: viewing-confirmed',
        type: 'add_tag',
        tagName: 'vastgoed-viewing-confirmed',
      },
      {
        name: 'Wacht tot dag voor bezichtiging',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur bezichtiging herinnering',
        type: 'send_email',
        templateName: 'Bezichtiging Herinnering',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'vastgoed-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Bezichtiging herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'viewing.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['vastgoed', 'bezichtiging', 'reminder', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 26. VASTGOED NA-BEZICHTIGING FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Vastgoed Na-Bezichtiging Follow-up Flow',
    description: 'Automatische follow-up na een afgeronde bezichtiging: 1 dag wachten, follow-up mail, 7 dagen wachten, interesse herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'viewing.completed',
    },
    steps: [
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur na-bezichtiging follow-up',
        type: 'send_email',
        templateName: 'Na-Bezichtiging Follow-up',
      },
      {
        name: 'Tag: follow-up-sent',
        type: 'add_tag',
        tagName: 'vastgoed-follow-up-sent',
      },
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Stuur interesse herinnering',
        type: 'send_email',
        templateName: 'Na-Bezichtiging Follow-up',
      },
      {
        name: 'Tag: interest-reminder-sent',
        type: 'add_tag',
        tagName: 'vastgoed-interest-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Na-bezichtiging follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['vastgoed', 'follow-up', 'post-viewing', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 27. VASTGOED WAARDEBEPALING FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Vastgoed Waardebepaling Follow-up Flow',
    description: 'Automatische follow-up na afgeronde waardebepaling: rapport versturen, 14 dagen wachten, verkoopaanbod',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'valuation.completed',
    },
    steps: [
      {
        name: 'Stuur waardebepaling gereed',
        type: 'send_email',
        templateName: 'Waardebepaling Gereed (Klant)',
      },
      {
        name: 'Tag: valuation-delivered',
        type: 'add_tag',
        tagName: 'vastgoed-valuation-delivered',
      },
      {
        name: 'Wacht 14 dagen',
        type: 'wait',
        waitDuration: { value: 14, unit: 'days' },
      },
      {
        name: 'Stuur verkoopaanbod',
        type: 'send_email',
        templateName: 'Waardebepaling Gereed (Klant)',
      },
      {
        name: 'Tag: sell-offer-sent',
        type: 'add_tag',
        tagName: 'vastgoed-sell-offer-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Waardebepaling follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 5,
    },
    tags: ['vastgoed', 'waardebepaling', 'follow-up', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // ONDERWIJS BRANCH — ENROLLMENT & COURSE FLOWS (28–30)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 28. ONDERWIJS CURSUS WELKOM FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Onderwijs Cursus Welkom Flow',
    description: 'Welkomstmail 1 uur na activering van een cursus-inschrijving',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'enrollment.active',
    },
    steps: [
      {
        name: 'Tag: enrollment-active',
        type: 'add_tag',
        tagName: 'onderwijs-enrollment-active',
      },
      {
        name: 'Wacht 1 uur',
        type: 'wait',
        waitDuration: { value: 1, unit: 'hours' },
      },
      {
        name: 'Stuur cursus welkom',
        type: 'send_email',
        templateName: 'Cursus Welkom',
      },
      {
        name: 'Tag: welcome-sent',
        type: 'add_tag',
        tagName: 'onderwijs-welcome-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Cursus welkom flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'enrollment.refunded' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['onderwijs', 'welcome', 'enrollment', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 29. ONDERWIJS VOORTGANG HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Onderwijs Voortgang Herinnering Flow',
    description: 'Herinneringen om studenten aan te moedigen hun cursus af te ronden: 7 dagen wachten, voortgang herinnering, 14 dagen wachten, tweede herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'enrollment.active',
    },
    entryConditions: [
      { field: 'days_since_enrollment', operator: 'greater_than', value: '7' },
      { field: 'progress', operator: 'less_than', value: '50' },
    ],
    steps: [
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Stuur voortgang herinnering',
        type: 'send_email',
        templateName: 'Voortgang Herinnering',
      },
      {
        name: 'Tag: progress-reminder-sent',
        type: 'add_tag',
        tagName: 'onderwijs-progress-reminder-sent',
      },
      {
        name: 'Wacht 14 dagen',
        type: 'wait',
        waitDuration: { value: 14, unit: 'days' },
      },
      {
        name: 'Check voortgang',
        type: 'condition',
        condition: { field: 'progress', operator: 'less_than', value: '75' },
      },
      {
        name: 'Stuur tweede herinnering',
        type: 'send_email',
        templateName: 'Voortgang Herinnering',
      },
      {
        name: 'Tag: second-reminder',
        type: 'add_tag',
        tagName: 'onderwijs-second-reminder',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Voortgang herinnering flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'enrollment.completed' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['onderwijs', 'progress', 'reminder', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 30. ONDERWIJS NA-CURSUS REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Onderwijs Na-Cursus Review Flow',
    description: 'Automatisch certificaat en review verzoek na het afronden van een cursus',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'enrollment.completed',
    },
    steps: [
      {
        name: 'Stuur cursus afgerond',
        type: 'send_email',
        templateName: 'Cursus Afgerond',
      },
      {
        name: 'Tag: course-completed',
        type: 'add_tag',
        tagName: 'onderwijs-course-completed',
      },
      {
        name: 'Wacht 3 dagen',
        type: 'wait',
        waitDuration: { value: 3, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek (Na Cursus)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'onderwijs-review-requested',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Na-cursus review flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['onderwijs', 'review', 'post-course', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // CONSTRUCTION (BOUWBEDRIJF) — FLOWS (31–33)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 31. BOUW OFFERTE FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bouw Offerte Follow-up Flow',
    description: 'Automatische follow-up na offerte aanvraag: wacht 1 dag → bevestiging',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'quote.requested',
    },
    steps: [
      {
        name: 'Tag: quote-requested',
        type: 'add_tag',
        tagName: 'bouw-quote-requested',
      },
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur offerte bevestiging',
        type: 'send_email',
        templateName: 'Offerte Aanvraag Bevestiging (Bouw)',
      },
      {
        name: 'Tag: followup-sent',
        type: 'add_tag',
        tagName: 'bouw-quote-followup-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Offerte follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['bouw', 'construction', 'offerte', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 32. BOUW NA-PROJECT REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bouw Na-Project Review Flow',
    description: 'Automatisch review verzoek na afgerond project: wacht 14 dagen → review email → wacht 7 dagen → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'project.completed',
    },
    steps: [
      {
        name: 'Tag: project-completed',
        type: 'add_tag',
        tagName: 'bouw-project-completed',
      },
      {
        name: 'Wacht 14 dagen',
        type: 'wait',
        waitDuration: { value: 14, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Project (Bouw)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'bouw-review-requested',
      },
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Stuur review herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Project (Bouw)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'bouw-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['bouw', 'construction', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 33. BOUW OFFERTE HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bouw Offerte Herinnering Flow',
    description: 'Herinnering als offerte 5 dagen onbeantwoord is: wacht 5 dagen → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'quote.sent',
    },
    steps: [
      {
        name: 'Tag: quote-sent',
        type: 'add_tag',
        tagName: 'bouw-quote-sent',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur offerte herinnering',
        type: 'send_email',
        templateName: 'Offerte Gereed (Bouw)',
      },
      {
        name: 'Tag: quote-reminder-sent',
        type: 'add_tag',
        tagName: 'bouw-quote-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Offerte herinnering flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'quote.accepted' },
      { eventType: 'custom.event', customEventName: 'quote.rejected' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['bouw', 'construction', 'offerte', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // EXPERIENCES (ERVARINGEN) — FLOWS (34–36)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 34. ERVARINGEN BOEKING HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Ervaringen Boeking Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor ervaring',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'experience.booking.confirmed',
    },
    steps: [
      {
        name: 'Tag: booking-confirmed',
        type: 'add_tag',
        tagName: 'experience-booking-confirmed',
      },
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Boeking Herinnering (Ervaringen)',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'experience-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'experience.booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['ervaringen', 'experiences', 'herinnering', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 35. ERVARINGEN NA-ERVARING REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Ervaringen Na-Ervaring Review Flow',
    description: 'Automatisch review verzoek na ervaring: wacht 2 dagen → review email → wacht 5 dagen → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'experience.completed',
    },
    steps: [
      {
        name: 'Tag: experience-completed',
        type: 'add_tag',
        tagName: 'experience-completed',
      },
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Ervaring',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'experience-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur review herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Ervaring',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'experience-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['ervaringen', 'experiences', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 36. ERVARINGEN GROEPSERVARING WELKOM FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Ervaringen Groepservaring Welkom Flow',
    description: 'Automatische welkomstmail voor groepservaringen',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'experience.booking.confirmed',
    },
    entryConditions: [
      { field: 'groupSize', operator: 'greater_than', value: '4' },
    ],
    steps: [
      {
        name: 'Stuur groep welkomstmail',
        type: 'send_email',
        templateName: 'Groepservaring Welkom',
      },
      {
        name: 'Tag: group-welcomed',
        type: 'add_tag',
        tagName: 'experience-group-welcomed',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Welkomstmail verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'experience.booking.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['ervaringen', 'experiences', 'groep', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // HOSPITALITY — FLOWS (37–39)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 37. HOSPITALITY AFSPRAAK HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Hospitality Afspraak Herinnering Flow',
    description: 'Automatische herinnering 1 dag voor afspraak bij de praktijk',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'hospitality.appointment.confirmed',
    },
    steps: [
      {
        name: 'Tag: appointment-confirmed',
        type: 'add_tag',
        tagName: 'hospitality-appointment-confirmed',
      },
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur herinnering',
        type: 'send_email',
        templateName: 'Afspraak Herinnering (Hospitality)',
      },
      {
        name: 'Tag: reminder-sent',
        type: 'add_tag',
        tagName: 'hospitality-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Herinnering verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'hospitality.appointment.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 50,
    },
    tags: ['hospitality', 'praktijk', 'herinnering', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 38. HOSPITALITY NA-BEZOEK REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Hospitality Na-Bezoek Review Flow',
    description: 'Automatisch review verzoek na bezoek: wacht 2 dagen → review email → wacht 5 dagen → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'hospitality.appointment.completed',
    },
    steps: [
      {
        name: 'Tag: appointment-completed',
        type: 'add_tag',
        tagName: 'hospitality-appointment-completed',
      },
      {
        name: 'Wacht 2 dagen',
        type: 'wait',
        waitDuration: { value: 2, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Bezoek (Hospitality)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'hospitality-review-requested',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur review herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Bezoek (Hospitality)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'hospitality-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 20,
    },
    tags: ['hospitality', 'praktijk', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 39. HOSPITALITY EERSTE BEZOEK ONBOARDING
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Hospitality Eerste Bezoek Onboarding',
    description: 'Automatische welkomstmail voor eerste bezoek aan de praktijk',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'hospitality.appointment.confirmed',
    },
    entryConditions: [
      { field: 'isFirstVisit', operator: 'equals', value: 'true' },
    ],
    steps: [
      {
        name: 'Stuur welkomstmail',
        type: 'send_email',
        templateName: 'Eerste Bezoek Welkom (Hospitality)',
      },
      {
        name: 'Tag: first-visit-welcomed',
        type: 'add_tag',
        tagName: 'hospitality-first-visit-welcomed',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Welkomstmail verstuurd',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'hospitality.appointment.cancelled' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['hospitality', 'praktijk', 'eerste-bezoek', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // PROFESSIONAL-SERVICES (ZAKELIJKE DIENSTVERLENING) — FLOWS (40–42)
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // 40. ZAKELIJK ADVIESGESPREK FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zakelijk Adviesgesprek Follow-up Flow',
    description: 'Automatische follow-up na adviesgesprek aanvraag: wacht 1 dag → bevestiging',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'consultation.requested',
    },
    steps: [
      {
        name: 'Tag: consultation-requested',
        type: 'add_tag',
        tagName: 'zakelijk-consultation-requested',
      },
      {
        name: 'Wacht 1 dag',
        type: 'wait',
        waitDuration: { value: 1, unit: 'days' },
      },
      {
        name: 'Stuur adviesgesprek bevestiging',
        type: 'send_email',
        templateName: 'Adviesgesprek Bevestiging (Zakelijk)',
      },
      {
        name: 'Tag: followup-sent',
        type: 'add_tag',
        tagName: 'zakelijk-consultation-followup-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['zakelijk', 'professional-services', 'adviesgesprek', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 41. ZAKELIJK NA-OPDRACHT REVIEW FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zakelijk Na-Opdracht Review Flow',
    description: 'Automatisch review verzoek na afgeronde opdracht: wacht 7 dagen → review email → wacht 7 dagen → herinnering',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'engagement.completed',
    },
    steps: [
      {
        name: 'Tag: engagement-completed',
        type: 'add_tag',
        tagName: 'zakelijk-engagement-completed',
      },
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Stuur review verzoek',
        type: 'send_email',
        templateName: 'Review Verzoek Na Opdracht (Zakelijk)',
      },
      {
        name: 'Tag: review-requested',
        type: 'add_tag',
        tagName: 'zakelijk-review-requested',
      },
      {
        name: 'Wacht 7 dagen',
        type: 'wait',
        waitDuration: { value: 7, unit: 'days' },
      },
      {
        name: 'Stuur review herinnering',
        type: 'send_email',
        templateName: 'Review Verzoek Na Opdracht (Zakelijk)',
      },
      {
        name: 'Tag: review-reminder-sent',
        type: 'add_tag',
        tagName: 'zakelijk-review-reminder-sent',
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
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['zakelijk', 'professional-services', 'review', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 42. ZAKELIJK VOORSTEL HERINNERING FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zakelijk Voorstel Herinnering Flow',
    description: 'Herinnering als voorstel 5 dagen onbeantwoord is',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'proposal.sent',
    },
    steps: [
      {
        name: 'Tag: proposal-sent',
        type: 'add_tag',
        tagName: 'zakelijk-proposal-sent',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Stuur voorstel herinnering',
        type: 'send_email',
        templateName: 'Voorstel Gereed (Zakelijk)',
      },
      {
        name: 'Tag: proposal-reminder-sent',
        type: 'add_tag',
        tagName: 'zakelijk-proposal-reminder-sent',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Voorstel herinnering flow afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'proposal.accepted' },
      { eventType: 'custom.event', customEventName: 'proposal.rejected' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: true,
      maxEntriesPerUser: 10,
    },
    tags: ['zakelijk', 'professional-services', 'voorstel', 'predefined'],
  },

  // ═══════════════════════════════════════════════════════════
  // 43. MARKETPLACE LEVERANCIER AANVRAAG FOLLOW-UP FLOW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Leverancier Aanvraag Follow-up',
    description: 'Bevestiging naar aanvrager + herinnering aan admin als aanvraag na 5 dagen nog pending is',
    entryTrigger: {
      eventType: 'custom.event',
      customEventName: 'vendor.application.submitted',
    },
    entryConditions: [],
    steps: [
      {
        name: 'Stuur bevestiging naar aanvrager',
        type: 'send_email',
        templateName: 'Leverancier Aanvraag Bevestiging',
      },
      {
        name: 'Tag: vendor-application-submitted',
        type: 'add_tag',
        tagName: 'vendor-application-submitted',
      },
      {
        name: 'Wacht 5 dagen',
        type: 'wait',
        waitDuration: { value: 5, unit: 'days' },
      },
      {
        name: 'Herinnering admin als nog pending',
        type: 'send_email',
        templateName: 'Leverancier Aanvraag Ontvangen (Admin)',
      },
      {
        name: 'Flow afgerond',
        type: 'exit',
        exitReason: 'Leverancier aanvraag follow-up afgerond',
      },
    ],
    exitConditions: [
      { eventType: 'custom.event', customEventName: 'vendor.application.approved' },
      { eventType: 'custom.event', customEventName: 'vendor.application.rejected' },
      { eventType: 'subscriber.unsubscribed' },
    ],
    settings: {
      allowReentry: false,
      maxEntriesPerUser: 1,
    },
    tags: ['marketplace', 'vendor', 'application', 'predefined'],
  },
]
