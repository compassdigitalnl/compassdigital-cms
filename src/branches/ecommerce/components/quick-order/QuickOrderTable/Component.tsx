'use client'

import React, { useMemo } from 'react'
import { Plus, ShoppingCart } from 'lucide-react'
import type { QuickOrderTableProps } from './types'

/**
 * QuickOrderTable Component
 *
 * Multi-row data table for B2B quick order entry with product search,
 * quantity input, and bulk add to cart.
 *
 * @example
 * ```tsx
 * <QuickOrderTable
 *   rows={orderRows}
 *   onRowChange={(id, field, value) => updateRow(id, field, value)}
 *   onRowDelete={(id) => deleteRow(id)}
 *   onRowAdd={() => addNewRow()}
 *   onBulkAddToCart={async () => await addAllToCart()}
 * />
 * ```
 */
export function QuickOrderTable({
  rows,
  onRowChange,
  onRowDelete,
  onRowAdd,
  onBulkAddToCart,
  loading = false,
  className = '',
}: QuickOrderTableProps) {
  // Calculate totals
  const { totalProducts, totalAmount } = useMemo(() => {
    const validProducts = rows.filter((r) => r.productId)
    const amount = rows.reduce((sum, r) => sum + r.total, 0)
    return {
      totalProducts: validProducts.length,
      totalAmount: amount,
    }
  }, [rows])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const handleBulkAdd = async () => {
    if (loading || totalProducts === 0) return
    await onBulkAddToCart()
  }

  return (
    <div className={`qot ${className}`} role="table" aria-label="Quick order table">
      {/* Table Header */}
      <div className="qot-header" role="row">
        <div className="qot-header-cell" role="columnheader">
          Artikelnummer of naam
        </div>
        <div className="qot-header-cell" role="columnheader">
          Aantal
        </div>
        <div className="qot-header-cell" role="columnheader">
          Prijs/stuk
        </div>
        <div className="qot-header-cell qot-align-right" role="columnheader">
          Totaal
        </div>
        <div className="qot-header-cell" role="columnheader"></div>
      </div>

      {/* Table Body */}
      <div className="qot-body">
        {rows.map((row) => (
          <div key={row.id} className="qot-row-wrapper" role="row">
            {/* QuickOrderRow will be rendered here - for now, placeholder */}
            <div className="qot-placeholder">
              Row {row.id} - QuickOrderRow component (qo03) will be implemented next
            </div>
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="qot-footer">
        <button
          type="button"
          onClick={onRowAdd}
          className="qot-add-row-btn"
          disabled={loading}
          aria-label="Nieuwe rij toevoegen"
        >
          <Plus size={16} aria-hidden="true" />
          Rij toevoegen
        </button>

        <div className="qot-footer-summary">
          <div className="qot-footer-total">
            <div className="qot-footer-total-label">
              Totaal ({totalProducts} {totalProducts === 1 ? 'product' : 'producten'})
            </div>
            <div className="qot-footer-total-value" aria-live="polite">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBulkAdd}
            className="qot-bulk-add-btn"
            disabled={loading || totalProducts === 0}
            aria-label={`Toevoegen aan winkelwagen (${totalProducts} producten)`}
          >
            <ShoppingCart size={20} aria-hidden="true" />
            Toevoegen aan winkelwagen
          </button>
        </div>
      </div>

      <style jsx>{`
        .qot {
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        /* TABLE HEADER */
        .qot-header {
          display: grid;
          grid-template-columns: 1fr 140px 140px 180px 48px;
          gap: var(--space-16);
          padding: var(--space-16) var(--space-24);
          background: var(--grey-bg);
          border-bottom: 1px solid var(--grey);
        }

        .qot-header-cell {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--grey-dark);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .qot-header-cell.qot-align-right {
          justify-content: flex-end;
        }

        /* TABLE BODY */
        .qot-body {
          padding: 0 var(--space-24);
        }

        .qot-row-wrapper {
          padding: var(--space-20) 0;
          border-bottom: 1px solid var(--grey);
        }

        .qot-row-wrapper:last-child {
          border-bottom: none;
        }

        /* Placeholder - will be removed when QuickOrderRow is integrated */
        .qot-placeholder {
          padding: var(--space-12);
          background: var(--grey-light);
          border-radius: var(--radius);
          font-size: 13px;
          color: var(--grey-dark);
          text-align: center;
        }

        /* TABLE FOOTER */
        .qot-footer {
          padding: var(--space-20) var(--space-24);
          background: var(--grey-bg);
          border-top: 1px solid var(--grey);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Add Row Button */
        .qot-add-row-btn {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          padding: 10px 16px;
          background: white;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: all var(--transition);
        }

        .qot-add-row-btn:hover:not(:disabled) {
          border-color: var(--teal);
          background: var(--teal-bg);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .qot-add-row-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .qot-add-row-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .qot-add-row-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer Summary */
        .qot-footer-summary {
          display: flex;
          align-items: center;
          gap: var(--space-24);
        }

        .qot-footer-total {
          text-align: right;
        }

        .qot-footer-total-label {
          font-size: 12px;
          color: var(--grey-dark);
          margin-bottom: var(--space-4);
        }

        .qot-footer-total-value {
          font-family: var(--font-primary);
          font-size: 28px;
          font-weight: 800;
          color: var(--navy);
        }

        /* Bulk Add Button */
        .qot-bulk-add-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--teal), var(--teal-light));
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          box-shadow: var(--shadow-teal);
        }

        .qot-bulk-add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px var(--color-primary-glow);
        }

        .qot-bulk-add-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow), var(--shadow-teal);
        }

        .qot-bulk-add-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .qot-bulk-add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .qot-header {
            grid-template-columns: 1fr 100px 100px 140px 40px;
          }

          .qot-footer-total-value {
            font-size: 24px;
          }
        }

        @media (max-width: 768px) {
          /* Hide header on mobile */
          .qot-header {
            display: none;
          }

          .qot-body {
            padding: 0;
          }

          .qot-row-wrapper {
            padding: var(--space-16);
          }

          /* Footer stacks vertically */
          .qot-footer {
            flex-direction: column;
            gap: var(--space-16);
            align-items: stretch;
          }

          .qot-footer-summary {
            flex-direction: column;
            gap: var(--space-12);
          }

          .qot-footer-total {
            text-align: left;
          }

          .qot-bulk-add-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
