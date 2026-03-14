import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  automotiveConversationFlows,
  automotiveSystemPrompt,
  automotiveTrainingContext,
  automotiveWelcomeMessage,
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
 * Seed Automotive Content
 *
 * Seeds: 5 vehicle brands, 6 vehicles, 5 workshop services (content-services),
 * 2 team members (content-team), chatbot-settings global.
 */
export async function seedAutomotive(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // VOERTUIGMERKEN (vehicle-brands)
  // ==========================================================================
  payload.logger.info('      Seeding vehicle brands...')

  const brands = [
    {
      name: 'Volkswagen',
      slug: 'volkswagen',
      order: 1,
      popularModels: [
        { name: 'Golf' },
        { name: 'Polo' },
        { name: 'Tiguan' },
        { name: 'Passat' },
        { name: 'T-Cross' },
      ],
    },
    {
      name: 'Toyota',
      slug: 'toyota',
      order: 2,
      popularModels: [
        { name: 'Yaris' },
        { name: 'Corolla' },
        { name: 'RAV4' },
        { name: 'Aygo X' },
        { name: 'C-HR' },
      ],
    },
    {
      name: 'BMW',
      slug: 'bmw',
      order: 3,
      popularModels: [
        { name: '1 Serie' },
        { name: '3 Serie' },
        { name: 'X1' },
        { name: 'X3' },
        { name: 'iX1' },
      ],
    },
    {
      name: 'Renault',
      slug: 'renault',
      order: 4,
      popularModels: [
        { name: 'Clio' },
        { name: 'Captur' },
        { name: 'M\u00e9gane' },
        { name: 'Arkana' },
        { name: 'Zoe' },
      ],
    },
    {
      name: 'Kia',
      slug: 'kia',
      order: 5,
      popularModels: [
        { name: 'Picanto' },
        { name: 'Ceed' },
        { name: 'Sportage' },
        { name: 'Niro' },
        { name: 'EV6' },
      ],
    },
  ]

  // Store brand IDs for vehicle relationships
  const brandIds: Record<string, number> = {}

  for (const brand of brands) {
    if (!(await checkExistingContent(payload, 'vehicle-brands', brand.slug))) {
      try {
        const created = await payload.create({
          collection: 'vehicle-brands',
          data: {
            name: brand.name,
            slug: brand.slug,
            order: brand.order,
            popularModels: brand.popularModels,
          } as any,
        })
        brandIds[brand.slug] = created.id as number
        result.collections['vehicle-brands'] = (result.collections['vehicle-brands'] || 0) + 1
        payload.logger.info(`      + ${brand.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create brand "${brand.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${brand.name} (exists)`)
      // Fetch the existing brand ID
      try {
        const existing = await payload.find({
          collection: 'vehicle-brands',
          where: { slug: { equals: brand.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          brandIds[brand.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // VOERTUIGEN (vehicles)
  // ==========================================================================
  payload.logger.info('      Seeding vehicles...')

  const vehicles = [
    {
      title: 'Volkswagen Golf 1.5 TSI Style',
      slug: 'volkswagen-golf-15-tsi-style',
      brandSlug: 'volkswagen',
      model: 'Golf',
      variant: '1.5 TSI Style',
      year: 2024,
      fuelType: 'benzine',
      transmission: 'handgeschakeld',
      price: 29950,
      mileage: 15000,
      bodyType: 'hatchback',
      color: 'Oryx Wit',
      power: 150,
      doors: 5,
      seats: 5,
      licensePlate: 'NL-432-B',
      shortDescription: 'Zeer complete Volkswagen Golf in de populaire Style-uitvoering. Voorzien van navigatie, adaptieve cruise control, LED-koplampen en parkeersensoren rondom. Eerste eigenaar, volledig dealer onderhouden.',
    },
    {
      title: 'Toyota Yaris 1.5 Hybrid Active',
      slug: 'toyota-yaris-15-hybrid-active',
      brandSlug: 'toyota',
      model: 'Yaris',
      variant: '1.5 Hybrid Active',
      year: 2023,
      fuelType: 'hybride-benzine',
      transmission: 'automaat',
      price: 22500,
      mileage: 28000,
      bodyType: 'hatchback',
      color: 'Platina Grijs',
      power: 116,
      doors: 5,
      seats: 5,
      licensePlate: 'RK-891-D',
      shortDescription: 'Zuinige Toyota Yaris Hybrid met laag verbruik en Toyota Safety Sense pakket. Inclusief Apple CarPlay, achteruitrijcamera en automatische airconditioning. Nog 3 jaar fabrieksgarantie.',
    },
    {
      title: 'BMW 320i M Sport',
      slug: 'bmw-320i-m-sport',
      brandSlug: 'bmw',
      model: '3 Serie',
      variant: '320i M Sport',
      year: 2024,
      fuelType: 'benzine',
      transmission: 'automaat',
      price: 45900,
      mileage: 8000,
      bodyType: 'sedan',
      color: 'Zwart Metallic',
      power: 184,
      doors: 4,
      seats: 5,
      licensePlate: 'GV-102-F',
      shortDescription: 'Sportieve BMW 320i in M Sport-uitvoering met M-sportonderstel, 18-inch M-velgen en sport-stoelen. Voorzien van groot navigatiescherm, LED-koplampen en parking assistant. Als nieuw.',
    },
    {
      title: 'Renault Captur 1.0 TCe Techno',
      slug: 'renault-captur-10-tce-techno',
      brandSlug: 'renault',
      model: 'Captur',
      variant: '1.0 TCe Techno',
      year: 2023,
      fuelType: 'benzine',
      transmission: 'handgeschakeld',
      price: 24750,
      mileage: 32000,
      bodyType: 'suv',
      color: 'Iron Blauw',
      power: 91,
      doors: 5,
      seats: 5,
      licensePlate: 'HB-567-G',
      shortDescription: 'Compacte SUV in de rijk uitgeruste Techno-uitvoering met 9,3-inch touchscreen, draadloos Apple CarPlay, achteruitrijcamera en dodehoekdetectie. Zeer netjes onderhouden.',
    },
    {
      title: 'Kia EV6 58 kWh',
      slug: 'kia-ev6-58-kwh',
      brandSlug: 'kia',
      model: 'EV6',
      variant: '58 kWh',
      year: 2023,
      fuelType: 'elektrisch',
      transmission: 'automaat',
      price: 39900,
      mileage: 20000,
      bodyType: 'suv',
      color: 'Moonscape',
      power: 170,
      doors: 5,
      seats: 5,
      licensePlate: 'PD-234-H',
      shortDescription: 'Volledig elektrische Kia EV6 met 58 kWh accu en bereik tot 394 km WLTP. Ultra-snel laden (10-80% in 18 minuten), head-up display, verwarmde stoelen en stuur. Nog 5 jaar fabrieksgarantie.',
    },
    {
      title: 'Volkswagen Tiguan 2.0 TDI Elegance',
      slug: 'volkswagen-tiguan-20-tdi-elegance',
      brandSlug: 'volkswagen',
      model: 'Tiguan',
      variant: '2.0 TDI Elegance',
      year: 2022,
      fuelType: 'diesel',
      transmission: 'automaat',
      price: 35500,
      mileage: 45000,
      bodyType: 'suv',
      color: 'Dolphin Grey',
      power: 150,
      doors: 5,
      seats: 5,
      licensePlate: 'KS-789-J',
      shortDescription: 'Ruime Volkswagen Tiguan in Elegance-uitvoering met DSG-automaat. Voorzien van trekhaak, panoramadak, elektrische achterklep, verwarmd stuur en IQ.Drive assistentiepakket. Ideale gezinsauto.',
    },
  ]

  for (const vehicle of vehicles) {
    if (!(await checkExistingContent(payload, 'vehicles', vehicle.slug))) {
      try {
        const brandId = brandIds[vehicle.brandSlug]
        await payload.create({
          collection: 'vehicles',
          data: {
            title: vehicle.title,
            slug: vehicle.slug,
            status: 'beschikbaar',
            vehicleType: 'auto',
            brand: brandId || undefined,
            model: vehicle.model,
            variant: vehicle.variant,
            year: vehicle.year,
            fuelType: vehicle.fuelType,
            transmission: vehicle.transmission,
            price: vehicle.price,
            mileage: vehicle.mileage,
            bodyType: vehicle.bodyType,
            color: vehicle.color,
            power: vehicle.power,
            doors: vehicle.doors,
            seats: vehicle.seats,
            licensePlate: vehicle.licensePlate,
            napCheck: true,
            shortDescription: vehicle.shortDescription,
            description: richText(vehicle.shortDescription),
            featured: vehicle.slug === 'bmw-320i-m-sport' || vehicle.slug === 'kia-ev6-58-kwh',
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['vehicles'] = (result.collections['vehicles'] || 0) + 1
        payload.logger.info(`      + ${vehicle.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create vehicle "${vehicle.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${vehicle.title} (exists)`)
    }
  }

  // ==========================================================================
  // WERKPLAATSDIENSTEN (content-services, branch: automotive)
  // ==========================================================================
  payload.logger.info('      Seeding workshop services...')

  const workshopServices = [
    {
      title: 'APK Keuring',
      slug: 'apk-keuring',
      icon: 'shield',
      shortDescription: 'Wettelijk verplichte periodieke keuring van uw voertuig. Inclusief uitgebreide controle van remmen, verlichting, uitlaat en carrosserie. Resultaat direct bekend.',
      duration: 45,
      price: 39.95,
      serviceCategory: 'apk',
      bookable: true,
    },
    {
      title: 'Grote Beurt',
      slug: 'grote-beurt',
      icon: 'wrench',
      shortDescription: 'Uitgebreide onderhoudsbeurt volgens fabrieksvoorschrift. Inclusief olie verversen, alle filters, bougies, remvloeistof en uitgebreide controle van het complete voertuig.',
      duration: 120,
      price: 249,
      serviceCategory: 'onderhoud',
      bookable: true,
    },
    {
      title: 'Kleine Beurt',
      slug: 'kleine-beurt',
      icon: 'wrench',
      shortDescription: 'Standaard onderhoudsbeurt met olie- en filterverversing, vloeistofniveaus aanvullen en controle van banden, remmen en verlichting.',
      duration: 60,
      price: 149,
      serviceCategory: 'onderhoud',
      bookable: true,
    },
    {
      title: 'Bandenwissel (4 banden)',
      slug: 'bandenwissel',
      icon: 'tire',
      shortDescription: 'Wisselen van 4 banden inclusief balanceren, bandenspanning instellen en controle van het profiel. Opslag van uw seizoensbanden mogelijk.',
      duration: 30,
      price: 49.95,
      serviceCategory: 'banden',
      bookable: true,
    },
    {
      title: 'Airco Service',
      slug: 'airco-service',
      icon: 'snowflake',
      shortDescription: 'Complete airconditioning service inclusief koelmiddel bijvullen, lektest, temperatuurcontrole en reiniging van het pollendfilter. Voor een optimaal werkende airco.',
      duration: 60,
      price: 89.95,
      serviceCategory: 'airco',
      bookable: true,
    },
  ]

  for (const service of workshopServices) {
    if (!(await checkExistingContent(payload, 'content-services', service.slug))) {
      try {
        await payload.create({
          collection: 'content-services',
          data: {
            title: service.title,
            slug: service.slug,
            branch: 'automotive',
            icon: service.icon,
            shortDescription: service.shortDescription,
            description: richText(service.shortDescription),
            duration: service.duration,
            price: service.price,
            serviceCategory: service.serviceCategory,
            bookable: service.bookable,
            featured: service.slug === 'apk-keuring' || service.slug === 'grote-beurt',
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['content-services'] = (result.collections['content-services'] || 0) + 1
        payload.logger.info(`      + ${service.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create service "${service.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${service.title} (exists)`)
    }
  }

  // ==========================================================================
  // TEAMLEDEN (content-team, branch: automotive)
  // ==========================================================================
  payload.logger.info('      Seeding automotive team members...')

  const teamMembers = [
    {
      name: 'Jan de Vries',
      slug: 'jan-de-vries',
      role: 'Verkoopadviseur',
      bio: 'Jan is een ervaren verkoopadviseur met meer dan 15 jaar ervaring in de autobranche. Hij helpt u graag bij het vinden van de perfecte auto en adviseert u over financiering en inruil. Zijn uitgebreide kennis van het aanbod zorgt ervoor dat u altijd goed ge\u00efnformeerd een keuze maakt.',
      experience: 15,
      specialties: [
        { specialty: 'occasions' },
        { specialty: 'financiering' },
        { specialty: 'inruil' },
      ],
    },
    {
      name: 'Marco Bakker',
      slug: 'marco-bakker',
      role: 'Werkplaatsmanager',
      bio: 'Marco is werkplaatsmanager en gecertificeerd monteur met een passie voor techniek. Hij leidt ons team van monteurs en zorgt ervoor dat iedere auto in topconditie de werkplaats verlaat. Van APK-keuring tot complexe diagnoses: bij Marco bent u aan het juiste adres.',
      experience: 12,
      specialties: [
        { specialty: 'apk' },
        { specialty: 'onderhoud' },
        { specialty: 'diagnose' },
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
            branch: 'automotive',
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
        conversationFlows: automotiveConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: automotiveSystemPrompt,
        trainingContext: automotiveTrainingContext,
        welcomeMessage: automotiveWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
