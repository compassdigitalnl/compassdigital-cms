INSTRUCTIES VOOR CLAUDE LOKAAL: Products Collection Enterprise Upgrade                                                                          
  
 Wat je moet doen                                                                                                                                
                                                                            
 Upgrade de Products collection van 17 basisvelden naar ~70 enterprise velden, voeg een price calculation engine toe, en upgrade de volledige
 frontend (shop, cart, checkout) voor gegroepeerde producten en staffelprijzen.

 Belangrijk: Regels

 1. Backward compatibility: Behoud bestaande veldnamen (title, price, stock, compareAtPrice, images, slug, sku, categories, brand, badge,
 status, featured, specifications, downloads, relatedProducts, meta). Hernoem NIETS. Voeg alleen nieuwe velden toe.
 2. Gebruik bestaande code als referentie: packages/modules/catalog/collections/Products.ts bevat een volledig enterprise template met 63+
 velden. Kopieer patronen/structuur hieruit.
 3. Gebruik bestaande price engine als basis: packages/modules/pricing/lib/calculatePrice.ts bevat een werkende prijs engine. Kopieer en pas
 aan.
 4. Labels in het Nederlands waar van toepassing (consistent met bestaande code).
 5. Admin UI: Gebruik type: 'tabs' voor de hoofdstructuur, type: 'collapsible' voor sub-groepen, type: 'row' voor horizontale layouts.
 6. Hidden logic: Behoud de bestaande hidden en access configuratie exact zoals die nu is.

 ---
 STAP 1: Upgrade src/collections/Products.ts

 Vervang de fields array door een tab-gebaseerde structuur. Behoud de bestaande slug, admin, access, labels configuratie bovenaan.

 Nieuwe fields structuur (met tabs):

 fields: [
   {
     type: 'tabs',
     tabs: [
       // Tab 1: Basis Info
       // Tab 2: Prijzen
       // Tab 3: Voorraad
       // Tab 4: Verzending
       // Tab 5: Media
       // Tab 6: Gegroepeerde Producten
       // Tab 7: B2B
       // Tab 8: SEO
       // Tab 9: Specificaties
       // Tab 10: Gerelateerd
     ]
   }
 ]

 Tab 1: Basis Info

 Bevat alle bestaande velden + nieuwe velden:

 Veld: title
 Type: text
 Bestaand?: JA
 Details: required, label: 'Product Naam'
 ────────────────────────────────────────
 Veld: slug
 Type: text
 Bestaand?: JA
 Details: required, unique, sidebar, auto-generate hook
 ────────────────────────────────────────
 Veld: productType
 Type: select
 Bestaand?: NIEUW
 Details: options: 'simple'/'grouped', default: 'simple', label: 'Product Type'
 ────────────────────────────────────────
 Veld: sku
 Type: text
 Bestaand?: JA
 Details: unique, in row met ean/mpn
 ────────────────────────────────────────
 Veld: ean
 Type: text
 Bestaand?: NIEUW
 Details: label: 'EAN / Barcode', description: 'European Article Number (13 cijfers)'
 ────────────────────────────────────────
 Veld: mpn
 Type: text
 Bestaand?: NIEUW
 Details: label: 'MPN', description: 'Manufacturer Part Number'
 ────────────────────────────────────────
 Veld: shortDescription
 Type: textarea
 Bestaand?: NIEUW
 Details: maxLength: 200, label: 'Korte Beschrijving'
 ────────────────────────────────────────
 Veld: description
 Type: richText
 Bestaand?: JA
 Details: label: 'Beschrijving'
 ────────────────────────────────────────
 Veld: brand
 Type: relationship→brands
 Bestaand?: JA
 Details: label: 'Merk'
 ────────────────────────────────────────
 Veld: manufacturer
 Type: text
 Bestaand?: NIEUW
 Details: label: 'Fabrikant'
 ────────────────────────────────────────
 Veld: categories
 Type: relationship→product-categories
 Bestaand?: JA
 Details: hasMany, sidebar
 ────────────────────────────────────────
 Veld: tags
 Type: array
 Bestaand?: NIEUW
 Details: fields: [{name: 'tag', type: 'text', required: true}]
 ────────────────────────────────────────
 Veld: status
 Type: select
 Bestaand?: JA
 Details: behoud bestaande options
 ────────────────────────────────────────
 Veld: featured
 Type: checkbox
 Bestaand?: JA
 Details: sidebar
 ────────────────────────────────────────
 Veld: condition
 Type: select
 Bestaand?: NIEUW
 Details: options: new/refurbished/used, default: 'new', label: 'Conditie'
 ────────────────────────────────────────
 Veld: warranty
 Type: text
 Bestaand?: NIEUW
 Details: label: 'Garantie', description: 'Bijv. "2 jaar", "Lifetime"'
 ────────────────────────────────────────
 Veld: releaseDate
 Type: date
 Bestaand?: NIEUW
 Details: label: 'Release Datum'
 ────────────────────────────────────────
 Veld: badge
 Type: select
 Bestaand?: JA
 Details: behoud bestaande options, sidebar

 Gebruik type: 'row' om sku, ean, mpn naast elkaar te zetten (elk 33%).
 Gebruik type: 'row' om status, featured, condition, warranty naast elkaar te zetten (elk 25%).

 Tab 2: Prijzen

 ┌────────────────┬──────────┬───────────┬─────────────────────────────────────────────────────────────────────────────────────┐
 │      Veld      │   Type   │ Bestaand? │                                       Details                                       │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ price          │ number   │ JA        │ required, min:0, step:0.01, label: 'Basis Prijs (excl. BTW)'                        │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ salePrice      │ number   │ NIEUW     │ min:0, step:0.01, label: 'Actieprijs'                                               │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ compareAtPrice │ number   │ JA        │ behoud, label: 'Vergelijk Prijs (doorstreept)'                                      │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ costPrice      │ number   │ NIEUW     │ min:0, step:0.01, label: 'Kostprijs (intern)'                                       │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ msrp           │ number   │ NIEUW     │ min:0, step:0.01, label: 'Adviesprijs (MSRP)'                                       │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ taxClass       │ select   │ NIEUW     │ options: standard(21%)/reduced(9%)/zero(0%), default:'standard', label:'BTW Klasse' │
 ├────────────────┼──────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ includesTax    │ checkbox │ NIEUW     │ label: 'Prijs inclusief BTW', default: false                                        │
 └────────────────┴──────────┴───────────┴─────────────────────────────────────────────────────────────────────────────────────┘

 Gebruik type: 'row' om price, salePrice, compareAtPrice naast elkaar te plaatsen (elk 33%).
 Gebruik type: 'row' om costPrice, msrp naast elkaar te plaatsen (elk 50%).
 Gebruik type: 'row' om taxClass, includesTax naast elkaar te plaatsen.

 Collapsible: Klantengroep Prijzen (B2B)
 {
   type: 'collapsible',
   label: 'Klantengroep Prijzen',
   admin: { initCollapsed: true, description: 'Speciale prijzen per klantengroep' },
   fields: [
     {
       name: 'groupPrices',
       type: 'array',
       label: 'Groepsprijzen',
       maxRows: 20,
       fields: [
         { name: 'group', type: 'relationship', relationTo: 'customer-groups', required: true, label: 'Klantengroep' },
         { name: 'price', type: 'number', required: true, min: 0, label: 'Prijs', admin: { step: 0.01 } },
         { name: 'minQuantity', type: 'number', min: 1, label: 'Vanaf aantal' },
       ]
     }
   ]
 }

 Collapsible: Staffelprijzen (Volume)
 {
   type: 'collapsible',
   label: 'Staffelprijzen',
   admin: { initCollapsed: true, description: 'Korting bij grotere aantallen' },
   fields: [
     {
       name: 'volumePricing',
       type: 'array',
       label: 'Staffels',
       fields: [
         // Gebruik type: 'row' voor deze 4 naast elkaar
         { name: 'minQuantity', type: 'number', required: true, min: 1, label: 'Vanaf' },
         { name: 'maxQuantity', type: 'number', min: 1, label: 'Tot' },
         { name: 'price', type: 'number', required: true, min: 0, label: 'Stuksprijs', admin: { step: 0.01 } },
         { name: 'discountPercentage', type: 'number', min: 0, max: 100, label: 'Korting %' },
       ]
     }
   ]
 }

 Tab 3: Voorraad

 ┌───────────────────┬──────────┬───────────┬──────────────────────────────────────────────────────────────────────────────┐
 │       Veld        │   Type   │ Bestaand? │                                   Details                                    │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ trackStock        │ checkbox │ NIEUW     │ default: true, label: 'Voorraad Bijhouden'                                   │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ stock             │ number   │ JA        │ min:0, label: 'Voorraad Aantal', condition: data.trackStock                  │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ stockStatus       │ select   │ NIEUW     │ options: in-stock/out-of-stock/on-backorder/discontinued, default:'in-stock' │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ lowStockThreshold │ number   │ NIEUW     │ min:0, default:5, label: 'Lage Voorraad Drempel', condition: data.trackStock │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ backordersAllowed │ checkbox │ NIEUW     │ default: false, label: 'Backorders Toestaan'                                 │
 ├───────────────────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────┤
 │ availabilityDate  │ date     │ NIEUW     │ label: 'Verwachte Leverdatum', condition: stockStatus==='on-backorder'       │
 └───────────────────┴──────────┴───────────┴──────────────────────────────────────────────────────────────────────────────┘

 Tab 4: Verzending

 ┌──────────────────┬──────────┬────────────────────────────────────────────┐
 │       Veld       │   Type   │                  Details                   │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ weight           │ number   │ min:0, step:0.01, label: 'Gewicht'         │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ weightUnit       │ select   │ options: kg/g, default: 'kg'               │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ dimensionsLength │ number   │ min:0, step:0.1, label: 'Lengte'           │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ dimensionsWidth  │ number   │ min:0, step:0.1, label: 'Breedte'          │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ dimensionsHeight │ number   │ min:0, step:0.1, label: 'Hoogte'           │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ shippingClass    │ text     │ label: 'Verzendklasse'                     │
 ├──────────────────┼──────────┼────────────────────────────────────────────┤
 │ freeShipping     │ checkbox │ default: false, label: 'Gratis Verzending' │
 └──────────────────┴──────────┴────────────────────────────────────────────┘

 Alle NIEUW. Gebruik rows: weight+weightUnit (50/50), dimensions L/W/H (33/33/34), shippingClass+freeShipping (50/50).

 Tab 5: Media

 Bevat bestaande velden + videos:

 ┌───────────┬───────────────────────┬───────────┬───────────────────────────────┐
 │   Veld    │         Type          │ Bestaand? │            Details            │
 ├───────────┼───────────────────────┼───────────┼───────────────────────────────┤
 │ images    │ upload→media, hasMany │ JA        │ label: 'Product Afbeeldingen' │
 ├───────────┼───────────────────────┼───────────┼───────────────────────────────┤
 │ videos    │ array                 │ NIEUW     │ maxRows: 5                    │
 ├───────────┼───────────────────────┼───────────┼───────────────────────────────┤
 │ downloads │ upload→media, hasMany │ JA        │ filter: pdf                   │
 └───────────┴───────────────────────┴───────────┴───────────────────────────────┘

 Videos array fields: url (text, required), platform (select: youtube/vimeo/custom).

 Tab 6: Gegroepeerde Producten

 Hele tab is conditional: admin: { condition: (data) => data.productType === 'grouped' }

 Nee - tabs ondersteunen geen condition. Gebruik in plaats daarvan condition op de fields BINNEN de tab:

 {
   label: 'Gegroepeerde Producten',
   description: 'Koppel sub-producten voor multi-select bestelling',
   fields: [
     {
       name: 'childProducts',
       type: 'array',
       label: 'Sub-producten',
       admin: {
         description: 'Elk sub-product is een zelfstandig Simple product met eigen SKU, EAN, prijs en voorraad.',
         condition: (data) => data.productType === 'grouped',
       },
       fields: [
         { name: 'product', type: 'relationship', relationTo: 'products', required: true, label: 'Product',
           filterOptions: { productType: { equals: 'simple' } }
         },
         { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Volgorde' },
         { name: 'isDefault', type: 'checkbox', defaultValue: false, label: 'Standaard geselecteerd' },
       ]
     }
   ]
 }

 Tab 7: B2B

 Alle NIEUW:

 ┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────┐
 │       Veld        │   Type   │                                        Details                                        │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ minOrderQuantity  │ number   │ min:1, label: 'Minimum Bestelhoeveelheid (MOQ)'                                       │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ maxOrderQuantity  │ number   │ min:1, label: 'Maximum Bestelhoeveelheid'                                             │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ orderMultiple     │ number   │ min:1, label: 'Bestel Veelvoud', description: 'Alleen bestelbaar in veelvouden van X' │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ leadTime          │ number   │ min:0, label: 'Levertijd (dagen)'                                                     │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ customizable      │ checkbox │ default: false, label: 'Maatwerk Mogelijk'                                            │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ quotationRequired │ checkbox │ default: false, label: 'Offerte Verplicht'                                            │
 ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ contractPricing   │ checkbox │ default: false, label: 'Contract Pricing'                                             │
 └───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────┘

 Gebruik rows: minOrder+maxOrder+orderMultiple (33/33/34), leadTime+customizable+quotationRequired+contractPricing (25 elk).

 Tab 8: SEO

 Upgrade het bestaande meta group naar een tab:

 ┌──────────────────┬──────────────┬───────────┬────────────────────────────────────────────────────────┐
 │       Veld       │     Type     │ Bestaand? │                        Details                         │
 ├──────────────────┼──────────────┼───────────┼────────────────────────────────────────────────────────┤
 │ meta.title       │ text         │ JA        │ maxLength: 60                                          │
 ├──────────────────┼──────────────┼───────────┼────────────────────────────────────────────────────────┤
 │ meta.description │ textarea     │ JA        │ maxLength: 160                                         │
 ├──────────────────┼──────────────┼───────────┼────────────────────────────────────────────────────────┤
 │ meta.image       │ upload→media │ JA        │                                                        │
 ├──────────────────┼──────────────┼───────────┼────────────────────────────────────────────────────────┤
 │ meta.keywords    │ array        │ NIEUW     │ fields: [{name:'keyword', type:'text', required:true}] │
 └──────────────────┴──────────────┴───────────┴────────────────────────────────────────────────────────┘

 Let op: Behoud meta als group (name: 'meta') met deze 4 velden erin. Zet de groep in de SEO tab.

 Tab 9: Specificaties

 Upgrade het bestaande specifications array naar gegroepeerde specs:

 {
   name: 'specifications',
   type: 'array',
   label: 'Specificatie Groepen',
   fields: [
     { name: 'group', type: 'text', required: true, label: 'Groep Naam',
       admin: { description: 'Bijv. "Technische Specificaties", "Afmetingen"' } },
     {
       name: 'attributes',
       type: 'array',
       label: 'Attributen',
       fields: [
         { name: 'name', type: 'text', required: true, label: 'Naam' },
         { name: 'value', type: 'text', required: true, label: 'Waarde' },
         { name: 'unit', type: 'text', label: 'Eenheid' },
       ]
     }
   ]
 }

 Backward compatibility issue: Het bestaande specifications array heeft velden key + value (flat). Het nieuwe format heeft group + attributes[]
 (nested). Dit is een breaking change voor bestaande data. Oplossing: hernoem het bestaande naar specificationsLegacy OF gebruik het nieuwe
 format en accepteer dat bestaand product ID 1 zijn specs kwijtraakt (ze moeten toch opnieuw worden ingevoerd).

 Aanbeveling: Gebruik het nieuwe format. Bestaande data (1 product) kan handmatig opnieuw ingevoerd worden.

 Tab 10: Gerelateerd

 ┌─────────────────┬────────────────────────────────┬───────────┬─────────────────────────────────────────────────────────┐
 │      Veld       │              Type              │ Bestaand? │                         Details                         │
 ├─────────────────┼────────────────────────────────┼───────────┼─────────────────────────────────────────────────────────┤
 │ relatedProducts │ relationship→products, hasMany │ JA        │ label: 'Gerelateerde Producten'                         │
 ├─────────────────┼────────────────────────────────┼───────────┼─────────────────────────────────────────────────────────┤
 │ crossSells      │ relationship→products, hasMany │ NIEUW     │ label: 'Cross-Sells', description: 'Vaak samen gekocht' │
 ├─────────────────┼────────────────────────────────┼───────────┼─────────────────────────────────────────────────────────┤
 │ upSells         │ relationship→products, hasMany │ NIEUW     │ label: 'Up-Sells', description: 'Upgrade suggesties'    │
 ├─────────────────┼────────────────────────────────┼───────────┼─────────────────────────────────────────────────────────┤
 │ accessories     │ relationship→products, hasMany │ NIEUW     │ label: 'Accessoires'                                    │
 └─────────────────┴────────────────────────────────┴───────────┴─────────────────────────────────────────────────────────┘

 Hooks toevoegen:

 hooks: {
   beforeChange: [
     async ({ data, operation }) => {
       // Auto-generate slug
       if (!data.slug && data.title) {
         data.slug = data.title
           .toLowerCase()
           .replace(/[^a-z0-9]+/g, '-')
           .replace(/(^-|-$)/g, '')
       }
       return data
     },
   ],
 },

 Admin config aanpassen:

 admin: {
   useAsTitle: 'title',
   group: 'E-commerce',
   defaultColumns: ['title', 'sku', 'ean', 'price', 'stock', 'status', 'productType', 'updatedAt'],
   hidden: ({ user }) =>
     isClientDeployment()
       ? false
       : !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop',
 },

 ---
 STAP 2: Maak src/lib/pricing/calculatePrice.ts

 Kopieer packages/modules/pricing/lib/calculatePrice.ts en pas aan:

 1. Hernoem rolePrices → groupPrices in de interface
 2. Hernoem roleId → groupId
 3. De rest van de logica blijft hetzelfde

 De engine moet deze discount hiërarchie toepassen:
 1. Klantengroep-prijs (als die lager is dan basisprijs)
 2. Persoonlijke korting (percentage)
 3. Staffelkorting (volume pricing, hoogste toepasselijke tier)

 Export:
 - calculatePrice(input): PriceCalculationResult
 - calculateCartTotal(items, customer, currency): CartTotalResult

 ---
 STAP 3: Upgrade src/contexts/CartContext.tsx

 Nieuwe CartItem interface:

 export interface CartItem {
   id: number | string
   slug: string
   title: string
   price: number           // Basisprijs (backward compatible)
   unitPrice: number       // Berekende prijs na kortingen
   quantity: number
   stock: number
   sku?: string
   ean?: string
   image?: string
   parentProductId?: number | string
   parentProductTitle?: string
   minOrderQuantity?: number
   orderMultiple?: number
 }

 Nieuwe functies toevoegen:

 addGroupedItems: (items: Array<Omit<CartItem, 'quantity'> & { quantity?: number }>) => void

 Deze functie voegt meerdere items tegelijk toe (vanuit grouped product multi-select).

 Quantity validatie aanpassen:

 In updateQuantity: respecteer minOrderQuantity en orderMultiple:
 const updateQuantity = (id, quantity) => {
   setItems(prev => prev.map(item => {
     if (item.id !== id) return item
     let newQty = Math.max(item.minOrderQuantity || 1, Math.min(quantity, item.stock))
     if (item.orderMultiple && item.orderMultiple > 1) {
       newQty = Math.round(newQty / item.orderMultiple) * item.orderMultiple
       if (newQty < (item.minOrderQuantity || 1)) newQty = item.minOrderQuantity || item.orderMultiple
     }
     return { ...item, quantity: newQty }
   }).filter(item => item.quantity > 0))
 }

 Total berekening:

 Gebruik unitPrice (niet price) voor total:
 const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

 Maar behoud backward compat: als unitPrice niet gezet is, fallback naar price.

 ---
 STAP 4: Upgrade src/app/(app)/shop/[slug]/page.tsx

 A) Simple Product View - verbeteringen:

 1. Toon shortDescription boven de prijs
 2. Toon EAN naast SKU: EAN: {product.ean}
 3. Staffelprijzen tabel als product.volumePricing bestaat:
 {product.volumePricing?.length > 0 && (
   <div className="bg-blue-50 rounded-lg p-4 mb-6">
     <h3 className="font-semibold mb-2">Staffelprijzen</h3>
     <table className="w-full text-sm">
       <thead><tr><th>Vanaf</th><th>Stuksprijs</th><th>Korting</th></tr></thead>
       <tbody>
         {product.volumePricing.map((tier, i) => (
           <tr key={i}>
             <td>{tier.minQuantity}+ stuks</td>
             <td>€{tier.price?.toFixed(2)}</td>
             <td>{tier.discountPercentage ? `${tier.discountPercentage}%` : '-'}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 )}
 4. Downloads sectie als product.downloads bestaat
 5. Badge weergave (sale badge, etc.)
 6. Verbeterde specificaties met groepen

 B) Grouped Product View - NIEUW:

 Als product.productType === 'grouped' en product.childProducts bestaat, toon een volledig andere view:

 // Fetch child products met depth: 1 zodat de relationship geresolved wordt

 Toon een tabel/grid met:
 - Thumbnail (eerste afbeelding van child)
 - Product naam
 - SKU + EAN
 - Prijs
 - Voorraad indicator (groen/rood bolletje)
 - Quantity input (number input met + en - knoppen)
 - Checkbox voor selectie

 Onderaan:
 - Live subtotaal van geselecteerde items
 - "Geselecteerde toevoegen aan winkelwagen" button
 - "Alles toevoegen" button

 Maak dit als een client component (apart bestand GroupedProductTable.tsx in dezelfde map).

 C) Pas AddToCartButton.tsx aan:

 Voeg optionele props toe voor ean, image, parentProductId, parentProductTitle, minOrderQuantity, orderMultiple. Geef deze door aan addItem().

 ---
 STAP 5: Upgrade src/app/(app)/shop/page.tsx

 ProductCard aanpassingen:
 1. Toon shortDescription (max 2 regels, line-clamp)
 2. Toon badge als die niet 'none' is (gekleurde badge boven afbeelding)
 3. Toon EAN onder SKU
 4. Voor grouped products: toon "Vanaf €X" (laagste prijs uit childProducts)
 5. Toon staffelprijs hint als volumePricing bestaat: "Vanaf X stuks: -Y%"

 ---
 STAP 6: Upgrade src/app/(app)/cart/page.tsx

 1. Toon product afbeelding (gebruik item.image uit CartItem)
 2. Toon EAN naast SKU
 3. Groepeer items die een parentProductId hebben (toon parent naam als header)
 4. Toon staffelkorting info als item.unitPrice < item.price
 5. Respecteer MOQ bij min quantity (min={item.minOrderQuantity || 1})
 6. Respecteer orderMultiple bij step

 ---
 STAP 7: Upgrade src/app/(app)/checkout/page.tsx

 1. Toon EAN + SKU per item in order summary
 2. Vervang hardcoded tax = total * 0.21 door per-product BTW
 3. Vervang setTimeout simulatie door echte API call naar /api/orders/create

 ---
 STAP 8: Maak src/app/api/orders/create/route.ts

 import { getPayload } from 'payload'
 import config from '@payload-config'
 import { NextResponse } from 'next/server'

 export async function POST(request: Request) {
   const payload = await getPayload({ config })
   const body = await request.json()

   // 1. Validate items tegen actuele prijzen/voorraad
   // 2. Bereken totalen server-side
   // 3. Maak Order document:
   const order = await payload.create({
     collection: 'orders',
     data: { ... }
   })
   // 4. Decrement stock per product
   // 5. Return order confirmation
   return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber })
 }

 ---
 STAP 9: Upgrade src/collections/Orders.ts

 Voeg sku en ean toe aan de items array fields:

 // In de items array fields, na 'product':
 { name: 'sku', type: 'text', label: 'SKU', admin: { readOnly: true } },
 { name: 'ean', type: 'text', label: 'EAN', admin: { readOnly: true } },

 ---
 Bestanden overzicht

 Aan te passen:

 1. src/collections/Products.ts - Enterprise upgrade (17 → ~70 velden)
 2. src/contexts/CartContext.tsx - Grouped products + pricing support
 3. src/app/(app)/shop/page.tsx - Listing met badges, grouped pricing
 4. src/app/(app)/shop/[slug]/page.tsx - Detail page + grouped view
 5. src/app/(app)/shop/[slug]/AddToCartButton.tsx - Nieuwe props voor grouped
 6. src/app/(app)/cart/page.tsx - Afbeeldingen, staffel, EAN
 7. src/app/(app)/checkout/page.tsx - BTW per product, echte API
 8. src/collections/Orders.ts - Voeg EAN/SKU toe aan order items

 Nieuw aan te maken:

 1. src/lib/pricing/calculatePrice.ts - Kopieer van packages/modules/pricing/lib/calculatePrice.ts, pas aan
 2. src/app/api/orders/create/route.ts - Order creatie API
 3. src/app/(app)/shop/[slug]/GroupedProductTable.tsx - Client component voor grouped product multi-select

 Referentie (NIET aanpassen, alleen lezen):

 - packages/modules/catalog/collections/Products.ts - Enterprise velden template
 - packages/modules/pricing/lib/calculatePrice.ts - Price engine logica
 - src/collections/shop/CustomerGroups.ts - Al compleet
 - src/collections/OrderLists.ts - Al compleet