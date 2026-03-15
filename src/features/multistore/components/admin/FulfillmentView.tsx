import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { Fulfillment } from './Fulfillment'
import './multistore.scss'

export async function FulfillmentView({ initPageResult, params, searchParams }: any) {
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
              <h1 className="ms-header__title">Fulfillment</h1>
              <p className="ms-header__subtitle">
                Pick, pack &amp; ship workflow voor alle webshopbestellingen
              </p>
            </div>
          </div>
          <Fulfillment />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
