import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page, BlogPost } from '@/payload-types'
import {
  buildLocalBusinessSchema,
  buildWebSiteSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildArticleSchema,
  buildReviewSchemas,
} from '@/lib/seo/schema-builders'

interface JsonLdSchemaProps {
  page?: Page
  post?: BlogPost
}

export async function JsonLdSchema({ page, post }: JsonLdSchemaProps) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'

  // Check if JSON-LD is enabled
  if (!settings.enableJSONLD) return null

  const schemas: object[] = []

  // ─── LocalBusiness (always on every page) ─────────────────
  schemas.push(buildLocalBusinessSchema(settings, siteUrl))

  // ─── Page-specific schemas ────────────────────────────────
  if (page) {
    // WebSite schema (homepage only)
    if (page.slug === 'home' || page.slug === '/' || page.slug === '') {
      schemas.push(buildWebSiteSchema(settings, siteUrl))
    }

    // Breadcrumbs (all pages except homepage)
    if (page.slug !== 'home' && page.slug !== '/' && page.slug !== '') {
      schemas.push(buildBreadcrumbSchema(page, siteUrl))
    }

    // Block-specific schemas
    if (page.layout && Array.isArray(page.layout)) {
      for (const block of page.layout) {
        // FAQ schema
        if (block.blockType === 'faq') {
          const faqSchema = buildFAQSchema(block)
          if (faqSchema) schemas.push(faqSchema)
        }

        // Testimonials/Reviews schema
        if (block.blockType === 'testimonials') {
          const reviewSchemas = buildReviewSchemas(block, settings, siteUrl)
          schemas.push(...reviewSchemas)
        }
      }
    }
  }

  // ─── Blog post schema ──────────────────────────────────────
  if (post) {
    schemas.push(buildArticleSchema(post, settings, siteUrl))
  }

  if (schemas.length === 0) return null

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
