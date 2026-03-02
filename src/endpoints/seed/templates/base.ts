import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import { checkExistingContent } from '../seedOrchestrator'

export interface SeedResultPartial {
  collections: Record<string, number>
  globals: string[]
}

/**
 * Seed Base Content (ALTIJD)
 *
 * Homepage, contact page, header, footer, settings
 * Deze content is altijd nodig, ongeacht features
 */
export async function seedBase(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  const { companyName, domain } = options

  // ==========================================================================
  // HOMEPAGE
  // ==========================================================================
  if (!(await checkExistingContent(payload, 'pages', 'home'))) {
    payload.logger.info('   → Creating homepage...')

    await payload.create({
      collection: 'pages',
      data: {
        title: `Welkom bij ${companyName}`,
        slug: 'home',
        _status: status as 'draft' | 'published',
        layout: [
          {
            blockType: 'content',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Over ons',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: `Dit is de homepage van ${companyName}. Voeg hier uw eigen content toe via het admin panel. U kunt tekst, afbeeldingen, formulieren en meer toevoegen.`,
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          } as any,
          {
            blockType: 'cta',
            title: 'Klaar om te beginnen?',
            description: 'Neem contact met ons op voor meer informatie.',
            buttons: [
              {
                link: {
                  type: 'reference',
                  label: 'Contact',
                  reference: {
                    relationTo: 'pages',
                    value: 'contact',  // Will be resolved after contact page creation
                  },
                },
              },
            ],
          } as any,
        ],
        meta: {
          title: `${companyName} - Welkom`,
          description: `Welkom bij ${companyName}. Ontdek wat we voor u kunnen betekenen.`,
        },
      },
    })

    result.collections.pages = (result.collections.pages || 0) + 1
  }

  // ==========================================================================
  // CONTACT PAGE
  // ==========================================================================
  if (!(await checkExistingContent(payload, 'pages', 'contact'))) {
    payload.logger.info('   → Creating contact page...')

    await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact',
        slug: 'contact',
        _status: status as 'draft' | 'published',
        layout: [
          {
            blockType: 'content',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Contactgegevens',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: `${companyName}`,
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: `Website: ${domain}`,
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'E-mail: info@' + domain,
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          } as any,
        ],
        meta: {
          title: `Contact - ${companyName}`,
          description: `Neem contact op met ${companyName}. We beantwoorden uw vragen graag.`,
        },
      },
    })

    result.collections.pages = (result.collections.pages || 0) + 1
  }

  // ==========================================================================
  // HEADER GLOBAL
  // ==========================================================================
  payload.logger.info('   → Updating header...')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Home',
            url: '/',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Contact',
            url: '/contact',
          },
        },
      ],
    } as any,
  })

  result.globals.push('header')

  // ==========================================================================
  // FOOTER GLOBAL
  // ==========================================================================
  payload.logger.info('   → Updating footer...')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Admin',
            url: '/admin',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Privacy Policy',
            url: '/privacy',
          },
        },
        {
          link: {
            type: 'custom',
            label: companyName,
            url: '/',
          },
        },
      ],
    } as any,
  })

  result.globals.push('footer')

  return result
}
