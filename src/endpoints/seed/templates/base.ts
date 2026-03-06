import type { Payload } from 'payload'
import { sql } from 'drizzle-orm'
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
  // FORMS (Contact + Newsletter + Quote) — via raw SQL
  // (Payload's form builder plugin has a boolean→integer bug in the local API,
  //  so we insert directly to ensure `required` is stored as integer correctly)
  // ==========================================================================
  payload.logger.info('   → Creating default forms...')

  const existingForms = await payload.find({ collection: 'forms', limit: 100 })
  const existingFormTitles = existingForms.docs.map((f: any) => f.title)
  const db = (payload.db as any).drizzle

  type FormField = { blockType: string; name: string; label: string; required: boolean }

  const richText = (children: any[]) => JSON.stringify({
    root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
  })

  async function seedForm(
    title: string,
    submitLabel: string,
    confirmChildren: any[],
    fields: FormField[],
  ) {
    if (existingFormTitles.includes(title)) return

    payload.logger.info(`     → Creating ${title}...`)

    // Insert form row
    const formRows = await db.execute(sql`
      INSERT INTO forms (title, submit_button_label, confirmation_type, confirmation_message, updated_at, created_at)
      VALUES (${title}, ${submitLabel}, 'message', ${richText(confirmChildren)}::jsonb, NOW(), NOW())
      RETURNING id
    `)
    const formId = formRows.rows[0].id

    // Insert field blocks
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i]
      const order = i + 1
      const id = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      const req = f.required ? 1 : 0

      await db.execute(sql.raw(
        `INSERT INTO forms_blocks_${f.blockType} (_order, _parent_id, _path, id, name, label, required)
         VALUES (${order}, ${formId}, 'fields', '${id}', '${f.name}', '${f.label}', ${req})`
      ))
    }

    result.collections.forms = (result.collections.forms || 0) + 1
  }

  await seedForm('Contactformulier', 'Versturen', [
    { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Bedankt voor uw bericht!' }] },
    { type: 'paragraph', children: [{ type: 'text', text: 'Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op.' }] },
  ], [
    { blockType: 'text', name: 'naam', label: 'Naam', required: true },
    { blockType: 'email', name: 'email', label: 'E-mailadres', required: true },
    { blockType: 'text', name: 'telefoon', label: 'Telefoonnummer', required: false },
    { blockType: 'textarea', name: 'bericht', label: 'Uw bericht', required: true },
    { blockType: 'checkbox', name: 'privacy', label: 'Ik ga akkoord met het privacybeleid', required: true },
  ])

  await seedForm('Nieuwsbrief', 'Aanmelden', [
    { type: 'paragraph', children: [{ type: 'text', text: 'U bent succesvol aangemeld voor onze nieuwsbrief!' }] },
  ], [
    { blockType: 'text', name: 'naam', label: 'Naam', required: false },
    { blockType: 'email', name: 'email', label: 'E-mailadres', required: true },
  ])

  await seedForm('Offerte aanvragen', 'Offerte aanvragen', [
    { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Bedankt voor uw aanvraag!' }] },
    { type: 'paragraph', children: [{ type: 'text', text: 'Wij nemen binnen 2 werkdagen contact met u op met een offerte op maat.' }] },
  ], [
    { blockType: 'text', name: 'bedrijfsnaam', label: 'Bedrijfsnaam', required: true },
    { blockType: 'text', name: 'contactpersoon', label: 'Contactpersoon', required: true },
    { blockType: 'email', name: 'email', label: 'E-mailadres', required: true },
    { blockType: 'text', name: 'telefoon', label: 'Telefoonnummer', required: true },
    { blockType: 'textarea', name: 'omschrijving', label: 'Omschrijving van uw aanvraag', required: true },
    { blockType: 'checkbox', name: 'privacy', label: 'Ik ga akkoord met het privacybeleid', required: true },
  ])

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
