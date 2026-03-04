/**
 * Account Template Configuration
 *
 * Maps admin setting "defaultMyAccountTemplate" to the template folder.
 * Same pattern as checkoutFlows.ts / product template selection.
 *
 * Folder structure:
 *   templates/account/AccountTemplate1/  → 'enterprise'
 *   templates/account/AccountTemplate2/  → (future variant)
 */

export interface AccountTemplateConfig {
  id: string
  label: string
  /** Folder name under templates/account/ */
  folder: 'AccountTemplate1'
}

export const ACCOUNT_TEMPLATES: Record<string, AccountTemplateConfig> = {
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise — Dashboard met statistieken, sidebar navigatie',
    folder: 'AccountTemplate1',
  },
}

/** Resolve legacy or current value to a template key */
export function resolveAccountTemplate(value?: string | null): string {
  if (value === 'myaccounttemplate1') return 'enterprise'
  if (value && ACCOUNT_TEMPLATES[value]) return value
  return 'enterprise'
}
