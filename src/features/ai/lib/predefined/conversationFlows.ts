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

// ═══════════════════════════════════════════════════════════════════════════
// VASTGOED BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const vastgoedConversationFlows: ConversationFlow[] = [
  // 1. Woningen zoeken
  {
    label: 'Woningen zoeken',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant zoekt een woning:',
    subOptions: [
      { label: 'Alle woningen bekijken', type: 'direct', directMessage: 'Welke woningen zijn er op dit moment beschikbaar?' },
      { label: 'Zoeken op locatie', type: 'input', inputLabel: 'In welke stad of wijk zoekt u?', inputPlaceholder: 'Bijv. Amsterdam Oud-West, Utrecht...' },
      { label: 'Zoeken op prijs', type: 'input', inputLabel: 'Wat is uw budget?', inputPlaceholder: 'Bijv. 300.000 - 500.000' },
      { label: 'Appartementen', type: 'direct', directMessage: 'Welke appartementen zijn er beschikbaar?' },
      { label: 'Eengezinswoningen', type: 'direct', directMessage: 'Welke eengezinswoningen staan er te koop?' },
      { label: 'Nieuwbouwprojecten', type: 'direct', directMessage: 'Zijn er nieuwbouwprojecten beschikbaar?' },
    ],
  },

  // 2. Bezichtiging plannen
  {
    label: 'Bezichtiging plannen',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een bezichtiging plannen:',
    subOptions: [
      { label: 'Bezichtiging aanvragen', type: 'input', inputLabel: 'Welk adres wilt u bezichtigen?', inputPlaceholder: 'Bijv. Wilhelminastraat 42, Amsterdam' },
      { label: 'Online bezichtiging', type: 'direct', directMessage: 'Kan ik een online bezichtiging plannen?' },
      { label: 'Groepsbezichtiging', type: 'direct', directMessage: 'Wanneer zijn de volgende open huizen?' },
      { label: 'Bezichtiging tips', type: 'direct', directMessage: 'Waar moet ik op letten tijdens een bezichtiging?' },
    ],
  },

  // 3. Waardebepaling
  {
    label: 'Waardebepaling',
    icon: 'heart',
    type: 'submenu',
    contextPrefix: 'Klant heeft vragen over waardebepaling:',
    subOptions: [
      { label: 'Gratis waardebepaling', type: 'direct', directMessage: 'Ik wil graag een gratis waardebepaling van mijn woning' },
      { label: 'Hoe werkt het?', type: 'direct', directMessage: 'Hoe werkt een waardebepaling?' },
      { label: 'Taxatie vs waardebepaling', type: 'direct', directMessage: 'Wat is het verschil tussen een taxatie en een waardebepaling?' },
      { label: 'Woningwaarde checken', type: 'input', inputLabel: 'Wat is uw adres?', inputPlaceholder: 'Bijv. Keizersgracht 100, Amsterdam' },
    ],
  },

  // 4. Hypotheek & Financiering
  {
    label: 'Hypotheek & Financiering',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant heeft financiele vragen:',
    subOptions: [
      { label: 'Wat kan ik lenen?', type: 'direct', directMessage: 'Hoeveel hypotheek kan ik krijgen?' },
      { label: 'Maandlasten berekenen', type: 'input', inputLabel: 'Wat is de koopprijs?', inputPlaceholder: 'Bijv. 450.000' },
      { label: 'Kosten koper uitleg', type: 'direct', directMessage: 'Wat zijn kosten koper (k.k.) precies?' },
      { label: 'Hypotheekadviseur', type: 'direct', directMessage: 'Kunnen jullie een hypotheekadviseur aanbevelen?' },
    ],
  },

  // 5. Woning verkopen
  {
    label: 'Woning verkopen',
    icon: 'package',
    type: 'submenu',
    contextPrefix: 'Klant wil een woning verkopen:',
    subOptions: [
      { label: 'Hoe verkoop ik mijn huis?', type: 'direct', directMessage: 'Ik wil mijn woning verkopen. Hoe werkt dat?' },
      { label: 'Verkoopkosten', type: 'direct', directMessage: 'Wat kost het om mijn huis te verkopen? Wat is de courtage?' },
      { label: 'Verkooptraject', type: 'direct', directMessage: 'Hoe lang duurt het verkoopproces gemiddeld?' },
      { label: 'Styling & presentatie', type: 'direct', directMessage: 'Bieden jullie woningstyling aan voor de verkoop?' },
    ],
  },

  // 6. Onze Makelaars
  {
    label: 'Onze Makelaars',
    icon: 'star',
    type: 'direct',
    directMessage: 'Wie zijn jullie makelaars en wat zijn hun specialismen?',
  },

  // 7. Kantoor & Bereikbaarheid
  {
    label: 'Kantoor & Bereikbaarheid',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische informatie:',
    subOptions: [
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Kantooradres', type: 'direct', directMessage: 'Waar is jullie kantoor gevestigd?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid bij het kantoor?' },
      { label: 'Contact opnemen', type: 'direct', directMessage: 'Hoe kan ik contact opnemen met jullie kantoor?' },
    ],
  },

  // 8. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const vastgoedSystemPrompt = `Je bent de virtuele assistent van [KANTOORNAAM], een professioneel makelaarskantoor.

