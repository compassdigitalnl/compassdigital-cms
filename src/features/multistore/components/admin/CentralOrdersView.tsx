import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { CentralOrders } from './CentralOrders'

export async function CentralOrdersView({ initPageResult, params, searchParams }: any) {
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
              <h1 className="ms-header__title">Centraal Orderdashboard</h1>
              <p className="ms-header__subtitle">
                Alle bestellingen van alle webshops op een plek
              </p>
            </div>
          </div>
          <CentralOrders />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
