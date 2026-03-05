import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import BrancheArchiveTemplate1 from '@/branches/ecommerce/templates/branches/BrancheArchiveTemplate1'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Branches - Producten per branche',
  description: 'Ontdek producten speciaal samengesteld voor uw branche. Van huisarts tot thuiszorg.',
}

export default async function BranchesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  // TODO: Fetch branches from CMS collection when available
  // For now, return static demo data
  const branches = [
    {
      id: 1,
      name: 'Huisartsen',
      slug: 'huisartsen',
      description: 'Alles voor de huisartsenpraktijk: diagnostiek, verbruiksmateriaal en meer.',
      productCount: 1240,
    },
    {
      id: 2,
      name: 'Tandartsen',
      slug: 'tandartsen',
      description: 'Tandheelkundige instrumenten, materialen en apparatuur.',
      productCount: 860,
    },
    {
      id: 3,
      name: 'Verloskunde',
      slug: 'verloskunde',
      description: 'Verloskundige benodigdheden en prenatale zorgproducten.',
      productCount: 420,
    },
    {
      id: 4,
      name: 'Fysiotherapie',
      slug: 'fysiotherapie',
      description: 'Therapie-apparatuur, tapes en behandelmaterialen.',
      productCount: 680,
    },
    {
      id: 5,
      name: 'Thuiszorg',
      slug: 'thuiszorg',
      description: 'Producten voor professionele thuiszorg en mantelzorg.',
      productCount: 540,
    },
    {
      id: 6,
      name: 'Ziekenhuizen',
      slug: 'ziekenhuizen',
      description: 'Medische supplies voor ziekenhuizen en klinieken.',
      productCount: 2100,
    },
  ]

  const totalProductCount = branches.reduce((sum, b) => sum + (b.productCount || 0), 0)

  return (
    <BrancheArchiveTemplate1
      branches={branches}
      totalProductCount={totalProductCount}
    />
  )
}
