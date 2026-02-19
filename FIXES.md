Fix: "Invalid relationship" errors bij disabled collections                                                                                    
                                                                                                                                                 
  Probleem                                                                                                                                       

  DISABLED_COLLECTIONS=services,cases in de .env zorgt dat de services en cases collections niet in Payload worden geladen. Maar er zijn blocks
  die er nog naar verwijzen:

  - src/blocks/Services.ts regel 42: relationTo: 'services'
  - src/blocks/CasesBlock.ts regel 44: relationTo: 'cases'

  Deze blocks worden altijd geladen in src/collections/Pages/index.ts (regels 178, 189). Payload gooit een 500 error omdat de relationship target
   niet bestaat.

  Oplossing

  De blocks moeten conditioneel worden opgenomen in Pages, net als de collections zelf. Er zijn twee opties:

  Optie 1 (aanbevolen): Filter blocks in Pages/index.ts
  In src/collections/Pages/index.ts, gebruik dezelfde DISABLED_COLLECTIONS check:

  import { isClientDeployment } from '@/lib/isClientDeployment'

  // In de blocks array, maak Services en CasesBlock conditioneel:
  const disabledCollections = new Set(
    (process.env.DISABLED_COLLECTIONS || '').split(',').map(s => s.trim()).filter(Boolean)
  )

  // In de blocks array:
  blocks: [
    Hero,
    Content,
    // ...
    ...(disabledCollections.has('services') ? [] : [Services]),
    ...(disabledCollections.has('cases') ? [] : [CasesBlock]),
    // ...
  ].filter(Boolean)

  Optie 2: Maak de relationship in de blocks zelf conditioneel
  In src/blocks/Services.ts en src/blocks/CasesBlock.ts, vervang het relationship field conditioneel (vergelijkbaar met de Users fix).

  Tip

  Zoek ook naar andere mogelijke relationTo references naar disabled collections om toekomstige problemen te voorkomen:
  grep -rn "relationTo.*services\|relationTo.*cases" src/ --include="*.ts" | grep -v node_modules | grep -v payload-types