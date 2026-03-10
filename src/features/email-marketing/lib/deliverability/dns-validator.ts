/**
 * DNS Validator for Email Deliverability
 *
 * Validates SPF, DKIM, and DMARC records to ensure proper email authentication
 * and improve deliverability scores.
 */

import { promises as dns } from 'dns'

// ═══════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

export interface SPFRecord {
  exists: boolean
  record?: string
  valid: boolean
  mechanisms?: string[]
  issues?: string[]
}

export interface DKIMRecord {
  exists: boolean
  selector: string
  record?: string
  valid: boolean
  keyType?: string
  issues?: string[]
}

export interface DMARCRecord {
  exists: boolean
  record?: string
  valid: boolean
  policy?: string
  percentage?: number
  reportEmail?: string
  issues?: string[]
}

export interface MXRecord {
  exists: boolean
  records?: Array<{ priority: number; exchange: string }>
  valid: boolean
  issues?: string[]
}

export interface DNSValidationResult {
  domain: string
  timestamp: Date
  spf: SPFRecord
  dkim: DKIMRecord[]
  dmarc: DMARCRecord
  mx: MXRecord
  score: number // 0-100
  overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  recommendations: string[]
}

// ═══════════════════════════════════════════════════════════
// SPF VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate SPF record for a domain
 */
export async function validateSPF(domain: string): Promise<SPFRecord> {
  const result: SPFRecord = {
    exists: false,
    valid: false,
    issues: [],
  }

  try {
    const records = await dns.resolveTxt(domain)
    const spfRecords = records.filter(record =>
      record.join('').startsWith('v=spf1')
    )

    if (spfRecords.length === 0) {
      result.issues!.push('No SPF record found')
      return result
    }

    if (spfRecords.length > 1) {
      result.issues!.push('Multiple SPF records found (only one allowed)')
      return result
    }

    result.exists = true
    result.record = spfRecords[0].join('')

    // Parse SPF mechanisms
    const mechanisms = result.record.split(' ')
    result.mechanisms = mechanisms

    // Validate SPF syntax
    const validMechanisms = ['v=spf1', 'include:', 'a', 'mx', 'ip4:', 'ip6:', 'all', '-all', '~all', '?all', '+all']
    let hasValidMechanisms = false

    for (const mechanism of mechanisms) {
      if (validMechanisms.some(valid => mechanism.startsWith(valid))) {
        hasValidMechanisms = true
      }
    }

    if (!hasValidMechanisms) {
      result.issues!.push('SPF record contains invalid mechanisms')
      return result
    }

    // Check for common issues
    if (!result.record.includes('all')) {
      result.issues!.push('SPF record should end with an "all" mechanism')
    }

    if (result.record.includes('+all')) {
      result.issues!.push('SPF record uses "+all" which allows any server (not recommended)')
    }

    // Check DNS lookups (max 10 allowed)
    const lookupCount = mechanisms.filter(m =>
      m.startsWith('include:') || m.startsWith('a:') || m.startsWith('mx:') || m === 'a' || m === 'mx'
    ).length

    if (lookupCount > 10) {
      result.issues!.push(`SPF record has ${lookupCount} DNS lookups (max 10 allowed)`)
    }

    result.valid = result.issues!.length === 0
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    result.issues!.push(`DNS lookup failed: ${message}`)
    return result
  }
}

// ═══════════════════════════════════════════════════════════
// DKIM VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate DKIM record for a domain with given selector
 */
export async function validateDKIM(domain: string, selector: string): Promise<DKIMRecord> {
  const result: DKIMRecord = {
    exists: false,
    selector,
    valid: false,
    issues: [],
  }

  try {
    const dkimDomain = `${selector}._domainkey.${domain}`
    const records = await dns.resolveTxt(dkimDomain)

    if (records.length === 0) {
      result.issues!.push(`No DKIM record found for selector "${selector}"`)
      return result
    }

    result.exists = true
    result.record = records[0].join('')

    // Parse DKIM record
    const parts = result.record.split(';').map(p => p.trim())
    const tags: Record<string, string> = {}

    for (const part of parts) {
      const [key, value] = part.split('=').map(s => s.trim())
      if (key && value) {
        tags[key] = value
      }
    }

    // Validate required tags
    if (!tags['v']) {
      result.issues!.push('DKIM record missing version tag (v=)')
    } else if (tags['v'] !== 'DKIM1') {
      result.issues!.push('DKIM version must be "DKIM1"')
    }

    if (!tags['p']) {
      result.issues!.push('DKIM record missing public key (p=)')
    } else if (tags['p'].length < 100) {
      result.issues!.push('DKIM public key seems too short')
    }

    // Extract key type
    result.keyType = tags['k'] || 'rsa'

    if (tags['k'] && tags['k'] !== 'rsa') {
      result.issues!.push(`DKIM key type "${tags['k']}" is uncommon (rsa is standard)`)
    }

    result.valid = result.issues!.length === 0
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    result.issues!.push(`DNS lookup failed: ${message}`)
    return result
  }
}

