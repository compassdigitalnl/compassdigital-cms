/**
 * Listmonk Variable Blocks
 *
 * Blocks that use Listmonk template variables:
 * - Subscriber name/email
 * - Campaign data
 * - Unsubscribe link
 * - Opt-in confirmation
 */

export function registerListmonkBlocks(editor: any) {
  const blockManager = editor.BlockManager

  // ═══════════════════════════════════════════════════════════
  // PERSONALIZED GREETING
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-greeting', {
    label: 'Personalized Greeting',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-user' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <h2 style="margin: 0; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 24px; font-weight: 600;">
              Hello {{ .Subscriber.Name }}!
            </h2>
            <p style="margin: 10px 0 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px;">
              This email is personalized just for you.
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // SUBSCRIBER INFO
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-subscriber-info', {
    label: 'Subscriber Info',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-info-circle' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f9fafb;">
        <tr>
          <td style="padding: 15px 20px;">
            <p style="margin: 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px;">
              <strong>Your email:</strong> {{ .Subscriber.Email }}<br />
              <strong>Subscriber ID:</strong> {{ .Subscriber.UUID }}
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // CAMPAIGN INFO
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-campaign-info', {
    label: 'Campaign Info',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-envelope' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <h3 style="margin: 0 0 10px; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 20px; font-weight: 600;">
              {{ .Campaign.Name }}
            </h3>
            <p style="margin: 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 14px;">
              {{ .Campaign.Subject }}
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // UNSUBSCRIBE LINK
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-unsubscribe', {
    label: 'Unsubscribe Link',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-times-circle' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f9fafb;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="margin: 0; padding: 0; color: #9ca3af; font-family: Arial, sans-serif; font-size: 12px;">
              Don't want to receive these emails?
              <a href="{{ .UnsubscribeURL }}" style="color: #ef4444; text-decoration: underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // OPT-IN CONFIRMATION BUTTON
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-optin', {
    label: 'Opt-in Button',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-check-circle' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 30px 20px; text-align: center; background-color: #ecfdf5;">
            <h2 style="margin: 0 0 15px; padding: 0; color: #065f46; font-family: Arial, sans-serif; font-size: 24px; font-weight: 600;">
              Confirm Your Subscription
            </h2>
            <p style="margin: 0 0 20px; padding: 0; color: #047857; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
              Click the button below to confirm your email address and complete your subscription.
            </p>
            <a href="{{ .OptinURL }}" style="display: inline-block; padding: 14px 40px; background-color: #10b981; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
              Confirm Subscription
            </a>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // CUSTOM ATTRIBUTE (ADVANCED)
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-custom-attribute', {
    label: 'Custom Attribute',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-code' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <p style="margin: 0; padding: 0; color: #111827; font-family: Arial, sans-serif; font-size: 14px;">
              Custom value: <strong>{{ .Subscriber.Attribs.custom_field }}</strong>
            </p>
            <p style="margin: 10px 0 0; padding: 0; color: #9ca3af; font-family: Arial, sans-serif; font-size: 12px; font-style: italic;">
              (Replace 'custom_field' with your actual attribute name)
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // DATE PLACEHOLDER
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-date', {
    label: 'Current Date',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-calendar' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="margin: 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px;">
              Sent on {{ .Date }}
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // VIEW IN BROWSER LINK
  // ═══════════════════════════════════════════════════════════
  blockManager.add('listmonk-view-browser', {
    label: 'View in Browser',
    category: 'Listmonk Variables',
    attributes: { class: 'fa fa-external-link' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f9fafb;">
        <tr>
          <td style="padding: 10px 20px; text-align: center;">
            <p style="margin: 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px;">
              Having trouble viewing this email?
              <a href="{{ .ArchiveURL }}" style="color: #3b82f6; text-decoration: underline;">View in browser</a>
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  console.log('[Listmonk Blocks] Registered 8 Listmonk variable blocks')
}
