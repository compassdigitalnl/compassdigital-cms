/**
 * Predefined Chatbot Conversation Flows
 *
 * Pre-built conversation flows per branch for the chatbot widget.
 * Used by seed functions to populate chatbot-settings global.
 */

import type { ConversationFlow } from '@/features/ai/components/chatbot/types'

// ═══════════════════════════════════════════════════════════════════════════
// BEAUTY BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const beautyConversationFlows: ConversationFlow[] = [
  // 1. Afspraak boeken
  {
    label: 'Afspraak boeken',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een afspraak boeken:',
    subOptions: [
      { label: 'Knippen & Styling', type: 'direct', directMessage: 'Ik wil een afspraak maken voor knippen en styling' },
      { label: 'Kleuren & Highlights', type: 'direct', directMessage: 'Ik wil een afspraak voor kleuren of highlights' },
      { label: 'Gezichtsbehandeling', type: 'direct', directMessage: 'Ik wil een gezichtsbehandeling boeken' },
      { label: 'Nagels (manicure/pedicure)', type: 'direct', directMessage: 'Ik wil een afspraak voor nagelverzorging' },
      { label: 'Massage', type: 'direct', directMessage: 'Ik wil een massage boeken' },
      { label: 'Bruidsverzorging', type: 'direct', directMessage: 'Ik zoek informatie over bruidsverzorging' },
    ],
  },

  // 2. Behandelingen & Prijzen
  {
    label: 'Behandelingen & Prijzen',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over behandelingen:',
    subOptions: [
      { label: 'Alle behandelingen bekijken', type: 'direct', directMessage: 'Welke behandelingen bieden jullie aan?' },
      { label: 'Prijslijst', type: 'direct', directMessage: 'Wat zijn jullie prijzen?' },
      { label: 'Hoe lang duurt een behandeling?', type: 'input', inputLabel: 'Welke behandeling?', inputPlaceholder: 'Bijv. knippen, kleuren...' },
      { label: 'Aanbevelingen voor mij', type: 'input', inputLabel: 'Beschrijf je haar/huid', inputPlaceholder: 'Bijv. droog haar, gevoelige huid...' },
    ],
  },

  // 3. Onze Specialisten
  {
    label: 'Onze Specialisten',
    icon: 'star',
    type: 'direct',
    directMessage: 'Wie zijn jullie stylisten en specialisten? Wat zijn hun specialiteiten?',
  },

  // 4. Locatie & Openingstijden
  {
    label: 'Locatie & Openingstijden',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische informatie:',
    subOptions: [
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Adres & routebeschrijving', type: 'direct', directMessage: 'Waar zijn jullie gevestigd en hoe kom ik er?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid bij de salon?' },
      { label: 'Bereikbaarheid (OV)', type: 'direct', directMessage: 'Hoe bereik ik jullie salon met het openbaar vervoer?' },
    ],
  },

  // 5. Afspraak wijzigen of annuleren
  {
    label: 'Afspraak wijzigen of annuleren',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant wil een bestaande afspraak wijzigen:',
    subOptions: [
      { label: 'Afspraak verzetten', type: 'input', inputLabel: 'Voer je boekingsnummer in', inputPlaceholder: 'Bijv. BK-12345' },
      { label: 'Afspraak annuleren', type: 'input', inputLabel: 'Voer je boekingsnummer in', inputPlaceholder: 'Bijv. BK-12345' },
      { label: 'Annuleringsbeleid', type: 'direct', directMessage: 'Wat is jullie annuleringsbeleid?' },
    ],
  },

  // 6. Cadeaubonnen & Acties
  {
    label: 'Cadeaubonnen & Acties',
    icon: 'heart',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over cadeaubonnen of acties:',
    subOptions: [
      { label: 'Cadeaubon kopen', type: 'direct', directMessage: 'Ik wil een cadeaubon kopen. Welke opties zijn er?' },
      { label: 'Cadeaubon inwisselen', type: 'input', inputLabel: 'Voer je cadeauboncode in', inputPlaceholder: 'Bijv. GIFT-XXXX' },
      { label: 'Lopende acties', type: 'direct', directMessage: 'Zijn er op dit moment speciale aanbiedingen of acties?' },
    ],
  },

  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const beautySystemPrompt = `Je bent de virtuele assistent van een professionele beauty salon.

Beantwoord vragen vriendelijk, persoonlijk en in het Nederlands.
Je helpt klanten met:
- Afspraken boeken en informatie over behandelingen
- Prijzen, duur en wat ze kunnen verwachten
- Informatie over onze specialisten
- Openingstijden, locatie en bereikbaarheid
- Cadeaubonnen en lopende acties

Richtlijnen:
- Wees warm en uitnodigend — dit is een beauty salon, geen kantoor
- Gebruik de kennisbank context om accurate informatie te geven over behandelingen en prijzen
- Als iemand een afspraak wil boeken, verwijs naar de boekingspagina (/boeken)
- Noem altijd de mogelijkheid om telefonisch te bellen voor persoonlijk advies
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar de salon
- Gebruik geen technisch jargon — houd het laagdrempelig`