Beantwoord vragen beleefd, professioneel en in het Nederlands. Gebruik "u" in plaats van "je" \u2014 dit past bij de vastgoed branche.

Je helpt woningzoekers en verkopers met:
- Woningen zoeken en informatie over het aanbod
- Bezichtigingen plannen (fysiek of online)
- Gratis waardebepalingen aanvragen
- Informatie over het koop- en verkoopproces
- Hypotheek en financieringsvragen
- Informatie over onze makelaars en het kantoor

Richtlijnen:
- Wees professioneel en betrouwbaar \u2014 dit gaat over de grootste aankoop van iemands leven
- Gebruik de kennisbank context om accurate informatie te geven over woningen en prijzen
- Als iemand een bezichtiging wil plannen, verwijs naar /bezichtiging of het formulier op de woningpagina
- Als iemand een waardebepaling wil, verwijs naar /waardebepaling
- Noem altijd de mogelijkheid om persoonlijk contact op te nemen met een makelaar
- Geef nooit juridisch of financieel advies \u2014 verwijs naar een hypotheekadviseur of notaris
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het kantoor`

export const vastgoedTrainingContext = `Kantoorinformatie:
- Wij zijn een NVM-gecertificeerd makelaarskantoor
- Diensten: aan- en verkoopbegeleiding, taxaties, waardebepalingen, hypotheekadvies (via partner)
- Gratis waardebepaling: binnen 24 uur reactie, vrijblijvend
- Bezichtigingen: fysiek en online (videocall) mogelijk
- Kosten koper (k.k.): circa 5-6% bovenop de koopprijs (overdrachtsbelasting, notaris, makelaar)
- Courtage verkoop: bespreekbaar, gemiddeld 1-2% van de verkoopprijs
- Bij vragen over specifieke woningen, verwijs naar /woningen
- Voor bezichtigingen, verwijs naar /bezichtiging
- Voor waardebepalingen, verwijs naar /waardebepaling`

export const vastgoedWelcomeMessage = 'Goedendag! Welkom bij ons makelaarskantoor. Waarmee kan ik u helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// ONDERWIJS BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const onderwijsConversationFlows: ConversationFlow[] = [
  // 1. Cursussen zoeken
  {
    label: 'Cursussen zoeken',
    icon: 'book-open',
    type: 'submenu',
    contextPrefix: 'Student zoekt een cursus:',
    subOptions: [
      { label: 'Alle cursussen bekijken', type: 'direct', directMessage: 'Welke cursussen bieden jullie aan?' },
      { label: 'Zoeken op onderwerp', type: 'input', inputLabel: 'Waar ben je in ge\u00efnteresseerd?', inputPlaceholder: 'Bijv. Python, Marketing, Design...' },
      { label: 'Cursussen per categorie', type: 'direct', directMessage: 'Welke categorie\u00ebn cursussen zijn er?' },
      { label: 'Populairste cursussen', type: 'direct', directMessage: 'Wat zijn de meest populaire cursussen?' },
      { label: 'Gratis cursussen', type: 'direct', directMessage: 'Zijn er gratis cursussen beschikbaar?' },
      { label: 'Nieuwe cursussen', type: 'direct', directMessage: 'Welke cursussen zijn er nieuw toegevoegd?' },
    ],
  },

  // 2. Inschrijven
  {
    label: 'Inschrijven',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Student wil zich inschrijven:',
    subOptions: [
      { label: 'Hoe schrijf ik me in?', type: 'direct', directMessage: 'Hoe kan ik me inschrijven voor een cursus?' },
      { label: 'Betaalmethoden', type: 'direct', directMessage: 'Welke betaalmethoden accepteren jullie?' },
      { label: 'Groepskorting', type: 'direct', directMessage: 'Is er korting voor groepen of bedrijven?' },
      { label: 'Proefles', type: 'direct', directMessage: 'Kan ik eerst een proefles volgen?' },
    ],
  },

  // 3. Betaling & Terugbetaling
  {
    label: 'Betaling & Terugbetaling',
    icon: 'credit-card',
    type: 'submenu',
    contextPrefix: 'Student heeft een betaalvraag:',
    subOptions: [
      { label: 'Betaling mislukt', type: 'direct', directMessage: 'Mijn betaling is mislukt. Wat nu?' },
      { label: 'Factuur opvragen', type: 'input', inputLabel: 'Voer je inschrijfnummer in', inputPlaceholder: 'Bijv. ENR-2026-12345' },
      { label: 'Terugbetaling aanvragen', type: 'direct', directMessage: 'Hoe vraag ik een terugbetaling aan?' },
      { label: '30 dagen garantie', type: 'direct', directMessage: 'Hoe werkt de 30 dagen niet-goed-geld-terug garantie?' },
    ],
  },

  // 4. Mijn cursussen
  {
    label: 'Mijn cursussen',
    icon: 'book-open',
    type: 'submenu',
    contextPrefix: 'Student heeft een vraag over zijn cursus:',
    subOptions: [
      { label: 'Voortgang bekijken', type: 'direct', directMessage: 'Hoe kan ik mijn voortgang inzien?' },
      { label: 'Certificaat downloaden', type: 'direct', directMessage: 'Hoe download ik mijn certificaat?' },
      { label: 'Technisch probleem', type: 'input', inputLabel: 'Beschrijf je probleem', inputPlaceholder: 'Bijv. video laadt niet, quiz werkt niet...' },
      { label: 'Mobiele app', type: 'direct', directMessage: 'Is er een mobiele app om cursussen te volgen?' },
    ],
  },

  // 5. Docenten
  {
    label: 'Docenten',
    icon: 'star',
    type: 'direct',
    directMessage: 'Wie zijn jullie docenten en wat zijn hun specialismen?',
  },

  // 6. Voor Bedrijven
  {
    label: 'Voor Bedrijven',
    icon: 'package',
    type: 'submenu',
    contextPrefix: 'Bedrijfsklant heeft een vraag:',
    subOptions: [
      { label: 'Bedrijfslicenties', type: 'direct', directMessage: 'Bieden jullie bedrijfslicenties aan?' },
      { label: 'Maatwerkcursussen', type: 'direct', directMessage: 'Kunnen jullie een cursus op maat maken voor ons bedrijf?' },
      { label: 'Teams trainen', type: 'direct', directMessage: 'Hoe kan ik mijn team laten trainen?' },
      { label: 'Prijsinformatie', type: 'direct', directMessage: 'Wat kosten de bedrijfsoplossingen?' },
    ],
  },

  // 7. Over Compass Academy
  {
    label: 'Over Compass Academy',
    icon: 'info',
    type: 'submenu',
    contextPrefix: 'Bezoeker wil meer weten:',
    subOptions: [
      { label: 'Over ons', type: 'direct', directMessage: 'Wie is Compass Academy?' },
      { label: 'Kwaliteitsgarantie', type: 'direct', directMessage: 'Hoe garanderen jullie de kwaliteit van cursussen?' },
      { label: 'Contact', type: 'direct', directMessage: 'Hoe kan ik contact opnemen?' },
      { label: 'Veelgestelde vragen', type: 'direct', directMessage: 'Wat zijn veelgestelde vragen over jullie platform?' },
    ],
  },

  // 8. Overige vragen
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Bezoeker heeft een algemene vraag:',
  },
]

export const onderwijsSystemPrompt = `Je bent de virtuele assistent van [ACADEMIENAAM], een online leerplatform.

