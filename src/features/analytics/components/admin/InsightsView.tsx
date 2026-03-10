import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { InsightsDashboard } from '../../customer-insights/components/InsightsDashboard'

export async function InsightsView({ initPageResult, params, searchParams }: any) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1 style={{ marginBottom: '0.5rem' }}>Klantinzichten</h1>
        <p style={{ marginBottom: '1.5rem', opacity: 0.6 }}>
          RFM-analyse, segmentatie, CLV en churn-predictie
        </p>
        <InsightsDashboard />
      </Gutter>
    </DefaultTemplate>
  )
}