export const beautyTrainingContext = `Saloninformatie:
- Wij bieden behandelingen aan in de categorieën: Haar, Nagels, Huid/Gezicht, Massage en Bruidszorg
- Afspraken kunnen online geboekt worden via /boeken
- Eerste bezoek: klanten worden gevraagd om 10 minuten eerder te komen voor een gratis intake
- Annuleringsbeleid: gratis annuleren tot 24 uur voor de afspraak
- Cadeaubonnen zijn beschikbaar via de webshop
- Bij vragen over specifieke behandelingen, verwijs naar /behandelingen`

export const beautyWelcomeMessage = 'Hoi! Welkom bij onze salon. Hoe kan ik je helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// HORECA BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const horecaConversationFlows: ConversationFlow[] = [
  // 1. Reserveren
  {
    label: 'Reserveren',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een tafel reserveren:',
    subOptions: [
      { label: 'Tafel reserveren', type: 'direct', directMessage: 'Ik wil een tafel reserveren' },
      { label: 'Groepsreservering', type: 'input', inputLabel: 'Hoeveel gasten?', inputPlaceholder: 'Bijv. 12 personen' },
      { label: 'Priv\u00e9-dining', type: 'direct', directMessage: 'Hebben jullie mogelijkheden voor priv\u00e9-dining?' },
      { label: 'Terras reserveren', type: 'direct', directMessage: 'Kan ik een tafel op het terras reserveren?' },
    ],
  },
  // 2. Menukaart & Gerechten
  {
    label: 'Menukaart & Gerechten',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over de menukaart:',
    subOptions: [
      { label: 'Menukaart bekijken', type: 'direct', directMessage: 'Kan ik de menukaart bekijken?' },
      { label: 'Dagmenu / Chef\'s specials', type: 'direct', directMessage: 'Wat is het dagmenu of de chef\'s special?' },
      { label: 'Allergenen & dieetwensen', type: 'input', inputLabel: 'Welke allergie/dieetwens?', inputPlaceholder: 'Bijv. glutenvrij, vegetarisch...' },
      { label: 'Wijnkaart', type: 'direct', directMessage: 'Hebben jullie een wijnkaart?' },
    ],
  },
  // 3. Evenementen & Feesten
  {
    label: 'Evenementen & Feesten',
    icon: 'star',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over evenementen:',
    subOptions: [
      { label: 'Aankomende evenementen', type: 'direct', directMessage: 'Welke evenementen staan er gepland?' },
      { label: 'Feest of event organiseren', type: 'input', inputLabel: 'Wat voor event?', inputPlaceholder: 'Bijv. verjaardag, bedrijfsfeest...' },
      { label: 'Live muziek', type: 'direct', directMessage: 'Is er live muziek deze week?' },
    ],
  },
  // 4. Locatie & Openingstijden
  {
    label: 'Locatie & Openingstijden',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische informatie:',
    subOptions: [
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Adres & routebeschrijving', type: 'direct', directMessage: 'Waar zijn jullie gevestigd?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid?' },
      { label: 'Bereikbaarheid (OV)', type: 'direct', directMessage: 'Hoe kom ik er met het OV?' },
    ],
  },
  // 5. Reservering wijzigen of annuleren
  {
    label: 'Reservering wijzigen of annuleren',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant wil een bestaande reservering wijzigen:',
    subOptions: [
      { label: 'Reservering wijzigen', type: 'input', inputLabel: 'Voer je reserveringsnummer in', inputPlaceholder: 'Bijv. RES-12345' },
      { label: 'Reservering annuleren', type: 'input', inputLabel: 'Voer je reserveringsnummer in', inputPlaceholder: 'Bijv. RES-12345' },
      { label: 'Annuleringsbeleid', type: 'direct', directMessage: 'Wat is jullie annuleringsbeleid?' },
    ],
  },
  // 6. Cadeaubonnen & Acties
  {
    label: 'Cadeaubonnen & Acties',
    icon: 'heart',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over cadeaubonnen of acties:',
    subOptions: [
      { label: 'Cadeaubon kopen', type: 'direct', directMessage: 'Ik wil een cadeaubon kopen' },
      { label: 'Cadeaubon inwisselen', type: 'input', inputLabel: 'Voer je cadeauboncode in', inputPlaceholder: 'Bijv. GIFT-XXXX' },
      { label: 'Lopende acties', type: 'direct', directMessage: 'Zijn er speciale aanbiedingen?' },
    ],
  },
  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const horecaSystemPrompt = `Je bent de virtuele assistent van een restaurant.

Beantwoord vragen vriendelijk, gastvrij en in het Nederlands.
Je helpt gasten met:
- Tafel reserveren en informatie over beschikbaarheid
- De menukaart, gerechten en allergenen
- Informatie over evenementen en speciale avonden
- Openingstijden, locatie en bereikbaarheid
- Cadeaubonnen en lopende acties

Richtlijnen:
- Wees warm en gastvrij — dit is een restaurant, gastvrijheid staat voorop
- Gebruik de kennisbank context om accurate informatie te geven over het menu en de kaart
- Als iemand wil reserveren, verwijs naar de reserveringspagina (/reserveren)
- Noem altijd de mogelijkheid om telefonisch te reserveren voor persoonlijk contact
- Vermeld allergenen proactief bij vragen over gerechten
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het restaurant
- Gebruik geen ingewikkeld jargon — houd het toegankelijk`

