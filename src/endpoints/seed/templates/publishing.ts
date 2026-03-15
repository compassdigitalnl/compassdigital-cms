import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  publishingConversationFlows,
  publishingSystemPrompt,
  publishingTrainingContext,
  publishingWelcomeMessage,
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
 * Seed Publishing Content
 *
 * Seeds: 3 blog categories, 4 blog articles (blog-posts),
 * chatbot-settings global.
 */
export async function seedPublishing(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // BLOG CATEGORIEËN (blog-categories)
  // ==========================================================================
  payload.logger.info('      Seeding publishing blog categories...')

  const categories = [
    {
      name: 'Nieuws',
      slug: 'nieuws',
      icon: 'Newspaper',
      color: 'blue',
      description: 'Het laatste nieuws over publicaties, media en de uitgeverswereld.',
      displayOrder: 1,
    },
    {
      name: 'Achtergrond',
      slug: 'achtergrond',
      icon: 'BookOpen',
      color: 'purple',
      description: 'Diepgaande achtergrondartikelen en analyses over de mediawereld.',
      displayOrder: 2,
    },
    {
      name: 'How-to',
      slug: 'how-to',
      icon: 'GraduationCap',
      color: 'green',
      description: 'Praktische handleidingen en tips voor content creators en uitgevers.',
      displayOrder: 3,
    },
  ]

  // Create categories and store their IDs for article relationships
  const categoryIdMap: Record<string, number | string> = {}

  for (const category of categories) {
    if (!(await checkExistingContent(payload, 'blog-categories', category.slug))) {
      try {
        const created = await payload.create({
          collection: 'blog-categories',
          data: {
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            color: category.color,
            description: category.description,
            displayOrder: category.displayOrder,
          } as any,
        })
        categoryIdMap[category.slug] = created.id
        result.collections['blog-categories'] = (result.collections['blog-categories'] || 0) + 1
        payload.logger.info(`      + ${category.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create category "${category.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${category.name} (exists)`)
      // Fetch existing category ID for article relationships
      try {
        const existing = await payload.find({
          collection: 'blog-categories',
          where: { slug: { equals: category.slug } },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          categoryIdMap[category.slug] = existing.docs[0].id
        }
      } catch {
        // Ignore — article relationship will be skipped
      }
    }
  }

  // ==========================================================================
  // BLOG ARTIKELEN (blog-posts)
  // ==========================================================================
  payload.logger.info('      Seeding publishing blog articles...')

  const articles = [
    {
      title: 'De Toekomst van Digitale Media',
      slug: 'toekomst-digitale-media',
      excerpt: 'Hoe digitale media het publicatielandschap transformeert en wat dit betekent voor uitgevers.',
      categorySlug: 'achtergrond',
      contentType: 'article',
      contentAccess: { accessLevel: 'free' },
      featured: true,
    },
    {
      title: '5 Tips voor Effectieve Contentmarketing',
      slug: 'tips-contentmarketing',
      excerpt: 'Praktische tips om uw contentmarketing naar een hoger niveau te tillen.',
      categorySlug: 'how-to',
      contentType: 'guide',
      contentAccess: { accessLevel: 'free' },
      featured: false,
    },
    {
      title: 'Exclusief: Interview met de Hoofdredacteur',
      slug: 'interview-hoofdredacteur',
      excerpt: 'Een diepgaand gesprek over de toekomst van onze publicaties en de rol van digitale innovatie.',
      categorySlug: 'achtergrond',
      contentType: 'article',
      contentAccess: {
        accessLevel: 'premium',
        previewLength: 200,
        lockMessage: 'Dit interview is exclusief beschikbaar voor premium abonnees.',
      },
      featured: true,
    },
    {
      title: 'Handleiding: Uw Digitale Bibliotheek Gebruiken',
      slug: 'handleiding-digitale-bibliotheek',
      excerpt: 'Stap-voor-stap handleiding voor het gebruik van de digitale bibliotheek.',
      categorySlug: 'how-to',
      contentType: 'guide',
      contentAccess: {
        accessLevel: 'premium',
        previewLength: 300,
      },
      featured: false,
    },
  ]

  for (const article of articles) {
    if (!(await checkExistingContent(payload, 'blog-posts', article.slug))) {
      try {
        const categoryId = categoryIdMap[article.categorySlug]

        await payload.create({
          collection: 'blog-posts',
          data: {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: richText(article.excerpt),
            contentType: article.contentType,
            contentAccess: article.contentAccess,
            featured: article.featured,
            status: status === 'published' ? 'published' : 'draft',
            _status: status as 'draft' | 'published',
            ...(categoryId ? { categories: [categoryId] } : {}),
          } as any,
        })
        result.collections['blog-posts'] = (result.collections['blog-posts'] || 0) + 1
        payload.logger.info(`      + ${article.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create article "${article.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${article.title} (exists)`)
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
        conversationFlows: publishingConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: publishingSystemPrompt,
        trainingContext: publishingTrainingContext,
        welcomeMessage: publishingWelcomeMessage,
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
