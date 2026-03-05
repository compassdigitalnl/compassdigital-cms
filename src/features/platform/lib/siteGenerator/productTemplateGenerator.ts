/**
 * Product Template Generator
 * Generates dynamic XLSX/CSV templates based on e-commerce configuration
 */

import type {
  ProductTemplateColumn,
  CustomPricingRole,
  EcommerceSettings,
} from './types'

export class ProductTemplateGenerator {
  private columns: ProductTemplateColumn[] = []

  constructor(
    private ecommerceSettings: EcommerceSettings,
    private templateType: 'basis' | 'advanced' | 'enterprise' = 'enterprise',
  ) {
    this.generateColumns()
  }

  private generateColumns() {
    // Always include basic columns
    this.addBasicColumns()

    // Add pricing columns based on strategy
    this.addPricingColumns()

    // Add inventory columns (if enabled)
    if (this.ecommerceSettings.stockManagement) {
      this.addInventoryColumns()
    }

    // Add shipping columns (if enabled)
    if (this.ecommerceSettings.shippingEnabled) {
      this.addShippingColumns()
    }

    // Add media columns (advanced/enterprise)
    if (this.templateType === 'advanced' || this.templateType === 'enterprise') {
      this.addMediaColumns()
    }

    // Add variants columns (enterprise)
    if (this.templateType === 'enterprise') {
      this.addVariantsColumns()
    }

    // Add SEO columns (advanced/enterprise)
    if (this.templateType === 'advanced' || this.templateType === 'enterprise') {
      this.addSeoColumns()
    }

    // Add status columns
    this.addStatusColumns()
  }

  private addBasicColumns() {
    const basicColumns: ProductTemplateColumn[] = [
      {
        key: 'sku',
        label: 'SKU',
        description: 'Unieke product code (Stock Keeping Unit)',
        required: true,
        example: 'PROD-001',
        category: 'basic',
      },
      {
        key: 'ean',
        label: 'EAN',
        description: 'European Article Number (barcode)',
        required: false,
        example: '8718924532089',
        category: 'basic',
      },
      {
        key: 'parent_sku',
        label: 'Parent SKU',
        description: 'SKU van parent product (voor variants)',
        required: false,
        example: 'PROD-001-PARENT',
        category: 'basic',
      },
      {
        key: 'name',
        label: 'Product Naam',
        description: 'Naam van het product',
        required: true,
        example: 'Wireless Bluetooth Speaker',
        category: 'basic',
      },
      {
        key: 'short_description',
        label: 'Korte Beschrijving',
        description: 'Beknopte beschrijving (1-2 zinnen)',
        required: false,
        example: 'Draadloze speaker met 10u batterij',
        category: 'basic',
      },
      {
        key: 'long_description',
        label: 'Lange Beschrijving',
        description: 'Uitgebreide productbeschrijving',
        required: false,
        example: 'Deze hoogwaardige Bluetooth speaker biedt...',
        category: 'basic',
      },
      {
        key: 'brand',
        label: 'Merk',
        description: 'Merk van het product',
        required: false,
        example: 'SoundPro',
        category: 'basic',
      },
      {
        key: 'model_number',
        label: 'Model Nummer',
        description: 'Model nummer van fabrikant',
        required: false,
        example: 'SP-2000X',
        category: 'basic',
      },
      {
        key: 'category',
        label: 'Categorie',
        description: 'Hoofdcategorie',
        required: true,
        example: 'Elektronica',
        category: 'basic',
      },
      {
        key: 'subcategory',
        label: 'Subcategorie',
        description: 'Subcategorie (optioneel)',
        required: false,
        example: 'Audio',
        category: 'basic',
      },
      {
        key: 'tags',
        label: 'Tags',
        description: 'Zoektags, komma gescheiden',
        required: false,
        example: 'bluetooth,speaker,draadloos,audio',
        category: 'basic',
      },
      {
        key: 'product_type',
        label: 'Product Type',
        description: 'Type product (simple/variant/bundle)',
        required: true,
        example: 'simple',
        category: 'basic',
      },
    ]

    this.columns.push(...basicColumns)
  }