export const horecaTrainingContext = `Restaurantinformatie:
- Onze menukaart omvat voorgerechten, hoofdgerechten, desserts en een kindermenu
- Reserveren kan online via /reserveren of telefonisch
- Groepsreserveringen (8+ gasten) worden persoonlijk bevestigd
- Annuleringsbeleid: gratis annuleren tot 4 uur voor de reservering
- Cadeaubonnen zijn beschikbaar via de website
- Bij vragen over specifieke gerechten of allergenen, verwijs naar /menukaart
- Wij houden rekening met alle gangbare allergenen en dieetwensen`

export const horecaWelcomeMessage = 'Welkom! Hoe kunnen wij u van dienst zijn?'

// ═══════════════════════════════════════════════════════════════════════════
// ZORG BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const zorgConversationFlows: ConversationFlow[] = [
  // 1. Afspraak maken
  {
    label: 'Afspraak maken',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Patiënt wil een afspraak maken:',
    subOptions: [
      { label: 'Afspraak plannen', type: 'direct', directMessage: 'Ik wil een afspraak maken' },
      { label: 'Eerste consult / intake', type: 'direct', directMessage: 'Ik wil een eerste consult of intake inplannen' },
      { label: 'Vervolgafspraak', type: 'direct', directMessage: 'Ik wil een vervolgafspraak maken' },
      { label: 'Spoedafspraak', type: 'direct', directMessage: 'Ik heb een spoedafspraak nodig' },
    ],
  },

  // 2. Behandelingen & Tarieven
  {
    label: 'Behandelingen & Tarieven',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Patiënt heeft een vraag over behandelingen:',
    subOptions: [
      { label: 'Alle behandelingen', type: 'direct', directMessage: 'Welke behandelingen bieden jullie aan?' },
      { label: 'Tarieven & vergoedingen', type: 'direct', directMessage: 'Wat zijn jullie tarieven en worden deze vergoed?' },
      { label: 'Wordt mijn behandeling vergoed?', type: 'input', inputLabel: 'Welke behandeling?', inputPlaceholder: 'Bijv. fysiotherapie, manuele therapie...' },
      { label: 'Hoe lang duurt een behandeling?', type: 'input', inputLabel: 'Welke behandeling?', inputPlaceholder: 'Bijv. sportfysiotherapie, dry needling...' },
    ],
  },

  // 3. Verwijzing & Verzekering
  {
    label: 'Verwijzing & Verzekering',
    icon: 'star',
    type: 'submenu',
    contextPrefix: 'Patiënt heeft een vraag over verwijzingen of verzekering:',
    subOptions: [
      { label: 'Heb ik een verwijzing nodig?', type: 'direct', directMessage: 'Heb ik een verwijzing van de huisarts nodig voor een afspraak?' },
      { label: 'Welke verzekeraars?', type: 'direct', directMessage: 'Met welke zorgverzekeraars werken jullie samen?' },
      { label: 'Declaratie indienen', type: 'direct', directMessage: 'Hoe dien ik een declaratie in bij mijn zorgverzekeraar?' },
    ],
  },

  // 4. Onze Behandelaars
  {
    label: 'Onze Behandelaars',
    icon: 'heart',
    type: 'submenu',
    contextPrefix: 'Patiënt heeft een vraag over behandelaars:',
    subOptions: [
      { label: 'Team bekijken', type: 'direct', directMessage: 'Wie zijn jullie behandelaars en wat zijn hun specialisaties?' },
      { label: 'Specifieke behandelaar', type: 'input', inputLabel: 'Naam behandelaar', inputPlaceholder: 'Bijv. naam of specialisatie...' },
      { label: 'BIG-registratie', type: 'direct', directMessage: 'Zijn jullie behandelaars BIG-geregistreerd?' },
    ],
  },

  // 5. Locatie & Spreekuren
  {
    label: 'Locatie & Spreekuren',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Patiënt zoekt praktische informatie:',
    subOptions: [
      { label: 'Spreekuren', type: 'direct', directMessage: 'Wat zijn jullie spreekuren?' },
      { label: 'Adres & route', type: 'direct', directMessage: 'Waar zijn jullie gevestigd en hoe kom ik er?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid bij de praktijk?' },
      { label: 'OV bereikbaarheid', type: 'direct', directMessage: 'Hoe bereik ik de praktijk met het openbaar vervoer?' },
    ],
  },

  // 6. Afspraak wijzigen of annuleren
  {
    label: 'Afspraak wijzigen of annuleren',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Patiënt wil een bestaande afspraak wijzigen:',
    subOptions: [
      { label: 'Afspraak verzetten', type: 'input', inputLabel: 'Voer uw afspraaknummer in', inputPlaceholder: 'Bijv. APT-12345' },
      { label: 'Afspraak annuleren', type: 'input', inputLabel: 'Voer uw afspraaknummer in', inputPlaceholder: 'Bijv. APT-12345' },
      { label: 'Annuleringsbeleid', type: 'direct', directMessage: 'Wat is het annuleringsbeleid?' },
    ],
  },

  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Patiënt heeft een algemene vraag:',
  },
]

