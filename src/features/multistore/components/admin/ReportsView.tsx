import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { Reports } from './Reports'
import './multistore.scss'

export async function ReportsView({ initPageResult, params, searchParams }: any) {
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
              <h1 className="ms-header__title">Rapporten</h1>
              <p className="ms-header__subtitle">
                Omzet, commissie en orderstatistieken per webshop
              </p>
            </div>
          </div>
          <Reports />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
