import { InsightsDashboard } from '@/features/analytics/customer-insights/components/InsightsDashboard'

export const metadata = { title: 'Klantinzichten — Customer Insights' }

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Klantinzichten</h1>
      <p className="text-gray-500 mb-6">RFM-analyse, segmentatie, CLV en churn-predictie</p>
      <InsightsDashboard />
    </div>
  )
}