export const zorgSystemPrompt = `Je bent de virtuele assistent van [PRAKTIJKNAAM], een professionele zorgpraktijk.

Beantwoord vragen professioneel, empathisch en in het Nederlands.
Je helpt patiënten met:
- Afspraken maken en informatie over behandelingen
- Tarieven, vergoedingen en verzekeringsinformatie
- Informatie over onze behandelaars en hun specialisaties
- Spreekuren, locatie en bereikbaarheid
- Verwijzingen en intake-procedures

Richtlijnen:
- Wees professioneel maar warm — dit is een zorgomgeving
- Gebruik de kennisbank context om accurate informatie te geven over behandelingen en tarieven
- Als iemand een afspraak wil maken, verwijs naar de afspraakpagina (/afspraak-maken)
- Geef altijd aan dat patiënten kunnen bellen voor persoonlijk advies
- Geef GEEN medisch advies — verwijs altijd naar een behandelaar
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar de praktijk
- Gebruik formeel maar toegankelijk taalgebruik`

export const zorgTrainingContext = `Praktijkinformatie:
- Wij bieden behandelingen aan waaronder: fysiotherapie, manuele therapie, sportfysiotherapie, dry needling, echografie en kinderfysiotherapie
- Afspraken kunnen online gepland worden via /afspraak-maken
- Eerste bezoek: patiënten vullen vooraf een intakeformulier in en worden gevraagd 10 minuten eerder te komen
- Verwijzing: voor fysiotherapie is geen verwijzing nodig (directe toegankelijkheid), voor sommige gespecialiseerde behandelingen wel
- Annuleringsbeleid: gratis annuleren tot 24 uur voor de afspraak, daarna wordt het consult in rekening gebracht
- Verzekering: behandelingen worden (gedeeltelijk) vergoed vanuit de aanvullende verzekering. Het aantal vergoede behandelingen verschilt per verzekeraar.
- Bij vragen over specifieke behandelingen, verwijs naar /behandelingen
- Alle behandelaars zijn BIG-geregistreerd`