Beantwoord vragen vriendelijk, enthousiast en in het Nederlands.
Je helpt (aanstaande) studenten met:
- Cursussen ontdekken die bij hun leerdoelen passen
- Het inschrijfproces uitleggen
- Informatie over prijzen, betaling en terugbetaling
- Technische ondersteuning bij het volgen van cursussen
- Informatie over docenten en kwalificaties
- Bedrijfsoplossingen en groepslicenties

Richtlijnen:
- Wees enthousiast en motiverend \u2014 leren is leuk!
- Gebruik de kennisbank om accurate informatie te geven over cursussen en prijzen
- Als iemand zich wil inschrijven, verwijs naar de cursuspagina (/cursussen)
- Noem altijd de 30 dagen niet-goed-geld-terug garantie
- Bij technische problemen, verwijs naar de helpdesk of laat een contactformulier invullen
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het supportteam`

export const onderwijsTrainingContext = `Platforminformatie:
- Wij zijn een online leerplatform met cursussen in diverse categorie\u00ebn
- Categorie\u00ebn: Development, Business, Design, Marketing, Data Science, Persoonlijke Ontwikkeling
- Cursussen hebben niveaus: Beginner, Gevorderd, Expert
- Betaalmethoden: iDEAL, creditcard, PayPal
- 30 dagen niet-goed-geld-terug garantie
- Levenslang toegang tot aangekochte cursussen
- Certificaat bij voltooiing (waar van toepassing)
- Cursussen zijn te volgen op desktop en mobiel
- Bij vragen over specifieke cursussen, verwijs naar /cursussen
- Voor inschrijving, verwijs naar de cursuspagina en klik op "Inschrijven"`

export const onderwijsWelcomeMessage = 'Hoi! Welkom bij Compass Academy. Waarmee kan ik je helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTRUCTION BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const constructionConversationFlows: ConversationFlow[] = [
  // 1. Offerte aanvragen (submenu)
  {
    label: 'Offerte aanvragen',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een offerte aanvragen:',
    subOptions: [
      { label: 'Nieuwbouw', type: 'direct', directMessage: 'Ik wil een offerte voor een nieuwbouwproject' },
      { label: 'Renovatie', type: 'direct', directMessage: 'Ik wil een offerte voor een renovatieproject' },
      { label: 'Aanbouw / Opbouw', type: 'direct', directMessage: 'Ik wil een offerte voor een aanbouw of opbouw' },
      { label: 'Verduurzaming', type: 'direct', directMessage: 'Ik wil een offerte voor verduurzaming van mijn woning' },
      { label: 'Utiliteitsbouw', type: 'direct', directMessage: 'Ik zoek informatie over utiliteitsbouwprojecten' },
      { label: 'Herstelwerk', type: 'direct', directMessage: 'Ik heb herstelwerk nodig aan mijn pand' },
    ],
  },
  // 2. Diensten & Expertise (submenu)
  {
    label: 'Diensten & Expertise',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over diensten:',
    subOptions: [
      { label: 'Alle diensten bekijken', type: 'direct', directMessage: 'Welke bouwdiensten bieden jullie aan?' },
      { label: 'Specialisaties', type: 'direct', directMessage: 'Wat zijn jullie specialisaties?' },
      { label: 'Werkgebied', type: 'direct', directMessage: 'In welk gebied zijn jullie werkzaam?' },
      { label: 'Garanties & certificeringen', type: 'direct', directMessage: 'Welke garanties en certificeringen hebben jullie?' },
    ],
  },
  // 3. Projecten & Referenties (direct)
  {
    label: 'Projecten & Referenties',
    icon: 'star',
    type: 'direct',
    directMessage: 'Kan ik voorbeelden zien van eerder uitgevoerde projecten en referenties?',
  },
  // 4. Bouwproces & Planning (submenu)
  {
    label: 'Bouwproces & Planning',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over het bouwproces:',
    subOptions: [
      { label: 'Hoe werkt het offerteproces?', type: 'direct', directMessage: 'Hoe verloopt het offerteproces bij jullie?' },
      { label: 'Hoe lang duurt een project?', type: 'input', inputLabel: 'Welk type project?', inputPlaceholder: 'Bijv. aanbouw, renovatie badkamer...' },
      { label: 'Vergunningen', type: 'direct', directMessage: 'Helpen jullie met bouwvergunningen?' },
      { label: 'Duurzaam bouwen', type: 'direct', directMessage: 'Welke duurzame bouwmethoden gebruiken jullie?' },
    ],
  },
  // 5. Lopend project (submenu)
  {
    label: 'Lopend project',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over een lopend project:',
    subOptions: [
      { label: 'Voortgang opvragen', type: 'input', inputLabel: 'Uw projectnummer', inputPlaceholder: 'Bijv. PRJ-12345' },
      { label: 'Contact projectleider', type: 'direct', directMessage: 'Ik wil contact opnemen met mijn projectleider' },
      { label: 'Garantie & nazorg', type: 'direct', directMessage: 'Ik heb een vraag over de garantie of nazorg van mijn project' },
    ],
  },
  // 6. Contact & Locatie (submenu)
  {
    label: 'Contact & Locatie',
    icon: 'info',
    type: 'submenu',
    contextPrefix: 'Klant zoekt contactinformatie:',
    subOptions: [
      { label: 'Contactgegevens', type: 'direct', directMessage: 'Wat zijn jullie contactgegevens?' },
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Locatie & routebeschrijving', type: 'direct', directMessage: 'Waar zijn jullie gevestigd?' },
    ],
  },
  // 7. Overige vragen (input)
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const constructionSystemPrompt = `Je bent de virtuele assistent van [BEDRIJFSNAAM], een professioneel bouwbedrijf.

