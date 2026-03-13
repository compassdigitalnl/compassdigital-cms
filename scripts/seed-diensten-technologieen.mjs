/**
 * Seed script for Diensten Hub & Technologie Hub content
 *
 * Seeds:
 * 1. Professional services (diensten) with branch, features, processSteps, usps, faq
 * 2. Updates relatedServices on existing projects
 *
 * Usage: DATABASE_URL=<db_url> node scripts/seed-diensten-technologieen.mjs
 */

import pg from 'pg'
const { Client } = pg

const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/client_sityzr01'

// ─── Diensten Data ──────────────────────────────────────────────

const diensten = [
  {
    title: 'Webshop Development',
    slug: 'webshop-development',
    icon: '🛒',
    color: 'teal',
    branch: 'e-commerce',
    shortDescription: 'Complete webshop ontwikkeling met headless architectuur. Van productcatalogus tot checkout, afgestemd op uw branche.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Wij bouwen webshops die écht converteren. Met een headless architectuur combineren we de snelheid van een moderne frontend met de flexibiliteit van een krachtig CMS en e-commerce backend.'),
          p('Onze webshops zijn standaard uitgerust met razendsnelle zoekfunctionaliteit, slimme filters, productvergelijking en een gestroomlijnd checkout-proces. We integreren met alle gangbare betaalproviders en verzendpartijen.'),
          p('Of het nu gaat om B2C, B2B of een marketplace: we hebben de ervaring en de tooling om een webshop te bouwen die past bij uw bedrijf en meegroeit met uw ambities.'),
        ],
      },
    }),
    features: [
      'Headless e-commerce architectuur',
      'Razendsnelle zoek- en filterfunctie',
      'Productvergelijking',
      'Wensenlijst & alerts',
      'Multi-betaalmethoden (iDEAL, creditcard, etc.)',
      'Responsive design (mobile-first)',
      'SEO-geoptimaliseerd',
      'Koppeling met voorraadsystemen',
    ],
    processSteps: [
      { title: 'Discovery & Strategie', description: 'We analyseren uw markt, doelgroep en concurrentie. Samen bepalen we de functionele eisen en de juiste technische architectuur.', icon: 'Search' },
      { title: 'UX Design & Prototype', description: 'Wireframes en interactieve prototypes valideren we met uw team. De gebruikerservaring staat centraal.', icon: 'Palette' },
      { title: 'Iteratieve Development', description: 'In sprints van 2 weken bouwen we de webshop op. Elke sprint levert werkende functionaliteit met een demo.', icon: 'Code2' },
      { title: 'Integraties & Testing', description: 'Koppelingen met betaalproviders, verzendpartijen en ERP-systemen. Uitgebreide QA en performance-tests.', icon: 'Layers' },
      { title: 'Lancering & Optimalisatie', description: 'Go-live met monitoring, gevolgd door conversie-optimalisatie op basis van data.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Razendsnel', description: 'Sub-seconde laadtijden dankzij Next.js en edge caching. Lighthouse scores van 95+.', icon: 'Zap' },
      { title: 'Schaalbaar', description: 'Van 100 tot 100.000 producten zonder performance-verlies. Groei zonder zorgen.', icon: 'TrendingUp' },
      { title: 'Zelf beheerbaar', description: 'Intuïtief CMS dashboard waarmee u zelf producten, prijzen en acties beheert.', icon: 'Settings' },
      { title: 'Toekomstbestendig', description: 'Headless architectuur die eenvoudig uitbreidbaar is met nieuwe kanalen en features.', icon: 'Shield' },
    ],
    faq: [
      { question: 'Hoelang duurt het bouwen van een webshop?', answer: 'Een standaard webshop is in 6-10 weken live. Complexere projecten met maatwerk-integraties kunnen 12-16 weken duren. We werken altijd met een gefaseerde aanpak zodat u snel resultaat ziet.' },
      { question: 'Welke betaalmethoden worden ondersteund?', answer: 'We integreren standaard met Mollie, waardoor u alle gangbare betaalmethoden kunt aanbieden: iDEAL, creditcard, PayPal, Bancontact, Klarna, Apple Pay en meer.' },
      { question: 'Kan ik mijn bestaande producten importeren?', answer: 'Ja, we hebben ervaring met migraties vanuit WooCommerce, Magento, Shopify en andere platformen. Productdata, klantgegevens en bestelhistorie worden zorgvuldig overgezet.' },
      { question: 'Is de webshop geschikt voor B2B?', answer: 'Absoluut. We bieden B2B-functionaliteit zoals klantgroepen, staffelprijzen, offerteaanvragen, bedrijfsaccounts met meerdere gebruikers en goedkeuringsworkflows.' },
    ],
    relatedProjectSlugs: ['techstore24-webshop', 'biobites-maaltijdboxen'],
  },
  {
    title: 'Boekingsplatform',
    slug: 'boekingsplatform',
    icon: '📅',
    color: 'blue',
    branch: 'ervaringen',
    shortDescription: 'Online boekings- en reserveringssystemen voor ervaringen, treatments en evenementen. Real-time beschikbaarheid en directe bevestiging.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Van wijnproeverijen tot schoonheidsbehandelingen: wij bouwen boekingsplatformen die uw klanten 24/7 laten reserveren met real-time beschikbaarheid.'),
          p('Onze boekingssystemen zijn volledig op maat, geïntegreerd met uw agenda en betalingssysteem, en voorzien van automatische bevestigingen en herinneringen om no-shows te minimaliseren.'),
          p('Het resultaat: meer boekingen, minder administratie en een professionele klantervaring.'),
        ],
      },
    }),
    features: [
      '24/7 online boeken',
      'Real-time beschikbaarheid',
      'Automatische bevestigingen & herinneringen',
      'Groepsboekingen',
      'Cadeaubonnen',
      'Review & rating systeem',
      'Multi-locatie ondersteuning',
      'Agenda-integratie (Google Calendar, Outlook)',
    ],
    processSteps: [
      { title: 'Workflow Analyse', description: 'We brengen uw huidige boekingsproces in kaart en identificeren verbeterpunten.', icon: 'Search' },
      { title: 'Platform Design', description: 'UX-design gericht op een naadloze boekingservaring voor uw doelgroep.', icon: 'Palette' },
      { title: 'Development & Integratie', description: 'Bouw van het platform met koppelingen naar agenda, betaling en communicatie.', icon: 'Code2' },
      { title: 'Training & Lancering', description: 'Training voor uw team en een begeleide lancering met support.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Minder no-shows', description: 'Automatische SMS en e-mail herinneringen reduceren no-shows met tot 60%.', icon: 'Bell' },
      { title: 'Meer omzet', description: 'Klanten boeken vaker en gemakkelijker, met hogere gemiddelde orderwaarde door upselling.', icon: 'TrendingUp' },
      { title: 'Tijdsbesparing', description: 'Geen telefoonverkeer meer voor boekingen. Uw team kan zich focussen op service.', icon: 'Clock' },
    ],
    faq: [
      { question: 'Kan het systeem overweg met meerdere locaties?', answer: 'Ja, het platform ondersteunt meerdere locaties met elk hun eigen agenda, medewerkers en beschikbaarheid. Alles beheerbaar vanuit één centraal dashboard.' },
      { question: 'Hoe worden betalingen afgehandeld?', answer: 'We integreren met Mollie voor directe online betalingen. U kunt kiezen tussen vooruitbetaling, aanbetaling of betaling ter plekke.' },
      { question: 'Is er een mobiele app nodig?', answer: 'Nee, het platform is volledig responsive en werkt perfect op mobiel. Een native app is optioneel maar in veel gevallen niet nodig dankzij PWA-technologie.' },
    ],
    relatedProjectSlugs: ['wijnroute-belevenisplatform', 'glow-studio-boekingsplatform'],
  },
  {
    title: 'Website & CMS',
    slug: 'website-cms',
    icon: '🌐',
    color: 'purple',
    branch: 'dienstverlening',
    shortDescription: 'Professionele websites met een krachtig CMS. Van corporate sites tot content platforms, gebouwd voor performance en vindbaarheid.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Een website is meer dan een digitaal visitekaartje. Het is uw belangrijkste verkoopkanaal, uw expertiseplatform en de basis van uw online aanwezigheid.'),
          p('Wij bouwen websites met Payload CMS en Next.js: een combinatie die zorgt voor razendsnelle laadtijden, uitstekende SEO en een intuïtief beheersysteem waarmee u zelf content kunt publiceren.'),
          p('Van eenvoudige bedrijfswebsites tot uitgebreide content platforms met blog, kennisbank en klantenportaal.'),
        ],
      },
    }),
    features: [
      'Payload CMS — intuïtief contentbeheer',
      'Next.js — server-side rendering voor SEO',
      'Responsive design (mobile-first)',
      'Blog & kennisbank',
      'Contactformulieren met validatie',
      'SEO-optimalisatie (schema, sitemap, meta)',
      'Analytics integratie',
      'Meertalig (optioneel)',
    ],
    processSteps: [
      { title: 'Briefing & Strategie', description: 'Doelen, doelgroep en positionering bepalen. Concurrentieanalyse en contentstrategie.', icon: 'Search' },
      { title: 'Design', description: 'Visueel ontwerp op basis van uw huisstijl. Wireframes → mockups → interactief prototype.', icon: 'Palette' },
      { title: 'Development', description: 'Component-based development met headless CMS. Content migratie en SEO-setup.', icon: 'Code2' },
      { title: 'Content & Lancering', description: 'Contentcreatie, definitieve QA en go-live met redirects en monitoring.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'SEO-first', description: 'Technisch perfect geoptimaliseerd voor zoekmachines. Schema markup, Core Web Vitals en sitemap.', icon: 'Search' },
      { title: 'Zelf beheren', description: 'Met Payload CMS beheert u zelf pagina\'s, blog en media zonder technische kennis.', icon: 'Settings' },
      { title: 'Razendsnel', description: 'Server-side rendering en edge caching voor sub-seconde laadtijden wereldwijd.', icon: 'Zap' },
      { title: 'Schaalbaar', description: 'Modulaire architectuur die meegroeit. Voeg later eenvoudig shop, portaal of blog toe.', icon: 'Layers' },
    ],
    faq: [
      { question: 'Waarom Payload CMS en niet WordPress?', answer: 'Payload CMS is een moderne headless CMS die veel sneller, veiliger en flexibeler is dan WordPress. U kunt exact die velden en structuur definiëren die bij uw content past, zonder overbodige plugins.' },
      { question: 'Kan ik later een webshop toevoegen?', answer: 'Ja, dankzij de modulaire architectuur kan een e-commerce module later worden toegevoegd zonder de bestaande site te herbouwen.' },
      { question: 'Hoe zit het met hosting en onderhoud?', answer: 'Wij regelen hosting op een betrouwbaar platform met automatische backups, SSL en monitoring. Optioneel bieden we een onderhoudscontract met updates en support.' },
    ],
    relatedProjectSlugs: ['juristonline-adviesplatform', 'zorgconnect-patientenportaal'],
  },
  {
    title: 'Bouwproject Presentatie',
    slug: 'bouwproject-presentatie',
    icon: '🏗️',
    color: 'amber',
    branch: 'construction',
    shortDescription: 'Digitale presentatie van bouwprojecten. Interactieve plattegronden, voor/na visualisaties en leadgeneratie voor aannemers.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Bouwprojecten verdienen een professionele digitale presentatie. Wij maken websites die uw vakmanschap tonen en gekwalificeerde leads genereren.'),
          p('Met interactieve plattegronden, voor/na sliders, projecttijdlijnen en geïntegreerde offerteformulieren maken we uw bouwprojecten tastbaar voor potentiële opdrachtgevers.'),
          p('Ideaal voor nieuwbouw, renovatie, verbouwing en utiliteitsbouw projecten.'),
        ],
      },
    }),
    features: [
      'Interactieve plattegronden',
      'Voor/na visualisaties met slider',
      'Projecttijdlijn met foto-updates',
      'Online offerteaanvraag',
      'Specificaties & materialen overzicht',
      'Galerij met lightbox',
      'Lokale SEO-optimalisatie',
      'Google Maps integratie',
    ],
    processSteps: [
      { title: 'Projectinventarisatie', description: 'Alle projectgegevens, foto\'s, plattegronden en specificaties verzamelen.', icon: 'ClipboardList' },
      { title: 'Visueel ontwerp', description: 'Design dat de kwaliteit van uw werk weerspiegelt. Focus op beelden en resultaten.', icon: 'Palette' },
      { title: 'Development', description: 'Interactieve elementen, formulieren en galerijen bouwen.', icon: 'Code2' },
      { title: 'SEO & Lancering', description: 'Lokale SEO-setup, Google Business koppeling en lancering.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Meer leads', description: 'Geoptimaliseerde landingspagina\'s met duidelijke call-to-actions genereren gekwalificeerde leads.', icon: 'Users' },
      { title: 'Professioneel portfolio', description: 'Toon uw vakmanschap met een digitaal portfolio dat indruk maakt.', icon: 'Award' },
      { title: 'Lokale vindbaarheid', description: 'SEO-optimalisatie gericht op uw regio, zodat lokale opdrachtgevers u vinden.', icon: 'MapPin' },
    ],
    faq: [
      { question: 'Kan ik zelf nieuwe projecten toevoegen?', answer: 'Ja, via het CMS kunt u eenvoudig nieuwe bouwprojecten aanmaken met foto\'s, specificaties en beschrijvingen. Geen technische kennis vereist.' },
      { question: 'Hoe werkt de voor/na slider?', answer: 'Bezoekers kunnen een slider over het beeld bewegen om de situatie voor en na de bouw te vergelijken. Dit werkt op desktop en mobiel en maakt direct impact.' },
      { question: 'Kan de site gekoppeld worden aan social media?', answer: 'Ja, we integreren met Instagram voor automatische portfolio-updates en met Facebook/LinkedIn voor social sharing van projecten.' },
    ],
    relatedProjectSlugs: ['villa-duinzicht-nieuwbouw', 'kantoorpand-centrum-renovatie'],
  },
  {
    title: 'Beauty & Wellness Platform',
    slug: 'beauty-wellness-platform',
    icon: '💆',
    color: 'coral',
    branch: 'beauty',
    shortDescription: 'Online boekings- en loyaliteitsplatform voor salons, spa\'s en wellness centra. Stijlvol design met praktische functionaliteit.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Beauty en wellness draait om beleving — en die begint online. Wij bouwen platforms die de sfeer van uw salon vertalen naar een digitale ervaring.'),
          p('Van online boeken en stylist-matching tot loyaliteitsprogramma\'s en klantprofielen met behandelingshistorie. Alles ontworpen voor de beauty-branche.'),
          p('Uw klanten boeken 24/7, ontvangen automatische herinneringen en bouwen een relatie op met uw salon — ook buiten openingstijden.'),
        ],
      },
    }),
    features: [
      'Online boeken met stylist-voorkeur',
      'Loyaliteitsprogramma met punten',
      'Klantprofiel met behandelingshistorie',
      'Automatische SMS & e-mail herinneringen',
      'Multi-locatie agenda-beheer',
      'Product aanbevelingen na behandeling',
      'Cadeaubonnen',
      'Fotogalerij van resultaten',
    ],
    processSteps: [
      { title: 'Salon bezoek', description: 'Een dag meedraaien in uw salon om de werkprocessen en klantbeleving te begrijpen.', icon: 'Search' },
      { title: 'Design op maat', description: 'Luxe design dat past bij uw merkidentiteit en de sfeer van uw salon.', icon: 'Palette' },
      { title: 'Platform bouw', description: 'Boekingssysteem, agenda-integratie, klantportaal en loyaliteitsprogramma.', icon: 'Code2' },
      { title: 'Training & Go-live', description: 'Persoonlijke training voor uw team en begeleide lancering.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Merkbeleving online', description: 'Design dat de luxe en sfeer van uw salon weerspiegelt — van kleuren tot typografie.', icon: 'Sparkles' },
      { title: 'Klantretentie', description: 'Loyaliteitsprogramma en persoonlijke aanbevelingen zorgen voor terugkerende klanten.', icon: 'Heart' },
      { title: 'Efficiëntie', description: 'Minder telefoonverkeer, minder no-shows en meer inzicht in klantvoorkeuren.', icon: 'TrendingUp' },
    ],
    faq: [
      { question: 'Werkt het met mijn huidige agenda-systeem?', answer: 'We integreren met Google Calendar, Outlook en de meeste salon-specifieke systemen. Mocht uw systeem er niet bij staan, bouwen we een custom koppeling.' },
      { question: 'Hoe werkt het loyaliteitsprogramma?', answer: 'Klanten verdienen automatisch punten bij elke behandeling. Punten kunnen worden ingewisseld voor kortingen, gratis behandelingen of producten. U bepaalt zelf de regels.' },
      { question: 'Kunnen klanten reviews achterlaten?', answer: 'Ja, na een behandeling ontvangen klanten automatisch een uitnodiging om een review te schrijven. Reviews worden getoond op uw website en helpen bij Google-vindbaarheid.' },
    ],
    relatedProjectSlugs: ['glow-studio-boekingsplatform'],
  },
  {
    title: 'Horeca Digitalisering',
    slug: 'horeca-digitalisering',
    icon: '🍽️',
    color: 'green',
    branch: 'horeca',
    shortDescription: 'Digitale menu\'s, reserveringssystemen en QR-bestelsystemen voor restaurants, cafés en hotels. Bespaar kosten, verhoog omzet.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('De horeca digitaliseert in hoog tempo. Wij helpen restaurants, cafés en hotels met slimme digitale oplossingen die de gastervaring verbeteren en operationele kosten verlagen.'),
          p('Van dynamische digitale menu\'s en QR-code bestelsystemen tot eigen reserveringsplatformen zonder commissiekosten. Alles beheerbaar via een intuïtief CMS.'),
          p('Het resultaat: hogere omzet per tafel, minder fouten in bestellingen en een modern imago.'),
        ],
      },
    }),
    features: [
      'Dynamisch digitaal menu',
      'QR-code bestelsysteem',
      'Online reserveringen (0% commissie)',
      'Allergenen & dieetfilters',
      'Seizoens- en dagmenu beheer',
      'Tafelmanagement',
      'Takeaway & delivery module',
      'Food fotografie integratie',
    ],
    processSteps: [
      { title: 'Menu & Workflow Analyse', description: 'Alle gerechten, allergenen en werkprocessen in kaart brengen.', icon: 'ClipboardList' },
      { title: 'Design & Fotografie', description: 'Professionele food-fotografie en merkgericht webdesign.', icon: 'Camera' },
      { title: 'Platform Bouw', description: 'Menu-beheer, reserveringssysteem, QR-bestelling en keuken-integratie.', icon: 'Code2' },
      { title: 'Training & Lancering', description: 'QR-codes op tafel, teamtraining en live monitoring van de eerste dagen.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Nul commissie', description: 'Eigen reserveringssysteem zonder maandelijkse kosten of commissie per boeking.', icon: 'DollarSign' },
      { title: 'Hogere omzet', description: 'Visuele menu\'s en suggesties verhogen de gemiddelde besteding per tafel.', icon: 'TrendingUp' },
      { title: 'Minder fouten', description: 'Digitale bestellingen gaan direct naar de keuken — geen miscommunicatie meer.', icon: 'CheckCircle' },
    ],
    faq: [
      { question: 'Moet ik investeren in tablets of hardware?', answer: 'Nee, het systeem werkt via de smartphones van uw gasten. Ze scannen een QR-code en bestellen via hun eigen telefoon. U heeft alleen een printer nodig voor de keuken.' },
      { question: 'Kan ik het menu dagelijks aanpassen?', answer: 'Ja, via het CMS past u in seconden gerechten aan, markeert u items als uitverkocht of voegt u dagspecials toe. Wijzigingen zijn direct zichtbaar.' },
      { question: 'Hoe bespaar ik op commissiekosten?', answer: 'Met een eigen reserveringssysteem betaalt u geen commissie per boeking aan platforms zoals TheFork. Bij gemiddeld 200 reserveringen per maand bespaart u al snel €400-800 per maand.' },
    ],
    relatedProjectSlugs: ['de-waterkant-digitaal-menu'],
  },
  {
    title: 'Zorg & Patiëntenportaal',
    slug: 'zorg-patientenportaal',
    icon: '🏥',
    color: 'blue',
    branch: 'zorg',
    shortDescription: 'Veilige patiëntenportalen en zorgplatformen. AVG-compliant, NEN 7510 gecertificeerd, met DigiD-authenticatie.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Zorgorganisaties staan voor unieke digitale uitdagingen: hoge privacy-eisen, diverse gebruikersgroepen en complexe workflows. Wij bouwen portalen die hieraan voldoen.'),
          p('Van patiëntenportalen met DigiD-authenticatie tot interne systemen voor zorgverleners. Altijd AVG-compliant en gebouwd volgens NEN 7510 richtlijnen.'),
          p('Het doel: betere toegankelijkheid van zorg, minder administratieve belasting en hogere patiënttevredenheid.'),
        ],
      },
    }),
    features: [
      'DigiD-authenticatie (SAML)',
      'Online afspraken plannen',
      'Herhaalrecepten aanvragen',
      'Beveiligd berichtenverkeer',
      'Medisch dossier inzage',
      'Vaccinatieregistratie',
      'End-to-end encryptie',
      'NEN 7510 compliant',
    ],
    processSteps: [
      { title: 'Privacy & Security Audit', description: 'Uitgebreide analyse van privacy-vereisten, NEN 7510 en AVG-compliance.', icon: 'Shield' },
      { title: 'UX Research', description: 'Gebruikersonderzoek met patiënten en zorgverleners van alle leeftijdsgroepen.', icon: 'Users' },
      { title: 'Secure Development', description: 'Development met focus op beveiliging, encryptie en audit-logging.', icon: 'Lock' },
      { title: 'Pilot & Uitrol', description: 'Pilot bij één locatie, evaluatie en gefaseerde uitrol naar alle locaties.', icon: 'Rocket' },
    ],
    usps: [
      { title: 'Veiligheid voorop', description: 'End-to-end encryptie, DigiD en NEN 7510 — uw patiëntdata is maximaal beschermd.', icon: 'Shield' },
      { title: 'Toegankelijkheid', description: 'WCAG 2.1 AA compliant, zodat alle patiënten het portaal kunnen gebruiken.', icon: 'Accessibility' },
      { title: 'Ontlasting personeel', description: 'Minder telefoonverkeer voor afspraken en recepten — meer tijd voor zorg.', icon: 'Heart' },
    ],
    faq: [
      { question: 'Is het portaal AVG-compliant?', answer: 'Ja, het portaal is volledig AVG-compliant en voldoet aan NEN 7510 voor informatiebeveiliging in de zorg. We werken met een gecertificeerd datacenter en voeren regelmatig security audits uit.' },
      { question: 'Hoe werkt de DigiD-koppeling?', answer: 'Patiënten loggen in via DigiD (niveau substantieel of hoog). De koppeling is gerealiseerd via SAML met een gecertificeerde identity provider.' },
      { question: 'Kan het portaal gekoppeld worden aan ons HIS?', answer: 'Ja, we integreren met de meeste huisartsinformatiesystemen (HIS) zoals Medicom, Promedico en CGM. De koppeling verloopt via HL7 FHIR of directe API.' },
    ],
    relatedProjectSlugs: ['zorgconnect-patientenportaal'],
  },
  {
    title: 'Platform & SaaS Development',
    slug: 'platform-saas-development',
    icon: '🚀',
    color: 'purple',
    branch: 'dienstverlening',
    shortDescription: 'Custom platforms en SaaS-oplossingen. Van marketplace tot community platform, gebouwd voor groei.',
    longDescription: JSON.stringify({
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: [
          p('Heeft u een idee voor een platform of SaaS-product? Wij vertalen uw visie naar een werkend product. Van validatie tot schaalbare lancering.'),
          p('We bouwen platforms met bewezen technologie: Next.js, Payload CMS en PostgreSQL. Een stack die snel is, veilig en eenvoudig te onderhouden.'),
          p('Of het nu gaat om een marketplace, community platform, kennisbank of specialistische applicatie — we hebben de expertise om uw platform te realiseren.'),
        ],
      },
    }),
    features: [
      'Multi-tenant architectuur',
      'Gebruikersbeheer met rollen & rechten',
      'API-first ontwerp',
      'Real-time functionaliteit',
      'Betaalintegraties',
      'Analytics & dashboards',
      'White-label mogelijkheden',
      'CI/CD en automatische deployments',
    ],
    processSteps: [
      { title: 'Idee Validatie', description: 'Samen valideren we uw concept met marktonderzoek en een lean canvas.', icon: 'Lightbulb' },
      { title: 'MVP Design', description: 'Minimaal viable product design: alleen de kernfunctionaliteiten voor validatie.', icon: 'Palette' },
      { title: 'MVP Development', description: 'In 6-8 weken een werkend MVP dat u kunt testen met echte gebruikers.', icon: 'Code2' },
      { title: 'Iteratie & Groei', description: 'Op basis van gebruikersfeedback itereren en opschalen.', icon: 'TrendingUp' },
    ],
    usps: [
      { title: 'Snel naar markt', description: 'MVP in 6-8 weken zodat u snel kunt valideren en itereren.', icon: 'Zap' },
      { title: 'Schaalbare architectuur', description: 'Gebouwd om mee te groeien van 10 naar 10.000 gebruikers.', icon: 'Server' },
      { title: 'Eigenaarschap', description: 'De code is van u. Geen vendor lock-in, geen maandelijkse licentiekosten.', icon: 'Key' },
    ],
    faq: [
      { question: 'Wat kost het bouwen van een platform?', answer: 'Een MVP start vanaf €15.000-25.000 afhankelijk van de complexiteit. We werken graag met een gefaseerde aanpak zodat u de investering kunt spreiden en risico\'s beperkt.' },
      { question: 'Kan ik later zelf doorontwikkelen?', answer: 'Ja, we gebruiken standaard technologieën (Next.js, TypeScript, PostgreSQL) en schrijven schone, gedocumenteerde code. Uw eigen team of een andere partij kan hier naadloos op voortbouwen.' },
      { question: 'Hoe zit het met hosting?', answer: 'We adviseren en regelen hosting op basis van uw eisen. Van gedeelde hosting tot dedicated cloud-omgevingen met auto-scaling. Altijd met monitoring en backups.' },
    ],
    relatedProjectSlugs: ['juristonline-adviesplatform', 'wijnroute-belevenisplatform'],
  },
]

