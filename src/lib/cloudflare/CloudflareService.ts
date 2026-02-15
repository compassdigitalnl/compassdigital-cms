/**
 * Cloudflare DNS Service
 *
 * Handles DNS record management via Cloudflare API
 *
 * Documentation: https://developers.cloudflare.com/api/
 *
 * Required ENV:
 * - CLOUDFLARE_API_TOKEN: API token with DNS edit permissions
 * - CLOUDFLARE_ZONE_ID: Zone ID for compassdigital.nl
 */

interface CloudflareConfig {
  apiToken: string
  zoneId: string // Zone ID for the main domain (compassdigital.nl)
  baseUrl?: string
}

interface DNSRecord {
  id?: string
  type: 'A' | 'CNAME' | 'TXT' | 'MX'
  name: string // Full subdomain (e.g., "demoshop.compassdigital.nl")
  content: string // IP address or target domain
  ttl?: number // TTL in seconds (1 = auto)
  proxied?: boolean // Cloudflare proxy (orange cloud)
  comment?: string
}

interface CloudflareDNSRecord {
  id: string
  type: string
  name: string
  content: string
  proxied: boolean
  ttl: number
  created_on: string
  modified_on: string
}

interface CloudflareResponse<T> {
  success: boolean
  errors: Array<{ code: number; message: string }>
  messages: Array<{ code: number; message: string }>
  result: T
}

export class CloudflareService {
  private apiToken: string
  private zoneId: string
  private baseUrl: string

  constructor(config: CloudflareConfig) {
    this.apiToken = config.apiToken
    this.zoneId = config.zoneId
    this.baseUrl = config.baseUrl || 'https://api.cloudflare.com/client/v4'
  }

  /**
   * Make authenticated request to Cloudflare API
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<CloudflareResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      const errorMessage = data.errors?.[0]?.message || `Cloudflare API error: ${response.status}`
      throw new Error(errorMessage)
    }

    return data
  }

  // ===== DNS Record Management =====

  /**
   * Create a new DNS record
   */
  async createDNSRecord(record: DNSRecord): Promise<CloudflareDNSRecord> {
    const response = await this.request<CloudflareDNSRecord>(
      `/zones/${this.zoneId}/dns_records`,
      {
        method: 'POST',
        body: JSON.stringify({
          type: record.type,
          name: record.name,
          content: record.content,
          ttl: record.ttl || 1, // 1 = auto
          proxied: record.proxied !== undefined ? record.proxied : false,
          comment: record.comment,
        }),
      },
    )

    return response.result
  }

  /**
   * Get DNS record by name
   */
  async getDNSRecord(name: string): Promise<CloudflareDNSRecord | null> {
    const response = await this.request<CloudflareDNSRecord[]>(
      `/zones/${this.zoneId}/dns_records?name=${encodeURIComponent(name)}`,
    )

    return response.result[0] || null
  }

  /**
   * List all DNS records (with optional filter)
   */
  async listDNSRecords(filter?: {
    type?: string
    name?: string
    content?: string
  }): Promise<CloudflareDNSRecord[]> {
    const params = new URLSearchParams()
    if (filter?.type) params.append('type', filter.type)
    if (filter?.name) params.append('name', filter.name)
    if (filter?.content) params.append('content', filter.content)

    const queryString = params.toString()
    const endpoint = `/zones/${this.zoneId}/dns_records${queryString ? `?${queryString}` : ''}`

    const response = await this.request<CloudflareDNSRecord[]>(endpoint)

    return response.result
  }

