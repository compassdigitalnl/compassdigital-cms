Instructie voor Claude lokaal                                                                                                                  
                                          
  Dezelfde fix als bij de collecties, nu voor de 4 globals:                                                                                      
                                                                                                                                                 
  1. src/globals/Settings.ts                                                                                                                     
                                                                                                                                                 
  - Voeg import toe (na regel 2): import { isClientDeployment } from '@/lib/isClientDeployment'                                                  
  - Wijzig regel 10 van:
  hidden: ({ user }) => checkRole(['admin'], user),
  - naar:
  hidden: ({ user }) => isClientDeployment() ? false : checkRole(['admin'], user),

  2. src/globals/Theme.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 9 — zelfde fix

  3. src/globals/Header.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 10 — zelfde fix

  4. src/globals/Footer.ts

  - Voeg import toe: import { isClientDeployment } from '@/lib/isClientDeployment'
  - Wijzig regel 9 — zelfde fix

  ---
  Dit verklaart ook waarom het toevoegen van een Hero block faalt — als de pagina "create" view server-side problemen heeft met het renderen van
  verborgen globals (die bijv. in de SEO panel of admin UI worden opgehaald), kan dat leiden tot een client-side crash.