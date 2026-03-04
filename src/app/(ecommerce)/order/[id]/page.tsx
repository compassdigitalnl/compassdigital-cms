import { Suspense } from 'react'
import { OrderConfirmation } from './OrderConfirmation'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { OrderPageStepper } from './OrderPageStepper'

export const metadata = {
  title: 'Bestelling bevestigd',
  description: 'Uw bestelling is succesvol ontvangen',
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  if (!isFeatureEnabled('shop')) notFound()

  const { id } = await params

  // Fetch order from database
  let order: any
  try {
    const payload = await getPayload({ config })
    order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })
  } catch {
    notFound()
  }

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Progress Stepper — step 5 = Bevestiging */}
      <OrderPageStepper />

      {/* Main Content */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderConfirmation order={order} />
      </Suspense>
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