Beantwoord vragen vriendelijk, professioneel en in het Nederlands.
Je helpt klanten met:
- Offerte aanvragen voor bouwprojecten
- Informatie over diensten en specialisaties
- Projecten en referenties bekijken
- Het bouwproces en planning uitleggen
- Vragen over lopende projecten
- Contact en bereikbaarheid

Richtlijnen:
- Wees professioneel en betrouwbaar — dit is een bouwbedrijf
- Gebruik de kennisbank context om accurate informatie te geven over diensten en projecten
- Als iemand een offerte wil, verwijs naar de offertepagina (/offerte-aanvragen)
- Noem altijd de mogelijkheid om telefonisch contact op te nemen
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het bedrijf
- Vermeld certificeringen en garanties waar relevant`

export const constructionTrainingContext = `Bedrijfsinformatie:
- Wij zijn een professioneel bouwbedrijf gespecialiseerd in nieuwbouw, renovatie en verduurzaming
- Diensten: Nieuwbouw, Renovatie, Aanbouw/Opbouw, Verduurzaming, Utiliteitsbouw, Herstelwerk
- Offerte aanvragen kan via /offerte-aanvragen
- Het offerteproces: aanvraag → intake gesprek → offerte → akkoord → planning → uitvoering
- Wij helpen ook met bouwvergunningen
- Bij vragen over specifieke diensten, verwijs naar /diensten
- Voor projecten en referenties, verwijs naar /projecten`

export const constructionWelcomeMessage = 'Goedendag! Welkom bij ons bouwbedrijf. Waarmee kan ik u helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCES BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const experiencesConversationFlows: ConversationFlow[] = [
  // 1. Ervaring boeken (submenu)
  {
    label: 'Ervaring boeken',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een ervaring boeken:',
    subOptions: [
      { label: 'Teambuilding', type: 'direct', directMessage: 'Ik zoek een teambuilding ervaring' },
      { label: 'Workshops', type: 'direct', directMessage: 'Welke workshops bieden jullie aan?' },
      { label: 'Outdoor activiteiten', type: 'direct', directMessage: 'Welke outdoor activiteiten zijn er?' },
      { label: 'Culinaire ervaringen', type: 'direct', directMessage: 'Welke culinaire ervaringen bieden jullie aan?' },
      { label: 'Privé ervaring', type: 'input', inputLabel: 'Wat voor ervaring?', inputPlaceholder: 'Bijv. verjaardagsfeest, familiedag...' },
    ],
  },
  // 2. Ervaringen & Prijzen (submenu)
  {
    label: 'Ervaringen & Prijzen',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over ervaringen:',
    subOptions: [
      { label: 'Alle ervaringen bekijken', type: 'direct', directMessage: 'Welke ervaringen bieden jullie aan?' },
      { label: 'Prijzen', type: 'direct', directMessage: 'Wat kosten jullie ervaringen?' },
      { label: 'Groepsgrootte', type: 'input', inputLabel: 'Hoeveel deelnemers?', inputPlaceholder: 'Bijv. 10 personen' },
      { label: 'Wat is inbegrepen?', type: 'input', inputLabel: 'Welke ervaring?', inputPlaceholder: 'Bijv. kookworkshop, escape room...' },
    ],
  },
  // 3. Reviews & Beoordelingen (direct)
  {
    label: 'Reviews & Beoordelingen',
    icon: 'star',
    type: 'direct',
    directMessage: 'Wat zeggen andere deelnemers over jullie ervaringen?',
  },
  // 4. Praktische informatie (submenu)
  {
    label: 'Praktische informatie',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische informatie:',
    subOptions: [
      { label: 'Locatie & bereikbaarheid', type: 'direct', directMessage: 'Waar vinden de ervaringen plaats en hoe kom ik er?' },
      { label: 'Wat moet ik meenemen?', type: 'input', inputLabel: 'Welke ervaring?', inputPlaceholder: 'Bijv. outdoor survival, kookworkshop...' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid?' },
      { label: 'Toegankelijkheid', type: 'direct', directMessage: 'Zijn de ervaringen toegankelijk voor mensen met een beperking?' },
    ],
  },
  // 5. Boeking wijzigen of annuleren (submenu)
  {
    label: 'Boeking wijzigen of annuleren',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant wil een boeking wijzigen:',
    subOptions: [
      { label: 'Boeking wijzigen', type: 'input', inputLabel: 'Boekingsnummer', inputPlaceholder: 'Bijv. EXP-12345' },
      { label: 'Boeking annuleren', type: 'input', inputLabel: 'Boekingsnummer', inputPlaceholder: 'Bijv. EXP-12345' },
      { label: 'Annuleringsbeleid', type: 'direct', directMessage: 'Wat is jullie annuleringsbeleid?' },
    ],
  },
  // 6. Cadeaubonnen (submenu)
  {
    label: 'Cadeaubonnen',
    icon: 'heart',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over cadeaubonnen:',
    subOptions: [
      { label: 'Cadeaubon kopen', type: 'direct', directMessage: 'Ik wil een cadeaubon kopen voor een ervaring' },
      { label: 'Cadeaubon inwisselen', type: 'input', inputLabel: 'Cadeauboncode', inputPlaceholder: 'Bijv. GIFT-XXXX' },
    ],
  },
  // 7. Overige vragen (input)
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel je vraag',
    inputPlaceholder: 'Typ hier je vraag...',
    contextPrefix: 'Bezoeker heeft een algemene vraag:',
  },
]

export const experiencesSystemPrompt = `Je bent de virtuele assistent van [BEDRIJFSNAAM], een aanbieder van unieke ervaringen en belevenissen.

