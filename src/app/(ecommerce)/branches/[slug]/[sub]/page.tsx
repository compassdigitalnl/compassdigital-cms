import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/branches/shared/blocks/RenderBlocks'
import { JsonLdSchema } from '@/features/seo/components/JsonLdSchema'
import { generateMeta } from '@/features/seo/lib/generateMeta'
import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function findSubBranchPage(payload: any, slug: string, sub: string) {
  // Try multiple slug conventions: "bouw-elektricien" or "elektricien"
  const slugVariants = [`${slug}-${sub}`, sub]

  for (const variant of slugVariants) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: variant } },
      limit: 1,
      depth: 2,
    })
    if (docs[0]) return docs[0] as Page
  }

  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>
}): Promise<Metadata> {
  const { slug, sub } = await params

  try {
    const payload = await getPayload({ config })
    const page = await findSubBranchPage(payload, slug, sub)

    if (page) {
      return generateMeta({ doc: page as any })
    }

    return { title: 'Niet gevonden' }
  } catch {
    return { title: 'Niet gevonden' }
  }
}

export default async function SubBranchePage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>
}) {
  const { slug, sub } = await params
  const payload = await getPayload({ config })

  const page = await findSubBranchPage(payload, slug, sub)

  if (page) {
    return (
      <article className="pt-16 pb-24">
        <JsonLdSchema page={page} />
        <RenderBlocks blocks={page.layout || []} />
      </article>
    )
  }

  notFound()
}
