import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  vastgoedConversationFlows,
  vastgoedSystemPrompt,
  vastgoedTrainingContext,
  vastgoedWelcomeMessage,
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
 * Seed Vastgoed Content
 *
 * Seeds: 6 properties (woningen), 2 team members (makelaars),
 * 2 reviews, chatbot-settings global.
 */
export async function seedVastgoed(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // TEAMLEDEN / MAKELAARS (content-team, branch: vastgoed)
  // ==========================================================================
  payload.logger.info('      Seeding vastgoed team members (makelaars)...')

  const teamMembers = [
    {
      name: 'Jan de Vries',
      slug: 'jan-de-vries-vastgoed',
      role: 'Senior Makelaar / Taxateur',
      bio: 'Jan is een ervaren senior makelaar en register taxateur met meer dan 20 jaar ervaring in de Amsterdamse woningmarkt. Hij begeleidt zowel kopers als verkopers bij het gehele proces en staat bekend om zijn grondige marktkennis en persoonlijke aanpak. Als NVM-gecertificeerd makelaar en register taxateur garandeert Jan een professionele en betrouwbare dienstverlening.',
      experience: 20,
      specialties: [
        { specialty: 'Woningverkoop' },
        { specialty: 'Taxaties' },
        { specialty: 'Waardebepaling' },
      ],
      qualifications: [
        { name: 'NVM Gecertificeerd', year: 2006 },
        { name: 'Register Taxateur', year: 2010 },
      ],
    },
    {
      name: 'Lisa Bakker',
      slug: 'lisa-bakker-vastgoed',
      role: 'Aankoopmakelaar',
      bio: 'Lisa is onze gespecialiseerde aankoopmakelaar die kopers begeleidt bij het vinden en aankopen van hun droomwoning. Met haar scherpe onderhandelingsvaardigheden en oog voor detail zorgt zij ervoor dat u de beste deal krijgt. Lisa kent de Amsterdamse markt als geen ander en weet precies wanneer en hoe u moet bieden.',
      experience: 12,
      specialties: [
        { specialty: 'Woningaankoop' },
        { specialty: 'Bezichtigingen' },
        { specialty: 'Onderhandeling' },
      ],
      qualifications: [
        { name: 'NVM Gecertificeerd', year: 2014 },
      ],
    },
  ]

  // Store team member IDs for property agent relationships
  const teamMemberIds: Record<string, number> = {}

  for (const member of teamMembers) {
    if (!(await checkExistingContent(payload, 'content-team', member.slug))) {
      try {
        const created = await payload.create({
          collection: 'content-team',
          data: {
            name: member.name,
            slug: member.slug,
            branch: 'vastgoed',
            role: member.role,
            bio: richText(member.bio),
            experience: member.experience,
            status: status === 'published' ? 'published' : 'draft',
            specialties: member.specialties,
            qualifications: member.qualifications,
          } as any,
        })
        teamMemberIds[member.slug] = created.id as number
        result.collections['content-team'] = (result.collections['content-team'] || 0) + 1
        payload.logger.info(`      + ${member.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create team member "${member.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${member.name} (exists)`)
      // Fetch the existing team member ID
      try {
        const existing = await payload.find({
          collection: 'content-team',
          where: { slug: { equals: member.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          teamMemberIds[member.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // WONINGEN (properties)
  // ==========================================================================
  payload.logger.info('      Seeding properties (woningen)...')

  const properties = [
    {
      title: 'Wilhelminastraat 42, Amsterdam',
      slug: 'wilhelminastraat-42-amsterdam',
      shortDescription: 'Prachtig gerenoveerd 3-kamer appartement in het hart van Oud-West. Dit lichte appartement beschikt over een ruime woonkamer, moderne open keuken, twee slaapkamers en een badkamer met inloopdouche. De achtertuin van 18m\u00b2 op het zuidwesten is een zeldzaamheid in deze gewilde buurt. CV-ketel uit 2021.',
      description: 'Dit sfeervolle appartement aan de Wilhelminastraat is volledig gerenoveerd in 2021 met behoud van authentieke details zoals de originele plavuizen in de hal en de hoge plafonds. De ruime woonkamer baadt in het licht dankzij de grote ramen aan de straatzijde. De moderne open keuken is voorzien van alle inbouwapparatuur. Via de keuken bereikt u de achtertuin van 18m\u00b2 op het zuidwesten \u2014 ideaal voor zonnige middagen. De twee slaapkamers bevinden zich aan de achterzijde van het appartement, wat zorgt voor een rustige nachtrust. De badkamer is voorzien van een ruime inloopdouche, wastafelmeubel en designradiator.',
      street: 'Wilhelminastraat',
      houseNumber: '42',
      postalCode: '1054 RH',
      city: 'Amsterdam',
      neighborhood: 'Oud-West',
      province: 'noord-holland',
      propertyType: 'appartement',
      buildYear: 1928,
      livingArea: 92,
      plotArea: 0,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      floors: 1,
      hasGarden: true,
      gardenArea: 18,
      gardenOrientation: 'west',
      hasGarage: false,
      hasParking: false,
      energyLabel: 'A',
      heatingType: 'cv-ketel',
      heatingYear: 2021,
      insulation: ['muurisolatie', 'dubbel-glas', 'hr++-glas'],
      askingPrice: 485000,
      priceCondition: 'k.k.',
      pricePerM2: 5272,
      listingStatus: 'beschikbaar',
      featured: true,
      agentSlug: 'jan-de-vries-vastgoed',
    },
    {
      title: 'Prinsengracht 127-II, Amsterdam',
      slug: 'prinsengracht-127-ii-amsterdam',
      shortDescription: 'Uniek grachtenpand appartement op de bel-etage van een monumentaal pand aan de Prinsengracht. Met 115m\u00b2 woonoppervlakte, 4 slaapkamers, 2 badkamers en authentieke details zoals originele balkenplafonds en schouw.',
      description: 'Een zeldzame kans om eigenaar te worden van dit prachtige bel-etage appartement in een monumentaal grachtenpand uit 1895. Het appartement is met respect voor de originele architectuur gemoderniseerd en biedt een unieke combinatie van historische charme en modern comfort. De ruime woonkamer met origineel balkenplafond en marmeren schouw kijkt uit over de Prinsengracht. De volledig uitgeruste keuken is voorzien van alle moderne apparatuur. Met 4 slaapkamers en 2 badkamers is dit appartement ideaal voor een gezin dat wil wonen in het hart van Amsterdam.',
      street: 'Prinsengracht',
      houseNumber: '127-II',
      postalCode: '1015 DH',
      city: 'Amsterdam',
      neighborhood: 'Centrum',
      province: 'noord-holland',
      propertyType: 'appartement',
      buildYear: 1895,
      livingArea: 115,
      plotArea: 0,
      rooms: 5,
      bedrooms: 4,
      bathrooms: 2,
      floors: 1,
      hasGarden: false,
      gardenArea: 0,
      gardenOrientation: 'nvt',
      hasGarage: false,
      hasParking: false,
      energyLabel: 'C',
      heatingType: 'cv-ketel',
      heatingYear: 2018,
      insulation: ['dubbel-glas'],
      askingPrice: 625000,
      priceCondition: 'k.k.',
      pricePerM2: 5435,
      listingStatus: 'beschikbaar',
      featured: false,
      agentSlug: 'lisa-bakker-vastgoed',
    },
    {
      title: 'Jan van Galenstraat 88-3, Amsterdam',
      slug: 'jan-van-galenstraat-88-3-amsterdam',
      shortDescription: 'Instapklaar 2-kamer appartement op de derde verdieping met lift. Modern gerenoveerd met open keuken, ruime slaapkamer en balkon op het zuiden. Ideale starterswoning of belegging in opkomend Bos en Lommer.',
      description: 'Dit moderne 2-kamer appartement aan de Jan van Galenstraat is volledig gerenoveerd en instapklaar. Het appartement is bereikbaar via een lift en beschikt over een lichte woonkamer met open keuken, een ruime slaapkamer aan de achterzijde en een moderne badkamer met douche en wasmachineaansluiting. Het balkon op het zuiden is ideaal voor een kopje koffie in de zon. De buurt Bos en Lommer is de afgelopen jaren enorm in trek geraakt met nieuwe restaurants, winkels en het Erasmuspark om de hoek.',
      street: 'Jan van Galenstraat',
      houseNumber: '88-3',
      postalCode: '1056 BN',
      city: 'Amsterdam',
      neighborhood: 'Bos en Lommer',
      province: 'noord-holland',
      propertyType: 'appartement',
      buildYear: 1960,
      livingArea: 68,
      plotArea: 0,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      floors: 1,
      hasGarden: false,
      gardenArea: 0,
      gardenOrientation: 'nvt',
      hasGarage: false,
      hasParking: true,
      parkingType: 'Vergunningsgebied',
      energyLabel: 'B',
      heatingType: 'cv-ketel',
      heatingYear: 2019,
      insulation: ['muurisolatie', 'dubbel-glas'],
      askingPrice: 395000,
      priceCondition: 'k.k.',
      pricePerM2: 5809,
      listingStatus: 'onder-bod',
      featured: false,
      agentSlug: 'lisa-bakker-vastgoed',
    },
    {
      title: 'Beethovenstraat 142, Amsterdam',
      slug: 'beethovenstraat-142-amsterdam',
      shortDescription: 'Luxe nieuwbouw woonhuis in het Beethovenkwartier met 128m\u00b2 woonoppervlakte, 3 slaapkamers, 2 badkamers, eigen tuin en garage. Energielabel A met vloerverwarming en warmtepomp. Instapklaar met hoogwaardige afwerking.',
      description: 'Dit prachtige nieuwbouw woonhuis in de prestigieuze Beethovenstraat biedt luxe wonen op topniveau. Het huis beschikt over een ruime woonkamer met vloerverwarming en directe toegang tot de tuin, een volledig uitgeruste keuken van Bulthaup met Gaggenau apparatuur, drie royale slaapkamers en twee complete badkamers. De master bedroom beschikt over een en-suite badkamer met dubbele wastafel, regendouche en losstaand bad. De eigen garage biedt ruimte voor twee auto\u2019s. De tuin is professioneel aangelegd met terras en privacy door de hoge hagen.',
      street: 'Beethovenstraat',
      houseNumber: '142',
      postalCode: '1077 JV',
      city: 'Amsterdam',
      neighborhood: 'Beethovenkwartier',
      province: 'noord-holland',
      propertyType: 'woonhuis',
      buildYear: 2018,
      livingArea: 128,
      plotArea: 180,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
      floors: 2,
      hasGarden: true,
      gardenArea: 45,
      gardenOrientation: 'zuid',
      hasGarage: true,
      hasParking: true,
      parkingType: 'Eigen garage',
      energyLabel: 'A',
      heatingType: 'warmtepomp',
      heatingYear: 2018,
      insulation: ['dakisolatie', 'muurisolatie', 'vloerisolatie', 'hr++-glas'],
      askingPrice: 725000,
      priceCondition: 'k.k.',
      pricePerM2: 5664,
      listingStatus: 'beschikbaar',
      featured: true,
      agentSlug: 'jan-de-vries-vastgoed',
    },
    {
      title: 'Vondelstraat 23-I, Amsterdam',
      slug: 'vondelstraat-23-i-amsterdam',
      shortDescription: 'Ruim en karakteristiek 5-kamer appartement op de eerste verdieping aan de Vondelstraat, op steenworp afstand van het Vondelpark. Met 145m\u00b2 woonoppervlakte, hoge plafonds, originele ornamenten en een prachtige erker.',
      description: 'Dit indrukwekkende appartement aan de Vondelstraat is een van de mooiste adressen van Amsterdam. Het eerste verdieping appartement in dit monumentale pand uit 1905 biedt maar liefst 145m\u00b2 woonoppervlakte met authentieke details als originele ornamenten, hoge plafonds en een schitterende erker met uitzicht op de straat. De ruime woonkamer is ideaal voor zowel gezellige avonden als het ontvangen van gasten. De keuken is recent vernieuwd met alle moderne apparatuur. Met 5 kamers, waaronder 3 slaapkamers, en 2 badkamers biedt dit appartement alle ruimte die u nodig heeft. Het Vondelpark bevindt zich letterlijk om de hoek.',
      street: 'Vondelstraat',
      houseNumber: '23-I',
      postalCode: '1054 GE',
      city: 'Amsterdam',
      neighborhood: 'Oud-Zuid',
      province: 'noord-holland',
      propertyType: 'appartement',
      buildYear: 1905,
      livingArea: 145,
      plotArea: 0,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      hasGarden: false,
      gardenArea: 0,
      gardenOrientation: 'nvt',
      hasGarage: false,
      hasParking: true,
      parkingType: 'Vergunningsgebied',
      energyLabel: 'C',
      heatingType: 'cv-ketel',
      heatingYear: 2016,
      insulation: ['dubbel-glas', 'muurisolatie'],
      askingPrice: 875000,
      priceCondition: 'k.k.',
      pricePerM2: 6034,
      listingStatus: 'beschikbaar',
      featured: true,
      agentSlug: 'jan-de-vries-vastgoed',
    },
    {
      title: 'IJburglaan 500, Amsterdam',
      slug: 'ijburglaan-500-amsterdam',
      shortDescription: 'Gloednieuw nieuwbouw appartement op IJburg met 98m\u00b2, 3 slaapkamers, 2 badkamers en energielabel A+++. Modern en duurzaam wonen aan het water met uitzicht over het IJmeer. Oplevering 2026.',
      description: 'Dit prachtige nieuwbouw appartement op IJburg biedt modern en duurzaam wonen aan het water. Het ruime 3-kamer appartement beschikt over een open woonkamer met grote schuifpui naar het balkon met uitzicht over het IJmeer. De keuken is voorzien van alle luxe inbouwapparatuur. De drie slaapkamers zijn allen voorzien van inbouwkasten. De master bedroom heeft een eigen en-suite badkamer. Het gebouw is voorzien van de nieuwste duurzame technologie\u00ebn: warmtepomp, zonnepanelen, driedubbel glas en een A+++ energielabel. In de kelder is een privé-berging en een fietsenstalling.',
      street: 'IJburglaan',
      houseNumber: '500',
      postalCode: '1087 CG',
      city: 'Amsterdam',
      neighborhood: 'IJburg',
      province: 'noord-holland',
      propertyType: 'appartement',
      buildYear: 2026,
      livingArea: 98,
      plotArea: 0,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      hasGarden: false,
      gardenArea: 0,
      gardenOrientation: 'nvt',
      hasGarage: false,
      hasParking: true,
      parkingType: 'Parkeergarage',
      energyLabel: 'A+++',
      heatingType: 'warmtepomp',
      heatingYear: 2026,
      insulation: ['dakisolatie', 'muurisolatie', 'vloerisolatie', 'hr++-glas'],
      askingPrice: 550000,
      priceCondition: 'v.o.n.',
      pricePerM2: 5612,
      listingStatus: 'beschikbaar',
      featured: false,
      agentSlug: 'lisa-bakker-vastgoed',
    },
  ]

  for (const property of properties) {
    if (!(await checkExistingContent(payload, 'properties', property.slug))) {
      try {
        const agentId = property.agentSlug ? teamMemberIds[property.agentSlug] : undefined
        await payload.create({
          collection: 'properties',
          data: {
            title: property.title,
            slug: property.slug,
            shortDescription: property.shortDescription,
            description: richText(property.description),
            listingStatus: property.listingStatus,
            featured: property.featured,
            // Locatie
            street: property.street,
            houseNumber: property.houseNumber,
            postalCode: property.postalCode,
            city: property.city,
            neighborhood: property.neighborhood,
            province: property.province,
            // Kenmerken
            propertyType: property.propertyType,
            buildYear: property.buildYear,
            livingArea: property.livingArea,
            plotArea: property.plotArea || undefined,
            rooms: property.rooms,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            floors: property.floors,
            hasGarden: property.hasGarden,
            gardenArea: property.gardenArea || undefined,
            gardenOrientation: property.gardenOrientation !== 'nvt' ? property.gardenOrientation : undefined,
            hasGarage: property.hasGarage,
            hasParking: property.hasParking,
            parkingType: (property as any).parkingType || undefined,
            // Energie
            energyLabel: property.energyLabel,
            heatingType: property.heatingType,
            heatingYear: property.heatingYear,
            insulation: property.insulation,
            // Prijzen
            askingPrice: property.askingPrice,
            priceCondition: property.priceCondition,
            pricePerM2: property.pricePerM2,
            // Status & Admin
            listingDate: new Date().toISOString(),
            viewCount: 0,
            favoriteCount: 0,
            agent: agentId || undefined,
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['properties'] = (result.collections['properties'] || 0) + 1
        payload.logger.info(`      + ${property.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create property "${property.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${property.title} (exists)`)
    }
  }

  // ==========================================================================
  // REVIEWS (content-reviews, branch: vastgoed)
  // ==========================================================================
  payload.logger.info('      Seeding vastgoed reviews...')

  const reviews = [
    {
      authorName: 'Familie Van der Berg',
      authorRole: 'Koper',
      authorInitials: 'VB',
      authorColor: 'blue',
      rating: 5,
      quote: 'Uitstekende begeleiding bij de aankoop van ons eerste huis. Lisa heeft ons door het hele proces geleid, van de eerste bezichtiging tot de sleuteloverdracht. Haar kennis van de markt en onderhandelingsvaardigheden hebben ervoor gezorgd dat we een geweldige deal kregen. We kunnen dit kantoor van harte aanbevelen aan iedereen die een woning zoekt in Amsterdam.',
      featured: true,
    },
    {
      authorName: 'Dhr. Jansen',
      authorRole: 'Verkoper',
      authorInitials: 'DJ',
      authorColor: 'teal',
      rating: 5,
      quote: 'Professionele verkoop van onze woning aan de Prinsengracht. Jan heeft alles perfect geregeld: van de fotografie en presentatie tot de bezichtigingen en onderhandeling. Onze woning was binnen 2 weken verkocht, boven de vraagprijs. De communicatie was uitstekend en we werden bij elke stap op de hoogte gehouden. Absoluut een aanrader.',
      featured: true,
    },
  ]

  for (const review of reviews) {
    // Check if review already exists by authorName
    try {
      const existing = await payload.find({
        collection: 'content-reviews' as any,
        where: {
          and: [
            { authorName: { equals: review.authorName } },
            { branch: { equals: 'vastgoed' } },
          ],
        },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        payload.logger.info(`      = ${review.authorName} (exists)`)
        continue
      }
    } catch {}

    try {
      await payload.create({
        collection: 'content-reviews' as any,
        data: {
          authorName: review.authorName,
          authorRole: review.authorRole,
          authorInitials: review.authorInitials,
          authorColor: review.authorColor,
          branch: 'vastgoed',
          rating: review.rating,
          quote: review.quote,
          featured: review.featured,
          status: status === 'published' ? 'published' : 'draft',
        } as any,
      })
      result.collections['content-reviews'] = (result.collections['content-reviews'] || 0) + 1
      payload.logger.info(`      + ${review.authorName}`)
    } catch (e) {
      payload.logger.warn(`      ! Could not create review "${review.authorName}":`, e)
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
        conversationFlows: vastgoedConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: vastgoedSystemPrompt,
        trainingContext: vastgoedTrainingContext,
        welcomeMessage: vastgoedWelcomeMessage,
        knowledgeBaseIntegration: {
          searchCollections: ['pages', 'blog-posts', 'properties'],
        },
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