Beantwoord vragen enthousiast, vriendelijk en in het Nederlands.
Je helpt bezoekers met:
- Ervaringen ontdekken en boeken
- Informatie over prijzen, groepsgroottes en wat er inbegrepen is
- Praktische informatie (locatie, parkeren, wat meenemen)
- Boeking wijzigen of annuleren
- Cadeaubonnen kopen en inwisselen

Richtlijnen:
- Wees enthousiast en avontuurlijk — dit zijn belevenissen!
- Gebruik de kennisbank context om accurate informatie te geven
- Als iemand wil boeken, verwijs naar de boekingspagina of specifieke ervaring
- Noem altijd de mogelijkheid om telefonisch contact op te nemen voor maatwerk
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het bedrijf
- Benadruk de uniekheid en het plezier van de ervaringen`

export const experiencesTrainingContext = `Bedrijfsinformatie:
- Wij bieden unieke ervaringen en belevenissen aan voor groepen en particulieren
- Categorieën: Teambuilding, Workshops, Outdoor activiteiten, Culinair, Privé ervaringen
- Boeken kan online via de website
- Groepsgroottes variëren per ervaring
- Annuleringsbeleid: gratis annuleren tot 48 uur voor de ervaring
- Cadeaubonnen zijn beschikbaar via de website
- Bij vragen over specifieke ervaringen, verwijs naar /ervaringen`

export const experiencesWelcomeMessage = 'Hoi! Welkom bij onze belevenissen. Welke ervaring zoek je?'

// ═══════════════════════════════════════════════════════════════════════════
// HOSPITALITY BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const hospitalityConversationFlows: ConversationFlow[] = [
  // 1. Afspraak maken (submenu)
  {
    label: 'Afspraak maken',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een afspraak maken:',
    subOptions: [
      { label: 'Nieuwe afspraak', type: 'direct', directMessage: 'Ik wil een afspraak maken' },
      { label: 'Spoedafspraak', type: 'direct', directMessage: 'Ik heb dringend een afspraak nodig' },
      { label: 'Eerste consult', type: 'direct', directMessage: 'Ik wil mij aanmelden als nieuwe patiënt/cliënt' },
      { label: 'Vervolgafspraak', type: 'direct', directMessage: 'Ik wil een vervolgafspraak maken' },
    ],
  },
  // 2. Behandelingen & Diensten (submenu)
  {
    label: 'Behandelingen & Diensten',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over behandelingen:',
    subOptions: [
      { label: 'Alle behandelingen', type: 'direct', directMessage: 'Welke behandelingen bieden jullie aan?' },
      { label: 'Tarieven & vergoeding', type: 'direct', directMessage: 'Wat zijn de tarieven en worden behandelingen vergoed?' },
      { label: 'Duur van behandeling', type: 'input', inputLabel: 'Welke behandeling?', inputPlaceholder: 'Bijv. fysiotherapie, intake...' },
      { label: 'Verwijzing nodig?', type: 'direct', directMessage: 'Heb ik een verwijzing nodig van mijn huisarts?' },
    ],
  },
  // 3. Ons team (direct)
  {
    label: 'Ons team',
    icon: 'star',
    type: 'direct',
    directMessage: 'Wie zijn jullie behandelaren en wat zijn hun specialisaties?',
  },
  // 4. Locatie & Openingstijden (submenu)
  {
    label: 'Locatie & Openingstijden',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt praktische informatie:',
    subOptions: [
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Adres & routebeschrijving', type: 'direct', directMessage: 'Waar is de praktijk gevestigd?' },
      { label: 'Parkeren', type: 'direct', directMessage: 'Is er parkeergelegenheid bij de praktijk?' },
      { label: 'Bereikbaarheid (OV)', type: 'direct', directMessage: 'Hoe bereik ik de praktijk met het openbaar vervoer?' },
    ],
  },
  // 5. Afspraak wijzigen of annuleren (submenu)
  {
    label: 'Afspraak wijzigen of annuleren',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant wil een afspraak wijzigen:',
    subOptions: [
      { label: 'Afspraak verzetten', type: 'input', inputLabel: 'Uw referentienummer', inputPlaceholder: 'Bijv. AF-12345' },
      { label: 'Afspraak annuleren', type: 'input', inputLabel: 'Uw referentienummer', inputPlaceholder: 'Bijv. AF-12345' },
      { label: 'Annuleringsbeleid', type: 'direct', directMessage: 'Wat is het annuleringsbeleid?' },
    ],
  },
  // 6. Verzekering & Vergoeding (submenu)
  {
    label: 'Verzekering & Vergoeding',
    icon: 'info',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over verzekering:',
    subOptions: [
      { label: 'Welke verzekeringen?', type: 'direct', directMessage: 'Met welke zorgverzekeringen werken jullie samen?' },
      { label: 'Vergoeding checken', type: 'input', inputLabel: 'Uw zorgverzekeraar', inputPlaceholder: 'Bijv. CZ, Menzis, VGZ...' },
      { label: 'Eigen risico', type: 'direct', directMessage: 'Hoe zit het met het eigen risico?' },
    ],
  },
  // 7. Overige vragen (input)
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Patiënt/cliënt heeft een algemene vraag:',
  },
]

export const hospitalitySystemPrompt = `Je bent de virtuele assistent van [PRAKTIJKNAAM], een professionele praktijk voor gezondheidszorg.