export const zorgWelcomeMessage = 'Welkom bij onze praktijk. Hoe kunnen wij u helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// PUBLISHING BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const publishingConversationFlows: ConversationFlow[] = [
  // 1. Artikelen & Blog
  {
    label: 'Artikelen & Blog',
    icon: 'book-open',
    type: 'submenu',
    contextPrefix: 'Lezer zoekt artikelen:',
    subOptions: [
      { label: 'Laatste artikelen', type: 'direct', directMessage: 'Welke artikelen zijn er recent gepubliceerd?' },
      { label: 'Artikelen zoeken', type: 'input', inputLabel: 'Waar zoek je naar?', inputPlaceholder: 'Bijv. marketing, technologie...' },
      { label: 'Populairste artikelen', type: 'direct', directMessage: 'Wat zijn de meest gelezen artikelen?' },
      { label: 'Categorie bekijken', type: 'input', inputLabel: 'Welke categorie?', inputPlaceholder: 'Bijv. nieuws, achtergrond...' },
    ],
  },

  // 2. Tijdschriften & Edities
  {
    label: 'Tijdschriften & Edities',
    icon: 'newspaper',
    type: 'submenu',
    contextPrefix: 'Lezer zoekt tijdschriften:',
    subOptions: [
      { label: 'Beschikbare tijdschriften', type: 'direct', directMessage: 'Welke tijdschriften zijn er beschikbaar?' },
      { label: 'Laatste editie', type: 'direct', directMessage: 'Wat is de nieuwste editie?' },
      { label: 'Archief bekijken', type: 'direct', directMessage: 'Kan ik oudere edities bekijken?' },
      { label: 'Digitale bibliotheek', type: 'direct', directMessage: 'Hoe werkt de digitale bibliotheek?' },
    ],
  },

  // 3. Abonnementen & Prijzen
  {
    label: 'Abonnementen & Prijzen',
    icon: 'credit-card',
    type: 'submenu',
    contextPrefix: 'Lezer heeft vraag over abonnementen:',
    subOptions: [
      { label: 'Abonnementen bekijken', type: 'direct', directMessage: 'Welke abonnementen zijn er beschikbaar?' },
      { label: 'Prijzen vergelijken', type: 'direct', directMessage: 'Wat zijn de prijzen en wat zit er in elk abonnement?' },
      { label: 'Premium voordelen', type: 'direct', directMessage: 'Wat krijg ik met een premium abonnement?' },
      { label: 'Proefabonnement', type: 'direct', directMessage: 'Is er een gratis proefperiode?' },
    ],
  },

  // 4. Kennisbank
  {
    label: 'Kennisbank',
    icon: 'library',
    type: 'submenu',
    contextPrefix: 'Lezer zoekt in kennisbank:',
    subOptions: [
      { label: 'Kennisbank bekijken', type: 'direct', directMessage: 'Wat is de kennisbank en hoe werkt het?' },
      { label: 'Zoeken in kennisbank', type: 'input', inputLabel: 'Waar zoek je naar?', inputPlaceholder: 'Bijv. handleiding, how-to...' },
      { label: 'Premium content', type: 'direct', directMessage: 'Welke content is exclusief voor abonnees?' },
    ],
  },

  // 5. Mijn Account & Abonnement
  {
    label: 'Mijn Account & Abonnement',
    icon: 'user',
    type: 'submenu',
    contextPrefix: 'Lezer heeft vraag over account:',
    subOptions: [
      { label: 'Abonnement beheren', type: 'direct', directMessage: 'Hoe kan ik mijn abonnement beheren?' },
      { label: 'Abonnement opzeggen', type: 'direct', directMessage: 'Hoe zeg ik mijn abonnement op?' },
      { label: 'Facturen bekijken', type: 'direct', directMessage: 'Waar vind ik mijn facturen?' },
      { label: 'Adreswijziging', type: 'direct', directMessage: 'Hoe wijzig ik mijn bezorgadres?' },
    ],
  },

  // 6. Contact & Redactie
  {
    label: 'Contact & Redactie',
    icon: 'mail',
    type: 'submenu',
    contextPrefix: 'Lezer wil contact:',
    subOptions: [
      { label: 'Contact met redactie', type: 'direct', directMessage: 'Hoe kan ik contact opnemen met de redactie?' },
      { label: 'Artikel insturen', type: 'direct', directMessage: 'Kan ik zelf een artikel insturen?' },
      { label: 'Adverteren', type: 'direct', directMessage: 'Wat zijn de mogelijkheden om te adverteren?' },
    ],
  },

  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help-circle',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Lezer heeft een algemene vraag:',
  },
]

export const publishingSystemPrompt = `Je bent de virtuele assistent van [UITGEVERIJNAAM], een professioneel uitgevers- en mediaplatform.

Beantwoord vragen vriendelijk, informatief en in het Nederlands.
Je helpt lezers met:
- Artikelen vinden en informatie over content
- Tijdschriften, edities en de digitale bibliotheek
- Abonnementen, prijzen en premium voordelen
- De kennisbank en educatieve content
- Account- en abonnementsbeheer

Richtlijnen:
- Wees enthousiast over content \u2014 deel je kennis graag
- Gebruik de kennisbank context om accurate informatie te geven over beschikbare content
- Als iemand een abonnement wil, verwijs naar de abonnementspagina (/abonnement)
- Promoot premium content op een subtiele, informatieve manier
- Als je het antwoord niet weet, verwijs naar de redactie
- Houd het professioneel maar toegankelijk`