/**
 * Validate DKIM for common selectors
 */
export async function validateDKIMSelectors(domain: string, customSelectors?: string[]): Promise<DKIMRecord[]> {
  const commonSelectors = [
    'default',
    'mail',
    'smtp',
    'dkim',
    'selector1',
    'selector2',
    'google',
    'k1',
    's1',
    ...(customSelectors || []),
  ]

  const results: DKIMRecord[] = []

  for (const selector of commonSelectors) {
    const result = await validateDKIM(domain, selector)
    if (result.exists) {
      results.push(result)
    }
  }

  return results
}

// ═══════════════════════════════════════════════════════════
// DMARC VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate DMARC record for a domain
 */
export async function validateDMARC(domain: string): Promise<DMARCRecord> {
  const result: DMARCRecord = {
    exists: false,
    valid: false,
    issues: [],
  }

  try {
    const dmarcDomain = `_dmarc.${domain}`
    const records = await dns.resolveTxt(dmarcDomain)
    const dmarcRecords = records.filter(record =>
      record.join('').startsWith('v=DMARC1')
    )

    if (dmarcRecords.length === 0) {
      result.issues!.push('No DMARC record found')
      return result
    }

    if (dmarcRecords.length > 1) {
      result.issues!.push('Multiple DMARC records found (only one allowed)')
      return result
    }

    result.exists = true
    result.record = dmarcRecords[0].join('')

    // Parse DMARC tags
    const parts = result.record.split(';').map(p => p.trim()).filter(Boolean)
    const tags: Record<string, string> = {}

    for (const part of parts) {
      const [key, value] = part.split('=').map(s => s.trim())
      if (key && value) {
        tags[key] = value
      }
    }

    // Validate version
    if (!tags['v']) {
      result.issues!.push('DMARC record missing version tag (v=)')
    } else if (tags['v'] !== 'DMARC1') {
      result.issues!.push('DMARC version must be "DMARC1"')
    }

    // Validate policy
    if (!tags['p']) {
      result.issues!.push('DMARC record missing policy tag (p=)')
    } else {
      result.policy = tags['p']
      if (!['none', 'quarantine', 'reject'].includes(tags['p'])) {
        result.issues!.push(`Invalid DMARC policy: ${tags['p']}`)
      }

      if (tags['p'] === 'none') {
        result.issues!.push('DMARC policy is "none" - consider using "quarantine" or "reject"')
      }
    }

    // Parse percentage
    if (tags['pct']) {
      result.percentage = parseInt(tags['pct'], 10)
      if (result.percentage < 100) {
        result.issues!.push(`DMARC applies to only ${result.percentage}% of emails (recommend 100%)`)
      }
    } else {
      result.percentage = 100
    }

    // Check for reporting email
    if (tags['rua']) {
      result.reportEmail = tags['rua'].replace('mailto:', '')
    } else {
      result.issues!.push('DMARC record missing aggregate report email (rua=)')
    }

    result.valid = result.issues!.length === 0
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    result.issues!.push(`DNS lookup failed: ${message}`)
    return result
  }
}

// ═══════════════════════════════════════════════════════════
// MX RECORD VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate MX records for a domain
 */
export async function validateMX(domain: string): Promise<MXRecord> {
  const result: MXRecord = {
    exists: false,
    valid: false,
    issues: [],
  }

  try {
    const records = await dns.resolveMx(domain)

    if (records.length === 0) {
      result.issues!.push('No MX records found')
      return result
    }

    result.exists = true
    result.records = records.map(r => ({
      priority: r.priority,
      exchange: r.exchange,
    }))

    // Sort by priority
    result.records.sort((a, b) => a.priority - b.priority)

    // Check for common issues
    if (records.length === 1) {
      result.issues!.push('Only one MX record found (recommend multiple for redundancy)')
    }

    result.valid = result.issues!.length === 0
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    result.issues!.push(`DNS lookup failed: ${message}`)
    return result
  }
}

