import { Suspense } from 'react'
import Link from 'next/link'
import { OrderConfirmation } from './OrderConfirmation'
import { CheckCircle } from 'lucide-react'

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
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            Logo
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <CheckCircle className="w-4 h-4" />
            Beveiligde checkout
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 py-5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
            {/* Step 1: Winkelwagen (done) */}
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Winkelwagen</span>
            </div>

            <div className="h-0.5 w-12 bg-green-600" />

            {/* Step 2: Gegevens (done) */}
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Gegevens</span>
            </div>

            <div className="h-0.5 w-12 bg-green-600" />

            {/* Step 3: Bevestiging (active) */}
            <div className="flex items-center gap-2 text-teal-600">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <span className="text-sm font-semibold">Bevestiging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderConfirmation orderId={id} />
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
