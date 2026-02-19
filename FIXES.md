Volledige instructies voor Claude lokaal                                                                                                       
                                                                                                                                                 
  Er zijn 3 problemen die samen veroorzaken dat de sidebar incompleet is en elke collectie "Nothing Found" toont:                                
                                                                                                                                                 
  Probleem 1: Omgekeerde hidden logica in 8 collecties                                                                                           
                                                                                                                                                 
  De hidden functie bepaalt of een collectie verborgen is in de admin sidebar. De huidige code hidden: ({ user }) => checkRole(['admin'], user)
  verbergt collecties voor admins — precies het tegenovergestelde van wat nodig is. Op tenant-deployments (waar de eerste gebruiker 'admin' rol  
  heeft) zijn hierdoor ALLE content-collecties onzichtbaar.                                                                                      

  Fix: In tenant-deployments (CLIENT_ID is gezet) moeten collecties altijd zichtbaar zijn. Op het platform bewaar je het huidige gedrag.

  Bestanden en wijzigingen:

  1. src/collections/BlogPosts.ts

  - Voeg import toe (na bestaande imports): import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 van:
  hidden: ({ user }) => checkRole(['admin'], user),
  - naar:
  hidden: ({ user }) => isClientDeployment() ? false : checkRole(['admin'], user),

  2. src/collections/FAQs.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix als BlogPosts

  3. src/collections/Partners.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix als BlogPosts

  4. src/collections/Testimonials.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix als BlogPosts

  5. src/collections/Cases.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix als BlogPosts

  6. src/collections/ServicesCollection.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix als BlogPosts

  7. src/collections/Media.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Zoek hidden: ({ user }) => checkRole(['admin'], user), (rond regel 18)
  - Wijzig naar: hidden: ({ user }) => isClientDeployment() ? false : checkRole(['admin'], user),

  8. src/collections/Pages/index.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 49 van:
  hidden: ({ user }) => checkRole(['admin'], user),
  - naar:
  hidden: ({ user }) => isClientDeployment() ? false : checkRole(['admin'], user),

  ---
  Probleem 2: E-commerce collecties verborgen door clientType check

  De e-commerce collecties hebben hidden: ({ user }) => !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop'. Dit verbergt ze
  voor:
  - Admin users (rol 'admin', niet 'editor') → !checkRole(['editor'], admin) = true → HIDDEN
  - Editor users zonder clientType: 'webshop' → HIDDEN

  Op tenant-deployments moeten deze collecties gewoon zichtbaar zijn (de _col() filter in payload.config.ts zorgt er al voor dat niet-relevante
  collecties niet geladen worden).

  Bestanden en wijzigingen:

  9. src/collections/Products.ts

  - Voeg import toe (na bestaande imports): import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 15 van:
  hidden: ({ user }) => !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop',
  - naar:
  hidden: ({ user }) => isClientDeployment() ? false : (!checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop'),

  10. src/collections/shop/ProductCategories.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 13 — zelfde patroon als Products

  11. src/collections/Brands.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 15 — zelfde patroon als Products

  12. src/collections/shop/CustomerGroups.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 13 — zelfde patroon als Products

  Niet aanpassen: Orders.ts en OrderLists.ts — die hebben hidden: ({ user }) => !checkRole(['admin'], user) wat correct is (verbergt van
  niet-admins, toont aan admins).

  ---
  Probleem 3: Provisioning mist env vars en clientType

  Als er via het platform een nieuwe client wordt aangemaakt, ontbreken cruciale environment variables. Dit moet opgelost worden in 2 bestanden:

  13. src/lib/provisioning/provisionClient.ts

  De provisioningInput (regels 101-123) leest wel client.name, client.domain, etc. maar niet client.template, client.enabledFeatures, en
  client.disabledCollections. Deze moeten als env vars worden doorgegeven.

  Wijzig de customEnv sectie (regels 89-99). Na de bestaande code die customEnvironment merged, voeg toe:

  // ── Derive env vars from client template & features ──────────────────
  const template = (client as any).template || 'corporate'
  const enabledFeatures: string[] = (client as any).enabledFeatures || []
  const disabledCollections: string[] = (client as any).disabledCollections || []

  // E-commerce detection: template is b2b/ecommerce OR ecommerce feature enabled
  const isEcommerce = ['b2b', 'ecommerce'].includes(template) || enabledFeatures.includes('ecommerce')

  if (disabledCollections.length > 0) {
    const disabled = disabledCollections.join(',')
    customEnv.DISABLED_COLLECTIONS = disabled
    customEnv.NEXT_PUBLIC_DISABLED_COLLECTIONS = disabled
  }

  if (isEcommerce) {
    customEnv.ECOMMERCE_ENABLED = 'true'
    customEnv.NEXT_PUBLIC_ECOMMERCE_ENABLED = 'true'

    const shopModel = template === 'b2b' ? 'b2b' : 'b2c'
    customEnv.SHOP_MODEL = shopModel
    customEnv.NEXT_PUBLIC_SHOP_MODEL = shopModel

    if (template === 'b2b') {
      customEnv.PRICING_MODEL = 'tiered'
      customEnv.CUSTOMER_GROUPS_ENABLED = 'true'
    }
  }

  customEnv.TEMPLATE_ID = template

  Dit moet voor Object.assign(customEnv, extraEnv) zodat caller-overrides altijd winnen.

  14. src/lib/provisioning/ProvisioningService.ts

  De createClientAdminUser methode (regels 620-664) stuurt alleen { email, password, name } naar /api/users. Payload's first-user flow zet
  automatisch roles: ['admin'] via de ensureFirstUserIsAdmin hook, maar clientType wordt niet gezet.

  Wijzig de methode signature (regel 620) om een extra parameter te accepteren:

  private async createClientAdminUser(
    siteUrl: string,
    email: string,
    name: string,
    clientType?: 'website' | 'webshop',
  ): Promise<{ email: string; password: string }> {

  Wijzig de POST body (regel 636) van:
  body: JSON.stringify({ email, password, name }),
  naar:
  body: JSON.stringify({
    email,
    password,
    name,
    ...(clientType ? { clientType } : {}),
  }),

  Wijzig de aanroep in de provision methode (regels 212-216). Zoek:
  const adminResult = await this.createClientAdminUser(
    deploymentResult.url || `https://${fullDomain}`,
    input.contactEmail || `admin@${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`,
    input.clientName,
  )
  en voeg de clientType parameter toe. Hiervoor moet je de template-info uit de env vars halen (die staan al in environmentVariables vanuit stap
  3):
  // Determine clientType from environment variables built earlier
  const isWebshop = environmentVariables.ECOMMERCE_ENABLED === 'true'

  const adminResult = await this.createClientAdminUser(
    deploymentResult.url || `https://${fullDomain}`,
    input.contactEmail || `admin@${input.domain}.${process.env.PLATFORM_BASE_URL || 'compassdigital.nl'}`,
    input.clientName,
    isWebshop ? 'webshop' : 'website',
  )

  (De variabele environmentVariables is beschikbaar — die wordt aangemaakt op regel 122.)