import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { StockPhotoBrowser } from './StockPhotoBrowser'

export async function StockPhotosView({ initPageResult, params, searchParams }: any) {
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
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
              Stock Foto&apos;s
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Zoek en importeer professionele foto&apos;s van Unsplash en Pexels
            </p>
          </div>
          <StockPhotoBrowser />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
