import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
// import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob' // TODO: Install package and configure
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL, GenerateDescription } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import type { Page, BlogPost } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// ─── Smart Title Generation ──────────────────────────────────
const generateTitle: GenerateTitle = ({ doc, collectionSlug }) => {
  const siteName = process.env.SITE_NAME || 'Website'

  if (!doc?.title) return siteName

  // Homepage gets special treatment
  if (doc.slug === 'home') {
    return `${siteName} | ${(doc as any).tagline || doc.title}`
  }

  // Blog posts
  if (collectionSlug === 'blog-posts') {
    return `${doc.title} | Blog`
  }

  // Cases/Portfolio
  if (collectionSlug === 'cases') {
    return `${doc.title} | Portfolio`
  }

  // Default: Just the title (clean for SEO)
  return doc.title
}

// ─── Smart URL Generation ─────────────────────────────────────
const generateURL: GenerateURL = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  switch (collectionSlug) {
    case 'blog-posts':
      return `${url}/blog/${doc.slug}`
    case 'cases':
      return `${url}/cases/${doc.slug}`
    default:
      return doc.slug === 'home' ? url : `${url}/${doc.slug}`
  }
}

// ─── Smart Description Generation ─────────────────────────────
const generateDescription: GenerateDescription = ({ doc }) => {
  // Explicit meta description takes priority
  if (doc?.meta?.description) return doc.meta.description

  // Blog posts: use excerpt
  if ((doc as any).excerpt) {
    return (doc as any).excerpt.slice(0, 160)
  }

  // Extract from first content block (if available)
  if ((doc as any).layout && Array.isArray((doc as any).layout)) {
    const firstTextBlock = (doc as any).layout.find(
      (b: any) => b.blockType === 'hero' || b.blockType === 'content'
    )
    if (firstTextBlock?.subtitle) return firstTextBlock.subtitle.slice(0, 160)
    if (firstTextBlock?.title) return firstTextBlock.title.slice(0, 160)
  }

  return ''
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
    generateDescription,
    collections: ['pages', 'blog-posts', 'cases'],
    uploadsCollection: 'media',
    tabbedUI: true, // Separate SEO tab in editor for better UX
    // Add custom SEO fields
    fieldOverrides: {
      description: {
        admin: {
          description: '150-160 characters is optimal for search results',
        },
      },
    },
    fields: ({ defaultFields }) => {
      // Add custom SEO fields
      const fields = [...defaultFields]

      // Insert focusKeyword after description field
      const descIndex = fields.findIndex(f => 'name' in f && f.name === 'description')
      if (descIndex !== -1) {
        fields.splice(descIndex + 1, 0, {
          name: 'focusKeyword',
          type: 'text',
          label: 'Focus Keyword',
          admin: {
            description: 'Primary keyword/phrase to optimize for (e.g., "medical supplies Amsterdam")',
            placeholder: 'Enter your target keyword...',
          },
        })
      }

      // Add canonical URL field at the end (Advanced section)
      fields.push(
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL',
          admin: {
            description: 'Override the default canonical URL. Leave empty to use auto-generated URL. Use for duplicate content prevention.',
            placeholder: 'https://example.com/canonical-page',
            condition: (data) => {
              // Show only in advanced mode or if value exists
              return true
            },
          },
          validate: (value) => {
            if (!value) return true // Optional field

            // Basic URL validation
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL (e.g., https://example.com/page)'
            }
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No Index',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page. Use for duplicate content, thank-you pages, etc.',
          },
        },
        {
          name: 'noFollow',
          type: 'checkbox',
          label: 'No Follow',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from following links on this page.',
          },
        }
      )

      return fields
    },
  }),
  formBuilderPlugin({
    fields: {
      text: true,
      textarea: true,
      select: true,
      email: true,
      number: true,
      checkbox: true,
      // Disabled voor klant veiligheid:
      state: false,
      country: false,
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Formulieren',
      },
    },
    formOverrides: {
      admin: {
        group: 'Formulieren',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      admin: {
        group: 'Instellingen',
        description: '301/302 redirects voor SEO en URL wijzigingen',
      },
    },
  }),
  // Vercel Blob Storage - For production file uploads on Vercel
  // TODO: Uncomment when @payloadcms/storage-vercel-blob is installed
  // Falls back to local storage in development (when BLOB_READ_WRITE_TOKEN is not set)
  // vercelBlobStorage({
  //   enabled: true,
  //   collections: {
  //     media: true, // Enable for 'media' collection
  //   },
  //   token: process.env.BLOB_READ_WRITE_TOKEN || '', // Required for Vercel
  // }),
]
