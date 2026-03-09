import React from 'react'
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'

/**
 * InvoiceDocument — React-PDF template for invoice generation
 *
 * Renders a professional Dutch invoice with:
 * - Company header with details
 * - Invoice + order metadata
 * - Billing & shipping addresses
 * - Line items table
 * - Totals breakdown (subtotal, shipping, discount, tax, total)
 * - Payment information footer
 */

export interface InvoiceDocumentProps {
  invoice: {
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    status: string
    paymentMethod?: string
    paymentDate?: string
    subtotal: number
    tax: number
    shippingCost: number
    discount: number
    amount: number
    items: Array<{
      description: string
      sku?: string
      quantity: number
      unitPrice: number
      lineTotal: number
    }>
    notes?: string
  }
  order: {
    orderNumber: string
    shippingAddress?: {
      firstName?: string
      lastName?: string
      company?: string
      street?: string
      houseNumber?: string
      addition?: string
      postalCode?: string
      city?: string
      country?: string
    }
    billingAddress?: {
      sameAsShipping?: boolean
      firstName?: string
      lastName?: string
      company?: string
      street?: string
      houseNumber?: string
      addition?: string
      postalCode?: string
      city?: string
      country?: string
      kvk?: string
      vatNumber?: string
    }
  }
  company: {
    name: string
    address?: string
    postalCode?: string
    city?: string
    country?: string
    kvk?: string
    vatNumber?: string
    iban?: string
    email?: string
    phone?: string
    website?: string
  }
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
    color: '#1a1a2e',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 8,
    color: '#666',
    lineHeight: 1.5,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#667eea',
    textAlign: 'right',
  },
  // Meta info
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  metaBlock: {
    width: '48%',
  },
  metaLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: '#333',
    marginBottom: 6,
  },
  // Addresses
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  addressBlock: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
  },
  addressTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 9,
    color: '#555',
    lineHeight: 1.6,
  },
  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  colDesc: { width: '45%' },
  colSku: { width: '15%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  thText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tdText: {
    fontSize: 9,
    color: '#333',
  },
  tdTextBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  // Totals
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  totalsTable: {
    width: 220,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#667eea',
    marginTop: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: '#666',
  },
  totalsValue: {
    fontSize: 9,
    color: '#333',
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  totalsFinalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#667eea',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 8,
    color: '#999',
  },
  footerValue: {
    fontSize: 8,
    color: '#555',
  },
  footerNote: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
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
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateStr))
}

function formatAddress(addr: any): string {
  if (!addr) return ''
  const lines = []
  if (addr.company) lines.push(addr.company)
  if (addr.firstName || addr.lastName) {
    lines.push(`${addr.firstName || ''} ${addr.lastName || ''}`.trim())
  }
  if (addr.street && addr.houseNumber) {
    lines.push(`${addr.street} ${addr.houseNumber}${addr.addition || ''}`)
  }
  if (addr.postalCode && addr.city) {
    lines.push(`${addr.postalCode} ${addr.city}`)
  }
  if (addr.country && addr.country !== 'Nederland') {
    lines.push(addr.country)
  }
  return lines.join('\n')
}

const paymentMethodLabels: Record<string, string> = {
  ideal: 'iDEAL',
  invoice: 'Op rekening',
  creditcard: 'Creditcard',
  banktransfer: 'Bankoverschrijving',
  direct_debit: 'Incasso',
}

export function InvoiceDocument({ invoice, order, company }: InvoiceDocumentProps) {
  const billingAddr = order.billingAddress?.sameAsShipping
    ? order.shippingAddress
    : order.billingAddress

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyDetails}>
              {[company.address, `${company.postalCode || ''} ${company.city || ''}`.trim()]
                .filter(Boolean)
                .join('\n')}
              {company.kvk ? `\nKVK: ${company.kvk}` : ''}
              {company.vatNumber ? `\nBTW: ${company.vatNumber}` : ''}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTUUR</Text>
          </View>
        </View>

        {/* Invoice meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Factuurnummer</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Factuurdatum</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.invoiceDate)}</Text>
            <Text style={styles.metaLabel}>Vervaldatum</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Ordernummer</Text>
            <Text style={styles.metaValue}>{order.orderNumber}</Text>
            <Text style={styles.metaLabel}>Betaalmethode</Text>
            <Text style={styles.metaValue}>
              {paymentMethodLabels[invoice.paymentMethod || ''] || invoice.paymentMethod || '-'}
            </Text>
            <Text style={styles.metaLabel}>Betaalstatus</Text>
            <Text style={styles.metaValue}>
              {invoice.status === 'paid'
                ? `Betaald${invoice.paymentDate ? ` (${formatDate(invoice.paymentDate)})` : ''}`
                : invoice.status === 'open'
                  ? 'Openstaand'
                  : invoice.status}
            </Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>Factuuradres</Text>
            <Text style={styles.addressText}>{formatAddress(billingAddr)}</Text>
            {order.billingAddress?.kvk && (
              <Text style={styles.addressText}>{`KVK: ${order.billingAddress.kvk}`}</Text>
            )}
            {order.billingAddress?.vatNumber && (
              <Text style={styles.addressText}>{`BTW: ${order.billingAddress.vatNumber}`}</Text>
            )}
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>Verzendadres</Text>
            <Text style={styles.addressText}>{formatAddress(order.shippingAddress)}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.thText}>Omschrijving</Text>
            </View>
            <View style={styles.colSku}>
              <Text style={styles.thText}>Artikelnr.</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.thText}>Aantal</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={styles.thText}>Prijs</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={styles.thText}>Totaal</Text>
            </View>
          </View>

          {invoice.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.tdText}>{item.description}</Text>
              </View>
              <View style={styles.colSku}>
                <Text style={styles.tdText}>{item.sku || '-'}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.tdText}>{item.quantity}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.tdText}>{formatCurrency(item.unitPrice)}</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.tdTextBold}>{formatCurrency(item.lineTotal)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotaal:</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            {invoice.shippingCost > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Verzendkosten:</Text>
                <Text style={styles.totalsValue}>{formatCurrency(invoice.shippingCost)}</Text>
              </View>
            )}
            {invoice.discount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={{ ...styles.totalsLabel, color: '#28a745' }}>Korting:</Text>
                <Text style={{ ...styles.totalsValue, color: '#28a745' }}>
                  -{formatCurrency(invoice.discount)}
                </Text>
              </View>
            )}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>BTW (21%):</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.tax)}</Text>
            </View>
            <View style={styles.totalsRowFinal}>
              <Text style={styles.totalsFinalLabel}>Totaal:</Text>
              <Text style={styles.totalsFinalValue}>{formatCurrency(invoice.amount)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 8, color: '#999', marginBottom: 4 }}>Opmerkingen:</Text>
            <Text style={{ fontSize: 9, color: '#555' }}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.footerLabel}>Betalingstermijn: 14 dagen</Text>
              {company.iban && (
                <Text style={styles.footerValue}>IBAN: {company.iban} t.n.v. {company.name}</Text>
              )}
            </View>
            <View>
              {company.email && <Text style={styles.footerValue}>{company.email}</Text>}
              {company.phone && <Text style={styles.footerValue}>{company.phone}</Text>}
              {company.website && <Text style={styles.footerValue}>{company.website}</Text>}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
