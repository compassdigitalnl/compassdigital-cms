import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/branches/shared/components/seo/JsonLdSchema'
import type { Page } from 'src/payload-types'

export const metadata = {
  title: 'Sityzr CMS — Build your perfect website',
  description:
    'Professional multi-tenant CMS platform for building beautiful websites, e-commerce stores, and SaaS applications.',
}

export const dynamic = 'force-dynamic'

export default async function PlastimedHomepage() {
  const payload = await getPayload({ config: configPromise })

  let page: Page | null = null

  try {
    // Fetch the homepage from Pages collection (slug = 'home')
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 2,
    })
    page = docs[0] as Page
  } catch (error) {
    console.error('Could not fetch homepage:', error)
  }

  if (!page) {
    // If no 'home' page exists, show setup message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold text-navy mb-4">
            Welkom bij Sityzr CMS
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            De homepage is nog niet geconfigureerd. Volg deze stappen om te beginnen:
          </p>
          <div className="bg-white border-2 border-teal-600 rounded-2xl p-8 text-left">
            <h2 className="text-xl font-bold text-navy mb-4">Setup Checklist:</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold">1.</span>
                <span>
                  Login in de admin:{' '}
                  <a href="/admin/" className="text-teal-600 underline font-semibold">
                    /admin
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold">2.</span>
                <span>
                  Ga naar <strong>Collections → Pages</strong> en maak een nieuwe pagina aan met
                  slug: <code className="bg-gray-100 px-2 py-1 rounded">home</code>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold">3.</span>
                <span>Voeg blocks toe aan de homepage (Hero, Stats, Features, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold">4.</span>
                <span>
                  Lees de setup guide:{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    /docs/HOMEPAGE_SETUP.md
                  </code>
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Render page blocks (Header/Footer/TopBar are in the layout)
  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLdSchema page={page} />

      {/* Page Blocks - dynamic content from CMS */}
      {page.layout && page.layout.length > 0 ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">De homepage heeft nog geen content blocks.</p>
            <p className="mt-2">
              Ga naar{' '}
              <a href="/admin/collections/pages/" className="text-teal-600 underline">
                Pages in de admin
              </a>{' '}
              om blocks toe te voegen.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
