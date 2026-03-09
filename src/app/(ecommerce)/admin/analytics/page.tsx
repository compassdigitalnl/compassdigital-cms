import { RevenueDashboard } from '@/features/analytics/components/RevenueDashboard'

export const metadata = { title: 'Analytics Dashboard' }

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
      <RevenueDashboard />
    </div>
  )
}
