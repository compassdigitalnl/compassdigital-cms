/**
 * Checkout Flow Configuration
 *
 * Replaces separate cart + checkout template selection with unified "flows"
 * that ensure consistent cart → checkout experience.
 *
 * Each flow couples a cart template with a checkout template and defines
 * whether the visual stepper is shown.
 */

/** Unified 5-step labels shared by cart + checkout */
export const UNIFIED_STEPS = [
  { id: 1, label: 'Winkelwagen' },
  { id: 2, label: 'Gegevens' },
  { id: 3, label: 'Verzending' },
  { id: 4, label: 'Betaling' },
  { id: 5, label: 'Bevestiging' },
]

export interface CheckoutFlowConfig {
  id: string
  label: string
  cartTemplate: 'template1' | 'template2' | 'template4'
  checkoutTemplate: 'checkouttemplate1' | 'checkouttemplate2' | 'template4'
  hasStepper: boolean
}

export const CHECKOUT_FLOWS: Record<string, CheckoutFlowConfig> = {
  premium: {
    id: 'premium',
    label: 'Premium — Visuele stepper, multi-step checkout',
    cartTemplate: 'template4',
    checkoutTemplate: 'template4',
    hasStepper: true,
  },
  efficient: {
    id: 'efficient',
    label: 'Efficiënt — Compact B2B, one-step checkout',
    cartTemplate: 'template2',
    checkoutTemplate: 'checkouttemplate2',
    hasStepper: false,
  },
  classic: {
    id: 'classic',
    label: 'Klassiek — Card layout, one-step checkout',
    cartTemplate: 'template1',
    checkoutTemplate: 'checkouttemplate2',
    hasStepper: false,
  },
}

/**
 * Map CheckoutTemplate4 internal steps (1-4) to stepper steps (2-5).
 *
 * Internal 1 (Contact) + 2 (Address) → Stepper 2 "Gegevens"
 * Internal 3 (Shipping)              → Stepper 3 "Verzending"
 * Internal 4 (Payment)               → Stepper 4 "Betaling"
 * Stepper 5 "Bevestiging"            → order confirmation page
 */
export function internalStepToStepperStep(internalStep: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 | 5 {
  if (internalStep <= 2) return 2 // Contact + Address = "Gegevens"
  if (internalStep === 3) return 3 // Shipping = "Verzending"
  return 4 // Payment = "Betaling"
}

/** Backward compat: resolve old cart+checkout settings to a flow id */
export function resolveFlowFromLegacy(
  cartTemplate?: string,
  checkoutTemplate?: string,
): string {
  if (cartTemplate === 'template4' && checkoutTemplate === 'template4') return 'premium'
  if (cartTemplate === 'template2') return 'efficient'
  return 'classic'
}
