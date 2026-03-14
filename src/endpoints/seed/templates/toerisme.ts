import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  toerismeConversationFlows,
  toerismeSystemPrompt,
  toerismeTrainingContext,
  toerismeWelcomeMessage,
} from '@/features/ai/lib/predefined/conversationFlows'

/**
 * Lexical rich-text helper — wraps plain text in a valid Lexical root structure
 */
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ text }],
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Seed Toerisme Content
 *
 * Seeds: 4 destinations, 6 tours, 4 accommodations,
 * 2 team members (content-team), chatbot-settings global.
 */
export async function seedToerisme(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // BESTEMMINGEN (destinations)
  // ==========================================================================
  payload.logger.info('      Seeding destinations...')

  const destinations = [
    {
      name: 'Thailand',
      slug: 'thailand',
      country: 'Thailand',
      continent: 'azie',
      icon: '\uD83C\uDF34',
      bestSeason: 'November - maart',
      climate: 'Tropisch, 25-35\u00B0C',
      description: 'Thailand is een van de meest geliefde bestemmingen in Zuidoost-Azi\u00eb. Van paradijselijke stranden en kristalhelder water tot bruisende steden en eeuwenoude tempels. Proef de beroemde Thaise keuken, ontdek de hartelijke gastvrijheid en geniet van tropische eilanden als Koh Samui, Phuket en Koh Phi Phi.',
      featured: true,
    },
    {
      name: 'Frankrijk',
      slug: 'frankrijk',
      country: 'Frankrijk',
      continent: 'europa',
      icon: '\uD83D\uDDFC',
      bestSeason: 'Mei - september',
      climate: 'Gematigd, 15-30\u00B0C',
      description: 'Frankrijk biedt een onge\u00ebvenaarde combinatie van cultuur, gastronomie en landschap. Van de romantische straten van Parijs tot de lavendelvelden van de Provence, de wijngaarden van Bordeaux en de glamour van de C\u00f4te d\'Azur. Een bestemming die elke reiziger betoovert.',
      featured: true,
    },
    {
      name: 'Kenia',
      slug: 'kenia',
      country: 'Kenia',
      continent: 'afrika',
      icon: '\uD83E\uDD81',
      bestSeason: 'Juli - oktober',
      climate: 'Tropisch, 20-30\u00B0C',
      description: 'Kenia is de ultieme safari-bestemming. Beleef de indrukwekkende wildernis van de Masai Mara, spot de Big Five en bewonder de adembenemende Great Rift Valley. Combineer uw safari met een strandvakantie aan de tropische kust van Mombasa en Diani Beach.',
      featured: true,
    },
    {
      name: 'Itali\u00eb',
      slug: 'italie',
      country: 'Itali\u00eb',
      continent: 'europa',
      icon: '\uD83C\uDFDB\uFE0F',
      bestSeason: 'April - oktober',
      climate: 'Mediterraan, 15-35\u00B0C',
      description: 'Itali\u00eb is een land van kunst, geschiedenis en culinaire genoegens. Ontdek het Colosseum in Rome, vaar door de kanalen van Veneti\u00eb, bewonder de kunstschatten van Florence en geniet van de Toscaanse heuvels. Itali\u00eb is een feest voor alle zintuigen.',
      featured: false,
    },
  ]

  // Store destination IDs for tour relationships
  const destinationIds: Record<string, number> = {}

  for (const dest of destinations) {
    if (!(await checkExistingContent(payload, 'destinations', dest.slug))) {
      try {
        const created = await payload.create({
          collection: 'destinations',
          data: {
            name: dest.name,
            slug: dest.slug,
            country: dest.country,
            continent: dest.continent,
            icon: dest.icon,
            bestSeason: dest.bestSeason,
            climate: dest.climate,
            description: richText(dest.description),
            featured: dest.featured,
          } as any,
        })
        destinationIds[dest.slug] = created.id as number
        result.collections['destinations'] = (result.collections['destinations'] || 0) + 1
        payload.logger.info(`      + ${dest.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create destination "${dest.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${dest.name} (exists)`)
      // Fetch the existing destination ID
      try {
        const existing = await payload.find({
          collection: 'destinations',
          where: { slug: { equals: dest.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          destinationIds[dest.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // REIZEN (tours)
  // ==========================================================================
  payload.logger.info('      Seeding tours...')

  const tours = [
    {
      title: 'Paradijselijk Bali',
      slug: 'paradijselijk-bali',
      destinationSlug: 'thailand',
      shortDescription: 'Ontdek het tropische paradijs Bali met zijn rijstterrassen, tempels, stranden en unieke cultuur. Een onvergetelijke 8-daagse reis door het eiland der goden.',
      description: 'Bali, het eiland der goden, is een betoverende bestemming die cultuur, natuur en ontspanning perfect combineert. Tijdens deze 8-daagse reis ontdekt u de prachtige rijstterrassen van Tegalalang, bezoekt u eeuwenoude tempels als Tanah Lot en Uluwatu, en geniet u van de paradijselijke stranden van Seminyak en Nusa Dua. Inclusief een traditionele Balinese kookles en een bezoek aan het heilige Monkey Forest.',
      duration: 8,
      category: 'strand',
      price: 1495,
      rating: 4.9,
      reviewCount: 127,
      featured: true,
      highlights: ['Rijstterrassen van Tegalalang', 'Tanah Lot tempel bij zonsondergang', 'Balinese kookles', 'Stranden van Nusa Dua'],
      inclusions: ['Retourvlucht', '7 nachten 4-sterren resort', 'Ontbijt dagelijks', 'Alle excursies en entrees', 'Engelstalige reisleider'],
      exclusions: ['Reisverzekering', 'Lunches en diners (tenzij vermeld)', 'Persoonlijke uitgaven'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst Bali', description: 'Aankomst op luchthaven Ngurah Rai. Transfer naar uw resort in Seminyak. Welkomstdrink en vrije avond.' },
        { dayNumber: 2, title: 'Ubud & Rijstterrassen', description: 'Bezoek aan de rijstterrassen van Tegalalang en het Monkey Forest. Lunch in een lokaal restaurant. Middags vrij voor ontspanning.' },
        { dayNumber: 3, title: 'Tempels & Cultuur', description: 'Ochtendbezoek aan Tirta Empul watertempel. Middags Balinese kookles. Avonds Tanah Lot tempel bij zonsondergang.' },
      ],
    },
    {
      title: 'Romantisch Parijs',
      slug: 'romantisch-parijs',
      destinationSlug: 'frankrijk',
      shortDescription: 'Beleef de romantiek van de Lichtstad. Een 5-daagse stedentrip door Parijs met bezoek aan de Eiffeltoren, Louvre, Montmartre en de beste bistro\'s.',
      description: 'Parijs is niet voor niets de meest romantische stad ter wereld. Tijdens deze 5-daagse stedentrip ontdekt u de iconische Eiffeltoren, wandelt u door de tuinen van Versailles, bewondert u de Mona Lisa in het Louvre en geniet u van de sfeer van Montmartre. Inclusief een Seine-cruise bij zonsondergang en een bezoek aan een authentieke Parijse wijnbar.',
      duration: 5,
      category: 'stedentrip',
      price: 695,
      rating: 5.0,
      reviewCount: 89,
      featured: true,
      highlights: ['Eiffeltoren bij avond', 'Rondvaart over de Seine', 'Louvre Museum', 'Montmartre & Sacr\u00e9-C\u0153ur'],
      inclusions: ['Retourvlucht of Thalys', '4 nachten boutique hotel', 'Ontbijt dagelijks', 'Paris Museum Pass (2 dagen)', 'Seine-cruise'],
      exclusions: ['Reisverzekering', 'Lunches en diners', 'Openbaar vervoer ter plaatse'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst Parijs', description: 'Aankomst per vliegtuig of Thalys. Check-in hotel in Le Marais. Wandeling door de wijk met welkomstdiner in lokale bistro.' },
        { dayNumber: 2, title: 'Eiffeltoren & Seine', description: 'Ochtend: bezoek aan de Eiffeltoren. Middag: wandeling langs de Seine. Avond: romantische Seine-cruise bij zonsondergang.' },
        { dayNumber: 3, title: 'Louvre & Tuilerieën', description: 'Ochtend: Louvre Museum (inclusief entree). Middag: wandeling door de Tuilerieën. Avond vrij in Saint-Germain-des-Prés.' },
      ],
    },
    {
      title: 'Safari Avontuur Kenia',
      slug: 'safari-avontuur-kenia',
      destinationSlug: 'kenia',
      shortDescription: 'Een spectaculaire 12-daagse safari door de Masai Mara en Amboseli. Spot de Big Five en ervaar de Afrikaanse wildernis op zijn best.',
      description: 'Dit 12-daagse safari-avontuur brengt u naar het hart van de Keniaanse wildernis. Van de uitgestrekte vlaktes van de Masai Mara tot het indrukwekkende uitzicht op de Kilimanjaro vanuit Amboseli National Park. U verblijft in sfeervolle lodges, maakt game drives bij zonsopkomst en zonsondergang, en bezoekt een Masai-dorp. Een reis die u voor altijd bijblijft.',
      duration: 12,
      category: 'avontuur',
      price: 2495,
      rating: 4.8,
      reviewCount: 64,
      featured: true,
      highlights: ['Big Five safari in Masai Mara', 'Uitzicht op Kilimanjaro', 'Bezoek Masai-dorp', 'Game drives bij zonsopkomst'],
      inclusions: ['Retourvlucht', '11 nachten safari lodge/tented camp', 'Volpension', 'Alle game drives', 'Engelstalige safari-gids', 'Parkentrees'],
      exclusions: ['Reisverzekering', 'Visum Kenia', 'Drankjes buiten maaltijden'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst Nairobi', description: 'Aankomst op Jomo Kenyatta Airport. Transfer naar hotel in Nairobi. Welkomstdiner en briefing over de safari.' },
        { dayNumber: 2, title: 'Naar Amboseli', description: 'Ochtends vertrek naar Amboseli National Park. Onderweg lunch. Middags eerste game drive met uitzicht op Mount Kilimanjaro.' },
        { dayNumber: 3, title: 'Amboseli Safari', description: 'Vroege ochtend game drive (zonsopkomst). Middag: bezoek aan Masai-dorp. Namiddag: tweede game drive bij zonsondergang.' },
      ],
    },
    {
      title: 'Rome & Vaticaan',
      slug: 'rome-vaticaan',
      destinationSlug: 'italie',
      shortDescription: 'Duik 6 dagen onder in de rijke geschiedenis van Rome. Van het Colosseum en Vaticaan tot verborgen piazza\'s en de beste Italiaanse keuken.',
      description: 'Rome, de Eeuwige Stad, is een openluchtmuseum waar iedere straat een verhaal vertelt. Tijdens deze 6-daagse cultuurreis bezoekt u het iconische Colosseum, het Forum Romanum, de Vaticaanse Musea met de Sixtijnse Kapel en de imposante Sint-Pietersbasiliek. Maar Rome is meer dan alleen geschiedenis: geniet van authentieke pasta in Trastevere, gooi een muntje in de Trevi-fontein en ontdek de verborgen schatten van deze magische stad.',
      duration: 6,
      category: 'cultuur',
      price: 845,
      rating: 4.7,
      reviewCount: 103,
      featured: false,
      highlights: ['Colosseum & Forum Romanum', 'Vaticaanse Musea & Sixtijnse Kapel', 'Trevi-fontein & Spaanse Trappen', 'Culinaire wandeling Trastevere'],
      inclusions: ['Retourvlucht', '5 nachten boutique hotel', 'Ontbijt dagelijks', 'Roma Pass (3 dagen)', 'Vaticaan skip-the-line entree'],
      exclusions: ['Reisverzekering', 'Lunches en diners', 'Persoonlijke uitgaven'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst Rome', description: 'Aankomst op luchthaven Fiumicino. Transfer naar hotel nabij Piazza Navona. Vrije middag om de buurt te verkennen. Welkomstdiner.' },
        { dayNumber: 2, title: 'Colosseum & Oud Rome', description: 'Ochtend: rondleiding Colosseum, Palatijn en Forum Romanum. Middag: lunch bij Piazza Venezia. Namiddag vrij.' },
        { dayNumber: 3, title: 'Vaticaan', description: 'Ochtend: Vaticaanse Musea en Sixtijnse Kapel (skip-the-line). Middag: Sint-Pietersbasiliek en koepelbezoek. Avond: culinaire wandeling Trastevere.' },
      ],
    },
    {
      title: 'Japan Highlights',
      slug: 'japan-highlights',
      destinationSlug: null,
      shortDescription: 'Een 10-daagse reis door de hoogtepunten van Japan: van het hypermoderne Tokyo tot de serene tempels van Kyoto en de majestueuze Fuji.',
      description: 'Japan is een land van contrasten waar ultramoderne technologie en eeuwenoude tradities naadloos samengaan. Tijdens deze 10-daagse reis ontdekt u het bruisende Tokyo, reist u met de befaamde Shinkansen bullet train, bewondert u de gouden tempel in Kyoto en maakt u een dagtocht naar de iconische Mount Fuji. Inclusief een traditionele thee-ceremonie, een bezoek aan een sumo-training en een overnachting in een authentiek Ryokan.',
      duration: 10,
      category: 'cultuur',
      price: 1895,
      rating: 4.9,
      reviewCount: 56,
      featured: false,
      highlights: ['Bullet train Tokyo-Kyoto', 'Mount Fuji dagtocht', 'Traditioneel Ryokan verblijf', 'Thee-ceremonie in Kyoto'],
      inclusions: ['Retourvlucht', '9 nachten hotels + 1 nacht Ryokan', 'Japan Rail Pass (7 dagen)', 'Ontbijt dagelijks', 'Engelstalige gids (Tokyo & Kyoto)'],
      exclusions: ['Reisverzekering', 'Visum (niet nodig voor NL paspoort)', 'Lunches en diners'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst Tokyo', description: 'Aankomst op Narita Airport. Transfer naar hotel in Shinjuku. Vrije avond om de neonlichten van Shibuya te ontdekken.' },
        { dayNumber: 2, title: 'Tokyo Verkenning', description: 'Ochtend: Sensoji-tempel in Asakusa. Middag: Harajuku en Meiji-schrijn. Avond: sumo-training bijwonen.' },
        { dayNumber: 3, title: 'Mount Fuji Dagtocht', description: 'Dagtocht naar Mount Fuji en het schilderachtige Hakone. Per kabelbaan naar een uitzichtpunt. Lunch met uitzicht op de berg. Retour Tokyo.' },
      ],
    },
    {
      title: 'Costa Rica Adventure',
      slug: 'costa-rica-adventure',
      destinationSlug: null,
      shortDescription: 'Een 8-daagse avontuurlijke reis door Costa Rica: vulkanen, regenwouden, wildwater raften en paradijselijke stranden.',
      description: 'Costa Rica is het avonturenparadijs van Centraal-Amerika. Tijdens deze 8-daagse reis verkent u het weelderige regenwoud van Monteverde via hangbruggen, rafter u door de stroomversnellingen van de Pacuare, bezoekt u de imposante Arenal-vulkaan en ontspant u op de stranden van Manuel Antonio. Spot luiaards, tukannen en kleurrijke kikkers in hun natuurlijke habitat. Pura Vida!',
      duration: 8,
      category: 'avontuur',
      price: 1595,
      rating: 4.8,
      reviewCount: 42,
      featured: false,
      highlights: ['Arenal vulkaan & hotsprings', 'Hangbruggen Monteverde', 'Wildwater raften Pacuare', 'Manuel Antonio stranden'],
      inclusions: ['Retourvlucht', '7 nachten ecolodges/hotels', 'Ontbijt dagelijks', 'Alle excursies en transfers', 'Nederlandstalige reisleider'],
      exclusions: ['Reisverzekering', 'Lunches en diners', 'Optionele activiteiten'],
      itinerary: [
        { dayNumber: 1, title: 'Aankomst San Jos\u00e9', description: 'Aankomst op Juan Santamar\u00eda Airport. Transfer naar hotel. Welkomstdiner met Costaricaanse keuken en reisbriefing.' },
        { dayNumber: 2, title: 'Arenal Vulkaan', description: 'Vertrek naar La Fortuna. Wandeling door het regenwoud rond de Arenal-vulkaan. Middag: ontspannen in natuurlijke hotsprings. Overnachting in ecolodge.' },
        { dayNumber: 3, title: 'Monteverde Cloudforest', description: 'Vertrek naar Monteverde. Middags: hangbruggen-trail door het nevelwoud. Avond: nachtwandeling op zoek naar nachtdieren.' },
      ],
    },
  ]

  for (const tour of tours) {
    if (!(await checkExistingContent(payload, 'tours', tour.slug))) {
      try {
        const destinationId = tour.destinationSlug ? destinationIds[tour.destinationSlug] : undefined
        await payload.create({
          collection: 'tours',
          data: {
            title: tour.title,
            slug: tour.slug,
            destination: destinationId || undefined,
            shortDescription: tour.shortDescription,
            description: richText(tour.description),
            duration: tour.duration,
            category: tour.category,
            price: tour.price,
            rating: tour.rating,
            reviewCount: tour.reviewCount,
            featured: tour.featured,
            availability: 'beschikbaar',
            highlights: tour.highlights.map(h => ({ text: h })),
            inclusions: tour.inclusions.map(i => ({ text: i })),
            exclusions: tour.exclusions.map(e => ({ text: e })),
            itinerary: tour.itinerary.map(day => ({
              dayNumber: day.dayNumber,
              title: day.title,
              description: richText(day.description),
            })),
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['tours'] = (result.collections['tours'] || 0) + 1
        payload.logger.info(`      + ${tour.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create tour "${tour.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${tour.title} (exists)`)
    }
  }

  // ==========================================================================
  // ACCOMMODATIES (accommodations)
  // ==========================================================================
  payload.logger.info('      Seeding accommodations...')

  const accommodations = [
    {
      name: 'The Laguna Resort & Spa',
      slug: 'the-laguna-resort-spa',
      destinationSlug: 'thailand',
      type: 'resort',
      stars: 5,
      city: 'Bali',
      shortDescription: 'Luxueus 5-sterren resort direct aan het strand met meerdere zwembaden, volledig spa-centrum en vier restaurants. De ultieme plek voor een ontspannen strandvakantie.',
      description: 'The Laguna Resort & Spa is een paradijselijk 5-sterren resort gelegen aan het prachtige Nusa Dua strand op Bali. Het resort beschikt over ruime kamers en suite\'s met zeezicht, meerdere zwembaden waaronder een infinity pool, een wereldklasse spa, vier restaurants met internationale en Balinese keuken, en directe toegang tot het privéstrand. Ideaal voor stellen en gezinnen die willen genieten van pure luxe in een tropische setting.',
      priceFrom: 189,
      mealPlan: 'allinclusive',
      facilities: ['zwembad', 'spa', 'restaurant', 'bar', 'fitness', 'wifi'],
      rooms: [
        { name: 'Deluxe Zeezicht Kamer', type: 'deluxe', maxGuests: 2, price: 189, description: 'Ruime kamer met zeezicht, kingsize bed, balkon en luxe badkamer.', amenities: ['zeezicht', 'balkon', 'minibar', 'airco'] },
        { name: 'Premium Suite', type: 'suite', maxGuests: 4, price: 345, description: 'Luxueuze suite met apart woon- en slaapgedeelte, priv\u00e9-jacuzzi op het balkon en butler service.', amenities: ['zeezicht', 'jacuzzi', 'butler service', 'minibar', 'airco'] },
      ],
      featured: true,
    },
    {
      name: 'H\u00f4tel Le Marais',
      slug: 'hotel-le-marais',
      destinationSlug: 'frankrijk',
      type: 'hotel',
      stars: 4,
      city: 'Parijs',
      shortDescription: 'Charmant 4-sterren boutique hotel in het hart van Le Marais, een van de meest gewilde wijken van Parijs. Op loopafstand van de Seine en Notre-Dame.',
      description: 'H\u00f4tel Le Marais is een stijlvol boutique hotel in het bruisende Le Marais district van Parijs. Het hotel combineert historische charme met modern comfort. De kamers zijn ingericht in een elegante Parijse stijl met alle hedendaagse gemakken. Begin uw dag met een uitgebreid Frans ontbijt, verken de lokale galerieën en boutiques, en eindig met een glas wijn op het gezellige binnenplein.',
      priceFrom: 145,
      mealPlan: 'ontbijt',
      facilities: ['restaurant', 'wifi', 'roomservice'],
      rooms: [
        { name: 'Chambre Classique', type: 'standaard', maxGuests: 2, price: 145, description: 'Sfeervolle kamer in Parijse stijl met queensize bed en ensuite badkamer.', amenities: ['airco', 'wifi', 'minibar'] },
        { name: 'Chambre Sup\u00e9rieure', type: 'superior', maxGuests: 2, price: 195, description: 'Grotere kamer met uitzicht op het binnenplein, zithoek en luxe badkamer met regendouche.', amenities: ['airco', 'wifi', 'minibar', 'zithoek', 'regendouche'] },
      ],
      featured: true,
    },
    {
      name: 'Masai Mara Safari Lodge',
      slug: 'masai-mara-safari-lodge',
      destinationSlug: 'kenia',
      type: 'resort',
      stars: 4,
      city: 'Masai Mara',
      shortDescription: 'Sfeervolle safari lodge aan de rand van de Masai Mara. Geniet van spectaculaire game drives en diner onder de sterren midden in de Afrikaanse wildernis.',
      description: 'De Masai Mara Safari Lodge biedt een authentieke safari-ervaring in het hart van de Keniaanse wildernis. De lodge beschikt over ruime tented suites met uitzicht op de savanne, een restaurant met lokale en internationale gerechten, een bar met panoramisch uitzicht, een zwembad en gratis wifi in de gemeenschappelijke ruimtes. Game drives bij zonsopkomst en zonsondergang zijn inbegrepen.',
      priceFrom: 220,
      mealPlan: 'volpension',
      facilities: ['restaurant', 'bar', 'wifi', 'zwembad'],
      rooms: [
        { name: 'Savanne Tent', type: 'tent', maxGuests: 2, price: 220, description: 'Sfeervolle luxe tent met kingsize bed, priv\u00e9-veranda met uitzicht op de savanne.', amenities: ['priv\u00e9-veranda', 'douche', 'nachtkijker'] },
        { name: 'Family Tent', type: 'family', maxGuests: 4, price: 380, description: 'Extra ruime tent met apart slaapgedeelte voor kinderen. Ideaal voor gezinnen op safari.', amenities: ['priv\u00e9-veranda', '2 slaapgedeeltes', 'douche'] },
      ],
      featured: true,
    },
    {
      name: 'Villa Toscana',
      slug: 'villa-toscana',
      destinationSlug: 'italie',
      type: 'villa',
      stars: 0,
      city: 'Toscane',
      shortDescription: 'Authentieke Toscaanse villa met priv\u00e9-zwembad, omringd door olijfgaarden en wijngaarden. De perfecte basis voor het verkennen van Florence, Siena en San Gimignano.',
      description: 'Villa Toscana is een prachtig gerestaureerde 17e-eeuwse villa in het glooiende Toscaanse landschap. De villa biedt ruimte voor maximaal 8 personen en beschikt over een groot priv\u00e9-zwembad, een volledig uitgeruste keuken, meerdere terrassen met uitzicht op de olijfgaarden en eigen parkeergelegenheid. De perfecte uitvalsbasis voor het verkennen van Florence (30 min), Siena (45 min) en de charmante middeleeuwse dorpjes in de omgeving.',
      priceFrom: 95,
      mealPlan: 'logies',
      facilities: ['zwembad', 'parkeren', 'wifi', 'airco'],
      rooms: [
        { name: 'Camera Matrimoniale', type: 'standaard', maxGuests: 2, price: 95, description: 'Sfeervolle slaapkamer met tweepersoonsbed, ensuite badkamer en uitzicht op de tuin.', amenities: ['airco', 'wifi', 'tuinuitzicht'] },
        { name: 'Suite Panoramica', type: 'suite', maxGuests: 4, price: 155, description: 'Grote suite met woonkamer, slaapkamer, eigen terras en panoramisch uitzicht over de Toscaanse heuvels.', amenities: ['airco', 'wifi', 'terras', 'panoramisch uitzicht'] },
      ],
      featured: false,
    },
  ]

  for (const acc of accommodations) {
    if (!(await checkExistingContent(payload, 'accommodations', acc.slug))) {
      try {
        const destinationId = acc.destinationSlug ? destinationIds[acc.destinationSlug] : undefined
        await payload.create({
          collection: 'accommodations',
          data: {
            name: acc.name,
            slug: acc.slug,
            destination: destinationId || undefined,
            type: acc.type,
            stars: acc.stars,
            city: acc.city,
            shortDescription: acc.shortDescription,
            description: richText(acc.description),
            priceFrom: acc.priceFrom,
            mealPlan: acc.mealPlan,
            facilities: acc.facilities,
            rooms: acc.rooms.map(room => ({
              name: room.name,
              type: room.type,
              maxGuests: room.maxGuests,
              price: room.price,
              description: room.description,
              amenities: room.amenities.map(a => ({ amenity: a })),
            })),
            featured: acc.featured,
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['accommodations'] = (result.collections['accommodations'] || 0) + 1
        payload.logger.info(`      + ${acc.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create accommodation "${acc.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${acc.name} (exists)`)
    }
  }

  // ==========================================================================
  // TEAMLEDEN (content-team, branch: toerisme)
  // ==========================================================================
  payload.logger.info('      Seeding toerisme team members...')

  const teamMembers = [
    {
      name: 'Sophie van den Berg',
      slug: 'sophie-van-den-berg',
      role: 'Reisadviseur',
      bio: 'Sophie is een ervaren reisadviseur met een passie voor Europa en stedentrips. Met meer dan 10 jaar ervaring in de reisbranche helpt zij u graag bij het samenstellen van uw perfecte vakantie. Of het nu gaat om een romantisch weekendje Parijs of een uitgebreide rondreis door Itali\u00eb, Sophie kent de mooiste plekjes en de beste tips.',
      experience: 10,
      specialties: [
        { specialty: 'Europa' },
        { specialty: 'Stedentrips' },
        { specialty: 'Luxe reizen' },
      ],
    },
    {
      name: 'Tom de Groot',
      slug: 'tom-de-groot',
      role: 'Bestemming-specialist',
      bio: 'Tom is onze bestemming-specialist voor Azi\u00eb en Afrika. Na jarenlange werkervaring in Thailand, Bali en Kenia kent hij deze bestemmingen als geen ander. Tom organiseert graag avontuurlijke reizen en safari\'s en weet precies wanneer het beste seizoen is, welke accommodaties de moeite waard zijn en welke verborgen parels u niet mag missen.',
      experience: 8,
      specialties: [
        { specialty: 'Azi\u00eb' },
        { specialty: 'Afrika' },
        { specialty: 'Avontuurlijke reizen' },
      ],
    },
  ]

  for (const member of teamMembers) {
    if (!(await checkExistingContent(payload, 'content-team', member.slug))) {
      try {
        await payload.create({
          collection: 'content-team',
          data: {
            name: member.name,
            slug: member.slug,
            branch: 'toerisme',
            role: member.role,
            bio: richText(member.bio),
            experience: member.experience,
            status: status === 'published' ? 'published' : 'draft',
            specialties: member.specialties,
          } as any,
        })
        result.collections['content-team'] = (result.collections['content-team'] || 0) + 1
        payload.logger.info(`      + ${member.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create team member "${member.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${member.name} (exists)`)
    }
  }

  // ==========================================================================
  // CHATBOT SETTINGS (global)
  // ==========================================================================
  payload.logger.info('      Seeding chatbot conversation flows...')

  try {
    await payload.updateGlobal({
      slug: 'chatbot-settings',
      data: {
        conversationFlows: toerismeConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: toerismeSystemPrompt,
        trainingContext: toerismeTrainingContext,
        welcomeMessage: toerismeWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