  private addPricingColumns() {
    const pricingColumns: ProductTemplateColumn[] = [
      {
        key: 'price',
        label: `Prijs (${this.ecommerceSettings.currency})`,
        description: 'Standaard verkoopprijs',
        required: true,
        example: '49.99',
        category: 'pricing',
      },
      {
        key: 'sale_price',
        label: `Actieprijs (${this.ecommerceSettings.currency})`,
        description: 'Prijs tijdens actie (optioneel)',
        required: false,
        example: '39.99',
        category: 'pricing',
      },
    ]

    // Add tax if configured
    if (this.ecommerceSettings.taxRate) {
      pricingColumns.push({
        key: 'tax_percentage',
        label: 'BTW %',
        description: 'BTW percentage voor dit product',
        required: false,
        example: this.ecommerceSettings.taxRate.toString(),
        category: 'pricing',
      })
    }

    // Add cost price
    pricingColumns.push({
      key: 'cost_price',
      label: `Kostprijs (${this.ecommerceSettings.currency})`,
      description: 'Inkoopprijs (voor marges)',
        required: false,
      example: '25.00',
      category: 'pricing',
    })

    pricingColumns.push({
      key: 'msrp',
      label: `Adviesprijs (${this.ecommerceSettings.currency})`,
      description: 'Manufacturer Suggested Retail Price',
      required: false,
      example: '59.99',
      category: 'pricing',
    })

    // Add custom role pricing columns
    if (
      this.ecommerceSettings.pricingStrategy === 'role-based' ||
      this.ecommerceSettings.pricingStrategy === 'hybrid'
    ) {
      const sortedRoles = [...this.ecommerceSettings.customRoles].sort(
        (a, b) => a.priority - b.priority,
      )

      sortedRoles.forEach((role) => {
        pricingColumns.push({
          key: `price_${role.id}`,
          label: `Prijs ${role.name} (${this.ecommerceSettings.currency})`,
          description: `Speciale prijs voor ${role.name} klanten`,
          required: false,
          example: '44.99',
          category: 'pricing',
        })
      })
    }

    // Add volume pricing if enabled
    if (
      this.ecommerceSettings.pricingStrategy === 'volume-based' ||
      this.ecommerceSettings.pricingStrategy === 'hybrid'
    ) {
      pricingColumns.push(
        {
          key: 'moq',
          label: 'MOQ (Minimum Order Qty)',
          description: 'Minimale afname hoeveelheid',
          required: false,
          example: '10',
          category: 'pricing',
        },
        {
          key: 'bulk_discount_10',
          label: 'Bulk Korting 10+',
          description: 'Kortingspercentage bij 10+ stuks',
          required: false,
          example: '5',
          category: 'pricing',
        },
        {
          key: 'bulk_discount_50',
          label: 'Bulk Korting 50+',
          description: 'Kortingspercentage bij 50+ stuks',
          required: false,
          example: '10',
          category: 'pricing',
        },
        {
          key: 'bulk_discount_100',
          label: 'Bulk Korting 100+',
          description: 'Kortingspercentage bij 100+ stuks',
          required: false,
          example: '15',
          category: 'pricing',
        },
      )
    }

    this.columns.push(...pricingColumns)
  }

  private addInventoryColumns() {
    const inventoryColumns: ProductTemplateColumn[] = [
      {
        key: 'stock_quantity',
        label: 'Voorraad',
        description: 'Aantal op voorraad',
        required: true,
        example: '150',
        category: 'inventory',
      },
      {
        key: 'stock_status',
        label: 'Voorraad Status',
        description: 'in_stock / out_of_stock / on_backorder',
        required: true,
        example: 'in_stock',
        category: 'inventory',
      },
      {
        key: 'backorder_allowed',
        label: 'Backorder Toegestaan',
        description: 'Mag product besteld worden als uitverkocht? (yes/no)',
        required: false,
        example: 'yes',
        category: 'inventory',
      },
      {
        key: 'warehouse_location',
        label: 'Magazijn Locatie',
        description: 'Locatie in magazijn',
        required: false,
        example: 'A-12-03',
        category: 'inventory',
      },
      {
        key: 'min_stock',
        label: 'Minimale Voorraad',
        description: 'Alert bij deze voorraad',
        required: false,
        example: '20',
        category: 'inventory',
      },
      {
        key: 'max_stock',
        label: 'Maximale Voorraad',
        description: 'Maximale voorraad limiet',
        required: false,
        example: '500',
        category: 'inventory',
      },
    ]

    this.columns.push(...inventoryColumns)
  }

