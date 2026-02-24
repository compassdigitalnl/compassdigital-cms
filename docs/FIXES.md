Instructies voor Claude lokaal: Fix ALLE hidden callbacks                                                                                      
                                                                                                                                                 
  De admin panel crasht met 500 voor ingelogde gebruikers omdat hidden callback-functies geserialiseerd worden naar Client Components. ALLE      
  hidden functies moeten vervangen worden door build-time booleans.                                                                              

  Groep 1: isClientDeployment() pattern (2 bestanden)

  Pattern: hidden: ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user))
  Fix: hidden: !isClientDeployment()

  Bestanden:
  - src/branches/shared/collections/Pages/index.ts (regel ~49)
  - src/branches/shared/collections/Media.ts (regel ~20)

  Groep 2: Admin-only pattern (4 bestanden)

  Pattern: hidden: ({ user }) => !checkRole(['admin'], user)
  Fix: hidden: false (admin-only bescherming via access controls ipv nav-hiding)

  Bestanden:
  - src/branches/ecommerce/collections/RecentlyViewed.ts (regel ~15) — wijzig naar hidden: true (achtergrond-collectie, altijd verborgen)
  - src/branches/shared/collections/FormSubmissions.ts (regel ~11) — wijzig naar hidden: false
  - src/branches/shared/collections/Notifications.ts (regel ~16) — wijzig naar hidden: true (systeem-collectie, altijd verborgen)
  - src/branches/shared/collections/Users/index.ts (regel ~27) — wijzig naar hidden: false

  Groep 3: Platform-only pattern (3 bestanden)

  Pattern: hidden: ({ user }) => { if (isClientDeployment()) return true; return !checkRole(['admin'], user) }
  Fix: hidden: isClientDeployment() (verborgen op klant-sites, zichtbaar op platform)

  Bestanden:
  - src/branches/platform/collections/Clients.ts (regel ~30)
  - src/branches/platform/collections/ClientRequests.ts (regel ~24)
  - src/branches/platform/collections/Deployments.ts (regel ~21)

  Samenvatting van alle wijzigingen:

  ┌────────────────────┬───────────────────────────────────────────────────────────────────────────┬───────────────────────┐
  │      Bestand       │                                    Oud                                    │         Nieuw         │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Pages/index.ts     │ ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)) │ !isClientDeployment() │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Media.ts           │ ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)) │ !isClientDeployment() │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ RecentlyViewed.ts  │ ({ user }) => !checkRole(['admin'], user)                                 │ true                  │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ FormSubmissions.ts │ ({ user }) => !checkRole(['admin'], user)                                 │ false                 │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Notifications.ts   │ ({ user }) => !checkRole(['admin'], user)                                 │ true                  │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Users/index.ts     │ ({ user }) => !checkRole(['admin'], user)                                 │ false                 │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Clients.ts         │ ({ user }) => { if (isClientDeployment()) return true; ... }              │ isClientDeployment()  │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ ClientRequests.ts  │ ({ user }) => { if (isClientDeployment()) return true; ... }              │ isClientDeployment()  │
  ├────────────────────┼───────────────────────────────────────────────────────────────────────────┼───────────────────────┤
  │ Deployments.ts     │ ({ user }) => { if (isClientDeployment()) return true; ... }              │ isClientDeployment()  │
  └────────────────────┴───────────────────────────────────────────────────────────────────────────┴───────────────────────┘

  Belangrijk: De checkRole import kan verwijderd worden in bestanden waar die ALLEEN voor hidden werd gebruikt. Check of checkRole ook in access
  wordt gebruikt voordat je de import verwijdert.

  Na de wijzigingen: push naar main.