// ─── Helpers ────────────────────────────────────────────────────

import crypto from 'crypto'

function p(text) {
  return {
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
    children: [{ type: 'text', format: 0, text, version: 1, style: '', mode: 'normal', detail: 0 }],
  }
}

function uid() {
  return crypto.randomBytes(12).toString('hex')
}

// ─── Main ───────────────────────────────────────────────────────

async function seed() {
  const client = new Client(DATABASE_URL)
  await client.connect()
  console.log('Connected to database')

  // Check if professional_services table exists
  const { rows: tableCheck } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='professional_services'"
  )
  if (tableCheck.length === 0) {
    console.error('❌ professional_services table does not exist. Run build first to create tables.')
    await client.end()
    process.exit(1)
  }

  // Get column info
  const { rows: columns } = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='professional_services'"
  )
  const columnNames = columns.map(c => c.column_name)
  console.log('Columns:', columnNames.join(', '))
  const hasBranch = columnNames.includes('branch')

  // Get all project IDs by slug
  const { rows: allProjects } = await client.query('SELECT id, slug FROM projects')
  const projectMap = Object.fromEntries(allProjects.map(p => [p.slug, p.id]))
  console.log(`Found ${allProjects.length} projects`)

  // Check for related sub-tables
  const { rows: subTables } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'professional_services_%' ORDER BY table_name"
  )
  console.log('Sub-tables:', subTables.map(t => t.table_name).join(', '))

  for (const dienst of diensten) {
    console.log(`\n--- Seeding: ${dienst.title} (${dienst.slug}) ---`)

    // Check if already exists
    const { rows: existing } = await client.query('SELECT id FROM professional_services WHERE slug = $1', [dienst.slug])
    let serviceId

    if (existing.length > 0) {
      serviceId = existing[0].id
      console.log(`  Already exists (id: ${serviceId}), updating...`)

      // Update
      const updates = ['title = $1', 'short_description = $2', 'long_description = $3', 'icon = $4', 'color = $5', 'status = $6']
      const values = [dienst.title, dienst.shortDescription, dienst.longDescription, dienst.icon, dienst.color, 'published']
      let idx = 7
      if (hasBranch) {
        updates.push(`branch = $${idx++}`)
        values.push(dienst.branch)
      }
      values.push(serviceId)
      await client.query(`UPDATE professional_services SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`, values)
    } else {
      // Insert
      const cols = ['title', 'slug', 'short_description', 'long_description', 'icon', 'color', 'status', 'created_at', 'updated_at']
      const vals = [dienst.title, dienst.slug, dienst.shortDescription, dienst.longDescription, dienst.icon, dienst.color, 'published', 'NOW()', 'NOW()']

      if (hasBranch) {
        cols.push('branch')
        vals.push(dienst.branch)
      }

      const placeholders = vals.map((v, i) => v === 'NOW()' ? 'NOW()' : `$${i + 1}`)
      const actualVals = vals.filter(v => v !== 'NOW()')

      // Build proper query
      let paramIdx = 1
      const paramPlaceholders = cols.map((col, i) => {
        if (vals[i] === 'NOW()') return 'NOW()'
        return `$${paramIdx++}`
      })
      const insertVals = vals.filter(v => v !== 'NOW()')

      const { rows } = await client.query(
        `INSERT INTO professional_services (${cols.join(', ')}) VALUES (${paramPlaceholders.join(', ')}) RETURNING id`,
        insertVals
      )
      serviceId = rows[0].id
      console.log(`  Created (id: ${serviceId})`)
    }

    // Insert features
    if (dienst.features?.length) {
      try {
        await client.query('DELETE FROM professional_services_features WHERE _parent_id = $1', [serviceId])
        for (let i = 0; i < dienst.features.length; i++) {
          await client.query(
            'INSERT INTO professional_services_features (_order, _parent_id, id, feature) VALUES ($1, $2, $3, $4)',
            [i + 1, serviceId, uid(), dienst.features[i]]
          )
        }
        console.log(`  Inserted ${dienst.features.length} features`)
      } catch (err) {
        console.log(`  Skipping features: ${err.message}`)
      }
    }

    // Insert process steps
    if (dienst.processSteps?.length) {
      try {
        await client.query('DELETE FROM professional_services_process_steps WHERE _parent_id = $1', [serviceId])
        for (let i = 0; i < dienst.processSteps.length; i++) {
          const s = dienst.processSteps[i]
          await client.query(
            'INSERT INTO professional_services_process_steps (_order, _parent_id, id, title, description, icon) VALUES ($1, $2, $3, $4, $5, $6)',
            [i + 1, serviceId, uid(), s.title, s.description, s.icon || null]
          )
        }
        console.log(`  Inserted ${dienst.processSteps.length} process steps`)
      } catch (err) {
        console.log(`  Skipping processSteps: ${err.message}`)
      }
    }

    // Insert USPs
    if (dienst.usps?.length) {
      try {
        await client.query('DELETE FROM professional_services_usps WHERE _parent_id = $1', [serviceId])
        for (let i = 0; i < dienst.usps.length; i++) {
          const u = dienst.usps[i]
          await client.query(
            'INSERT INTO professional_services_usps (_order, _parent_id, id, title, description, icon) VALUES ($1, $2, $3, $4, $5, $6)',
            [i + 1, serviceId, uid(), u.title, u.description, u.icon || null]
          )
        }
        console.log(`  Inserted ${dienst.usps.length} USPs`)
      } catch (err) {
        console.log(`  Skipping usps: ${err.message}`)
      }
    }

    // Insert FAQ
    if (dienst.faq?.length) {
      try {
        await client.query('DELETE FROM professional_services_faq WHERE _parent_id = $1', [serviceId])
        for (let i = 0; i < dienst.faq.length; i++) {
          const f = dienst.faq[i]
          await client.query(
            'INSERT INTO professional_services_faq (_order, _parent_id, id, question, answer) VALUES ($1, $2, $3, $4, $5)',
            [i + 1, serviceId, uid(), f.question, f.answer]
          )
        }
        console.log(`  Inserted ${dienst.faq.length} FAQ items`)
      } catch (err) {
        console.log(`  Skipping faq: ${err.message}`)
      }
    }

    // Link related projects
    if (dienst.relatedProjectSlugs?.length) {
      try {
        // Check if the rels table exists
        const relTableName = 'professional_services_rels'
        const { rows: relTableCheck } = await client.query(
          "SELECT table_name FROM information_schema.tables WHERE table_name = $1",
          [relTableName]
        )
        if (relTableCheck.length > 0) {
          // Delete existing relatedProjects
          await client.query(
            `DELETE FROM ${relTableName} WHERE parent_id = $1 AND path = 'relatedProjects'`,
            [serviceId]
          )
          let order = 1
          for (const slug of dienst.relatedProjectSlugs) {
            const projectId = projectMap[slug]
            if (projectId) {
              await client.query(
                `INSERT INTO ${relTableName} (parent_id, path, projects_id, "order") VALUES ($1, $2, $3, $4)`,
                [serviceId, 'relatedProjects', projectId, order++]
              )
            }
          }
          console.log(`  Linked ${order - 1} related projects`)
        }
      } catch (err) {
        console.log(`  Skipping relatedProjects link: ${err.message}`)
      }
    }
  }

  // ─── Link services to projects (relatedServices) ────────────────
  console.log('\n=== Linking services to projects ===')

  // Get all service IDs by slug
  const { rows: allServices } = await client.query('SELECT id, slug, branch FROM professional_services')
  const serviceMap = Object.fromEntries(allServices.map(s => [s.slug, s]))
  const serviceBranchMap = {}
  allServices.forEach(s => {
    if (s.branch) {
      if (!serviceBranchMap[s.branch]) serviceBranchMap[s.branch] = []
      serviceBranchMap[s.branch].push(s.id)
    }
  })

  // Map project branches to service slugs
  const branchServiceMapping = {
    'e-commerce': 'webshop-development',
    'construction': 'bouwproject-presentatie',
    'beauty': 'beauty-wellness-platform',
    'horeca': 'horeca-digitalisering',
    'zorg': 'zorg-patientenportaal',
    'dienstverlening': 'website-cms',
    'ervaringen': 'boekingsplatform',
  }

  try {
    const relTableName = 'projects_rels'
    const { rows: relTableCheck } = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_name = $1",
      [relTableName]
    )

    if (relTableCheck.length > 0) {
      // Get columns to understand the structure
      const { rows: relCols } = await client.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = $1",
        [relTableName]
      )
      const relColNames = relCols.map(c => c.column_name)
      console.log('projects_rels columns:', relColNames.join(', '))

      const hasProfServicesId = relColNames.includes('professional_services_id')

      if (hasProfServicesId) {
        for (const project of allProjects) {
          // Find matching service for this project's branch
          const { rows: projectBranch } = await client.query('SELECT branch FROM projects WHERE id = $1', [project.id])
          if (!projectBranch[0]?.branch) continue

          const serviceSlug = branchServiceMapping[projectBranch[0].branch]
          if (!serviceSlug || !serviceMap[serviceSlug]) continue

          const serviceInfo = serviceMap[serviceSlug]

          // Delete existing relatedServices links
          await client.query(
            `DELETE FROM ${relTableName} WHERE parent_id = $1 AND path = 'relatedServices'`,
            [project.id]
          )

          // Insert new link
          await client.query(
            `INSERT INTO ${relTableName} (parent_id, path, professional_services_id, "order") VALUES ($1, $2, $3, $4)`,
            [project.id, 'relatedServices', serviceInfo.id, 1]
          )
          console.log(`  Linked project ${project.slug} → service ${serviceSlug}`)
        }
      } else {
        console.log('  professional_services_id column not found in projects_rels, skipping')
      }
    } else {
      console.log('  projects_rels table not found, skipping')
    }
  } catch (err) {
    console.log(`  Skipping project→service links: ${err.message}`)
  }

  // ─── Navigation Menu Items ──────────────────────────────────────
  console.log('\n=== Updating navigation menu ===')

  try {
    // Get the header global _parent_id
    const { rows: headerRows } = await client.query(
      "SELECT id FROM header LIMIT 1"
    )

    if (headerRows.length > 0) {
      const headerId = headerRows[0].id

      // Check existing nav items
      const { rows: existingNav } = await client.query(
        'SELECT id, label, _order, url, type FROM header_manual_nav_items WHERE _parent_id = $1 ORDER BY _order',
        [headerId]
      )
      console.log('Existing nav items:', existingNav.map(n => `${n._order}:${n.label}`).join(', '))

      // Check if Diensten and Technologieën already exist
      const hasDiensten = existingNav.some(n => n.label === 'Diensten')
      const hasTech = existingNav.some(n => n.label === 'Technologieën')

      if (!hasDiensten || !hasTech) {
        // Shift existing items with _order >= 3 to make room
        // Current: 1:Branches, 2:Cases, 3:Over ons, 4:Blog, 5:Contact
        // Target:  1:Branches, 2:Cases, 3:Diensten, 4:Technologieën, 5:Over ons, 6:Blog, 7:Contact

        let itemsToInsert = 0
        if (!hasDiensten) itemsToInsert++
        if (!hasTech) itemsToInsert++

        // Shift existing items down
        await client.query(
          'UPDATE header_manual_nav_items SET _order = _order + $1 WHERE _parent_id = $2 AND _order >= 3',
          [itemsToInsert, headerId]
        )
        console.log(`  Shifted ${itemsToInsert} positions for items >= order 3`)

        let insertOrder = 3
        if (!hasDiensten) {
          await client.query(
            `INSERT INTO header_manual_nav_items (_order, _parent_id, id, label, icon, type, url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [insertOrder++, headerId, `nav-diensten-${Date.now()}`, 'Diensten', null, 'external', '/diensten']
          )
          console.log('  Added Diensten nav item')
        }

        if (!hasTech) {
          await client.query(
            `INSERT INTO header_manual_nav_items (_order, _parent_id, id, label, icon, type, url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [insertOrder++, headerId, `nav-tech-${Date.now()}`, 'Technologieën', null, 'external', '/technologieen']
          )
          console.log('  Added Technologieën nav item')
        }

        // Verify final order
        const { rows: finalNav } = await client.query(
          'SELECT label, _order, url FROM header_manual_nav_items WHERE _parent_id = $1 ORDER BY _order',
          [headerId]
        )
        console.log('Final nav order:', finalNav.map(n => `${n._order}:${n.label}`).join(', '))
      } else {
        console.log('  Diensten and Technologieën already in nav, skipping')
      }
    } else {
      console.log('  No header global found, skipping nav update')
    }
  } catch (err) {
    console.log(`  Nav update failed: ${err.message}`)
  }

  await client.end()
  console.log('\n✅ Diensten seed completed!')
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
