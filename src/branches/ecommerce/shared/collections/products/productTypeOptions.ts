import { features } from '@/lib/features'

// simple, grouped, variable are always available (base types)
// All other types require their respective feature flag
export const productTypeOptions = [
  { label: 'Simple Product (Enkel)', value: 'simple' },
  { label: 'Grouped Product (Multi-select)', value: 'grouped' },
  { label: 'Variable Product (Configureerbaar)', value: 'variable' },
  ...(features.bundleProducts ? [{ label: 'Bundle Product (Vast pakket)', value: 'bundle' }] : []),
  ...(features.mixAndMatch ? [{ label: 'Mix & Match (Bundel Builder)', value: 'mixAndMatch' }] : []),
  ...(features.bookableProducts ? [{ label: 'Bookable Product (Reservering)', value: 'bookable' }] : []),
  ...(features.configuratorProducts ? [{ label: 'Configurator Product (Stap-voor-stap)', value: 'configurator' }] : []),
  ...(features.personalizedProducts ? [{ label: 'Personalized Product (Op maat)', value: 'personalized' }] : []),
  ...(features.subscriptions ? [{ label: 'Subscription Product (Abonnement)', value: 'subscription' }] : []),
]
