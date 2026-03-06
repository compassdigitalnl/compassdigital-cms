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
  // FORMS (Contact + Newsletter) — via Payload Form Builder
  // ==========================================================================
  payload.logger.info('   → Creating default forms...')

  // Check if forms already exist
  const existingForms = await payload.find({ collection: 'forms', limit: 100 })
  const existingFormTitles = existingForms.docs.map((f: any) => f.title)

  if (!existingFormTitles.includes('Contactformulier')) {
    payload.logger.info('     → Creating contact form...')
    await payload.create({
      collection: 'forms',
      data: {
        title: 'Contactformulier',
        submitButtonLabel: 'Versturen',
        confirmationType: 'message',
        confirmationMessage: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h3',
                children: [{ type: 'text', text: 'Bedankt voor uw bericht!' }],
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', text: `Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op.` }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        fields: [
          {
            blockType: 'text',
            name: 'naam',
            label: 'Naam',
            required: true,
            width: 50,
          },
          {
            blockType: 'email',
            name: 'email',
            label: 'E-mailadres',
            required: true,
            width: 50,
          },
          {
            blockType: 'text',
            name: 'telefoon',
            label: 'Telefoonnummer',
            required: false,
            width: 50,
          },
          {
            blockType: 'select',
            name: 'onderwerp',
            label: 'Onderwerp',
            required: false,
            width: 50,
            options: [
              { label: 'Algemene vraag', value: 'algemeen' },
              { label: 'Bestelling', value: 'bestelling' },
              { label: 'Retour / Ruiling', value: 'retour' },
              { label: 'Factuur', value: 'factuur' },
              { label: 'Klacht', value: 'klacht' },
              { label: 'Overig', value: 'overig' },
            ],
          },
          {
            blockType: 'textarea',
            name: 'bericht',
            label: 'Uw bericht',
            required: true,
          },
          {
            blockType: 'checkbox',
            name: 'privacy',
            label: 'Ik ga akkoord met het privacybeleid',
            required: true,
          },
        ],
      } as any,
    })
    result.collections.forms = (result.collections.forms || 0) + 1
  }

  if (!existingFormTitles.includes('Nieuwsbrief')) {
    payload.logger.info('     → Creating newsletter form...')
    await payload.create({
      collection: 'forms',
      data: {
        title: 'Nieuwsbrief',
        submitButtonLabel: 'Aanmelden',
        confirmationType: 'message',
        confirmationMessage: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'U bent succesvol aangemeld voor onze nieuwsbrief!' }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        fields: [
          {
            blockType: 'text',
            name: 'naam',
            label: 'Naam',
            required: false,
            width: 50,
          },
          {
            blockType: 'email',
            name: 'email',
            label: 'E-mailadres',
            required: true,
            width: 50,
          },
        ],
      } as any,
    })
    result.collections.forms = (result.collections.forms || 0) + 1
  }

  if (!existingFormTitles.includes('Offerte aanvragen')) {
    payload.logger.info('     → Creating quote request form...')
    await payload.create({
      collection: 'forms',
      data: {
        title: 'Offerte aanvragen',
        submitButtonLabel: 'Offerte aanvragen',
        confirmationType: 'message',
        confirmationMessage: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h3',
                children: [{ type: 'text', text: 'Bedankt voor uw aanvraag!' }],
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Wij nemen binnen 2 werkdagen contact met u op met een offerte op maat.' }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        fields: [
          {
            blockType: 'text',
            name: 'bedrijfsnaam',
            label: 'Bedrijfsnaam',
            required: true,
            width: 50,
          },
          {
            blockType: 'text',
            name: 'contactpersoon',
            label: 'Contactpersoon',
            required: true,
            width: 50,
          },
          {
            blockType: 'email',
            name: 'email',
            label: 'E-mailadres',
            required: true,
            width: 50,
          },
          {
            blockType: 'text',
            name: 'telefoon',
            label: 'Telefoonnummer',
            required: true,
            width: 50,
          },
          {
            blockType: 'textarea',
            name: 'omschrijving',
            label: 'Omschrijving van uw aanvraag',
            required: true,
          },
          {
            blockType: 'checkbox',
            name: 'privacy',
            label: 'Ik ga akkoord met het privacybeleid',
            required: true,
          },
        ],
      } as any,
    })
    result.collections.forms = (result.collections.forms || 0) + 1
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
