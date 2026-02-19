Fix: Tenant dashboard (EditorDashboard) mist e-commerce en is incompleet                                                                       
                                                                                                                                                 
  Probleem                                                                                                                                       
                                                                                                                                                 
  De EditorDashboard in src/components/BeforeDashboard/index.tsx (regel 174-293) is hardcoded voor een website-only klant. Het mist:             
                                                                                                                                                 
  1. Gehele E-commerce sectie — geen links naar Products, Product Categories, Brands, Orders, Order Lists, Customer Groups                       
  2. Cases link staat erin terwijl die disabled is (regel 250-254)
  3. Partners mist
  4. Header global mist
  5. Forms collection mist (alleen form-submissions staat erin)
  6. Het dashboard is niet dynamisch — het past zich niet aan op basis van ECOMMERCE_ENABLED, SHOP_MODEL, of DISABLED_COLLECTIONS

  Wat er nu getoond wordt (EditorDashboard)

  - Snel aan de slag: Nieuwe pagina, Pagina's beheren
  - Content: Blog, Media, Reviews, FAQ, ~~Cases~~ (disabled!)
  - Design: Theme, Footer, Instellingen

  Wat er zou moeten staan voor plastimed01 (B2B webshop)

  Snel aan de slag:
  - Nieuwe pagina, Pagina's beheren

  E-commerce (NIEUW - geheel missend):
  - Products (/admin/collections/products)
  - Product Categorieën (/admin/collections/product-categories)
  - Merken / Brands (/admin/collections/brands)
  - Bestellingen / Orders (/admin/collections/orders)
  - Bestelrondes / Order Lists (/admin/collections/order-lists) — B2B
  - Klantgroepen / Customer Groups (/admin/collections/customer-groups) — B2B

  Content:
  - Blog, Media, Reviews, FAQ, Partners
  - GEEN Cases (disabled)

  Design & instellingen:
  - Theme, Header, Footer, Instellingen

  Oplossing

  Maak de EditorDashboard dynamisch op basis van env vars. De component is 'use client', dus gebruik NEXT_PUBLIC_* variabelen:

  const EditorDashboard: React.FC<{ userName: string }> = ({ userName }) => {
    const firstName = userName?.split(' ')[0] || 'daar'

    // Lees client config
    const ecommerceEnabled = process.env.NEXT_PUBLIC_ECOMMERCE_ENABLED === 'true'
    const shopModel = process.env.NEXT_PUBLIC_SHOP_MODEL // 'b2b' | 'b2c' | undefined
    const disabledCollections = new Set(
      (process.env.NEXT_PUBLIC_DISABLED_COLLECTIONS || '').split(',').map(s => s.trim()).filter(Boolean)
    )

    // Helper: toon alleen als collection niet disabled is
    const isEnabled = (slug: string) => !disabledCollections.has(slug)

  Dan conditioneel de secties renderen:

  {/* E-commerce sectie - alleen als ECOMMERCE_ENABLED=true */}
  {ecommerceEnabled && (
    <div className="cd-section">
      <h2 className="cd-section__title">E-commerce</h2>
      <div className="cd-grid cd-grid--3">
        <QuickAction href="/admin/collections/products" icon="📦" label="Producten" description="Beheer je productcatalogus" accent />
        <QuickAction href="/admin/collections/product-categories" icon="🏷️ " label="Categorieën" description="Productcategorieën beheren" />
        <QuickAction href="/admin/collections/brands" icon="🏭" label="Merken" description="Merken beheren" />
        <QuickAction href="/admin/collections/orders" icon="🛒" label="Bestellingen" description="Bekijk en beheer bestellingen" />
        {shopModel === 'b2b' && (
          <>
            <QuickAction href="/admin/collections/order-lists" icon="📋" label="Bestelrondes" description="B2B bestelrondes beheren" />
            <QuickAction href="/admin/collections/customer-groups" icon="👥" label="Klantgroepen" description="B2B klantgroepen en prijzen" />
          </>
        )}
      </div>
    </div>
  )}

  {/* Content - conditioneel per collection */}
  <div className="cd-section">
    <h2 className="cd-section__title">Content</h2>
    <div className="cd-grid cd-grid--3">
      {/* Blog, Media altijd */}
      {isEnabled('cases') && <QuickAction ... />}
      {isEnabled('services') && <QuickAction ... />}
      {/* Partners altijd tonen als niet disabled */}
      <QuickAction href="/admin/collections/partners" icon="🤝" label="Partners" description="Partnerbedrijven beheren" />
    </div>
  </div>

  Benodigde .env aanpassing voor plastimed01

  De huidige .env heeft ECOMMERCE_ENABLED=true en SHOP_MODEL=b2b, maar deze moeten ook als NEXT_PUBLIC_* beschikbaar zijn voor de client-side
  component:

  NEXT_PUBLIC_ECOMMERCE_ENABLED=true
  NEXT_PUBLIC_SHOP_MODEL=b2b
  NEXT_PUBLIC_DISABLED_COLLECTIONS=services,cases