  /**
   * Update existing DNS record
   */
  async updateDNSRecord(recordId: string, updates: Partial<DNSRecord>): Promise<CloudflareDNSRecord> {
    const response = await this.request<CloudflareDNSRecord>(
      `/zones/${this.zoneId}/dns_records/${recordId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          type: updates.type,
          name: updates.name,
          content: updates.content,
          ttl: updates.ttl,
          proxied: updates.proxied,
          comment: updates.comment,
        }),
      },
    )

    return response.result
  }

  /**
   * Delete DNS record
   */
  async deleteDNSRecord(recordId: string): Promise<void> {
    await this.request(`/zones/${this.zoneId}/dns_records/${recordId}`, {
      method: 'DELETE',
    })
  }

  // ===== Convenience Methods =====

  /**
   * Create or update A record for subdomain
   */
  async createOrUpdateARecord(subdomain: string, ipAddress: string, proxied: boolean = false): Promise<CloudflareDNSRecord> {
    // Check if record exists
    const existingRecord = await this.getDNSRecord(subdomain)

    if (existingRecord) {
      // Update existing record
      return this.updateDNSRecord(existingRecord.id, {
        type: 'A',
        name: subdomain,
        content: ipAddress,
        proxied,
        comment: `Auto-updated by SiteForge - ${new Date().toISOString()}`,
      })
    } else {
      // Create new record
      return this.createDNSRecord({
        type: 'A',
        name: subdomain,
        content: ipAddress,
        proxied,
        comment: `Auto-created by SiteForge - ${new Date().toISOString()}`,
      })
    }
  }

  /**
   * Create or update CNAME record for subdomain
   */
  async createOrUpdateCNAME(subdomain: string, target: string, proxied: boolean = false): Promise<CloudflareDNSRecord> {
    // Check if record exists
    const existingRecord = await this.getDNSRecord(subdomain)

    if (existingRecord) {
      // Update existing record
      return this.updateDNSRecord(existingRecord.id, {
        type: 'CNAME',
        name: subdomain,
        content: target,
        proxied,
        comment: `Auto-updated by SiteForge - ${new Date().toISOString()}`,
      })
    } else {
      // Create new record
      return this.createDNSRecord({
        type: 'CNAME',
        name: subdomain,
        content: target,
        proxied,
        comment: `Auto-created by SiteForge - ${new Date().toISOString()}`,
      })
    }
  }

  /**
   * Delete DNS record by name (convenience method)
   */
  async deleteDNSRecordByName(name: string): Promise<void> {
    const record = await this.getDNSRecord(name)
    if (record) {
      await this.deleteDNSRecord(record.id)
    }
  }

  /**
   * Verify DNS record is active and propagated
   */
  async verifyDNSRecord(name: string, expectedContent: string, maxAttempts: number = 10): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const record = await this.getDNSRecord(name)

      if (record && record.content === expectedContent) {
        return true
      }

      // Wait 3 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    return false
  }

  // ===== Zone Management =====

  /**
   * Get zone details
   */
  async getZoneDetails(): Promise<any> {
    const response = await this.request(`/zones/${this.zoneId}`)
    return response.result
  }

  /**
   * Purge cache for specific URLs
   */
  async purgeCache(urls: string[]): Promise<void> {
    await this.request(`/zones/${this.zoneId}/purge_cache`, {
      method: 'POST',
      body: JSON.stringify({ files: urls }),
    })
  }

  /**
   * Purge entire cache for zone
   */
  async purgeAllCache(): Promise<void> {
    await this.request(`/zones/${this.zoneId}/purge_cache`, {
      method: 'POST',
      body: JSON.stringify({ purge_everything: true }),
    })
  }
}

/**
 * Factory function to create CloudflareService
 */
export function createCloudflareService(config?: {
  apiToken?: string
  zoneId?: string
  baseUrl?: string
}) {
  const apiToken = config?.apiToken || process.env.CLOUDFLARE_API_TOKEN
  const zoneId = config?.zoneId || process.env.CLOUDFLARE_ZONE_ID

  if (!apiToken) {
    throw new Error(
      'Cloudflare API token not configured. Set CLOUDFLARE_API_TOKEN environment variable.',
    )
  }

  if (!zoneId) {
    throw new Error(
      'Cloudflare Zone ID not configured. Set CLOUDFLARE_ZONE_ID environment variable.',
    )
  }

  return new CloudflareService({
    apiToken,
    zoneId,
    baseUrl: config?.baseUrl,
  })
}