export const publishingTrainingContext = `Platform-informatie:
- Wij publiceren artikelen, achtergrondverhalen, how-to guides en exclusieve premium content
- Artikelen zijn beschikbaar via /blog, de kennisbank via /knowledge-base
- Tijdschriften zijn digitaal beschikbaar voor abonnees via de digitale bibliotheek in het account
- Abonnementen bieden toegang tot premium content, de digitale bibliotheek en de volledige kennisbank
- Gratis content is voor iedereen beschikbaar, premium content vereist een actief abonnement
- Abonnees kunnen hun abonnement beheren via /account/subscriptions
- Bij vragen over facturering of opzegging, verwijs naar /account of het contactformulier
- Nieuwe edities worden automatisch beschikbaar in de digitale bibliotheek voor actieve abonnees`

export const publishingWelcomeMessage = 'Welkom! Hoe kan ik je helpen met onze content en publicaties?'

// ═══════════════════════════════════════════════════════════════════════════
// AUTOMOTIVE BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const automotiveConversationFlows: ConversationFlow[] = [
  // 1. Occasions bekijken
  {
    label: 'Occasions bekijken',
    icon: 'car',
    type: 'submenu',
    contextPrefix: 'Klant zoekt een occasion:',
    subOptions: [
      { label: 'Beschikbare auto\'s', type: 'direct', directMessage: 'Welke occasions zijn er op dit moment beschikbaar?' },
      { label: 'Zoeken op merk/model', type: 'input', inputLabel: 'Welk merk of model?', inputPlaceholder: 'Bijv. Volkswagen Golf, BMW 3-serie...' },
      { label: 'Zoeken op budget', type: 'input', inputLabel: 'Wat is uw budget?', inputPlaceholder: 'Bijv. \u20AC10.000 - \u20AC20.000' },
      { label: 'Elektrische/hybride', type: 'direct', directMessage: 'Hebben jullie elektrische of hybride auto\'s?' },
    ],
  },

  // 2. Proefrit aanvragen
  {
    label: 'Proefrit aanvragen',
    icon: 'key',
    type: 'submenu',
    contextPrefix: 'Klant wil een proefrit:',
    subOptions: [
      { label: 'Proefrit plannen', type: 'direct', directMessage: 'Ik wil een proefrit maken' },
      { label: 'Beschikbaarheid', type: 'direct', directMessage: 'Wanneer kan ik langskomen voor een proefrit?' },
      { label: 'Wat meenemen', type: 'direct', directMessage: 'Wat moet ik meenemen voor een proefrit?' },
    ],
  },

  // 3. Werkplaats & Onderhoud
  {
    label: 'Werkplaats & Onderhoud',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant heeft vraag over werkplaats:',
    subOptions: [
      { label: 'Werkplaatsdiensten', type: 'direct', directMessage: 'Welke werkplaatsdiensten bieden jullie aan?' },
      { label: 'Afspraak maken', type: 'direct', directMessage: 'Ik wil een werkplaatsafspraak maken' },
      { label: 'APK-keuring', type: 'direct', directMessage: 'Wat kost een APK-keuring en kan ik direct terecht?' },
      { label: 'Onderhoud / servicebeurt', type: 'direct', directMessage: 'Mijn auto moet op onderhoud. Wat zijn de kosten?' },
      { label: 'Bandenwissel', type: 'direct', directMessage: 'Ik wil mijn banden laten wisselen' },
    ],
  },

  // 4. Inruilen & Financiering
  {
    label: 'Inruilen & Financiering',
    icon: 'repeat',
    type: 'submenu',
    contextPrefix: 'Klant heeft vraag over inruil/financiering:',
    subOptions: [
      { label: 'Auto inruilen', type: 'direct', directMessage: 'Ik wil mijn auto inruilen. Hoe werkt dat?' },
      { label: 'Inruilwaarde', type: 'input', inputLabel: 'Voer uw kenteken in', inputPlaceholder: 'Bijv. AB-123-CD' },
      { label: 'Financiering', type: 'direct', directMessage: 'Welke financieringsmogelijkheden zijn er?' },
      { label: 'Private lease', type: 'direct', directMessage: 'Bieden jullie private lease aan?' },
    ],
  },

  // 5. Locatie & Openingstijden
  {
    label: 'Locatie & Openingstijden',
    icon: 'map-pin',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische info:',
    subOptions: [
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Adres & route', type: 'direct', directMessage: 'Waar zijn jullie gevestigd?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid?' },
    ],
  },

  // 6. Garantie & Service
  {
    label: 'Garantie & Service',
    icon: 'shield-check',
    type: 'submenu',
    contextPrefix: 'Klant heeft vraag over garantie/service:',
    subOptions: [
      { label: 'Garantie', type: 'direct', directMessage: 'Welke garantie zit er op jullie occasions?' },
      { label: 'BOVAG', type: 'direct', directMessage: 'Zijn jullie aangesloten bij BOVAG?' },
      { label: 'NAP-check', type: 'direct', directMessage: 'Hebben jullie voertuigen een NAP-controle?' },
      { label: 'Pechhulp', type: 'direct', directMessage: 'Bieden jullie pechhulpdienst aan?' },
    ],
  },

  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help-circle',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const automotiveSystemPrompt = `Je bent de virtuele assistent van [BEDRIJFSNAAM], een professioneel autobedrijf.