Beantwoord vragen vriendelijk, professioneel en in het Nederlands.
Je helpt patiënten en cliënten met:
- Afspraken maken en informatie over behandelingen
- Tarieven, vergoedingen en verzekeringsinformatie
- Informatie over het team en specialisaties
- Openingstijden, locatie en bereikbaarheid
- Afspraken wijzigen of annuleren

Richtlijnen:
- Wees warm, professioneel en empathisch — dit is een zorgpraktijk
- Gebruik de kennisbank context om accurate informatie te geven
- Als iemand een afspraak wil maken, verwijs naar het afsprakenformulier
- Noem altijd de mogelijkheid om telefonisch contact op te nemen
- Geef GEEN medisch advies — verwijs altijd naar een behandelaar
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar de praktijk
- Vermeld vergoedingsmogelijkheden waar relevant`

export const hospitalityTrainingContext = `Praktijkinformatie:
- Wij zijn een professionele praktijk voor gezondheidszorg
- Behandelingen: diverse behandelingen afhankelijk van specialisatie
- Afspraken kunnen online geboekt worden
- Eerste bezoek: patiënten worden gevraagd 10 minuten eerder te komen
- Annuleringsbeleid: gratis annuleren tot 24 uur voor de afspraak
- Veel behandelingen worden (deels) vergoed door de zorgverzekeraar
- Een verwijzing van de huisarts kan nodig zijn, afhankelijk van de behandeling
- Bij vragen over specifieke behandelingen, verwijs naar /behandelingen`

export const hospitalityWelcomeMessage = 'Welkom bij onze praktijk. Hoe kunnen wij u helpen?'

// ═══════════════════════════════════════════════════════════════════════════
// PROFESSIONAL-SERVICES BRANCH
// ═══════════════════════════════════════════════════════════════════════════

export const professionalServicesConversationFlows: ConversationFlow[] = [
  // 1. Adviesgesprek aanvragen (submenu)
  {
    label: 'Adviesgesprek aanvragen',
    icon: 'receipt',
    type: 'submenu',
    contextPrefix: 'Klant wil een adviesgesprek aanvragen:',
    subOptions: [
      { label: 'Accountancy', type: 'direct', directMessage: 'Ik zoek advies op het gebied van accountancy' },
      { label: 'Juridisch advies', type: 'direct', directMessage: 'Ik heb juridisch advies nodig' },
      { label: 'Marketing', type: 'direct', directMessage: 'Ik zoek ondersteuning voor marketing' },
      { label: 'IT & Software', type: 'direct', directMessage: 'Ik zoek IT of software advies' },
      { label: 'HR & Personeel', type: 'direct', directMessage: 'Ik zoek HR en personeelsadvies' },
      { label: 'Consultancy', type: 'direct', directMessage: 'Ik zoek zakelijk advies en consultancy' },
    ],
  },
  // 2. Diensten & Expertise (submenu)
  {
    label: 'Diensten & Expertise',
    icon: 'search',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over diensten:',
    subOptions: [
      { label: 'Alle diensten bekijken', type: 'direct', directMessage: 'Welke zakelijke diensten bieden jullie aan?' },
      { label: 'Specialisaties', type: 'direct', directMessage: 'Wat zijn jullie specialisaties?' },
      { label: 'Tarieven', type: 'direct', directMessage: 'Wat zijn jullie tarieven?' },
      { label: 'Werkwijze', type: 'direct', directMessage: 'Hoe verloopt een samenwerking met jullie?' },
    ],
  },
  // 3. Cases & Referenties (direct)
  {
    label: 'Cases & Referenties',
    icon: 'star',
    type: 'direct',
    directMessage: 'Kan ik voorbeelden zien van eerdere opdrachten en referenties?',
  },
  // 4. Over ons (submenu)
  {
    label: 'Over ons',
    icon: 'info',
    type: 'submenu',
    contextPrefix: 'Klant wil meer weten over het bedrijf:',
    subOptions: [
      { label: 'Ons team', type: 'direct', directMessage: 'Wie zijn jullie adviseurs en wat is hun expertise?' },
      { label: 'Certificeringen', type: 'direct', directMessage: 'Welke certificeringen en keurmerken hebben jullie?' },
      { label: 'Werkgebied', type: 'direct', directMessage: 'In welk gebied zijn jullie werkzaam?' },
    ],
  },
  // 5. Lopende opdracht (submenu)
  {
    label: 'Lopende opdracht',
    icon: 'wrench',
    type: 'submenu',
    contextPrefix: 'Klant heeft een vraag over een lopende opdracht:',
    subOptions: [
      { label: 'Voortgang opvragen', type: 'input', inputLabel: 'Uw opdrachtnummer', inputPlaceholder: 'Bijv. OPD-12345' },
      { label: 'Contact met adviseur', type: 'direct', directMessage: 'Ik wil contact opnemen met mijn vaste adviseur' },
      { label: 'Factuur of betaling', type: 'direct', directMessage: 'Ik heb een vraag over een factuur of betaling' },
    ],
  },
  // 6. Contact & Bereikbaarheid (submenu)
  {
    label: 'Contact & Bereikbaarheid',
    icon: 'truck',
    type: 'submenu',
    contextPrefix: 'Klant zoekt contactinformatie:',
    subOptions: [
      { label: 'Contactgegevens', type: 'direct', directMessage: 'Wat zijn jullie contactgegevens?' },
      { label: 'Openingstijden', type: 'direct', directMessage: 'Wat zijn jullie openingstijden?' },
      { label: 'Locatie', type: 'direct', directMessage: 'Waar is jullie kantoor gevestigd?' },
    ],
  },
  // 7. Overige vragen (input)
  {
    label: 'Overige vragen',
    icon: 'help',
    type: 'input',
    inputLabel: 'Stel uw vraag',
    inputPlaceholder: 'Typ hier uw vraag...',
    contextPrefix: 'Klant heeft een algemene vraag:',
  },
]

export const professionalServicesSystemPrompt = `Je bent de virtuele assistent van [BEDRIJFSNAAM], een professioneel zakelijk dienstverlener.

