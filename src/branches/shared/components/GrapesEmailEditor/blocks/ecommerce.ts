/**
 * E-commerce Blocks
 *
 * Custom blocks for e-commerce email campaigns:
 * - Product card
 * - Price drop alert
 * - Product grid
 * - Customer review
 * - Order summary
 */

export function registerEcommerceBlocks(editor: any) {
  const blockManager = editor.BlockManager

  // ═══════════════════════════════════════════════════════════
  // PRODUCT CARD
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-product-card', {
    label: 'Productkaart',
    category: 'E-commerce',
    attributes: { class: 'fa fa-shopping-cart' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 0;">
                  <img src="https://via.placeholder.com/600x400?text=Product+Image" alt="Product" style="width: 100%; height: auto; display: block;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <h3 style="margin: 0 0 10px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600;">
                    Product Name
                  </h3>
                  <p style="margin: 0 0 15px; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
                    Short product description goes here. Highlight key features and benefits.
                  </p>
                  <div style="margin-bottom: 15px;">
                    <span style="color: #111827; font-family: Arial, sans-serif; font-size: 24px; font-weight: 700;">€49.99</span>
                    <span style="color: #9ca3af; font-family: Arial, sans-serif; font-size: 16px; text-decoration: line-through; margin-left: 8px;">€69.99</span>
                  </div>
                  <a href="#" style="display: inline-block; padding: 12px 32px; background-color: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px;">
                    Shop Now
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // PRICE DROP ALERT
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-price-drop', {
    label: 'Prijsverlaging',
    category: 'E-commerce',
    attributes: { class: 'fa fa-tag' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 30px 20px; text-align: center;">
                  <div style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px;">
                    🔥 Price Drop Alert
                  </div>
                  <h2 style="margin: 0 0 10px; padding: 0; color: #78350f; font-family: Arial, sans-serif; font-size: 24px; font-weight: 700;">
                    Your Wishlist Item is on Sale!
                  </h2>
                  <p style="margin: 0 0 20px; padding: 0; color: #92400e; font-family: Arial, sans-serif; font-size: 16px;">
                    Save <strong>30%</strong> on Product Name
                  </p>
                  <div style="margin-bottom: 20px;">
                    <span style="color: #78350f; font-family: Arial, sans-serif; font-size: 36px; font-weight: 700;">€49.99</span>
                    <span style="color: #92400e; font-family: Arial, sans-serif; font-size: 20px; text-decoration: line-through; margin-left: 10px;">€69.99</span>
                  </div>
                  <a href="#" style="display: inline-block; padding: 14px 40px; background-color: #dc2626; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                    Grab the Deal
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // PRODUCT GRID (3 Products)
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-product-grid', {
    label: 'Productraster',
    category: 'E-commerce',
    attributes: { class: 'fa fa-th' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Product 1 -->
                <td width="33.33%" style="padding: 10px; vertical-align: top;">
                  <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <tr>
                      <td style="padding: 0;">
                        <img src="https://via.placeholder.com/200x200?text=Product+1" alt="Product 1" style="width: 100%; height: auto; display: block;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; text-align: center;">
                        <p style="margin: 0 0 8px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600;">
                          Product Name
                        </p>
                        <p style="margin: 0 0 12px; padding: 0; color: #3b82f6; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700;">
                          €29.99
                        </p>
                        <a href="#" style="display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; text-decoration: none; border-radius: 4px;">
                          Shop
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- Product 2 -->
                <td width="33.33%" style="padding: 10px; vertical-align: top;">
                  <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <tr>
                      <td style="padding: 0;">
                        <img src="https://via.placeholder.com/200x200?text=Product+2" alt="Product 2" style="width: 100%; height: auto; display: block;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; text-align: center;">
                        <p style="margin: 0 0 8px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600;">
                          Product Name
                        </p>
                        <p style="margin: 0 0 12px; padding: 0; color: #3b82f6; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700;">
                          €39.99
                        </p>
                        <a href="#" style="display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; text-decoration: none; border-radius: 4px;">
                          Shop
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- Product 3 -->
                <td width="33.33%" style="padding: 10px; vertical-align: top;">
                  <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <tr>
                      <td style="padding: 0;">
                        <img src="https://via.placeholder.com/200x200?text=Product+3" alt="Product 3" style="width: 100%; height: auto; display: block;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; text-align: center;">
                        <p style="margin: 0 0 8px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600;">
                          Product Name
                        </p>
                        <p style="margin: 0 0 12px; padding: 0; color: #3b82f6; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700;">
                          €49.99
                        </p>
                        <a href="#" style="display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; text-decoration: none; border-radius: 4px;">
                          Shop
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // CUSTOMER REVIEW
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-review', {
    label: 'Klantrecensie',
    category: 'E-commerce',
    attributes: { class: 'fa fa-star' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-left: 4px solid #fbbf24; border-radius: 4px;">
              <tr>
                <td style="padding: 20px;">
                  <div style="margin-bottom: 10px;">
                    <span style="color: #fbbf24; font-size: 18px;">★★★★★</span>
                  </div>
                  <p style="margin: 0 0 15px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; font-style: italic;">
                    "This product exceeded my expectations! Highly recommend it to anyone looking for quality."
                  </p>
                  <p style="margin: 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px;">
                    <strong>— John Doe</strong>, Verified Customer
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // ORDER SUMMARY
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-order-summary', {
    label: 'Bestelling overzicht',
    category: 'E-commerce',
    attributes: { class: 'fa fa-receipt' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px;">
              <tr>
                <td style="padding: 20px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <h3 style="margin: 0; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600;">
                    Order Summary
                  </h3>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px;">Product Name x2</td>
                      <td style="padding: 8px 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; text-align: right;">€99.98</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px;">Shipping</td>
                      <td style="padding: 8px 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; text-align: right;">€5.99</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px;">Tax</td>
                      <td style="padding: 8px 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px; text-align: right;">€22.05</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 8px; border-top: 2px solid #e5e7eb; color: #111827; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700;">Total</td>
                      <td style="padding: 15px 0 8px; border-top: 2px solid #e5e7eb; color: #111827; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; text-align: right;">€128.02</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BACK IN STOCK ALERT
  // ═══════════════════════════════════════════════════════════
  blockManager.add('ecom-back-in-stock', {
    label: 'Weer op voorraad',
    category: 'E-commerce',
    attributes: { class: 'fa fa-box' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px;">
              <tr>
                <td style="padding: 30px 20px; text-align: center;">
                  <div style="display: inline-block; background-color: #059669; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px;">
                    ✓ Back in Stock
                  </div>
                  <h2 style="margin: 0 0 10px; padding: 0; color: #064e3b; font-family: Arial, sans-serif; font-size: 24px; font-weight: 700;">
                    Product Name is Available Again!
                  </h2>
                  <p style="margin: 0 0 20px; padding: 0; color: #065f46; font-family: Arial, sans-serif; font-size: 14px;">
                    The item you've been waiting for is back in stock. Order now before it sells out again!
                  </p>
                  <a href="#" style="display: inline-block; padding: 14px 40px; background-color: #059669; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                    Shop Now
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  console.log('[E-commerce Blocks] Registered 6 e-commerce blokken')
}