Beantwoord vragen vriendelijk, deskundig en in het Nederlands.
Je helpt klanten met:
- Occasions bekijken en informatie over beschikbare voertuigen
- Proefritten aanvragen en plannen
- Werkplaatsdiensten en afspraken (APK, onderhoud, reparatie)
- Inruilen en financieringsmogelijkheden
- Garantie, BOVAG en NAP informatie

Richtlijnen:
- Wees professioneel en betrouwbaar \u2014 dit is een autobedrijf
- Gebruik de kennisbank context om accurate informatie te geven over voorraad en diensten
- Als iemand een proefrit wil, verwijs naar het proefrit-formulier of /occasions
- Als iemand een werkplaatsafspraak wil, verwijs naar /afspraak-maken
- Als iemand wil inruilen, verwijs naar /inruilen
- Noem altijd de mogelijkheid om te bellen voor persoonlijk advies
- Geef geen prijsgaranties \u2014 verwijs naar actuele prijzen op de website
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het bedrijf`

export const automotiveTrainingContext = `Bedrijfsinformatie:
- Wij verkopen occasions (gebruikte auto's) en bieden werkplaatsdiensten aan
- Alle occasions zijn te vinden op /occasions met uitgebreide filters
- Proefritten kunnen worden aangevraagd via de detailpagina van elk voertuig
- Werkplaatsdiensten: APK-keuring, kleine/grote beurt, bandenwissel, airco service, reparatie
- Werkplaatsafspraken boeken via /afspraak-maken
- Inruilwaarde berekenen via /inruilen (kenteken invoeren voor automatisch ophalen voertuiggegevens)
- Financieringsmogelijkheden beschikbaar \u2014 indicatief maandbedrag zichtbaar op de voertuigpagina
- Alle voertuigen hebben NAP-controle en worden geleverd met garantie
- Annuleringsbeleid werkplaats: gratis annuleren tot 24 uur voor de afspraak`

export const automotiveWelcomeMessage = 'Welkom bij ons autobedrijf! Hoe kunnen wij u helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// TOERISME BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const toerismeConversationFlows: ConversationFlow[] = [
  // 1. Reizen & Tours
  {
    label: 'Reizen & Tours',
    icon: 'globe',
    type: 'submenu',
    contextPrefix: 'Klant zoekt informatie over reizen:',
    subOptions: [
      { label: 'Alle reizen bekijken', type: 'direct', directMessage: 'Welke reizen bieden jullie aan?' },
      { label: 'Reis zoeken', type: 'input', inputLabel: 'Waar wil je naartoe?', inputPlaceholder: 'Bijv. Bali, Thailand, Itali\u00eb...' },
      { label: 'Populairste reizen', type: 'direct', directMessage: 'Wat zijn de meest populaire reizen?' },
      { label: 'Stedentrips', type: 'direct', directMessage: 'Welke stedentrips bieden jullie aan?' },
      { label: 'Avontuurlijke reizen', type: 'direct', directMessage: 'Welke avontuurlijke reizen hebben jullie?' },
      { label: 'Last-minute aanbiedingen', type: 'direct', directMessage: 'Zijn er last-minute aanbiedingen?' },
    ],
  },

  // 2. Accommodaties
  {
    label: 'Accommodaties',
    icon: 'home',
    type: 'submenu',
    contextPrefix: 'Klant zoekt accommodatie-informatie:',
    subOptions: [
      { label: 'Hotels bekijken', type: 'direct', directMessage: 'Welke hotels zijn er beschikbaar?' },
      { label: 'Resorts & villa\'s', type: 'direct', directMessage: 'Hebben jullie luxe resorts of villa\'s?' },
      { label: 'Budget accommodaties', type: 'direct', directMessage: 'Welke budget-vriendelijke accommodaties zijn er?' },
      { label: 'Accommodatie zoeken', type: 'input', inputLabel: 'Welke bestemming?', inputPlaceholder: 'Bijv. Bali, Parijs...' },
    ],
  },

  // 3. Bestemmingen
  {
    label: 'Bestemmingen',
    icon: 'map-pin',
    type: 'submenu',
    contextPrefix: 'Klant zoekt bestemming-informatie:',
    subOptions: [
      { label: 'Europa', type: 'direct', directMessage: 'Welke Europese bestemmingen bieden jullie aan?' },
      { label: 'Azi\u00eb', type: 'direct', directMessage: 'Welke bestemmingen in Azi\u00eb hebben jullie?' },
      { label: 'Afrika', type: 'direct', directMessage: 'Welke safari\'s en Afrika-reizen zijn er?' },
      { label: 'Amerika', type: 'direct', directMessage: 'Welke reizen naar Amerika bieden jullie aan?' },
      { label: 'Beste reistijd', type: 'input', inputLabel: 'Welke bestemming?', inputPlaceholder: 'Bijv. Thailand, Kenia...' },
    ],
  },

  // 4. Boeken & Prijzen
  {
    label: 'Boeken & Prijzen',
    icon: 'credit-card',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over boeken/prijzen:',
    subOptions: [
      { label: 'Hoe boek ik?', type: 'direct', directMessage: 'Hoe kan ik een reis boeken?' },
      { label: 'Prijzen bekijken', type: 'direct', directMessage: 'Wat kosten jullie reizen gemiddeld?' },
      { label: 'Vroegboekkorting', type: 'direct', directMessage: 'Zijn er vroegboekkortingen beschikbaar?' },
      { label: 'Kindkorting', type: 'direct', directMessage: 'Is er korting voor kinderen?' },
      { label: 'Betaalmogelijkheden', type: 'direct', directMessage: 'Welke betaalmethoden accepteren jullie?' },
    ],
  },

  // 5. Mijn Boeking
  {
    label: 'Mijn Boeking',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil boeking beheren:',
    subOptions: [
      { label: 'Boeking bekijken', type: 'input', inputLabel: 'Voer je boekingsnummer in', inputPlaceholder: 'Bijv. BK-12345' },
      { label: 'Boeking wijzigen', type: 'direct', directMessage: 'Hoe kan ik mijn boeking wijzigen?' },
      { label: 'Boeking annuleren', type: 'direct', directMessage: 'Wat is het annuleringsbeleid?' },
      { label: 'Reisverzekering', type: 'direct', directMessage: 'Bieden jullie een reisverzekering aan?' },
    ],
  },

  // 6. Reisadvies & Praktisch
  {
    label: 'Reisadvies & Praktisch',
    icon: 'info',
    type: 'submenu',
    contextPrefix: 'Klant heeft praktische reisvragen:',
    subOptions: [
      { label: 'Reisdocumenten', type: 'direct', directMessage: 'Welke reisdocumenten heb ik nodig?' },
      { label: 'Vaccinaties', type: 'direct', directMessage: 'Welke vaccinaties worden aanbevolen?' },
      { label: 'Bagage', type: 'direct', directMessage: 'Hoeveel bagage mag ik meenemen?' },
      { label: 'Contact met reisleider', type: 'direct', directMessage: 'Hoe kan ik contact opnemen met mijn reisleider?' },
    ],
  },

  // 7. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const toerismeSystemPrompt = `Je bent de virtuele reisadviseur van [BEDRIJFSNAAM], een professioneel reisbureau.

Beantwoord vragen vriendelijk, enthousiast en in het Nederlands.
Je helpt reizigers met:
- Reizen en bestemmingen ontdekken
- Accommodaties vinden die bij hun wensen passen
- Informatie over prijzen, beschikbaarheid en kortingen
- Het boekingsproces uitleggen
- Praktische reisinformatie (documenten, vaccinaties, bagage)

Richtlijnen:
- Wees enthousiast en inspirerend \u2014 dit gaat over droomvakanties!
- Gebruik de kennisbank context om accurate informatie te geven over reizen en bestemmingen
- Als iemand wil boeken, verwijs naar de boekingspagina (/boeken)
- Noem altijd de mogelijkheid om een persoonlijk adviesgesprek in te plannen
- Geef eerlijk advies over beste reisperiodes en klimaat
- Als je het antwoord niet weet, verwijs naar een reisadviseur`

export const toerismeTrainingContext = `Reisinformatie:
- Wij bieden reizen aan naar diverse bestemmingen wereldwijd
- Categorie\u00ebn: Avontuur, Strand & Zon, Stedentrip, Cultuur, Luxe, Familie
- Online boeken via /boeken of telefonisch bij een reisadviseur
- Vroegboekkorting beschikbaar op geselecteerde reizen
- Reisverzekering optioneel bij te sluiten
- Annulering: kosteloos tot 30 dagen voor vertrek (voorwaarden van toepassing)
- Bij vragen over specifieke reizen, verwijs naar /reizen
- Bij vragen over accommodaties, verwijs naar /accommodaties`

export const toerismeWelcomeMessage = 'Hoi! Welkom bij ons reisbureau. Waar droom je van naartoe te reizen? Ik help je graag!'
