Fix: Tenant dashboard toont platform admin UI                                                                                                  
                                                                                                                                                 
  Probleem                                                                                                                                       

  Wanneer CLIENT_ID / NEXT_PUBLIC_CLIENT_ID gezet is (tenant deployment), toont het admin dashboard nog steeds de platform UI: "CompassDigital   
  Platform" header, "Actieve klanten" stats, Platform Management menu, en de ClientSwitcher ("ACTIEVE KLANT" dropdown). Geen van de admin        
  componenten checkt of het een client deployment is.
                                                                                                                                                 
  Betrokken bestanden (5 wijzigingen)                                                                                                            
                                                                                                                                                 
  1. src/components/BeforeDashboard/index.tsx                                                                                                    
  - De component checkt alleen user.roles.includes('admin') en toont dan altijd <AdminDashboard> (platform UI)
  - Fix: Check process.env.NEXT_PUBLIC_CLIENT_ID — als die gezet is, toon <EditorDashboard> (tenant UI) ook voor admin users, of maak een nieuw
  <TenantAdminDashboard> component dat:
    - "CompassDigital Platform" header vervangt door bijv. "Mijn Dashboard" of de client naam
    - Platform stats verwijdert (Actieve klanten, Deployments)
    - Platform management links verwijdert (Klanten, Deployments, Site Generator)
    - Focust op content & e-commerce (Pagina's, Producten, Bestellingen, Media, Blog)

  2. src/components/platform/ClientSwitcher/index.tsx
  - Toont de "ACTIEVE KLANT" dropdown voor alle admin users
  - Fix: Voeg check toe: als process.env.NEXT_PUBLIC_CLIENT_ID gezet is, return null (niet renderen)

  3. Platform collections verbergen in sidebar
  De hidden functie in deze 3 bestanden checkt alleen user role, niet deployment mode:
  - src/platform/collections/Clients.ts
  - src/platform/collections/Deployments.ts
  - src/platform/collections/ClientRequests.ts
  - Fix: In de hidden functie van elk: als process.env.CLIENT_ID gezet is, return true (altijd verbergen)

  Optioneel: Utility functie

  Maak src/lib/isClientDeployment.ts:
  export const isClientDeployment = (): boolean =>
    !!(process.env.CLIENT_ID || process.env.NEXT_PUBLIC_CLIENT_ID)
  Gebruik deze in alle bovenstaande componenten voor consistentie.

  Verwacht resultaat na fix

  Op plastimed01.compassdigital.nl/admin:
  - Geen "COMPASSDIGITAL PLATFORM" header
  - Geen "ACTIEVE KLANT" dropdown
  - Geen Platform Management / Platform Beheer in sidebar
  - Wel: Pagina's, Blog, Media, Theme, Products, Orders, Formulieren, Instellingen
  - Dashboard gefocust op content & e-commerce quick actions