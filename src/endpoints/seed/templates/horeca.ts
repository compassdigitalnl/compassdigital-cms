import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  horecaConversationFlows,
  horecaSystemPrompt,
  horecaTrainingContext,
  horecaWelcomeMessage,
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
 * Seed Horeca Content
 *
 * Seeds: 8 menu items (content-services), 3 events (content-activities),
 * 3 team members (content-team), chatbot-settings global.
 */
export async function seedHoreca(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // MENU ITEMS (content-services, branch: horeca)
  // ==========================================================================
  payload.logger.info('      Seeding horeca menu items...')

  const menuItems = [
    {
      title: 'Carpaccio van Rund',
      slug: 'carpaccio-rund',
      icon: '\uD83E\uDD69',
      category: 'Voorgerechten',
      price: 1450,
      shortDescription: 'Flinterdun gesneden rundvlees met rucola, parmezaan en truffelvinaigrette',
    },
    {
      title: 'Seizoenssoep',
      slug: 'seizoenssoep',
      icon: '\uD83C\uDF5C',
      category: 'Voorgerechten',
      price: 950,
      shortDescription: 'Dagverse soep op basis van seizoensgroenten, geserveerd met zuurdesembrood',
    },
    {
      title: 'Entrec\u00F4te',
      slug: 'entrecote',
      icon: '\uD83E\uDD69',
      category: 'Hoofdgerechten',
      price: 2850,
      shortDescription: '300g Black Angus entrec\u00F4te met kruidenboter, frites en seizoenssalade',
    },
    {
      title: 'Risotto ai Funghi',
      slug: 'risotto-funghi',
      icon: '\uD83C\uDF5A',
      category: 'Hoofdgerechten',
      price: 2250,
      shortDescription: 'Romige risotto met wilde paddenstoelen, truffelolie en parmezaan',
    },
    {
      title: 'Zeebaarsfilet',
      slug: 'zeebaarsfilet',
      icon: '\uD83D\uDC1F',
      category: 'Hoofdgerechten',
      price: 2650,
      shortDescription: 'Gebakken zeebaarsfilet op een bedje van geroosterde groenten met saffraansaus',
    },
    {
      title: 'Cr\u00E8me Br\u00FBl\u00E9e',
      slug: 'creme-brulee',
      icon: '\uD83C\uDF6E',
      category: 'Desserts',
      price: 1050,
      shortDescription: 'Klassieke cr\u00E8me br\u00FBl\u00E9e met een krokant suikerlaagje en vers fruit',
    },
    {
      title: 'Kindermenu',
      slug: 'kindermenu',
      icon: '\uD83D\uDC76',
      category: 'Kindermenu',
      price: 1250,
      shortDescription: 'Keuze uit pasta, kipnuggets of mini-hamburger met frietjes en een drankje',
    },
    {
      title: "Chef's Special",
      slug: 'chefs-special',
      icon: '\u2B50',
      category: 'Specials',
      price: 3450,
      shortDescription: 'Wekelijks wisselend 4-gangenmenu samengesteld door onze chef-kok',
    },
  ]

  for (const item of menuItems) {
    if (!(await checkExistingContent(payload, 'content-services', item.slug))) {
      try {
        await payload.create({
          collection: 'content-services',
          data: {
            title: item.title,
            slug: item.slug,
            branch: 'horeca',
            icon: item.icon,
            category: item.category,
            shortDescription: item.shortDescription,
            description: richText(item.shortDescription),
            price: item.price,
            featured: item.slug === 'entrecote' || item.slug === 'chefs-special',
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['content-services'] = (result.collections['content-services'] || 0) + 1
        payload.logger.info(`      + ${item.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create menu item "${item.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${item.title} (exists)`)
    }
  }

  // ==========================================================================
  // EVENEMENTEN (content-activities, branch: horeca)
  // ==========================================================================
  payload.logger.info('      Seeding horeca events...')

  const events = [
    {
      title: 'Live Jazz Avond',
      slug: 'live-jazz-avond',
      type: 'event',
      shortDescription: 'Geniet van live jazz bij een heerlijk diner. Elke eerste vrijdag van de maand.',
      price: 0,
      priceType: 'free',
      maxParticipants: undefined,
    },
    {
      title: 'Wijnproeverij',
      slug: 'wijnproeverij',
      type: 'event',
      shortDescription: 'Ontdek 6 bijzondere wijnen onder begeleiding van onze sommelier.',
      price: 3500,
      priceType: 'per-person',
      maxParticipants: 20,
    },
    {
      title: 'Kookworkshop met de Chef',
      slug: 'kookworkshop-chef',
      type: 'workshop',
      shortDescription: 'Leer de geheimen van onze keuken in een hands-on kookworkshop van 3 uur.',
      price: 7500,
      priceType: 'per-person',
      maxParticipants: 12,
    },
  ]

  for (const event of events) {
    if (!(await checkExistingContent(payload, 'content-activities', event.slug))) {
      try {
        await payload.create({
          collection: 'content-activities',
          data: {
            title: event.title,
            slug: event.slug,
            branch: 'horeca',
            type: event.type,
            shortDescription: event.shortDescription,
            description: richText(event.shortDescription),
            price: event.price,
            priceType: event.priceType,
            maxParticipants: event.maxParticipants,
            featured: true,
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['content-activities'] = (result.collections['content-activities'] || 0) + 1
        payload.logger.info(`      + ${event.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create event "${event.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${event.title} (exists)`)
    }
  }

  // ==========================================================================
  // TEAM MEMBERS (content-team, branch: horeca)
  // ==========================================================================
  payload.logger.info('      Seeding horeca team members...')

  const teamMembers = [
    {
      name: 'Marco Rossi',
      slug: 'marco-rossi',
      role: 'Chef-kok',
      bio: 'Chef Marco brengt 20 jaar internationale ervaring mee. Zijn passie voor verse, lokale ingredi\u00EBnten vormt de basis van onze menukaart.',
      specialties: [
        { specialty: 'Italiaanse keuken' },
        { specialty: 'Seizoensgebonden menu' },
        { specialty: 'Vis & zeevruchten' },
      ],
    },
    {
      name: 'Sophie Laurent',
      slug: 'sophie-laurent',
      role: 'Sommelier',
      bio: 'Sophie is gecertificeerd sommelier en selecteert persoonlijk onze wijnkaart. Zij adviseert graag bij uw wijkeuze.',
      specialties: [
        { specialty: 'Wijnadvies' },
        { specialty: 'Wine pairing' },
        { specialty: 'Proeverijen' },
      ],
    },
    {
      name: 'Thomas van Dijk',
      slug: 'thomas-van-dijk',
      role: 'Gastheer',
      bio: 'Thomas zorgt ervoor dat elk bezoek aan ons restaurant een bijzondere ervaring is. Zijn oog voor detail maakt het verschil.',
      specialties: [
        { specialty: 'Gastvrijheid' },
        { specialty: 'Groepsarrangementen' },
        { specialty: 'Evenementen' },
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
            branch: 'horeca',
            role: member.role,
            bio: richText(member.bio),
            specialties: member.specialties,
            status: status === 'published' ? 'published' : 'draft',
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
        conversationFlows: horecaConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: horecaSystemPrompt,
        trainingContext: horecaTrainingContext,
        welcomeMessage: horecaWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