  private addShippingColumns() {
    const shippingColumns: ProductTemplateColumn[] = [
      {
        key: 'weight_kg',
        label: 'Gewicht (kg)',
        description: 'Gewicht in kilogrammen',
        required: false,
        example: '0.8',
        category: 'shipping',
      },
      {
        key: 'length_cm',
        label: 'Lengte (cm)',
        description: 'Lengte in centimeters',
        required: false,
        example: '20',
        category: 'shipping',
      },
      {
        key: 'width_cm',
        label: 'Breedte (cm)',
        description: 'Breedte in centimeters',
        required: false,
        example: '15',
        category: 'shipping',
      },
      {
        key: 'height_cm',
        label: 'Hoogte (cm)',
        description: 'Hoogte in centimeters',
        required: false,
        example: '10',
        category: 'shipping',
      },
      {
        key: 'shipping_class',
        label: 'Verzendklasse',
        description: 'Verzendklasse voor tarieven',
        required: false,
        example: 'standard',
        category: 'shipping',
      },
      {
        key: 'fragile',
        label: 'Breekbaar',
        description: 'Is product breekbaar? (yes/no)',
        required: false,
        example: 'no',
        category: 'shipping',
      },
      {
        key: 'hazardous',
        label: 'Gevaarlijke Goederen',
        description: 'Bevat gevaarlijke stoffen? (yes/no)',
        required: false,
        example: 'no',
        category: 'shipping',
      },
    ]

    this.columns.push(...shippingColumns)
  }

  private addMediaColumns() {
    const mediaColumns: ProductTemplateColumn[] = [
      {
        key: 'image_1',
        label: 'Afbeelding 1 (URL)',
        description: 'URL naar hoofdafbeelding',
        required: false,
        example: 'https://example.com/images/product1.jpg',
        category: 'media',
      },
      {
        key: 'image_2',
        label: 'Afbeelding 2 (URL)',
        description: 'URL naar 2e afbeelding',
        required: false,
        example: 'https://example.com/images/product1-2.jpg',
        category: 'media',
      },
      {
        key: 'image_3',
        label: 'Afbeelding 3 (URL)',
        description: 'URL naar 3e afbeelding',
        required: false,
        example: 'https://example.com/images/product1-3.jpg',
        category: 'media',
      },
      {
        key: 'image_4',
        label: 'Afbeelding 4 (URL)',
        description: 'URL naar 4e afbeelding',
        required: false,
        example: 'https://example.com/images/product1-4.jpg',
        category: 'media',
      },
      {
        key: 'image_5',
        label: 'Afbeelding 5 (URL)',
        description: 'URL naar 5e afbeelding',
        required: false,
        example: 'https://example.com/images/product1-5.jpg',
        category: 'media',
      },
      {
        key: 'video_url',
        label: 'Video URL',
        description: 'URL naar productvideo (YouTube/Vimeo)',
        required: false,
        example: 'https://youtube.com/watch?v=xxxxx',
        category: 'media',
      },
      {
        key: 'image_alt_text',
        label: 'Alt Text Afbeelding',
        description: 'Alt text voor SEO en toegankelijkheid',
        required: false,
        example: 'Bluetooth speaker zwart met blauwe verlichting',
        category: 'media',
      },
    ]

    this.columns.push(...mediaColumns)
  }

