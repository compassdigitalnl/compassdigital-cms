'use client'

import React from 'react'
import { Building2, ShieldCheck, Info } from 'lucide-react'
import { CompanyInfoFormProps } from './types'

export function CompanyInfoForm({
  companyInfo,
  showContactFields = false,
  onContactChange,
  helperText = 'Deze gegevens zijn gekoppeld aan uw bedrijfsaccount en kunnen niet worden aangepast.',
  className = '',
}: CompanyInfoFormProps) {
  return (
    <div className={`company-info-form ${className}`}>
      <div className="company-info-header">
        <h3 className="company-info-title">
          <Building2 className="company-info-title-icon" size={20} strokeWidth={2} />
          Bedrijfsgegevens
        </h3>
        {companyInfo.verified && (
          <span className="company-info-badge">
            <ShieldCheck className="company-info-badge-icon" size={12} strokeWidth={2.5} />
            Geverifieerd
          </span>
        )}
      </div>

      <div className="company-info-fields">
        {/* Company Name (full width, read-only) */}
        <div className="company-info-field">
          <label className="company-info-label">Bedrijfsnaam</label>
          <input
            type="text"
            className="company-info-input"
            value={companyInfo.name}
            readOnly
            tabIndex={-1}
          />
        </div>

        {/* KVK + BTW row (read-only) */}
        <div className="company-info-row">
          <div className="company-info-field">
            <label className="company-info-label">KVK-nummer</label>
            <input
              type="text"
              className="company-info-input"
              value={companyInfo.kvk}
              readOnly
              tabIndex={-1}
            />
          </div>

          <div className="company-info-field">
            <label className="company-info-label">BTW-nummer</label>
            <input
              type="text"
              className="company-info-input"
              value={companyInfo.btw}
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>

        {/* Address (full width, read-only) */}
        <div className="company-info-field">
          <label className="company-info-label">Adres</label>
          <input
            type="text"
            className="company-info-input"
            value={companyInfo.address}
            readOnly
            tabIndex={-1}
          />
        </div>

        {/* Contact Person fields (editable, optional) */}
        {showContactFields && companyInfo.contactPerson && (
          <>
            <div className="company-info-row">
              <div className="company-info-field">
                <label className="company-info-label">Contactpersoon</label>
                <input
                  type="text"
                  className="company-info-input editable"
                  value={companyInfo.contactPerson.name}
                  onChange={(e) => onContactChange?.('name', e.target.value)}
                  placeholder="Naam contactpersoon"
                />
              </div>

              <div className="company-info-field">
                <label className="company-info-label">Telefoonnummer</label>
                <input
                  type="tel"
                  className="company-info-input editable"
                  value={companyInfo.contactPerson.phone}
                  onChange={(e) => onContactChange?.('phone', e.target.value)}
                  placeholder="020 XXX XXXX"
                />
              </div>
            </div>

            <div className="company-info-field">
              <label className="company-info-label">E-mailadres contactpersoon</label>
              <input
                type="email"
                className="company-info-input editable"
                value={companyInfo.contactPerson.email}
                onChange={(e) => onContactChange?.('email', e.target.value)}
                placeholder="naam@bedrijf.nl"
              />
            </div>
          </>
        )}

        {/* Helper text */}
        <p className="company-info-helper">
          <Info className="company-info-helper-icon" size={14} strokeWidth={2} />
          {helperText}
        </p>
      </div>

      <style jsx>{`
        .company-info-form {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-xl);
          padding: 24px;
        }

        /* Header */
        .company-info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 12px;
        }

        .company-info-title {
          font-family: var(--font-family-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .company-info-title-icon {
          color: var(--teal);
          flex-shrink: 0;
        }

        .company-info-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(0, 137, 123, 0.08);
          border: 1px solid var(--teal);
          border-radius: 100px;
          font-family: var(--font-family-body);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--teal);
        }

        .company-info-badge-icon {
          flex-shrink: 0;
        }

        /* Form fields container */
        .company-info-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .company-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Field */
        .company-info-field {
          display: flex;
          flex-direction: column;
        }

        .company-info-label {
          display: block;
          font-family: var(--font-family-body);
          font-size: 12px;
          font-weight: 600;
          color: var(--grey-dark);
          margin-bottom: 6px;
        }

        .company-info-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-family-body);
          font-size: 14px;
          color: var(--navy);
          background: var(--grey-lighter);
          outline: none;
          transition: all var(--transition-base);
          cursor: not-allowed;
        }

        .company-info-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Editable variant (for contact person) */
        .company-info-input.editable {
          background: var(--white);
          cursor: text;
        }

        .company-info-input.editable:hover {
          border-color: var(--grey-mid);
        }

        /* Helper text */
        .company-info-helper {
          font-family: var(--font-family-body);
          font-size: 11px;
          color: var(--grey-mid);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .company-info-helper-icon {
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .company-info-form {
            padding: 20px;
          }

          .company-info-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .company-info-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
