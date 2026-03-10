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
        <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
          <InsightsDashboard />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