  private addVariantsColumns() {
    const variantsColumns: ProductTemplateColumn[] = [
      {
        key: 'variant_type',
        label: 'Variant Type',
        description: 'Type variant (color/size/material/style)',
        required: false,
        example: 'color',
        category: 'variants',
      },
      {
        key: 'color',
        label: 'Kleur',
        description: 'Kleur variant',
        required: false,
        example: 'Zwart',
        category: 'variants',
      },
      {
        key: 'size',
        label: 'Maat',
        description: 'Maat variant (S/M/L/XL of numeriek)',
        required: false,
        example: 'L',
        category: 'variants',
      },
      {
        key: 'material',
        label: 'Materiaal',
        description: 'Materiaal variant',
        required: false,
        example: 'Aluminium',
        category: 'variants',
      },
      {
        key: 'style',
        label: 'Stijl',
        description: 'Stijl variant',
        required: false,
        example: 'Modern',
        category: 'variants',
      },
      {
        key: 'custom_attribute_1',
        label: 'Custom Attribuut 1',
        description: 'Vrij te gebruiken attribuut',
        required: false,
        example: '',
        category: 'variants',
      },
      {
        key: 'custom_attribute_2',
        label: 'Custom Attribuut 2',
        description: 'Vrij te gebruiken attribuut',
        required: false,
        example: '',
        category: 'variants',
      },
    ]

    this.columns.push(...variantsColumns)
  }

  private addSeoColumns() {
    const seoColumns: ProductTemplateColumn[] = [
      {
        key: 'meta_title',
        label: 'SEO Title',
        description: 'SEO geoptimaliseerde titel (max 60 tekens)',
        required: false,
        example: 'Draadloze Bluetooth Speaker - 10u batterij | SoundPro',
        category: 'seo',
      },
      {
        key: 'meta_description',
        label: 'SEO Description',
        description: 'SEO beschrijving (max 160 tekens)',
        required: false,
        example: 'Krachtige Bluetooth speaker met 10 uur batterij. Gratis verzending.',
        category: 'seo',
      },
      {
        key: 'url_slug',
        label: 'URL Slug',
        description: 'URL-vriendelijke product slug',
        required: false,
        example: 'draadloze-bluetooth-speaker-soundpro',
        category: 'seo',
      },
      {
        key: 'featured',
        label: 'Uitgelicht',
        description: 'Toon als uitgelicht product? (yes/no)',
        required: false,
        example: 'no',
        category: 'seo',
      },
      {
        key: 'new',
        label: 'Nieuw',
        description: 'Markeer als nieuw product? (yes/no)',
        required: false,
        example: 'yes',
        category: 'seo',
      },
      {
        key: 'bestseller',
        label: 'Bestseller',
        description: 'Markeer als bestseller? (yes/no)',
        required: false,
        example: 'no',
        category: 'seo',
      },
      {
        key: 'spotlight',
        label: 'In de Spotlight',
        description: 'Toon in spotlight sectie? (yes/no)',
        required: false,
        example: 'no',
        category: 'seo',
      },
    ]

    this.columns.push(...seoColumns)
  }

  private addStatusColumns() {
    const statusColumns: ProductTemplateColumn[] = [
      {
        key: 'status',
        label: 'Status',
        description: 'Product status (active/draft/archived)',
        required: true,
        example: 'active',
        category: 'status',
      },
      {
        key: 'publication_date',
        label: 'Publicatie Datum',
        description: 'Datum waarop product live gaat (YYYY-MM-DD)',
        required: false,
        example: '2026-03-01',
        category: 'status',
      },
      {
        key: 'publication_end_date',
        label: 'Eind Datum',
        description: 'Datum waarop product offline gaat (YYYY-MM-DD)',
        required: false,
        example: '2026-12-31',
        category: 'status',
      },
    ]

    this.columns.push(...statusColumns)
  }

  public getColumns(): ProductTemplateColumn[] {
    return this.columns
  }

  public getColumnsByCategory(category: ProductTemplateColumn['category']): ProductTemplateColumn[] {
    return this.columns.filter((col) => col.category === category)
  }

  public getRequiredColumns(): ProductTemplateColumn[] {
    return this.columns.filter((col) => col.required)
  }

  public getCSVHeaders(): string[] {
    return this.columns.map((col) => col.label)
  }

  public getCSVExampleRow(): string[] {
    return this.columns.map((col) => col.example)
  }

  public getTotalColumnCount(): number {
    return this.columns.length
  }

  public getColumnCategories(): string[] {
    return Array.from(new Set(this.columns.map((col) => col.category)))
  }
}
