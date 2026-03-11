import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

/**
 * QuoteDocument — React-PDF template for construction quote generation
 *
 * Renders a professional Dutch quote (offerte) PDF with:
 * - Company header with details (KvK, BTW)
 * - Quote number and date
 * - Customer info (name, email, phone, address)
 * - Project details (type, budget, timeline)
 * - Project description
 * - Quoted amount if set
 * - Expiry date if set
 * - Footer with company details
 */

export interface QuoteDocumentProps {
  quote: {
    id: number | string
    name: string
    email: string
    phone: string
    address?: string
    postalCode?: string
    city?: string
    projectType: string
    budget?: string
    timeline?: string
    description?: string
    quotedAmount?: number
    expiresAt?: string
    submittedAt: string
    status: string
  }
  company: {
    name: string
    address: string
    postalCode: string
    city: string
    country: string
    kvk: string
    vatNumber: string
    email: string
    phone: string
    website: string
  }
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  nieuwbouw: 'Nieuwbouw',
  renovatie: 'Renovatie',
  verduurzaming: 'Verduurzaming',
  aanbouw: 'Aanbouw / Opbouw',
  utiliteitsbouw: 'Utiliteitsbouw',
  herstelwerk: 'Herstelwerk',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    color: '#333',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2b4a',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  quoteTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2b4a',
    marginBottom: 4,
  },
  quoteNumber: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  // Dividers
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 16,
  },
  // Sections
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2b4a',
    marginBottom: 8,
  },
  // Key-value rows
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 140,
    fontFamily: 'Helvetica-Bold',
    color: '#666',
  },
  value: {
    flex: 1,
  },
  // Description block
  description: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    lineHeight: 1.5,
  },
  // Amount highlight
  amountBox: {
    backgroundColor: '#1a2b4a',
    padding: 16,
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
})

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function QuoteDocument({ quote, company }: QuoteDocumentProps) {
  const quoteDate = formatDate(quote.submittedAt)
  const expiryDate = quote.expiresAt ? formatDate(quote.expiresAt) : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyDetail}>{company.address}</Text>
            <Text style={styles.companyDetail}>
              {company.postalCode} {company.city}
            </Text>
            <Text style={styles.companyDetail}>
              {company.phone} | {company.email}
            </Text>
            {company.kvk ? (
              <Text style={styles.companyDetail}>KvK: {company.kvk}</Text>
            ) : null}
            {company.vatNumber ? (
              <Text style={styles.companyDetail}>BTW: {company.vatNumber}</Text>
            ) : null}
          </View>
          <View style={{ alignItems: 'flex-end' as const }}>
            <Text style={styles.quoteTitle}>OFFERTE</Text>
            <Text style={styles.quoteNumber}>
              Nr. OFF-{String(quote.id).padStart(5, '0')}
            </Text>
            <Text style={styles.quoteNumber}>Datum: {quoteDate}</Text>
            {expiryDate ? (
              <Text style={styles.quoteNumber}>Geldig tot: {expiryDate}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer info */}
        <Text style={styles.sectionTitle}>Klantgegevens</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Naam</Text>
          <Text style={styles.value}>{quote.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{quote.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefoon</Text>
          <Text style={styles.value}>{quote.phone}</Text>
        </View>
        {quote.address ? (
          <View style={styles.row}>
            <Text style={styles.label}>Adres</Text>
            <Text style={styles.value}>{quote.address}</Text>
          </View>
        ) : null}
        {quote.postalCode || quote.city ? (
          <View style={styles.row}>
            <Text style={styles.label}>Postcode / Plaats</Text>
            <Text style={styles.value}>
              {[quote.postalCode, quote.city].filter(Boolean).join(' ')}
            </Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* Project details */}
        <Text style={styles.sectionTitle}>Projectgegevens</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Projecttype</Text>
          <Text style={styles.value}>
            {PROJECT_TYPE_LABELS[quote.projectType] || quote.projectType}
          </Text>
        </View>
        {quote.budget ? (
          <View style={styles.row}>
            <Text style={styles.label}>Budget indicatie</Text>
            <Text style={styles.value}>{quote.budget}</Text>
          </View>
        ) : null}
        {quote.timeline ? (
          <View style={styles.row}>
            <Text style={styles.label}>Gewenste start</Text>
            <Text style={styles.value}>{quote.timeline}</Text>
          </View>
        ) : null}

        {/* Description */}
        {quote.description ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              Omschrijving
            </Text>
            <View style={styles.description}>
              <Text>{quote.description}</Text>
            </View>
          </>
        ) : null}

        {/* Quoted amount */}
        {quote.quotedAmount ? (
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Offertebedrag (excl. BTW)</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(quote.quotedAmount)}
            </Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {company.name} | {company.address}, {company.postalCode}{' '}
            {company.city}
          </Text>
          <Text style={styles.footerText}>{company.website}</Text>
        </View>
      </Page>
    </Document>
  )
}
