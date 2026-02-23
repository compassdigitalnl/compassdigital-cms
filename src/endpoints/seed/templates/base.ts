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
        _status: status,
        hero: {
          type: 'minimal',
          richText: [
            {
              children: [
                {
                  text: `Welkom bij ${companyName}`,
                },
              ],
              type: 'h1',
            },
            {
              children: [
                {
                  text: 'Deze site is aangemaakt met Compass Digital CMS. Pas de content aan in het admin panel.',
                },
              ],
            },
          ],
        },
        layout: [
          {
            blockType: 'content',
            richText: [
              {
                children: [
                  {
                    text: 'Over ons',
                  },
                ],
                type: 'h2',
              },
              {
                children: [
                  {
                    text: `Dit is de homepage van ${companyName}. Voeg hier uw eigen content toe via het admin panel. U kunt tekst, afbeeldingen, formulieren en meer toevoegen.`,
                  },
                ],
              },
            ],
          },
          {
            blockType: 'cta',
            richText: [
              {
                children: [
                  {
                    text: 'Klaar om te beginnen?',
                  },
                ],
                type: 'h3',
              },
              {
                children: [
                  {
                    text: 'Neem contact met ons op voor meer informatie.',
                  },
                ],
              },
            ],
            links: [
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
          },
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
        _status: status,
        hero: {
          type: 'minimal',
          richText: [
            {
              children: [
                {
                  text: 'Contact',
                },
              ],
              type: 'h1',
            },
            {
              children: [
                {
                  text: 'Neem contact met ons op. We helpen u graag verder.',
                },
              ],
            },
          ],
        },
        layout: [
          {
            blockType: 'content',
            richText: [
              {
                children: [
                  {
                    text: 'Contactgegevens',
                  },
                ],
                type: 'h2',
              },
              {
                children: [
                  {
                    text: `${companyName}`,
                  },
                ],
              },
              {
                children: [
                  {
                    text: `Website: ${domain}`,
                  },
                ],
              },
              {
                children: [
                  {
                    text: 'E-mail: info@' + domain,
                  },
                ],
              },
            ],
          },
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
    },
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
    },
  })

  result.globals.push('footer')

  return result
}
