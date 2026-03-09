/**
 * Live E-commerce Blocks
 *
 * GrapesJS blocks that fetch real product data:
 * - Productkaart (live): Single product card with picker
 * - Productraster (live): 3 products side by side
 *
 * Uses the product-picker:open command from productPicker.ts
 */
import { icons } from './icons'

interface ProductData {
  id: number
  title: string
  price: number
  salePrice?: number
  slug: string
  imageUrl?: string
}

function generateProductCardHtml(product: ProductData): string {
  const imageHtml = product.imageUrl
    ? `<img src="${product.imageUrl}" alt="${product.title}" style="width: 100%; height: auto; display: block;" />`
    : `<div style="width: 100%; height: 200px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-family: Arial, sans-serif; font-size: 14px;">Geen afbeelding</div>`

  const priceHtml = product.salePrice
    ? `<span style="color: #111827; font-family: Arial, sans-serif; font-size: 22px; font-weight: 700;">€${product.salePrice.toFixed(2)}</span>
       <span style="color: #9ca3af; font-family: Arial, sans-serif; font-size: 15px; text-decoration: line-through; margin-left: 8px;">€${product.price.toFixed(2)}</span>`
    : `<span style="color: #111827; font-family: Arial, sans-serif; font-size: 22px; font-weight: 700;">€${product.price.toFixed(2)}</span>`

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 0;">${imageHtml}</td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <h3 style="margin: 0 0 10px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600;">
            ${product.title}
          </h3>
          <div style="margin-bottom: 15px;">${priceHtml}</div>
          <a href="/product/${product.slug}" style="display: inline-block; padding: 12px 32px; background-color: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px;">
            Bekijk product
          </a>
        </td>
      </tr>
    </table>`
}

function generatePlaceholderHtml(label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 2px dashed #d1d5db; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 40px 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🛍️</div>
          <p style="margin: 0 0 5px; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600;">
            ${label}
          </p>
          <p style="margin: 0; padding: 0; color: #9ca3af; font-family: Arial, sans-serif; font-size: 12px;">
            Dubbelklik om een product te kiezen
          </p>
        </td>
      </tr>
    </table>`
}

export function registerLiveEcommerceBlocks(editor: any) {
  const blockManager = editor.BlockManager

  // ═══════════════════════════════════════════════════════════
  // Custom component type: product-card
  // ═══════════════════════════════════════════════════════════
  editor.DomComponents.addType('product-card', {
    model: {
      defaults: {
        tagName: 'div',
        droppable: false,
        attributes: { 'data-product-id': '' },
        traits: [
          {
            type: 'text',
            name: 'product-id',
            label: 'Product ID',
            changeProp: true,
          },
        ],
      },
      init(this: any) {
        // Open picker on first add (when no product selected)
        this.on('change:attributes', this.handleAttrChange)
      },
      handleAttrChange(this: any) {
        // Product ID changed
      },
      setProductData(this: any, product: ProductData) {
        const html = generateProductCardHtml(product)
        this.components(html)
        this.addAttributes({ 'data-product-id': String(product.id) })
        this.set('product-id', String(product.id))
      },
    },
    view: {
      events: {
        dblclick: 'onDblClick',
      },
      onDblClick(this: any) {
        const model = this.model
        editor.runCommand('product-picker:open', {
          onSelect: (product: ProductData) => {
            model.setProductData(product)
          },
        })
      },
      onRender(this: any) {
        // If no product data, show placeholder
        const productId = this.model.getAttributes()['data-product-id']
        if (!productId) {
          this.model.components(generatePlaceholderHtml('Productkaart'))
        }
      },
    },
  })

  // ═══════════════════════════════════════════════════════════
  // PRODUCTKAART (LIVE)
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-product-live', {
    label: 'Productkaart (live)',
    category: 'E-commerce',
    media: icons.shoppingBag,
    content: {
      type: 'product-card',
      content: generatePlaceholderHtml('Productkaart'),
      style: { padding: '20px' },
    },
  })

  // ═══════════════════════════════════════════════════════════
  // PRODUCTRASTER 2 (LIVE) — 2 products side by side
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-product-grid-2-live', {
    label: 'Productraster 2 (live)',
    category: 'E-commerce',
    media: icons.grid2cols,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="50%" style="padding: 10px; vertical-align: top;" data-gjs-type="product-card" data-product-id="">
                  ${generatePlaceholderHtml('Product 1')}
                </td>
                <td width="50%" style="padding: 10px; vertical-align: top;" data-gjs-type="product-card" data-product-id="">
                  ${generatePlaceholderHtml('Product 2')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // PRODUCTRASTER 3 (LIVE) — 3 products side by side
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-product-grid-live', {
    label: 'Productraster 3 (live)',
    category: 'E-commerce',
    media: icons.grid3cols,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="33.33%" style="padding: 10px; vertical-align: top;" data-gjs-type="product-card" data-product-id="">
                  ${generatePlaceholderHtml('Product 1')}
                </td>
                <td width="33.33%" style="padding: 10px; vertical-align: top;" data-gjs-type="product-card" data-product-id="">
                  ${generatePlaceholderHtml('Product 2')}
                </td>
                <td width="33.33%" style="padding: 10px; vertical-align: top;" data-gjs-type="product-card" data-product-id="">
                  ${generatePlaceholderHtml('Product 3')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  console.log('[Live E-commerce Blocks] Registered 3 live product blokken')
}