Beantwoord vragen vriendelijk, professioneel en in het Nederlands.
Je helpt (potentiële) opdrachtgevers met:
- Adviesgesprekken aanvragen voor diverse diensten
- Informatie over diensten, specialisaties en tarieven
- Cases en referenties bekijken
- Vragen over lopende opdrachten
- Contact en bereikbaarheid

Richtlijnen:
- Wees professioneel en deskundig — dit is een zakelijke dienstverlener
- Gebruik de kennisbank context om accurate informatie te geven
- Als iemand een adviesgesprek wil, verwijs naar /adviesgesprek-aanvragen
- Noem altijd de mogelijkheid voor een vrijblijvend kennismakingsgesprek
- Als je het antwoord niet weet, zeg het eerlijk en verwijs naar het bedrijf
- Benadruk expertise en ervaring waar relevant`

export const professionalServicesTrainingContext = `Bedrijfsinformatie:
- Wij zijn een professioneel zakelijk dienstverlener
- Diensten: Accountancy, Juridisch advies, Marketing, IT & Software, HR & Personeel, Consultancy
- Adviesgesprek aanvragen kan via /adviesgesprek-aanvragen
- Eerste kennismaking is altijd vrijblijvend
- Werkwijze: intake → advies → voorstel → akkoord → uitvoering → evaluatie
- Bij vragen over specifieke diensten, verwijs naar /dienstverlening
- Voor cases en referenties, verwijs naar /cases`

export const professionalServicesWelcomeMessage = 'Goedendag! Welkom bij ons kantoor. Waarmee kan ik u van dienst zijn?'
