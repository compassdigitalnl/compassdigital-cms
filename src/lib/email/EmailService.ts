import { Resend } from 'resend'

export interface ContactEmailData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
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
}

// Singleton instance
export const emailService = new EmailService()
