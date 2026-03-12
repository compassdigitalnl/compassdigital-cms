import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

/**
 * ConsultationDocument — React-PDF template for professional services consultation/quote PDF
 *
 * Renders a professional Dutch voorstel (proposal) PDF with:
 * - Company header with details (KvK, BTW)
 * - Proposal number and date
 * - Customer info (name, email, phone, company, address)
 * - Service details (type, budget, timeline)
 * - Project description
 * - Quoted amount if set
 * - Expiry date if set
 * - Footer with company details
 */

export interface ConsultationDocumentProps {
  consultation: {
    id: number | string
    name: string
    email: string
    phone: string
    company?: string
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
  companyInfo: {
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
  accountancy: 'Accountancy',
  juridisch: 'Juridisch advies',
  vastgoed: 'Vastgoed',
  marketing: 'Marketing',
  it: 'IT & Software',
  consultancy: 'Consultancy',
  hr: 'HR & Personeel',
  anders: 'Anders',
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
  proposalTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2b4a',
    marginBottom: 4,
  },
  proposalNumber: {
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

export function ConsultationDocument({ consultation, companyInfo }: ConsultationDocumentProps) {
  const proposalDate = formatDate(consultation.submittedAt)
  const expiryDate = consultation.expiresAt ? formatDate(consultation.expiresAt) : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text style={styles.companyDetail}>{companyInfo.address}</Text>
            <Text style={styles.companyDetail}>
              {companyInfo.postalCode} {companyInfo.city}
            </Text>
            <Text style={styles.companyDetail}>
              {companyInfo.phone} | {companyInfo.email}
            </Text>
            {companyInfo.kvk ? (
              <Text style={styles.companyDetail}>KvK: {companyInfo.kvk}</Text>
            ) : null}
            {companyInfo.vatNumber ? (
              <Text style={styles.companyDetail}>BTW: {companyInfo.vatNumber}</Text>
            ) : null}
          </View>
          <View style={{ alignItems: 'flex-end' as const }}>
            <Text style={styles.proposalTitle}>VOORSTEL</Text>
            <Text style={styles.proposalNumber}>
              Nr. VST-{String(consultation.id).padStart(5, '0')}
            </Text>
            <Text style={styles.proposalNumber}>Datum: {proposalDate}</Text>
            {expiryDate ? (
              <Text style={styles.proposalNumber}>Geldig tot: {expiryDate}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer info */}
        <Text style={styles.sectionTitle}>Klantgegevens</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Naam</Text>
          <Text style={styles.value}>{consultation.name}</Text>
        </View>
        {consultation.company ? (
          <View style={styles.row}>
            <Text style={styles.label}>Bedrijf</Text>
            <Text style={styles.value}>{consultation.company}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{consultation.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefoon</Text>
          <Text style={styles.value}>{consultation.phone}</Text>
        </View>
        {consultation.address ? (
          <View style={styles.row}>
            <Text style={styles.label}>Adres</Text>
            <Text style={styles.value}>{consultation.address}</Text>
          </View>
        ) : null}
        {consultation.postalCode || consultation.city ? (
          <View style={styles.row}>
            <Text style={styles.label}>Postcode / Plaats</Text>
            <Text style={styles.value}>
              {[consultation.postalCode, consultation.city].filter(Boolean).join(' ')}
            </Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* Service details */}
        <Text style={styles.sectionTitle}>Dienstgegevens</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Type dienst</Text>
          <Text style={styles.value}>
            {PROJECT_TYPE_LABELS[consultation.projectType] || consultation.projectType}
          </Text>
        </View>
        {consultation.budget ? (
          <View style={styles.row}>
            <Text style={styles.label}>Budget indicatie</Text>
            <Text style={styles.value}>{consultation.budget}</Text>
          </View>
        ) : null}
        {consultation.timeline ? (
          <View style={styles.row}>
            <Text style={styles.label}>Gewenste start</Text>
            <Text style={styles.value}>{consultation.timeline}</Text>
          </View>
        ) : null}

        {/* Description */}
        {consultation.description ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              Omschrijving
            </Text>
            <View style={styles.description}>
              <Text>{consultation.description}</Text>
            </View>
          </>
        ) : null}

        {/* Quoted amount */}
        {consultation.quotedAmount ? (
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Offertebedrag (excl. BTW)</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(consultation.quotedAmount)}
            </Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {companyInfo.name} | {companyInfo.address}, {companyInfo.postalCode}{' '}
            {companyInfo.city}
          </Text>
          <Text style={styles.footerText}>{companyInfo.website}</Text>
        </View>
      </Page>
    </Document>
  )
}
