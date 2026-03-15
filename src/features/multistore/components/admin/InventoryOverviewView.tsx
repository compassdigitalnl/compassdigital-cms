import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { InventoryOverview } from './InventoryOverview'
import './multistore.scss'

export async function InventoryOverviewView({ initPageResult, params, searchParams }: any) {
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
              <h1 className="ms-header__title">Voorraadbeheer</h1>
              <p className="ms-header__subtitle">
                Voorraadniveaus per product en per webshop
              </p>
            </div>
          </div>
          <InventoryOverview />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