// ═══════════════════════════════════════════════════════════
// COMPLETE DNS VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Perform complete DNS validation for email deliverability
 */
export async function validateDNS(
  domain: string,
  dkimSelectors?: string[]
): Promise<DNSValidationResult> {
  // Run all validations in parallel
  const [spf, dkimRecords, dmarc, mx] = await Promise.all([
    validateSPF(domain),
    validateDKIMSelectors(domain, dkimSelectors),
    validateDMARC(domain),
    validateMX(domain),
  ])

  // Calculate score (0-100)
  let score = 0
  const recommendations: string[] = []

  // SPF scoring (25 points)
  if (spf.exists && spf.valid) {
    score += 25
  } else if (spf.exists) {
    score += 15
    recommendations.push('Fix SPF record issues')
  } else {
    recommendations.push('Add an SPF record to your domain')
  }

  // DKIM scoring (25 points)
  if (dkimRecords.length > 0) {
    const validDKIM = dkimRecords.filter(d => d.valid)
    if (validDKIM.length > 0) {
      score += 25
    } else {
      score += 15
      recommendations.push('Fix DKIM record issues')
    }
  } else {
    recommendations.push('Add DKIM records to your domain')
  }

  // DMARC scoring (30 points)
  if (dmarc.exists && dmarc.valid) {
    score += 30
    if (dmarc.policy === 'reject') {
      score += 5 // Bonus for strict policy
    }
  } else if (dmarc.exists) {
    score += 15
    recommendations.push('Fix DMARC record issues')
  } else {
    recommendations.push('Add a DMARC record to your domain')
  }

  // MX scoring (20 points)
  if (mx.exists && mx.valid) {
    score += 20
  } else if (mx.exists) {
    score += 10
    recommendations.push('Fix MX record issues')
  } else {
    recommendations.push('Add MX records to your domain')
  }

  // Determine overall status
  let overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  if (score >= 90) {
    overallStatus = 'excellent'
  } else if (score >= 70) {
    overallStatus = 'good'
  } else if (score >= 50) {
    overallStatus = 'needs-improvement'
  } else {
    overallStatus = 'critical'
  }

  return {
    domain,
    timestamp: new Date(),
    spf,
    dkim: dkimRecords,
    dmarc,
    mx,
    score,
    overallStatus,
    recommendations,
  }
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string {
  const parts = email.split('@')
  return parts[1] || email
}

/**
 * Format DNS validation result for display
 */
export function formatValidationResult(result: DNSValidationResult): string {
  const lines: string[] = []

  lines.push(`DNS Validation for ${result.domain}`)
  lines.push(`Score: ${result.score}/100 (${result.overallStatus})`)
  lines.push('')

  lines.push(`SPF: ${result.spf.exists ? '✓' : '✗'} ${result.spf.valid ? 'Valid' : 'Invalid'}`)
  if (result.spf.issues && result.spf.issues.length > 0) {
    result.spf.issues.forEach(issue => lines.push(`  - ${issue}`))
  }
  lines.push('')

  lines.push(`DKIM: ${result.dkim.length} selector(s) found`)
  result.dkim.forEach(dkim => {
    lines.push(`  ${dkim.selector}: ${dkim.valid ? '✓ Valid' : '✗ Invalid'}`)
    if (dkim.issues && dkim.issues.length > 0) {
      dkim.issues.forEach(issue => lines.push(`    - ${issue}`))
    }
  })
  lines.push('')

  lines.push(`DMARC: ${result.dmarc.exists ? '✓' : '✗'} ${result.dmarc.valid ? 'Valid' : 'Invalid'}`)
  if (result.dmarc.policy) {
    lines.push(`  Policy: ${result.dmarc.policy}`)
  }
  if (result.dmarc.issues && result.dmarc.issues.length > 0) {
    result.dmarc.issues.forEach(issue => lines.push(`  - ${issue}`))
  }
  lines.push('')

  lines.push(`MX: ${result.mx.exists ? '✓' : '✗'} ${result.mx.valid ? 'Valid' : 'Invalid'}`)
  if (result.mx.records) {
    result.mx.records.forEach(record =>
      lines.push(`  ${record.priority} ${record.exchange}`)
    )
  }
  lines.push('')

  if (result.recommendations.length > 0) {
    lines.push('Recommendations:')
    result.recommendations.forEach(rec => lines.push(`  - ${rec}`))
  }

  return lines.join('\n')
}
