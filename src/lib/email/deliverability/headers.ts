/**
 * Email Headers Optimizer
 *
 * Generates optimal email headers for maximum deliverability
 */

export interface EmailHeaders {
  'From': string
  'To': string
  'Subject': string
  'Reply-To'?: string
  'List-Unsubscribe'?: string
  'List-Unsubscribe-Post'?: string
  'Message-ID'?: string
  'Date'?: string
  'MIME-Version'?: string
  'Content-Type'?: string
  'X-Mailer'?: string
  'Precedence'?: string
  'X-Priority'?: string
}

export interface EmailHeaderOptions {
  from: string
  to: string
  subject: string
  replyTo?: string
  unsubscribeUrl?: string
  messageId?: string
  domain?: string
}

/**
 * Generate optimal email headers for deliverability
 */
export function generateOptimalHeaders(options: EmailHeaderOptions): EmailHeaders {
  const domain = options.domain || options.from.split('@')[1]

  const headers: EmailHeaders = {
    'From': options.from,
    'To': options.to,
    'Subject': options.subject,
    'Date': new Date().toUTCString(),
    'MIME-Version': '1.0',
    'Content-Type': 'text/html; charset=UTF-8',
    'X-Mailer': 'Payload CMS Email Marketing',
    'Precedence': 'bulk',
    'X-Priority': '3',
  }

  // Reply-To header
  if (options.replyTo) {
    headers['Reply-To'] = options.replyTo
  }

  // List-Unsubscribe headers (RFC 8058)
  if (options.unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${options.unsubscribeUrl}>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
  }

  // Message-ID (unique identifier)
  if (options.messageId) {
    headers['Message-ID'] = `<${options.messageId}@${domain}>`
  } else {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    headers['Message-ID'] = `<${timestamp}.${random}@${domain}>`
  }

  return headers
}

/**
 * Validate email headers for common issues
 */
export function validateHeaders(headers: EmailHeaders): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  // Required headers
  if (!headers['From']) {
    issues.push('Missing From header')
  }
  if (!headers['To']) {
    issues.push('Missing To header')
  }
  if (!headers['Subject']) {
    issues.push('Missing Subject header')
  }

  // Subject line validation
  if (headers['Subject']) {
    if (headers['Subject'].length > 70) {
      issues.push('Subject line too long (recommend <70 characters)')
    }
    if (headers['Subject'].includes('!!!')) {
      issues.push('Subject contains multiple exclamation marks (spam trigger)')
    }
    if (headers['Subject'].toUpperCase() === headers['Subject']) {
      issues.push('Subject is all caps (spam trigger)')
    }
    if (/free|urgent|act now|limited time/i.test(headers['Subject'])) {
      issues.push('Subject contains spam trigger words')
    }
  }

  // List-Unsubscribe header (best practice)
  if (!headers['List-Unsubscribe']) {
    issues.push('Missing List-Unsubscribe header (recommended for bulk email)')
  }

  // Message-ID header
  if (!headers['Message-ID']) {
    issues.push('Missing Message-ID header (recommended)')
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

/**
 * Generate spam-score safe subject line
 */
export function optimizeSubjectLine(subject: string): string {
  let optimized = subject

  // Remove excessive punctuation
  optimized = optimized.replace(/!{2,}/g, '!')
  optimized = optimized.replace(/\?{2,}/g, '?')

  // Title case instead of ALL CAPS
  if (optimized === optimized.toUpperCase() && optimized.length > 3) {
    optimized = optimized.charAt(0) + optimized.slice(1).toLowerCase()
  }

  // Trim to reasonable length
  if (optimized.length > 70) {
    optimized = optimized.substring(0, 67) + '...'
  }

  return optimized
}
