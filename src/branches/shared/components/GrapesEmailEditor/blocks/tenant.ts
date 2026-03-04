/**
 * Tenant Branding Blocks
 *
 * Custom blocks that use tenant-specific branding:
 * - Logo block
 * - Branded button
 * - Branded header
 * - Branded footer
 */
import { icons } from './icons'

interface TenantBranding {
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: string
}

export function registerTenantBlocks(editor: any, branding: TenantBranding) {
  const {
    logo = '',
    primaryColor = '#3b82f6',
    secondaryColor = '#1e40af',
    fontFamily = 'Arial, sans-serif',
  } = branding

  const blockManager = editor.BlockManager

  // ═══════════════════════════════════════════════════════════
  // TENANT LOGO BLOCK
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-logo', {
    label: 'Bedrijfslogo',
    category: 'Huisstijl',
    media: icons.image,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            ${
              logo
                ? `<img src="${logo}" alt="Company Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />`
                : `<div style="width: 200px; height: 60px; background: #f3f4f6; display: inline-block; line-height: 60px; color: #6b7280; font-family: ${fontFamily}; font-size: 14px;">Logo Placeholder</div>`
            }
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BRANDED BUTTON
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-button', {
    label: 'Huisstijl knop',
    category: 'Huisstijl',
    media: icons.button,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <a href="#" style="display: inline-block; padding: 12px 32px; background-color: ${primaryColor}; color: #ffffff; font-family: ${fontFamily}; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 4px;">
              Click Here
            </a>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BRANDED HEADER
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-header', {
    label: 'Huisstijl koptekst',
    category: 'Huisstijl',
    media: icons.type,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: ${primaryColor};">
        <tr>
          <td style="padding: 30px 20px; text-align: center;">
            ${
              logo
                ? `<img src="${logo}" alt="Company Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 15px;" />`
                : `<div style="width: 150px; height: 45px; background: rgba(255, 255, 255, 0.2); display: inline-block; line-height: 45px; color: #ffffff; font-family: ${fontFamily}; font-size: 12px; margin-bottom: 15px;">Logo</div>`
            }
            <h1 style="margin: 0; padding: 0; color: #ffffff; font-family: ${fontFamily}; font-size: 28px; font-weight: 600;">
              Welcome!
            </h1>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BRANDED FOOTER
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-footer', {
    label: 'Huisstijl voettekst',
    category: 'Huisstijl',
    media: icons.mail,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f9fafb;">
        <tr>
          <td style="padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 10px; padding: 0; color: #6b7280; font-family: ${fontFamily}; font-size: 14px;">
              You're receiving this email because you subscribed to our newsletter.
            </p>
            <p style="margin: 0; padding: 0; color: #6b7280; font-family: ${fontFamily}; font-size: 12px;">
              &copy; 2024 Company Name. All rights reserved.
            </p>
            <div style="margin-top: 15px;">
              <a href="#" style="color: ${primaryColor}; text-decoration: none; margin: 0 10px; font-family: ${fontFamily}; font-size: 12px;">Privacy Policy</a>
              <a href="#" style="color: ${primaryColor}; text-decoration: none; margin: 0 10px; font-family: ${fontFamily}; font-size: 12px;">Unsubscribe</a>
            </div>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BRANDED DIVIDER
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-divider', {
    label: 'Huisstijl scheidingslijn',
    category: 'Huisstijl',
    media: icons.minus,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <hr style="border: none; border-top: 2px solid ${primaryColor}; margin: 0;" />
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // BRANDED SECTION (Two Columns)
  // ═══════════════════════════════════════════════════════════
  blockManager.add('tenant-two-column', {
    label: 'Huisstijl kolommen',
    category: 'Huisstijl',
    media: icons.columns2,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="50%" style="padding: 10px; vertical-align: top; border-right: 1px solid #e5e7eb;">
                  <h3 style="margin: 0 0 10px; padding: 0; color: ${primaryColor}; font-family: ${fontFamily}; font-size: 18px; font-weight: 600;">
                    Left Column
                  </h3>
                  <p style="margin: 0; padding: 0; color: #6b7280; font-family: ${fontFamily}; font-size: 14px; line-height: 1.6;">
                    Add your content here.
                  </p>
                </td>
                <td width="50%" style="padding: 10px; vertical-align: top;">
                  <h3 style="margin: 0 0 10px; padding: 0; color: ${primaryColor}; font-family: ${fontFamily}; font-size: 18px; font-weight: 600;">
                    Right Column
                  </h3>
                  <p style="margin: 0; padding: 0; color: #6b7280; font-family: ${fontFamily}; font-size: 14px; line-height: 1.6;">
                    Add your content here.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  console.log('[Tenant Blocks] Registered 6 huisstijl blocks')
}
