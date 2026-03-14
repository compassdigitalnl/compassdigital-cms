import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  zorgConversationFlows,
  zorgSystemPrompt,
  zorgTrainingContext,
  zorgWelcomeMessage,
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
 * Seed Zorg Content
 *
 * Seeds: 6 treatments (content-services), 3 practitioners (content-team),
 * chatbot-settings global.
 */
export async function seedZorg(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // BEHANDELINGEN (content-services, branch: zorg)
  // ==========================================================================
  payload.logger.info('      Seeding zorg treatments...')

  const treatments = [
    {
      title: 'Fysiotherapie',
      slug: 'fysiotherapie',
      icon: 'activity',
      shortDescription: 'Herstel van bewegingsklachten door middel van oefentherapie, manuele technieken en persoonlijk advies. Geschikt voor acute en chronische klachten.',
      duration: 30,
      price: 45,
      insurance: 'covered',
      successRate: 92,
      bookable: true,
    },
    {
      title: 'Manuele Therapie',
      slug: 'manuele-therapie',
      icon: 'hand',
      shortDescription: 'Gespecialiseerde handmatige behandeling van gewrichten, spieren en zenuwen. Effectief bij nek-, rug- en gewrichtsklachten.',
      duration: 30,
      price: 55,
      insurance: 'partial',
      successRate: 88,
      bookable: true,
    },
    {
      title: 'Sportfysiotherapie',
      slug: 'sportfysiotherapie',
      icon: 'dumbbell',
      shortDescription: 'Behandeling en preventie van sportblessures. Inclusief revalidatie, taping en sportspecifiek trainingsadvies.',
      duration: 45,
      price: 55,
      insurance: 'partial',
      successRate: 90,
      bookable: true,
    },
    {
      title: 'Dry Needling',
      slug: 'dry-needling',
      icon: 'target',
      shortDescription: 'Behandeling van triggerpoints met dunne naalden voor snelle pijnverlichting. Effectief bij spierspanning en uitstralende pijn.',
      duration: 30,
      price: 50,
      insurance: 'not-covered',
      successRate: 85,
      bookable: true,
    },
    {
      title: 'Echografie',
      slug: 'echografie',
      icon: 'scan',
      shortDescription: 'Diagnostisch beeldvormend onderzoek van spieren, pezen en gewrichten. Directe beeldvorming voor een nauwkeurige diagnose.',
      duration: 20,
      price: 65,
      insurance: 'covered',
      successRate: null,
      bookable: true,
    },
    {
      title: 'Kinderfysiotherapie',
      slug: 'kinderfysiotherapie',
      icon: 'baby',
      shortDescription: 'Fysiotherapie speciaal voor kinderen van 0-18 jaar. Speelse behandeling van motorische en houdingsklachten.',
      duration: 30,
      price: 45,
      insurance: 'covered',
      successRate: 94,
      bookable: true,
    },
  ]

  for (const treatment of treatments) {
    if (!(await checkExistingContent(payload, 'content-services', treatment.slug))) {
      try {
        await payload.create({
          collection: 'content-services',
          data: {
            title: treatment.title,
            slug: treatment.slug,
            branch: 'zorg',
            icon: treatment.icon,
            shortDescription: treatment.shortDescription,
            description: richText(treatment.shortDescription),
            duration: treatment.duration,
            price: treatment.price,
            insurance: treatment.insurance,
            successRate: treatment.successRate,
            bookable: treatment.bookable,
            featured: treatment.slug === 'fysiotherapie' || treatment.slug === 'manuele-therapie',
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['content-services'] = (result.collections['content-services'] || 0) + 1
        payload.logger.info(`      + ${treatment.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create treatment "${treatment.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${treatment.title} (exists)`)
    }
  }

  // ==========================================================================
  // BEHANDELAARS (content-team, branch: zorg)
  // ==========================================================================
  payload.logger.info('      Seeding zorg practitioners...')

  const practitioners = [
    {
      name: 'Drs. Mark de Boer',
      slug: 'mark-de-boer',
      role: 'Fysiotherapeut',
      bio: 'Mark is een ervaren fysiotherapeut met een brede expertise in manuele therapie en sportrevalidatie. Met 12 jaar ervaring helpt hij patiënten effectief bij het herstel van bewegingsklachten.',
      bookable: true,
      experience: 12,
      specialties: [
        { specialty: 'Manuele therapie' },
        { specialty: 'Sportrevalidatie' },
        { specialty: 'Dry needling' },
      ],
    },
    {
      name: 'Drs. Sarah Visser',
      slug: 'sarah-visser',
      role: 'Manueel Therapeut',
      bio: 'Sarah is gespecialiseerd in manuele therapie met een focus op nekklachten en hoofdpijn. Haar gedegen kennis en persoonlijke aanpak zorgen voor effectieve en duurzame resultaten.',
      bookable: true,
      experience: 8,
      specialties: [
        { specialty: 'Manuele therapie' },
        { specialty: 'Nekklachten' },
        { specialty: 'Hoofdpijn' },
      ],
    },
    {
      name: 'Drs. Thomas Bakker',
      slug: 'thomas-bakker',
      role: 'Sportfysiotherapeut',
      bio: 'Thomas combineert zijn achtergrond als sportfysiotherapeut met echografie-expertise. Hij begeleidt sporters van diagnose tot volledige terugkeer naar hun sport.',
      bookable: true,
      experience: 6,
      specialties: [
        { specialty: 'Sportblessures' },
        { specialty: 'Revalidatie' },
        { specialty: 'Echografie' },
      ],
    },
  ]

  for (const practitioner of practitioners) {
    if (!(await checkExistingContent(payload, 'content-team', practitioner.slug))) {
      try {
        await payload.create({
          collection: 'content-team',
          data: {
            name: practitioner.name,
            slug: practitioner.slug,
            branch: 'zorg',
            role: practitioner.role,
            bio: richText(practitioner.bio),
            bookable: practitioner.bookable,
            experience: practitioner.experience,
            status: status === 'published' ? 'published' : 'draft',
            specialties: practitioner.specialties,
          } as any,
        })
        result.collections['content-team'] = (result.collections['content-team'] || 0) + 1
        payload.logger.info(`      + ${practitioner.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create practitioner "${practitioner.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${practitioner.name} (exists)`)
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
        conversationFlows: zorgConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: zorgSystemPrompt,
        trainingContext: zorgTrainingContext,
        welcomeMessage: zorgWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
