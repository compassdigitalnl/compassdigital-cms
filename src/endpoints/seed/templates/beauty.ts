import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  beautyConversationFlows,
  beautySystemPrompt,
  beautyTrainingContext,
  beautyWelcomeMessage,
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
 * Seed Beauty Content
 *
 * Seeds: 6 treatments (content-services), 3 specialists (content-team),
 * 2 portfolio cases (content-cases), chatbot-settings global.
 */
export async function seedBeauty(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // BEHANDELINGEN (content-services, branch: beauty)
  // ==========================================================================
  payload.logger.info('      Seeding beauty treatments...')

  const treatments = [
    {
      title: 'Knippen & Styling',
      slug: 'knippen-styling',
      icon: 'scissors',
      shortDescription: 'Professioneel knippen en stylen door onze ervaren stylisten. Inclusief wasbeurt, advies en afwerking.',
      duration: 45,
      price: 45,
      bookable: true,
    },
    {
      title: 'Kleuren & Highlights',
      slug: 'kleuren-highlights',
      icon: 'palette',
      shortDescription: 'Van subtiele highlights tot complete kleurveranderingen. Onze kleurspecialisten werken met de beste producten.',
      duration: 120,
      price: 85,
      bookable: true,
    },
    {
      title: 'Gezichtsbehandeling',
      slug: 'gezichtsbehandeling',
      icon: 'sparkles',
      shortDescription: 'Luxe gezichtsbehandeling afgestemd op jouw huidtype. Reiniging, peeling, masker en hydratatie.',
      duration: 60,
      price: 65,
      bookable: true,
    },
    {
      title: 'Manicure',
      slug: 'manicure',
      icon: 'hand',
      shortDescription: 'Complete nagelverzorging inclusief vijlen, lakken en handmassage. Keuze uit reguliere lak of gelpolish.',
      duration: 45,
      price: 35,
      bookable: true,
    },
    {
      title: 'Ontspanningsmassage',
      slug: 'ontspanningsmassage',
      icon: 'heart',
      shortDescription: 'Ontspannende lichaamsmassage die spanning en stress wegneemt. Keuze uit diverse technieken.',
      duration: 60,
      price: 75,
      bookable: true,
    },
    {
      title: 'Bruidsmake-up',
      slug: 'bruidsmakeup',
      icon: 'crown',
      shortDescription: 'Compleet bruidsarrangement inclusief proefmake-up, haarstijl en make-up op de trouwdag.',
      duration: 180,
      priceFrom: 250,
      priceTo: 450,
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
            branch: 'beauty',
            icon: treatment.icon,
            shortDescription: treatment.shortDescription,
            description: richText(treatment.shortDescription),
            duration: treatment.duration,
            price: treatment.price || undefined,
            priceFrom: treatment.priceFrom || undefined,
            priceTo: treatment.priceTo || undefined,
            bookable: treatment.bookable,
            featured: treatment.slug === 'knippen-styling' || treatment.slug === 'gezichtsbehandeling',
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
  // SPECIALISTEN (content-team, branch: beauty)
  // ==========================================================================
  payload.logger.info('      Seeding beauty specialists...')

  const specialists = [
    {
      name: 'Sophie van der Berg',
      slug: 'sophie-van-der-berg',
      role: 'Senior Stylist',
      bio: 'Sophie is gespecialiseerd in kleurtechnieken en bruidskapsels. Met meer dan 10 jaar ervaring helpt zij klanten hun perfecte look te vinden.',
      bookable: true,
      experience: 10,
      specialties: [
        { specialty: 'Kleurtechnieken' },
        { specialty: 'Bruidskapsels' },
        { specialty: 'Balayage' },
      ],
    },
    {
      name: 'Lisa Jansen',
      slug: 'lisa-jansen',
      role: 'Huidspecialist',
      bio: 'Lisa is gediplomeerd huidtherapeut en gespecialiseerd in gezichtsbehandelingen en huidverbetering.',
      bookable: true,
      experience: 7,
      specialties: [
        { specialty: 'Gezichtsbehandelingen' },
        { specialty: 'Huidverbetering' },
        { specialty: 'Anti-aging' },
      ],
    },
    {
      name: 'Emma de Vries',
      slug: 'emma-de-vries',
      role: 'Nagelstyliste',
      bio: 'Emma is expert in nagelverzorging en nail art. Haar creatieve ontwerpen maken elke manicure uniek.',
      bookable: true,
      experience: 5,
      specialties: [
        { specialty: 'Gelpolish' },
        { specialty: 'Nail art' },
        { specialty: 'Manicure' },
      ],
    },
  ]

  for (const specialist of specialists) {
    if (!(await checkExistingContent(payload, 'content-team', specialist.slug))) {
      try {
        await payload.create({
          collection: 'content-team',
          data: {
            name: specialist.name,
            slug: specialist.slug,
            branch: 'beauty',
            role: specialist.role,
            bio: richText(specialist.bio),
            bookable: specialist.bookable,
            experience: specialist.experience,
            status: status === 'published' ? 'published' : 'draft',
            specialties: specialist.specialties,
          } as any,
        })
        result.collections['content-team'] = (result.collections['content-team'] || 0) + 1
        payload.logger.info(`      + ${specialist.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create specialist "${specialist.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${specialist.name} (exists)`)
    }
  }

  // ==========================================================================
  // PORTFOLIO CASES (content-cases, branch: beauty)
  // ==========================================================================
  payload.logger.info('      Seeding beauty portfolio cases...')

  const cases = [
    {
      title: 'Balayage Transformatie',
      slug: 'balayage-transformatie',
      shortDescription: 'Van eentonig bruin naar een prachtige balayage met warme honing- en karameltinten.',
      client: 'Anoniem',
      resultHighlight: 'Natuurlijke kleurovergang',
      badges: [{ badge: 'Balayage' }, { badge: 'Kleuring' }, { badge: 'Transformatie' }],
    },
    {
      title: 'Bruidsmake-up Sarah',
      slug: 'bruidsmakeup-sarah',
      shortDescription: 'Natuurlijke bruidsmake-up met zachte smokey eyes en een frisse gloed.',
      client: 'Sarah',
      resultHighlight: 'Stralende bruidslook',
      badges: [{ badge: 'Bruid' }, { badge: 'Make-up' }, { badge: 'Haarstyling' }],
    },
  ]

  for (const caseItem of cases) {
    if (!(await checkExistingContent(payload, 'content-cases', caseItem.slug))) {
      try {
        await payload.create({
          collection: 'content-cases',
          data: {
            title: caseItem.title,
            slug: caseItem.slug,
            branch: 'beauty',
            shortDescription: caseItem.shortDescription,
            client: caseItem.client,
            resultHighlight: caseItem.resultHighlight,
            badges: caseItem.badges,
            challenge: richText(`De klant wilde ${caseItem.shortDescription.toLowerCase()}`),
            solution: richText('Onze specialisten hebben een persoonlijk plan opgesteld en stap voor stap het gewenste resultaat bereikt.'),
            resultDescription: richText(`Het eindresultaat: ${caseItem.resultHighlight.toLowerCase()}. De klant was zeer tevreden met het resultaat.`),
            featured: true,
            _status: status as 'draft' | 'published',
          } as any,
        })
        result.collections['content-cases'] = (result.collections['content-cases'] || 0) + 1
        payload.logger.info(`      + ${caseItem.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create case "${caseItem.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${caseItem.title} (exists)`)
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
        conversationFlows: beautyConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: beautySystemPrompt,
        trainingContext: beautyTrainingContext,
        welcomeMessage: beautyWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
