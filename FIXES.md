Fix: 500 error - "Field Gekoppelde klant has invalid relationship 'clients'"

  Probleem

  In src/collections/Users/index.ts (regel 231-245) staat het veld client met relationTo: 'clients'. Op tenant deployments (waar _isPlatform =
  false) wordt de Clients collection niet geladen in payload.config.ts (regel 201), maar het Users veld verwijst er nog steeds naar. Dit
  veroorzaakt een 500 error.

  Oplossing

  In src/collections/Users/index.ts: maak het client veld conditioneel, zodat het alleen wordt opgenomen als het niet een client deployment is.

  Optie 1 — Conditioneel in Users/index.ts:
  import { isClientDeployment } from '@/lib/isClientDeployment'

  // In de fields array, vervang het client veld met:
  ...(!isClientDeployment() ? [{
    name: 'client',
    type: 'relationship' as const,
    relationTo: 'clients',
    label: 'Gekoppelde klant',
    // ... rest van het veld
  }] : []),