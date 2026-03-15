import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { MultistoreDashboard } from './MultistoreDashboard'

export async function MultistoreDashboardView({ initPageResult, params, searchParams }: any) {
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
        <div className="ms-page">
          <div className="ms-header">
            <div>
              <h1 className="ms-header__title">Multistore Hub</h1>
              <p className="ms-header__subtitle">
                Overzicht van alle webshops, bestellingen en synchronisatie
              </p>
            </div>
          </div>
          <MultistoreDashboard />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
