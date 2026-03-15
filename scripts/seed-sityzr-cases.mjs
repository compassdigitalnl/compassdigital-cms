/**
 * Seed script for Sityzr case studies
 * Fills all projects with rich content: challenge, solution, result,
 * features, technologies, metrics, timeline, processSteps, faq, videoUrl
 *
 * Usage: DATABASE_URL=<sityzr_db_url> node scripts/seed-sityzr-cases.mjs
 */

import pg from 'pg'
import crypto from 'crypto'
const { Client } = pg

const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/client_sityzr01'

// Helper to create Lexical richText JSON
function richText(paragraphs) {
  return JSON.stringify({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map(text => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', format: 0, text, version: 1, style: '', mode: 'normal', detail: 0 }],
        textFormat: 0,
        textStyle: '',
        direction: 'ltr',
      })),
      direction: 'ltr',
    },
  })
}

function oid() {
  return crypto.randomBytes(12).toString('hex')
}

// ─── Case Data ──────────────────────────────────────────────────

const casesData = {
  'wijnroute-belevenisplatform': {
    websiteUrl: 'https://wijnroute.nl',
    longDescription: richText([
      'WijnRoute is een boekingsplatform dat wijnliefhebbers verbindt met lokale wijnproducenten in heel Nederland. Het platform biedt een complete ervaring: van het ontdekken van wijngaarden tot het boeken van proeverijen, rondleidingen en culinaire evenementen.',
      'Met een focus op gebruiksvriendelijkheid en visuele storytelling hebben we een platform gecreëerd dat de beleving van wijn al laat beginnen bij het browsen door het aanbod.',
    ]),
    challenge: richText([
      'WijnRoute had geen centraal platform. Boekingen verliepen via telefoon en e-mail, waardoor veel potentiële klanten afhaakten. De verschillende wijnboeren hadden elk hun eigen (verouderde) website zonder boekingsmogelijkheid.',
      'De uitdaging was om een platform te bouwen dat zowel voor consumenten als voor wijnproducenten eenvoudig te gebruiken is, met real-time beschikbaarheid en directe bevestigingen.',
    ]),
    solution: richText([
      'We hebben een modern boekingsplatform ontwikkeld met Next.js en een headless CMS. De architectuur is opgebouwd rond drie pijlers: een intuïtieve zoek- en filterervaring, een gestroomlijnd boekingsproces, en een dashboard voor wijnproducenten om hun aanbod te beheren.',
      'Het platform integreert met Mollie voor betalingen, heeft een review-systeem en biedt cadeaubon-functionaliteit. Groepsboekingen worden automatisch afgehandeld met speciale kortingen.',
    ]),
    resultDescription: richText([
      'Binnen drie maanden na lancering heeft het platform meer dan 3.000 boekingen verwerkt. De gemiddelde boekingswaarde ligt 40% hoger dan de telefonische boekingen, doordat klanten vaker extra opties toevoegen.',
      'Wijnproducenten rapporteren een significante afname van administratieve werkdruk en een toename van internationale bezoekers.',
    ]),
    features: [
      { title: 'Real-time boekingssysteem', description: 'Direct beschikbaarheid zien en boeken met automatische bevestiging' },
      { title: 'Cadeaubonnen', description: 'Digitale cadeaubonnen met persoonlijke boodschap en QR-code validatie' },
      { title: 'Groepsboekingen', description: 'Speciale flow voor groepen met staffelkortingen en groepscommunicatie' },
      { title: 'Review & rating systeem', description: 'Gevalideerde reviews van bezoekers met foto-upload mogelijkheid' },
      { title: 'Producenten dashboard', description: 'Overzichtelijk beheer van ervaringen, beschikbaarheid en boekingen' },
      { title: 'Interactieve kaart', description: 'Ontdek wijngaarden op de kaart met filters op regio en type ervaring' },
      { title: 'Multi-taal ondersteuning', description: 'Platform beschikbaar in Nederlands, Engels en Duits' },
      { title: 'Automatische herinneringen', description: 'E-mail herinneringen voor aankomende boekingen en review-verzoeken' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'React', icon: 'Code2', category: 'frontend' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
      { name: 'Mollie Payments', icon: 'CreditCard', category: 'integration' },
      { name: 'Mapbox', icon: 'Map', category: 'integration' },
      { name: 'Vercel', icon: 'Cloud', category: 'platform' },
    ],
    metrics: [
      { value: '3.000+', label: 'Boekingen verwerkt', icon: 'Calendar', suffix: '' },
      { value: '40', label: 'Hogere orderwaarde', icon: 'TrendingUp', suffix: '%' },
      { value: '4.8', label: 'Gemiddelde review score', icon: 'Star', suffix: '/5' },
      { value: '85', label: 'Terugkerende bezoekers', icon: 'Users', suffix: '%' },
    ],
    timeline: [
      { title: 'Discovery & Strategie', description: 'Stakeholder interviews, marktonderzoek en technische architectuur', duration: '1 week', icon: 'Search' },
      { title: 'UX Design & Prototyping', description: 'Wireframes, user flows en interactief prototype', duration: '2 weken', icon: 'Palette' },
      { title: 'Development Sprint 1', description: 'Core platform: zoeken, filteren, boekingsflow', duration: '3 weken', icon: 'Code2' },
      { title: 'Development Sprint 2', description: 'Betalingen, reviews, cadeaubonnen, producenten-dashboard', duration: '2 weken', icon: 'Layers' },
      { title: 'Testing & Lancering', description: 'UAT, performance optimalisatie en go-live', duration: '1 week', icon: 'Rocket' },
    ],
    processSteps: [
      { title: 'Analyse & Briefing', description: 'Diepte-interview met WijnRoute om doelen, doelgroep en technische eisen helder te krijgen.', icon: 'Search' },
      { title: 'Concept & Design', description: 'Op basis van de analyse hebben we een visueel concept en UX-design opgeleverd dat de sfeer van wijnbeleving ademt.', icon: 'Palette' },
      { title: 'Agile Development', description: 'In twee sprints het platform gebouwd met wekelijkse demo\'s en feedback-rondes.', icon: 'Code2' },
      { title: 'Testen & Optimaliseren', description: 'Uitgebreide tests met echte gebruikers en wijnproducenten, gevolgd door performance-optimalisatie.', icon: 'CheckCircle' },
      { title: 'Lancering & Onboarding', description: 'Gefaseerde lancering met training voor wijnproducenten en 2 weken intensieve support.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Hoelang heeft de ontwikkeling van het platform geduurd?', answer: 'Het complete traject van briefing tot lancering heeft 8 weken geduurd. Dit omvat analyse, design, development en testing.' },
      { question: 'Welke technologieën zijn er gebruikt?', answer: 'Het platform is gebouwd met Next.js voor de frontend, Payload CMS als headless CMS, PostgreSQL als database en Mollie voor betalingen. De kaartintegratie is gerealiseerd met Mapbox.' },
      { question: 'Kunnen wijnproducenten zelf hun aanbod beheren?', answer: 'Ja, elke wijnproducent heeft een eigen dashboard waar ze ervaringen kunnen toevoegen, prijzen aanpassen, beschikbaarheid instellen en boekingen beheren.' },
      { question: 'Is het platform geschikt voor internationale bezoekers?', answer: 'Absoluut. Het platform is beschikbaar in drie talen (NL, EN, DE) en accepteert diverse betaalmethoden via Mollie, waaronder iDEAL, creditcard en Bancontact.' },
      { question: 'Hoe wordt de hosting en performance geregeld?', answer: 'Het platform draait op Vercel met edge caching voor optimale laadtijden. Afbeeldingen worden automatisch geoptimaliseerd en de database draait op een managed PostgreSQL cluster.' },
    ],
  },

  'techstore24-webshop': {
    websiteUrl: 'https://techstore24.nl',
    longDescription: richText([
      'TechStore24 is een complete B2C webshop voor consumentenelektronica. Van smartphones en laptops tot smart home producten en accessoires. Het platform combineert een uitgebreide productcatalogus met slimme zoek- en filtermogelijkheden.',
      'Het project richtte zich op het creëren van een snelle, gebruiksvriendelijke webshop die kan concurreren met de grote spelers, maar dan met persoonlijke service en deskundig advies als onderscheidende factor.',
    ]),
    challenge: richText([
      'TechStore24 verkocht voornamelijk via een fysieke winkel en een verouderd Magento-platform dat traag was en moeilijk te beheren. De conversieratio lag onder de 1% en het bouncepercentage was alarmerend hoog.',
      'Daarnaast ontbrak een mobiel-geoptimaliseerde ervaring, terwijl meer dan 65% van het verkeer via mobiel binnenkwam.',
    ]),
    solution: richText([
      'We hebben een headless e-commerce oplossing gebouwd met Next.js en Payload CMS. De productcatalogus is geoptimaliseerd met Meilisearch voor razendsnelle zoekresultaten met typo-tolerantie en faceted filtering.',
      'De checkout is versimpeld tot 3 stappen met gastbestelling, adresvalidatie en directe betaling via Mollie. Product-vergelijking en een wensenlijst verhogen de engagement.',
    ]),
    resultDescription: richText([
      'De nieuwe webshop heeft de conversieratio verhoogd van 0,8% naar 3,2% — een stijging van 300%. De gemiddelde sessieduur is verdubbeld en het bouncepercentage is gedaald met 45%.',
      'De Lighthouse score is gestegen naar 98/100 voor performance, wat bijdraagt aan betere SEO-posities en meer organisch verkeer.',
    ]),
    features: [
      { title: 'Razendsnelle zoekfunctie', description: 'Meilisearch-integratie met typo-tolerantie en instant results' },
      { title: 'Product vergelijking', description: 'Vergelijk tot 4 producten naast elkaar op specificaties' },
      { title: 'Wensenlijst & Alerts', description: 'Bewaar favorieten en ontvang meldingen bij prijsdalingen' },
      { title: 'Slimme filters', description: 'Dynamische faceted filters op merk, prijs, specificaties en meer' },
      { title: 'One-page checkout', description: 'Gestroomlijnde checkout met gastbestelling en adresvalidatie' },
      { title: 'Review systeem', description: 'Geverifieerde reviews met product-foto\'s en helpfulness-voting' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'Meilisearch', icon: 'Search', category: 'integration' },
      { name: 'Mollie', icon: 'CreditCard', category: 'integration' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
    ],
    metrics: [
      { value: '300', label: 'Conversie stijging', icon: 'TrendingUp', suffix: '%' },
      { value: '98', label: 'Lighthouse score', icon: 'Zap', suffix: '/100' },
      { value: '45', label: 'Lager bouncepercentage', icon: 'ArrowDown', suffix: '%' },
      { value: '2x', label: 'Langere sessieduur', icon: 'Clock', suffix: '' },
    ],
    timeline: [
      { title: 'Analyse & Migratieplan', description: 'Audit van bestaande Magento shop en migratieplan', duration: '1 week', icon: 'Search' },
      { title: 'Design System', description: 'Component-based design system voor consistente UI', duration: '2 weken', icon: 'Palette' },
      { title: 'Core Development', description: 'Productcatalogus, zoekfunctie en checkout', duration: '4 weken', icon: 'Code2' },
      { title: 'Integraties & Testing', description: 'Betalingen, verzending en uitgebreide QA', duration: '2 weken', icon: 'Layers' },
      { title: 'Datamigratie & Go-live', description: 'Productdata migratie en gefaseerde lancering', duration: '1 week', icon: 'Rocket' },
    ],
    processSteps: [
      { title: 'Audit bestaand platform', description: 'Analyse van de Magento-shop: performance, UX-knelpunten en conversie-bottlenecks.', icon: 'Search' },
      { title: 'Strategie & Roadmap', description: 'Prioritering van features op basis van impact en een haalbare planning.', icon: 'Map' },
      { title: 'Iteratief bouwen', description: 'Wekelijkse sprints met werkende demo\'s, zodat we snel konden bijsturen.', icon: 'Code2' },
      { title: 'Migratie & Lancering', description: 'Zero-downtime migratie van alle productdata en klantaccounts.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Waarom zijn jullie overgestapt van Magento?', answer: 'Magento was te traag en te complex voor ons team om zelf te beheren. De headless aanpak met Next.js geeft ons een veel snellere site en meer flexibiliteit.' },
      { question: 'Hoe snel laadt de nieuwe webshop?', answer: 'De gemiddelde laadtijd is minder dan 1 seconde dankzij server-side rendering, edge caching en geoptimaliseerde afbeeldingen. De Lighthouse performance score is 98/100.' },
      { question: 'Kunnen we zelf producten beheren?', answer: 'Ja, via het Payload CMS dashboard kunnen jullie producten toevoegen, prijzen aanpassen, voorraad beheren en acties instellen. Het is veel eenvoudiger dan Magento.' },
    ],
  },

  'biobites-maaltijdboxen': {
    websiteUrl: 'https://biobites.nl',
    longDescription: richText([
      'BioBites levert biologische maaltijdboxen aan huis met recepten van seizoensgebonden ingrediënten. Het platform combineert een abonnementsmodel met de mogelijkheid om losse boxen te bestellen.',
      'De focus lag op het creëren van een inspirerende ervaring waarin gezond eten toegankelijk en aantrekkelijk wordt gepresenteerd, met aandacht voor duurzaamheid en transparantie over de herkomst van ingrediënten.',
    ]),
    challenge: richText([
      'BioBites groeide snel maar hun bestelproces via WhatsApp en een eenvoudig bestelformulier was niet schaalbaar. Klanten konden niet zelf hun abonnement beheren en de administratie werd handmatig bijgehouden.',
      'Er was behoefte aan een platform dat zowel eenmalige bestellingen als flexibele abonnementen ondersteunt, met de mogelijkheid voor klanten om hun voorkeur, allergieën en bezorgmoment aan te geven.',
    ]),
    solution: richText([
      'We hebben een complete e-commerce oplossing gebouwd met een flexibel abonnementssysteem. Klanten kunnen kiezen uit verschillende boxformaten, hun dieetvoorkeuren instellen en wekelijks hun box personaliseren.',
      'Het beheerssysteem geeft BioBites real-time inzicht in bestellingen, voorraadplanning en klantvoorkeuren, waardoor voedselverspilling is geminimaliseerd.',
    ]),
    resultDescription: richText([
      'Het platform heeft geleid tot een verdrievoudiging van het aantal abonnees binnen 6 maanden. De churn rate is gedaald met 35% dankzij de verbeterde gebruikservaring en personalisatiemogelijkheden.',
      'De automatisering heeft het team 20 uur per week aan administratief werk bespaard.',
    ]),
    features: [
      { title: 'Flexibel abonnementssysteem', description: 'Wekelijks, tweewekelijks of maandelijks met eenvoudig pauzeren en hervatten' },
      { title: 'Box personalisatie', description: 'Kies ingrediënten op basis van dieet, allergieën en voorkeuren' },
      { title: 'Receptenbibliotheek', description: 'Digitale recepten met stap-voor-stap instructies en voedingswaarden' },
      { title: 'Bezorgplanning', description: 'Kies je bezorgdag en tijdslot met real-time beschikbaarheid' },
      { title: 'Klantportaal', description: 'Beheer abonnement, bekijk bestelhistorie en deel recepten' },
      { title: 'Herkomst transparantie', description: 'Inzicht in de boerderijen en leveranciers achter elk ingrediënt' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'Stripe Subscriptions', icon: 'CreditCard', category: 'integration' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
    ],
    metrics: [
      { value: '3x', label: 'Meer abonnees', icon: 'Users', suffix: '' },
      { value: '35', label: 'Lagere churn rate', icon: 'TrendingDown', suffix: '%' },
      { value: '20', label: 'Uur/week bespaard', icon: 'Clock', suffix: 'u' },
      { value: '4.9', label: 'Klanttevredenheid', icon: 'Star', suffix: '/5' },
    ],
    timeline: [
      { title: 'Product Discovery', description: 'Klantinterviews en concurrentieanalyse', duration: '1 week', icon: 'Search' },
      { title: 'UX & Visual Design', description: 'Food-fotografie geïntegreerd in het design', duration: '2 weken', icon: 'Palette' },
      { title: 'Platform Development', description: 'Abonnementssysteem, checkout en klantportaal', duration: '4 weken', icon: 'Code2' },
      { title: 'Integraties & Launch', description: 'Stripe, bezorgservice API en go-live', duration: '1 week', icon: 'Rocket' },
    ],
    processSteps: [
      { title: 'Klantonderzoek', description: 'Interviews met bestaande klanten om hun wensen en frustraties in kaart te brengen.', icon: 'Users' },
      { title: 'Prototype & Validatie', description: 'Clickable prototype getest met echte gebruikers voordat we begonnen met bouwen.', icon: 'Palette' },
      { title: 'Iteratief bouwen', description: 'Wekelijkse sprints met tussentijdse tests en feedback van het BioBites team.', icon: 'Code2' },
      { title: 'Soft launch', description: 'Eerst gelanceerd voor bestaande klanten, daarna opgeschaald naar nieuwe aanmeldingen.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Hoe werkt het abonnementssysteem technisch?', answer: 'Het abonnementssysteem is gebouwd op Stripe Subscriptions met webhooks voor automatische verwerking. Klanten kunnen via hun portaal pauzeren, hervatten en hun box samenstelling wijzigen.' },
      { question: 'Hoe is de bezorgplanning geïntegreerd?', answer: 'We hebben een eigen bezorgplanning-module gebouwd die integreert met de logistieke partner via API. Klanten zien real-time beschikbare bezorgslots op basis van hun postcode.' },
      { question: 'Is het platform schaalbaar?', answer: 'Ja, de architectuur is ontworpen om mee te groeien. Van 100 naar 10.000 abonnees zonder aanpassingen aan de code. Database queries zijn geoptimaliseerd en media wordt via CDN geserveerd.' },
    ],
  },

  'villa-duinzicht-nieuwbouw': {
    longDescription: richText([
      'Villa Duinzicht is een luxe nieuwbouwproject aan de kust, waarbij het volledige digitale traject is verzorgd: van projectpresentatie tot leadgeneratie.',
      'De website combineert architectuurvisualisaties met interactieve plattegronden en een aanvraagformulier voor bezichtigingen.',
    ]),
    challenge: richText([
      'Het bouwbedrijf had geen online aanwezigheid voor hun projecten. Geïnteresseerden moesten langskomen op kantoor of bellen voor informatie, wat resulteerde in veel gemiste leads.',
    ]),
    solution: richText([
      'We hebben een visueel rijke projectpagina gebouwd met voor/na beelden, een interactieve plattegrond en een geïntegreerd offerteformulier. De site is geoptimaliseerd voor lokale SEO.',
    ]),
    resultDescription: richText([
      'Het project genereerde 45 gekwalificeerde leads in de eerste maand. De bezichtigingsaanvragen zijn verviervoudigd ten opzichte van de vorige periode.',
    ]),
    features: [
      { title: 'Interactieve plattegronden', description: 'Klik op ruimtes voor details over afwerking en afmetingen' },
      { title: 'Voor/na visualisaties', description: 'Slider om bouwfoto\'s te vergelijken met artist impressions' },
      { title: 'Bezichtiging aanvragen', description: 'Online formulier met automatische agenda-integratie' },
      { title: 'Voortgang updates', description: 'Fotoblog met bouwupdates voor geïnteresseerden' },
    ],
    metrics: [
      { value: '45', label: 'Leads in eerste maand', icon: 'Users', suffix: '' },
      { value: '4x', label: 'Meer bezichtigingen', icon: 'TrendingUp', suffix: '' },
      { value: '2.5', label: 'Seconden laadtijd', icon: 'Zap', suffix: 's' },
    ],
    processSteps: [
      { title: 'Briefing met architect', description: 'Samenwerking met architect om de visie van het project digitaal te vertalen.', icon: 'Building' },
      { title: 'Visueel ontwerp', description: 'High-fidelity designs met focus op het presenteren van de villa in al zijn facetten.', icon: 'Palette' },
      { title: 'Development', description: 'Bouw van de interactieve plattegrond, voor/na slider en formulieren.', icon: 'Code2' },
      { title: 'SEO & Lancering', description: 'Lokale SEO-optimalisatie en lancering met Google Ads campagne.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Is de website ook geschikt voor andere bouwprojecten?', answer: 'Ja, het template is herbruikbaar. Voor elk nieuw project kan een nieuwe pagina worden aangemaakt met project-specifieke content, plattegronden en beelden.' },
      { question: 'Hoe werkt de voor/na functionaliteit?', answer: 'Bezoekers kunnen een slider over het beeld slepen om de situatie voor en na de bouw te vergelijken. Dit werkt op zowel desktop als mobiel.' },
    ],
  },

  'kantoorpand-centrum-renovatie': {
    longDescription: richText([
      'Een grootschalige renovatie van een historisch kantoorpand in het centrum, getransformeerd tot moderne werkruimte met behoud van karakter.',
      'De website documenteert het volledige renovatietraject en dient als referentie voor toekomstige opdrachtgevers.',
    ]),
    challenge: richText([
      'Het renovatiebedrijf wilde zich positioneren als specialist in monumentale renovaties, maar had geen portfolio om dit te onderbouwen.',
    ]),
    solution: richText([
      'We hebben een uitgebreide case study pagina gebouwd met tijdlijn, voor/na beelden en gedetailleerde specificaties die de expertise van het bedrijf aantonen.',
    ]),
    resultDescription: richText([
      'De case study pagina heeft geleid tot 3 vergelijkbare opdrachten in het eerste kwartaal na publicatie.',
    ]),
    features: [
      { title: 'Tijdlijn documentatie', description: 'Visuele tijdlijn van het renovatietraject met foto\'s per fase' },
      { title: 'Technische specificaties', description: 'Gedetailleerde specs van materialen en technieken' },
      { title: 'Voor/na galerij', description: 'Uitgebreide beeldvergelijking per ruimte' },
    ],
    metrics: [
      { value: '3', label: 'Nieuwe opdrachten', icon: 'Award', suffix: '' },
      { value: '280', label: 'Gerenoveerd oppervlak', icon: 'Square', suffix: 'm²' },
    ],
    processSteps: [
      { title: 'Inventarisatie', description: 'Volledige documentatie van het bestaande pand met fotografie en 3D-scans.', icon: 'Camera' },
      { title: 'Contentcreatie', description: 'Professionele fotografie, videografie en copywriting voor de case study.', icon: 'Image' },
      { title: 'Website development', description: 'Bouw van de interactieve case study met alle media-elementen.', icon: 'Code2' },
    ],
    faq: [
      { question: 'Kan ik ook zo\'n case study laten maken voor mijn project?', answer: 'Ja, bij elk bouwproject bieden we de optie om een professionele case study te laten maken. Dit helpt bij het aantrekken van nieuwe opdrachtgevers.' },
    ],
  },

  'glow-studio-boekingsplatform': {
    websiteUrl: 'https://glowstudio.nl',
    longDescription: richText([
      'Glow Studio is een beauty salon met meerdere locaties die een online boekingsplatform nodig had. Het platform integreert agenda-beheer, behandelingsoverzicht en een loyaliteitsprogramma.',
      'De nadruk lag op een luxe uitstraling die past bij het merk, gecombineerd met praktische functionaliteit voor zowel klanten als medewerkers.',
    ]),
    challenge: richText([
      'Glow Studio verloor klanten doordat telefonisch boeken alleen tijdens openingstijden mogelijk was. Daarnaast was er geen inzicht in klantvoorkeuren en bezochte behandelingen.',
    ]),
    solution: richText([
      'Een elegant boekingsplatform met 24/7 online reserveren, gekoppeld aan het interne agenda-systeem. Klanten bouwen een profiel op met hun behandelingshistorie en voorkeuren.',
    ]),
    resultDescription: richText([
      'Online boekingen vormen nu 78% van alle afspraken. De no-show rate is gedaald met 60% dankzij automatische herinneringen. De omzet is gestegen met 25% door het loyaliteitsprogramma.',
    ]),
    features: [
      { title: '24/7 Online boeken', description: 'Klanten boeken op elk moment een behandeling met real-time beschikbaarheid' },
      { title: 'Stylist matching', description: 'Intelligente koppeling op basis van specialisatie en klantvoorkeur' },
      { title: 'Loyaliteitsprogramma', description: 'Punten sparen bij elke behandeling met persoonlijke rewards' },
      { title: 'Klantprofiel', description: 'Behandelingshistorie, productadvies en voorkeursinstellingen' },
      { title: 'Multi-locatie agenda', description: 'Geïntegreerd agenda-beheer voor alle locaties vanuit één dashboard' },
      { title: 'Automatische herinneringen', description: 'SMS en e-mail herinneringen 24 uur en 1 uur voor de afspraak' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
      { name: 'Twilio SMS', icon: 'MessageSquare', category: 'integration' },
    ],
    metrics: [
      { value: '78', label: 'Online boekingen', icon: 'Calendar', suffix: '%' },
      { value: '60', label: 'Minder no-shows', icon: 'TrendingDown', suffix: '%' },
      { value: '25', label: 'Omzetstijging', icon: 'TrendingUp', suffix: '%' },
    ],
    timeline: [
      { title: 'Salon Analyse', description: 'Workflow-analyse en klantjourney mapping', duration: '1 week', icon: 'Search' },
      { title: 'Design & Branding', description: 'Luxe design passend bij de merkidentiteit', duration: '2 weken', icon: 'Palette' },
      { title: 'Platform Bouw', description: 'Boekingssysteem, agenda en klantportaal', duration: '3 weken', icon: 'Code2' },
      { title: 'Integratie & Training', description: 'Agenda-koppeling en teamtraining', duration: '1 week', icon: 'Rocket' },
    ],
    processSteps: [
      { title: 'Salon bezoek & analyse', description: 'Een dag meegelopen in de salon om de werkprocessen en klantinteractie te begrijpen.', icon: 'Search' },
      { title: 'Design op maat', description: 'Luxe design dat past bij de sfeer en het merk van Glow Studio.', icon: 'Palette' },
      { title: 'Bouwen & Testen', description: 'Iteratief bouwen met wekelijkse feedback van het salonteam.', icon: 'Code2' },
      { title: 'Training & Go-live', description: 'Persoonlijke training voor het team en begeleide lancering.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Werkt het boekingssysteem met de bestaande agenda?', answer: 'Ja, het systeem synchroniseert met Google Calendar en heeft een eigen agenda-module voor geavanceerd beheer met bloktijden, pauzes en vakanties.' },
      { question: 'Hoe werkt het loyaliteitsprogramma?', answer: 'Klanten verdienen punten bij elke behandeling die ze kunnen inwisselen voor kortingen of gratis behandelingen. Het systeem berekent automatisch de punten op basis van het bestede bedrag.' },
    ],
  },

  'de-waterkant-digitaal-menu': {
    websiteUrl: 'https://dewaterkant.nl',
    longDescription: richText([
      'Restaurant De Waterkant wilde de overstap maken naar een volledig digitaal menu- en reserveringssysteem. Het resultaat is een elegant platform dat gasten inspireert en het team ontlast.',
    ]),
    challenge: richText([
      'Het restaurant werkte met papieren menu\'s die bij elke seizoenswisseling opnieuw moesten worden gedrukt. Online reserveringen verliepen via een extern platform dat commissie rekende.',
    ]),
    solution: richText([
      'Een eigen website met dynamisch menu-beheer via het CMS, een geïntegreerd reserveringssysteem zonder commissiekosten, en QR-codes op tafel voor direct bestellen.',
    ]),
    resultDescription: richText([
      'Het restaurant bespaart €800 per maand aan commissiekosten en drukwerk. De gemiddelde besteding per tafel is met 15% gestegen doordat het digitale menu visueel aantrekkelijker is.',
    ]),
    features: [
      { title: 'Dynamisch digitaal menu', description: 'Eenvoudig aanpasbaar menu met foto\'s, allergeneninformatie en seizoensaanbiedingen' },
      { title: 'Online reserveringen', description: 'Eigen reserveringssysteem zonder commissie met tafelvoorkeur' },
      { title: 'QR-code bestelsysteem', description: 'Gasten scannen de QR-code op tafel voor het menu en bestelling' },
      { title: 'Allergeenfilter', description: 'Gasten filteren het menu op allergieën en dieetwensen' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
    ],
    metrics: [
      { value: '€800', label: 'Maandelijkse besparing', icon: 'PiggyBank', suffix: '/mnd' },
      { value: '15', label: 'Hogere besteding', icon: 'TrendingUp', suffix: '%' },
      { value: '0', label: 'Commissiekosten', icon: 'DollarSign', suffix: '€' },
    ],
    processSteps: [
      { title: 'Menu-analyse', description: 'Alle gerechten, allergenen en seizoensvariaties in kaart gebracht.', icon: 'ClipboardList' },
      { title: 'Design & Fotografie', description: 'Professionele food-fotografie en merkgericht webdesign.', icon: 'Camera' },
      { title: 'Platform bouw', description: 'Menu-beheer, reserveringssysteem en QR-code integratie.', icon: 'Code2' },
      { title: 'Lancering', description: 'Gelanceerd met QR-codes op elke tafel en training voor het personeel.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Kan het menu real-time worden aangepast?', answer: 'Ja, via het CMS kan het restaurantteam direct gerechten toevoegen, verwijderen of als uitverkocht markeren. Wijzigingen zijn direct zichtbaar voor gasten.' },
      { question: 'Hoe werkt de QR-code bestelling?', answer: 'Elke tafel heeft een unieke QR-code. Gasten scannen deze met hun telefoon, bekijken het menu en kunnen direct bestellen. De bestelling komt binnen op het keukenscherm.' },
    ],
  },

  'zorgconnect-patientenportaal': {
    websiteUrl: 'https://zorgconnect.nl',
    longDescription: richText([
      'ZorgConnect is een patiëntenportaal voor een groep huisartsenpraktijken. Het platform stelt patiënten in staat om online afspraken te maken, herhaalrecepten aan te vragen en medische gegevens in te zien.',
    ]),
    challenge: richText([
      'De huisartsenpraktijken werden overspoeld met telefoontjes voor afspraken en herhaalrecepten. De telefoonlijnen waren overbelast, vooral op maandagochtend, wat leidde tot frustratie bij zowel patiënten als personeel.',
    ]),
    solution: richText([
      'Een veilig patiëntenportaal met DigiD-authenticatie, online afspraken plannen, herhaalrecepten aanvragen en beveiligd berichtenverkeer met de huisarts.',
    ]),
    resultDescription: richText([
      'Het telefoonverkeer is met 40% afgenomen. 65% van de herhaalrecepten wordt nu online aangevraagd. Patiënttevredenheid is gestegen van 7,2 naar 8,4.',
    ]),
    features: [
      { title: 'DigiD authenticatie', description: 'Veilige toegang via DigiD met BSN-verificatie' },
      { title: 'Online afspraken', description: 'Beschikbaarheid per arts met type-specifieke tijdslots' },
      { title: 'Herhaalrecepten', description: 'Aanvragen en track & trace van recepten' },
      { title: 'Beveiligd berichtenverkeer', description: 'Versleutelde communicatie tussen patiënt en arts' },
      { title: 'Medisch dossier inzage', description: 'Inzicht in eigen medische gegevens en labuitslagen' },
      { title: 'Vaccinatieregistratie', description: 'Overzicht van vaccinaties en automatische herinneringen' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'DigiD/SAML', icon: 'Shield', category: 'integration' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
      { name: 'End-to-end encryptie', icon: 'Lock', category: 'platform' },
    ],
    metrics: [
      { value: '40', label: 'Minder telefoonverkeer', icon: 'PhoneOff', suffix: '%' },
      { value: '65', label: 'Online receptaanvragen', icon: 'FileText', suffix: '%' },
      { value: '8.4', label: 'Patiënttevredenheid', icon: 'Star', suffix: '/10' },
    ],
    processSteps: [
      { title: 'Privacy & Security audit', description: 'Uitgebreide analyse van privacy-vereisten, NEN 7510 en AVG-compliance.', icon: 'Shield' },
      { title: 'UX Research', description: 'Gebruikersonderzoek met patiënten van alle leeftijdsgroepen.', icon: 'Users' },
      { title: 'Secure development', description: 'Development met focus op beveiliging, encryptie en DigiD-integratie.', icon: 'Lock' },
      { title: 'Pilot & Uitrol', description: 'Pilot bij 1 praktijk, daarna uitrol naar alle locaties.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Is het portaal AVG-compliant?', answer: 'Ja, het portaal is volledig AVG-compliant en voldoet aan NEN 7510 voor informatiebeveiliging in de zorg. Alle data wordt end-to-end versleuteld en opgeslagen in een gecertificeerd datacenter.' },
      { question: 'Hoe werkt de DigiD-koppeling?', answer: 'Patiënten loggen in via DigiD (niveau substantieel). De koppeling is gerealiseerd via SAML en wordt beheerd door een gecertificeerde identity provider.' },
    ],
  },

  'juristonline-adviesplatform': {
    websiteUrl: 'https://juristonline.nl',
    longDescription: richText([
      'JuristOnline is een juridisch adviesplatform dat particulieren en ZZP\'ers toegang geeft tot betaalbaar juridisch advies. Via het platform kunnen gebruikers vragen stellen, documenten laten reviewen en video-consulten boeken.',
    ]),
    challenge: richText([
      'Juridisch advies is voor veel mensen ontoegankelijk door hoge kosten en de drempel om een advocaat te benaderen. JuristOnline wilde een laagdrempelig alternatief bieden.',
    ]),
    solution: richText([
      'Een platform met een gelaagd prijsmodel: gratis community-vragen, betaalde persoonlijke juridische review en premium video-consulten. Juristen worden gematcht op specialisatie.',
    ]),
    resultDescription: richText([
      'Het platform heeft 500+ actieve gebruikers binnen 3 maanden. De gemiddelde responstijd op juridische vragen is 4 uur, versus dagen bij traditionele kantoren.',
    ]),
    features: [
      { title: 'Vraag & Antwoord forum', description: 'Gratis juridische community met geverifieerde jurist-antwoorden' },
      { title: 'Document review', description: 'Upload contracten en krijg juridische feedback binnen 24 uur' },
      { title: 'Video-consulten', description: 'Boek een videogesprek met een specialist in jouw rechtsgebied' },
      { title: 'Jurist matching', description: 'Automatische matching op basis van vraagtype en specialisatie' },
      { title: 'Transparante prijzen', description: 'Vaste tarieven per dienst zonder verrassingen' },
      { title: 'Beveiligde documentopslag', description: 'Veilige upload en opslag van juridische documenten' },
    ],
    technologies: [
      { name: 'Next.js', icon: 'Globe', category: 'frontend' },
      { name: 'Payload CMS', icon: 'Database', category: 'backend' },
      { name: 'Tailwind CSS', icon: 'Palette', category: 'design' },
      { name: 'PostgreSQL', icon: 'Database', category: 'backend' },
      { name: 'Mollie Payments', icon: 'CreditCard', category: 'integration' },
      { name: 'Daily.co Video', icon: 'Video', category: 'integration' },
    ],
    metrics: [
      { value: '500+', label: 'Actieve gebruikers', icon: 'Users', suffix: '' },
      { value: '4', label: 'Gem. responstijd', icon: 'Clock', suffix: 'uur' },
      { value: '4.7', label: 'Gebruikersscore', icon: 'Star', suffix: '/5' },
    ],
    processSteps: [
      { title: 'Marktvalidatie', description: 'Interviews met potentiële gebruikers en juristen om de product-market fit te valideren.', icon: 'Search' },
      { title: 'MVP Design', description: 'Minimaal viable product design gefocust op de kernfunctionaliteiten.', icon: 'Palette' },
      { title: 'Platform development', description: 'Bouw van het forum, matching-algoritme, document-upload en betalingssysteem.', icon: 'Code2' },
      { title: 'Beta launch', description: 'Gesloten beta met 50 testgebruikers, gevolgd door een publieke lancering.', icon: 'Rocket' },
    ],
    faq: [
      { question: 'Hoe worden juristen geverifieerd?', answer: 'Alle juristen op het platform zijn geregistreerd bij de Nederlandse Orde van Advocaten of hebben een aantoonbare juridische achtergrond. We verifiëren hun identiteit en kwalificaties handmatig.' },
      { question: 'Zijn de video-consulten versleuteld?', answer: 'Ja, alle video-consulten worden end-to-end versleuteld via Daily.co. Opnames worden niet gemaakt tenzij beide partijen akkoord geven.' },
    ],
  },
}

// ─── Main ───────────────────────────────────────────────────────

async function seed() {
  const client = new Client(DATABASE_URL)
  await client.connect()
  console.log('Connected to database')

  for (const [slug, data] of Object.entries(casesData)) {
    console.log(`\n--- Updating: ${slug} ---`)

    // Get project ID
    const { rows } = await client.query('SELECT id FROM projects WHERE slug = $1', [slug])
    if (!rows[0]) {
      console.log(`  Project not found, skipping`)
      continue
    }
    const projectId = rows[0].id

    // Update main fields
    const updates = []
    const values = []
    let idx = 1

    if (data.longDescription) {
      updates.push(`long_description = $${idx++}`)
      values.push(data.longDescription)
    }
    if (data.challenge) {
      updates.push(`challenge = $${idx++}`)
      values.push(data.challenge)
    }
    if (data.solution) {
      updates.push(`solution = $${idx++}`)
      values.push(data.solution)
    }
    if (data.resultDescription) {
      updates.push(`result_description = $${idx++}`)
      values.push(data.resultDescription)
    }
    if (data.websiteUrl) {
      updates.push(`website_url = $${idx++}`)
      values.push(data.websiteUrl)
    }

    // Check if video_url column exists (new field)
    try {
      await client.query('SELECT video_url FROM projects LIMIT 0')
      if (data.videoUrl) {
        updates.push(`video_url = $${idx++}`)
        values.push(data.videoUrl)
      }
    } catch { /* column doesn't exist yet */ }

    if (updates.length > 0) {
      values.push(projectId)
      await client.query(`UPDATE projects SET ${updates.join(', ')} WHERE id = $${idx}`, values)
      console.log(`  Updated main fields`)
    }

    // Insert features (serial ID - omit id column)
    if (data.features?.length) {
      await client.query('DELETE FROM projects_features WHERE _parent_id = $1', [projectId])
      for (let i = 0; i < data.features.length; i++) {
        const f = data.features[i]
        await client.query(
          'INSERT INTO projects_features (_order, _parent_id, title, description) VALUES ($1, $2, $3, $4)',
          [i + 1, projectId, f.title, f.description || null]
        )
      }
      console.log(`  Inserted ${data.features.length} features`)
    }

    // Insert technologies (serial ID)
    if (data.technologies?.length) {
      await client.query('DELETE FROM projects_technologies WHERE _parent_id = $1', [projectId])
      for (let i = 0; i < data.technologies.length; i++) {
        const t = data.technologies[i]
        await client.query(
          'INSERT INTO projects_technologies (_order, _parent_id, name, icon, category) VALUES ($1, $2, $3, $4, $5)',
          [i + 1, projectId, t.name, t.icon || null, t.category || null]
        )
      }
      console.log(`  Inserted ${data.technologies.length} technologies`)
    }

    // Insert metrics (serial ID)
    if (data.metrics?.length) {
      await client.query('DELETE FROM projects_metrics WHERE _parent_id = $1', [projectId])
      for (let i = 0; i < data.metrics.length; i++) {
        const m = data.metrics[i]
        await client.query(
          'INSERT INTO projects_metrics (_order, _parent_id, value, label, icon, suffix) VALUES ($1, $2, $3, $4, $5, $6)',
          [i + 1, projectId, m.value, m.label, m.icon || null, m.suffix || null]
        )
      }
      console.log(`  Inserted ${data.metrics.length} metrics`)
    }

    // Insert timeline (serial ID)
    if (data.timeline?.length) {
      await client.query('DELETE FROM projects_timeline WHERE _parent_id = $1', [projectId])
      for (let i = 0; i < data.timeline.length; i++) {
        const t = data.timeline[i]
        await client.query(
          'INSERT INTO projects_timeline (_order, _parent_id, title, description, duration, icon) VALUES ($1, $2, $3, $4, $5, $6)',
          [i + 1, projectId, t.title, t.description || null, t.duration || null, t.icon || null]
        )
      }
      console.log(`  Inserted ${data.timeline.length} timeline phases`)
    }

    // Insert processSteps (serial ID)
    if (data.processSteps?.length) {
      try {
        await client.query('DELETE FROM projects_process_steps WHERE _parent_id = $1', [projectId])
        for (let i = 0; i < data.processSteps.length; i++) {
          const s = data.processSteps[i]
          await client.query(
            'INSERT INTO projects_process_steps (_order, _parent_id, title, description, icon) VALUES ($1, $2, $3, $4, $5)',
            [i + 1, projectId, s.title, s.description || null, s.icon || null]
          )
        }
        console.log(`  Inserted ${data.processSteps.length} process steps`)
      } catch (err) {
        console.log(`  Skipping processSteps (table not yet created - run build first)`)
      }
    }

    // Insert faq (serial ID)
    if (data.faq?.length) {
      try {
        await client.query('DELETE FROM projects_faq WHERE _parent_id = $1', [projectId])
        for (let i = 0; i < data.faq.length; i++) {
          const f = data.faq[i]
          await client.query(
            'INSERT INTO projects_faq (_order, _parent_id, question, answer) VALUES ($1, $2, $3, $4)',
            [i + 1, projectId, f.question, f.answer]
          )
        }
        console.log(`  Inserted ${data.faq.length} FAQ items`)
      } catch (err) {
        console.log(`  Skipping faq (table not yet created - run build first)`)
      }
    }
  }

  await client.end()
  console.log('\n✅ Seed completed!')
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
