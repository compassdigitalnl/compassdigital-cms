import { Resend } from 'resend'

export interface ContactEmailData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

interface OrderItem {
  product?: any
  productSnapshot?: {
    name?: string
    sku?: string
  }
  quantity?: number
  unitPrice?: number
  totalPrice?: number
}

interface Address {
  firstName?: string
  lastName?: string
  street?: string
  houseNumber?: string
  addition?: string
  postalCode?: string
  city?: string
  country?: string
}

interface Order {
  orderNumber?: string
  items?: OrderItem[]
  subtotal?: number
  discountTotal?: number
  shippingTotal?: number
  taxTotal?: number
  total?: number
  currency?: string
  billingAddress?: Address
  shippingAddress?: Address
  shipping?: {
    trackingNumber?: string
    carrier?: string
  }
  createdAt?: string
}

interface ReturnDoc {
  returnNumber?: string
  orderNumber?: string
  reason?: string
  items?: Array<{
    product?: any
    quantity?: number
  }>
  createdAt?: string
}

export class EmailService {
  private resend: Resend | null = null

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      this.resend = new Resend(apiKey)
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return this.resend !== null
  }

  /**
   * Send generic email
   */
  async send({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }): Promise<{ success: boolean; error?: string; data?: any }> {
    if (!this.resend) {
      console.warn('Email service not configured - RESEND_API_KEY missing')
      return { success: false, error: 'Email service not configured' }
    }

    const fromEmail = process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@example.com'

    try {
      const { data: emailData, error } = await this.resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      })

      if (error) {
        console.error('Resend error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: emailData }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }

  /**
   * Send contact form submission email
   */
  async sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.warn('Email service not configured - RESEND_API_KEY missing')
      return { success: false, error: 'Email service not configured' }
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'noreply@example.com'
    const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com'

    try {
      const { data: emailData, error } = await this.resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: data.subject || `Nieuw contactformulier bericht van ${data.name}`,
        replyTo: data.email,
        html: this.generateContactEmailHTML(data),
      })

      if (error) {
        console.error('Resend error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }

  /**
   * Generate HTML template for contact email
   */
  private generateContactEmailHTML(data: ContactEmailData): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contactformulier</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 30px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      font-size: 16px;
      color: #333;
    }
    .message-box {
      background: white;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Nieuw Contactformulier Bericht</h1>
    </div>

    <div class="field">
      <div class="field-label">Naam</div>
      <div class="field-value">${this.escapeHtml(data.name)}</div>
    </div>

    <div class="field">
      <div class="field-label">E-mailadres</div>
      <div class="field-value"><a href="mailto:${this.escapeHtml(data.email)}">${this.escapeHtml(data.email)}</a></div>
    </div>

    ${
      data.phone
        ? `
    <div class="field">
      <div class="field-label">Telefoonnummer</div>
      <div class="field-value"><a href="tel:${this.escapeHtml(data.phone)}">${this.escapeHtml(data.phone)}</a></div>
    </div>
    `
        : ''
    }

    ${
      data.subject
        ? `
    <div class="field">
      <div class="field-label">Onderwerp</div>
      <div class="field-value">${this.escapeHtml(data.subject)}</div>
    </div>
    `
        : ''
    }

    <div class="field">
      <div class="field-label">Bericht</div>
      <div class="message-box">${this.escapeHtml(data.message)}</div>
    </div>

    <div class="footer">
      Dit bericht is verzonden via het contactformulier op ${process.env.NEXT_PUBLIC_SERVER_URL || 'uw website'}
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order: Order, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    const subject = `Bevestiging bestelling ${order.orderNumber || 'N/A'}`
    const html = this.generateOrderConfirmationHTML(order)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send shipping confirmation email with tracking
   */
  async sendShippingConfirmation(
    order: Order,
    customerEmail: string,
    trackingNumber: string,
    carrier?: string,
  ): Promise<{ success: boolean; error?: string }> {
    const subject = `Je bestelling ${order.orderNumber || 'N/A'} is verzonden!`
    const html = this.generateShippingConfirmationHTML(order, trackingNumber, carrier)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send delivery confirmation email
   */
  async sendDeliveryConfirmation(order: Order, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    const subject = `Je bestelling ${order.orderNumber || 'N/A'} is afgeleverd!`
    const html = this.generateDeliveryConfirmationHTML(order)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send return request confirmation email
   */
  async sendReturnConfirmation(returnDoc: ReturnDoc, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    const subject = `Retour aanvraag ${returnDoc.returnNumber || 'N/A'} ontvangen`
    const html = this.generateReturnConfirmationHTML(returnDoc)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send return approval email
   */
  async sendReturnApproval(returnDoc: any, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    const subject = `✅ Retour ${returnDoc.rmaNumber || 'N/A'} goedgekeurd`
    const html = this.generateReturnApprovalHTML(returnDoc)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send return rejection email
   */
  async sendReturnRejection(returnDoc: any, customerEmail: string, rejectionReason?: string): Promise<{ success: boolean; error?: string }> {
    const subject = `❌ Retour ${returnDoc.rmaNumber || 'N/A'} afgekeurd`
    const html = this.generateReturnRejectionHTML(returnDoc, rejectionReason)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Send return label email (with tracking)
   */
  async sendReturnLabel(returnDoc: any, customerEmail: string, trackingUrl?: string): Promise<{ success: boolean; error?: string }> {
    const subject = `📦 Retourlabel voor ${returnDoc.rmaNumber || 'N/A'}`
    const html = this.generateReturnLabelHTML(returnDoc, trackingUrl)

    return await this.send({
      to: customerEmail,
      subject,
      html,
    })
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  // ========================================
  // ORDER EMAIL TEMPLATE GENERATORS
  // ========================================

  private generateOrderConfirmationHTML(order: Order): string {
    const items = (order.items || [])
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${this.getProductName(item)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity || 0}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          ${this.formatCurrency(item.unitPrice || 0, order.currency)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
          ${this.formatCurrency(item.totalPrice || 0, order.currency)}
        </td>
      </tr>
    `,
      )
      .join('')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orderbevestiging</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Bedankt voor je bestelling!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      We hebben je bestelling goed ontvangen en gaan deze zo snel mogelijk voor je verwerken.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #667eea;">Bestelling ${order.orderNumber || 'N/A'}</h2>
      <p style="margin: 0; color: #666;">Datum: ${this.formatDate(order.createdAt)}</p>
    </div>

    <h3 style="font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      Bestelde producten
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Aantal</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Prijs</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Totaal</th>
        </tr>
      </thead>
      <tbody>
        ${items}
      </tbody>
    </table>

    <div style="border-top: 2px solid #dee2e6; padding-top: 20px; margin-bottom: 30px;">
      <table style="width: 100%; max-width: 300px; margin-left: auto;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Subtotaal:</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatCurrency(order.subtotal || 0, order.currency)}</td>
        </tr>
        ${
          (order.discountTotal || 0) > 0
            ? `
        <tr>
          <td style="padding: 8px 0; color: #28a745;">Korting:</td>
          <td style="padding: 8px 0; text-align: right; color: #28a745;">-${this.formatCurrency(order.discountTotal || 0, order.currency)}</td>
        </tr>
        `
            : ''
        }
        <tr>
          <td style="padding: 8px 0; color: #666;">Verzendkosten:</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatCurrency(order.shippingTotal || 0, order.currency)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">BTW (21%):</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatCurrency(order.taxTotal || 0, order.currency)}</td>
        </tr>
        <tr style="border-top: 2px solid #667eea;">
          <td style="padding: 12px 0; font-size: 18px; font-weight: bold;">Totaal:</td>
          <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">
            ${this.formatCurrency(order.total || 0, order.currency)}
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="font-size: 16px; margin: 0 0 15px 0;">Verzendadres</h3>
      ${this.formatAddress(order.shippingAddress)}
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Je ontvangt een nieuwe e-mail zodra je bestelling is verzonden, inclusief Track & Trace informatie.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateShippingConfirmationHTML(order: Order, trackingNumber: string, carrier?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verzending bevestiging</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📦 Je bestelling is onderweg!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Goed nieuws! Je bestelling <strong>${order.orderNumber || 'N/A'}</strong> is verzonden en onderweg naar je toe.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">Track & Trace</h2>
      <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
        <code style="font-size: 20px; color: #333; font-weight: bold; letter-spacing: 2px;">${trackingNumber}</code>
      </div>
      ${carrier ? `<p style="margin: 0; color: #666;">Vervoerder: <strong>${carrier}</strong></p>` : ''}
    </div>

    <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #0066cc; font-size: 14px;">
        💡 <strong>Tip:</strong> Gebruik het Track & Trace nummer om de levering van je bestelling te volgen bij ${carrier || 'de vervoerder'}.
      </p>
    </div>

    <h3 style="font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      Verzendadres
    </h3>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      ${this.formatAddress(order.shippingAddress)}
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Vragen over je bestelling? Neem gerust contact met ons op!
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateDeliveryConfirmationHTML(order: Order): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Levering bevestiging</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Je bestelling is afgeleverd!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Je bestelling <strong>${order.orderNumber || 'N/A'}</strong> is succesvol afgeleverd. We hopen dat je tevreden bent met je aankoop!
    </p>

    <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #155724; font-size: 14px;">
        🎉 <strong>Bedankt voor je bestelling!</strong> Veel plezier met je nieuwe producten.
      </p>
    </div>

    <p style="color: #666; font-size: 14px;">
      Tevreden met je bestelling? We horen graag je mening! Niet tevreden? Neem contact met ons op, dan helpen we je graag verder.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateReturnConfirmationHTML(returnDoc: ReturnDoc): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retour bevestiging</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📋 Retour aanvraag ontvangen</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      We hebben je retour aanvraag goed ontvangen en gaan deze zo snel mogelijk voor je verwerken.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #fd7e14;">RMA Nummer</h2>
      <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px; text-align: center;">
        <code style="font-size: 20px; color: #333; font-weight: bold; letter-spacing: 2px;">${returnDoc.returnNumber || 'N/A'}</code>
      </div>
      <p style="margin: 0; color: #666; font-size: 14px;">
        Gebruik dit nummer bij correspondentie over je retour
      </p>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">
        ℹ️ Volgende stappen:
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
        <li>We beoordelen je aanvraag (meestal binnen 1-2 werkdagen)</li>
        <li>Bij goedkeuring ontvang je een retourlabel per e-mail</li>
        <li>Stuur het pakket terug met het retourlabel</li>
        <li>Na ontvangst verwerken we de terugbetaling</li>
      </ol>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Vragen over je retour? Neem gerust contact met ons op met vermelding van je RMA nummer.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateReturnApprovalHTML(returnDoc: any): string {
    const items = (returnDoc.items || [])
      .map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${this.escapeHtml(item.title || 'Unknown Product')}
            ${item.sku ? `<br><small style="color: #999;">SKU: ${this.escapeHtml(item.sku)}</small>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantityReturning || 0}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
            ${this.formatCurrency(item.returnValue || 0, 'EUR')}
          </td>
        </tr>
      `)
      .join('')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retour goedgekeurd</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Je retour is goedgekeurd!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Goed nieuws! Je retour aanvraag <strong>${returnDoc.rmaNumber || 'N/A'}</strong> is goedgekeurd.
    </p>

    <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #155724; font-size: 14px; font-weight: bold;">
        📋 Volgende stappen:
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #155724; font-size: 14px;">
        <li>Je ontvangt binnen 24 uur een retourlabel per e-mail</li>
        <li>Print het retourlabel en plak het op het pakket</li>
        <li>Stuur het pakket terug via ${returnDoc.returnShipping?.carrier || 'de vervoerder'}</li>
        <li>Na ontvangst inspecteren we de producten</li>
        <li>Als alles in orde is, verwerken we de terugbetaling binnen 5 werkdagen</li>
      </ol>
    </div>

    <h3 style="font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
      Geretourneerde producten
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Aantal</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Waarde</th>
        </tr>
      </thead>
      <tbody>
        ${items}
      </tbody>
    </table>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <table style="width: 100%; max-width: 300px; margin-left: auto;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; font-size: 16px;">Totale retourwaarde:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 16px; color: #28a745;">
            ${this.formatCurrency(returnDoc.returnValue || 0, 'EUR')}
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        ⚠️ <strong>Let op:</strong> De terugbetaling wordt pas verwerkt na inspectie van de geretourneerde producten.
        Als producten beschadigd of onvolledig zijn, kan het terugbetaalde bedrag afwijken.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Vragen over je retour? Neem gerust contact met ons op met vermelding van RMA nummer <strong>${returnDoc.rmaNumber || 'N/A'}</strong>.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateReturnRejectionHTML(returnDoc: any, rejectionReason?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retour afgekeurd</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">❌ Retour aanvraag afgekeurd</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Helaas kunnen we je retour aanvraag <strong>${returnDoc.rmaNumber || 'N/A'}</strong> niet goedkeuren.
    </p>

    <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #721c24; font-size: 14px; font-weight: bold;">
        📋 Reden van afkeuring:
      </p>
      <p style="margin: 0; color: #721c24; font-size: 14px;">
        ${this.escapeHtml(rejectionReason || returnDoc.rejectionReason || 'Geen reden opgegeven.')}
      </p>
    </div>

    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #0c5460; font-size: 14px; font-weight: bold;">
        💬 Niet tevreden met deze beslissing?
      </p>
      <p style="margin: 0; color: #0c5460; font-size: 14px;">
        Neem contact met ons op voor meer informatie of als je het niet eens bent met deze beslissing.
        Vermeld altijd je RMA nummer <strong>${returnDoc.rmaNumber || 'N/A'}</strong> in je bericht.
      </p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Contact</h3>
      <p style="margin: 0; color: #666; font-size: 14px;">
        📧 E-mail: ${process.env.CONTACT_EMAIL || 'info@example.com'}<br>
        📞 Telefoon: ${process.env.CONTACT_PHONE || '+31 (0)20 123 4567'}
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      We helpen je graag verder met je vraag of klacht.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  private generateReturnLabelHTML(returnDoc: any, trackingUrl?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retourlabel</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📦 Je retourlabel is klaar!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Je retourlabel voor <strong>${returnDoc.rmaNumber || 'N/A'}</strong> is klaar om gebruikt te worden.
    </p>

    ${
      trackingUrl
        ? `
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${trackingUrl}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        📥 Download Retourlabel
      </a>
    </div>
    `
        : ''
    }

    ${
      returnDoc.returnShipping?.trackingCode
        ? `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">Tracking Code</h2>
      <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
        <code style="font-size: 20px; color: #333; font-weight: bold; letter-spacing: 2px;">${returnDoc.returnShipping.trackingCode}</code>
      </div>
    </div>
    `
        : ''
    }

    <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #0066cc; font-size: 14px; font-weight: bold;">
        📋 Instructies:
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #0066cc; font-size: 14px;">
        <li>Download en print het retourlabel</li>
        <li>Verpak de producten veilig in de originele verpakking (indien mogelijk)</li>
        <li>Plak het retourlabel op het pakket</li>
        <li>Breng het pakket naar een ${returnDoc.returnShipping?.carrier || 'verzend'}punt</li>
        <li>Bewaar het ontvangstbewijs tot je de terugbetaling hebt ontvangen</li>
      </ol>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        ⚠️ <strong>Let op:</strong> Zorg dat het pakket goed verpakt is en de producten in originele staat zijn.
        Producten die beschadigd of onvolledig teruggestuurd worden, kunnen leiden tot een lagere terugbetaling.
      </p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Verwachte terugbetaling</h3>
      <p style="margin: 0; font-size: 24px; font-weight: bold; color: #667eea;">
        ${this.formatCurrency(returnDoc.returnValue || 0, 'EUR')}
      </p>
      <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
        Na inspectie (5-7 werkdagen na ontvangst)
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Vragen over je retour? Neem contact met ons op met vermelding van RMA nummer <strong>${returnDoc.rmaNumber || 'N/A'}</strong>.
    </p>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'SiteForge'}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
    `
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private getProductName(item: OrderItem): string {
    if (item.productSnapshot?.name) {
      return item.productSnapshot.name
    }
    if (typeof item.product === 'object' && item.product?.title) {
      return item.product.title
    }
    return 'Unknown Product'
  }

  private formatCurrency(amount: number, currency?: string): string {
    const curr = currency || 'EUR'
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: curr,
    }).format(amount)
  }

  private formatDate(date?: string): string {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  private formatAddress(address?: Address): string {
    if (!address) return '<p style="margin: 0; color: #999;">Geen adres beschikbaar</p>'

    const parts = []
    if (address.firstName || address.lastName) {
      parts.push(`<p style="margin: 0 0 5px 0;"><strong>${address.firstName || ''} ${address.lastName || ''}</strong></p>`)
    }
    if (address.street && address.houseNumber) {
      parts.push(
        `<p style="margin: 0 0 5px 0; color: #666;">${address.street} ${address.houseNumber}${address.addition || ''}</p>`,
      )
    }
    if (address.postalCode && address.city) {
      parts.push(`<p style="margin: 0 0 5px 0; color: #666;">${address.postalCode} ${address.city}</p>`)
    }
    if (address.country) {
      parts.push(`<p style="margin: 0; color: #666;">${address.country}</p>`)
    }

    return parts.join('')
  }
}

// Singleton instance
export const emailService = new EmailService()
