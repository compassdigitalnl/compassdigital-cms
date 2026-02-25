'use client'

import React, { useState, useMemo } from 'react'
import { Building2, FileText, Home, PenLine, Star, Trash2, Plus, Copy } from 'lucide-react'
import type { AddressBookProps, AddressCardProps, AddressEditFormProps, Address, AddressTypeIcon } from './types'

// Helper: Get icon for address type
function getAddressIcon(type: string): React.ComponentType<{ size?: number }> {
  if (type.toLowerCase().includes('praktijk') || type.toLowerCase().includes('bedrijf')) return Building2
  if (type.toLowerCase().includes('factuur')) return FileText
  return Home
}

// Helper: Get type label from address
function getTypeLabel(address: Address): string {
  if (address.company) return 'Praktijkadres'
  if (address.type === 'billing') return 'Factuuradres'
  if (address.type === 'shipping') return 'Afleveradres'
  return 'Thuisadres'
}

/**
 * AddressCard Component
 *
 * Individual address card with actions (edit, delete, set primary, duplicate)
 */
function AddressCard({ address, onEdit, onDelete, onSetPrimary, onDuplicate }: AddressCardProps) {
  const Icon = getAddressIcon(address.company || address.type)
  const typeLabel = getTypeLabel(address)

  return (
    <article className={`addr-card ${address.isPrimary ? 'primary' : ''}`} aria-label={address.isPrimary ? 'Standaard afleveradres' : undefined}>
      {address.isPrimary && <span className="primary-badge">Standaard</span>}

      <div className="ac-type">
        <Icon size={14} aria-hidden="true" />
        {typeLabel}
      </div>

      <div className="ac-name">
        {address.company || `${address.firstName} ${address.lastName}`}
      </div>

      <div className="ac-text">
        {address.company && <>{`T.a.v. ${address.firstName} ${address.lastName}`}<br /></>}
        {address.street}<br />
        {address.postalCode} {address.city}
        {address.kvk && <><br />KVK {address.kvk}</>}
      </div>

      <div className="ac-actions">
        <button className="ac-btn" onClick={onEdit} aria-label={`Bewerk ${typeLabel}`}>
          <PenLine size={12} /> Bewerken
        </button>

        {address.isPrimary && onDuplicate && (
          <button className="ac-btn" onClick={onDuplicate} aria-label="Dupliceer adres">
            <Copy size={12} /> Dupliceren
          </button>
        )}

        {!address.isPrimary && (
          <>
            <button className="ac-btn" onClick={onSetPrimary} aria-label="Stel in als standaard">
              <Star size={12} /> Standaard
            </button>
            <button className="ac-btn delete" onClick={onDelete} aria-label="Verwijder adres">
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .addr-card {
          background: white;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-18);
          position: relative;
          transition: all var(--transition);
        }

        .addr-card:hover {
          border-color: var(--teal);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .addr-card.primary {
          border-color: var(--teal);
        }

        .primary-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--teal);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 100px;
        }

        .ac-type {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--teal);
          margin-bottom: var(--space-8);
        }

        .ac-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: var(--space-2);
        }

        .ac-text {
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.6;
        }

        .ac-actions {
          display: flex;
          gap: var(--space-6);
          margin-top: var(--space-10);
          padding-top: var(--space-10);
          border-top: 1px solid var(--grey);
        }

        .ac-btn {
          height: 30px;
          padding: 0 var(--space-10);
          border-radius: var(--radius-sm);
          border: 1px solid var(--grey);
          background: white;
          cursor: pointer;
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 600;
          color: var(--navy);
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .ac-btn:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        .ac-btn.delete {
          color: var(--coral);
          border-color: var(--coral-light);
        }

        .ac-btn.delete:hover {
          background: var(--coral-light);
        }
      `}</style>
    </article>
  )
}

/**
 * AddressEditForm Component
 *
 * Form for adding or editing an address
 */
function AddressEditForm({ address, onSave, onCancel, validatePostalCode }: AddressEditFormProps) {
  const isNew = !address

  const [formData, setFormData] = useState({
    id: address?.id || undefined,
    type: address?.type || 'shipping',
    isPrimary: address?.isPrimary || false,
    company: address?.company || '',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    street: address?.street || '',
    postalCode: address?.postalCode || '',
    city: address?.city || '',
    country: address?.country || 'NL',
    phone: address?.phone || '',
    kvk: address?.kvk || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Voornaam is verplicht'
    if (!formData.lastName.trim()) newErrors.lastName = 'Achternaam is verplicht'
    if (!formData.street.trim()) newErrors.street = 'Straat is verplicht'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postcode is verplicht'
    if (!formData.city.trim()) newErrors.city = 'Plaats is verplicht'

    if (formData.postalCode && validatePostalCode && !validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Ongeldige postcode'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData as any)
  }

  return (
    <form className="addr-edit" onSubmit={handleSubmit}>
      <div className="ae-title">
        <PenLine size={16} />
        {isNew ? 'Nieuw adres toevoegen' : 'Adres bewerken'}
      </div>

      <div className="ae-row full">
        <div>
          <label className="ae-label" htmlFor="company">Bedrijfsnaam (optioneel)</label>
          <input
            id="company"
            className="ae-input"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>
      </div>

      <div className="ae-row">
        <div>
          <label className="ae-label" htmlFor="firstName">Voornaam *</label>
          <input
            id="firstName"
            className="ae-input"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <span id="firstName-error" className="ae-error" role="alert">{errors.firstName}</span>}
        </div>
        <div>
          <label className="ae-label" htmlFor="lastName">Achternaam *</label>
          <input
            id="lastName"
            className="ae-input"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && <span id="lastName-error" className="ae-error" role="alert">{errors.lastName}</span>}
        </div>
      </div>

      <div className="ae-row full">
        <div>
          <label className="ae-label" htmlFor="street">Straat + huisnummer *</label>
          <input
            id="street"
            className="ae-input"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            aria-invalid={!!errors.street}
            aria-describedby={errors.street ? 'street-error' : undefined}
          />
          {errors.street && <span id="street-error" className="ae-error" role="alert">{errors.street}</span>}
        </div>
      </div>

      <div className="ae-row">
        <div>
          <label className="ae-label" htmlFor="postalCode">Postcode *</label>
          <input
            id="postalCode"
            className="ae-input"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value.toUpperCase())}
            aria-invalid={!!errors.postalCode}
            aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
          />
          {errors.postalCode && <span id="postalCode-error" className="ae-error" role="alert">{errors.postalCode}</span>}
        </div>
        <div>
          <label className="ae-label" htmlFor="city">Plaats *</label>
          <input
            id="city"
            className="ae-input"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && <span id="city-error" className="ae-error" role="alert">{errors.city}</span>}
        </div>
      </div>

      {formData.company && (
        <div className="ae-row full">
          <div>
            <label className="ae-label" htmlFor="kvk">KVK nummer (optioneel)</label>
            <input
              id="kvk"
              className="ae-input"
              value={formData.kvk}
              onChange={(e) => handleChange('kvk', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="ae-actions">
        <button type="submit" className="ae-btn save">
          Opslaan
        </button>
        <button type="button" className="ae-btn cancel" onClick={onCancel}>
          Annuleren
        </button>
      </div>

      <style jsx>{`
        .addr-edit {
          background: white;
          border: 1.5px solid var(--teal);
          border-radius: var(--radius-lg);
          padding: var(--space-20);
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          margin-top: var(--space-16);
        }

        .ae-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: var(--space-12);
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .ae-title :global(svg) {
          color: var(--teal);
        }

        .ae-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }

        .ae-row.full {
          grid-template-columns: 1fr;
        }

        .ae-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--grey-mid);
          margin-bottom: var(--space-3);
          display: block;
        }

        .ae-input {
          width: 100%;
          height: 36px;
          padding: 0 var(--space-10);
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-sm);
          font-family: var(--font-primary);
          font-size: 13px;
          color: var(--navy);
          outline: none;
          transition: all var(--transition);
        }

        .ae-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .ae-input[aria-invalid="true"] {
          border-color: var(--coral);
        }

        .ae-error {
          font-size: 11px;
          color: var(--coral);
          margin-top: var(--space-2);
          display: block;
        }

        .ae-actions {
          display: flex;
          gap: var(--space-8);
          margin-top: var(--space-12);
        }

        .ae-btn {
          height: 36px;
          padding: 0 var(--space-16);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          border: none;
        }

        .ae-btn.save {
          background: var(--teal);
          color: white;
        }

        .ae-btn.save:hover {
          background: var(--navy);
        }

        .ae-btn.cancel {
          background: var(--grey-light);
          color: var(--navy);
          border: 1px solid var(--grey);
        }

        .ae-btn.cancel:hover {
          border-color: var(--teal);
          color: var(--teal);
        }
      `}</style>
    </form>
  )
}

/**
 * AddressBook Component
 *
 * Address management interface for user accounts. Allows adding, editing, deleting,
 * and setting default shipping/billing addresses.
 *
 * @example
 * ```tsx
 * <AddressBook
 *   addresses={addresses}
 *   onAdd={handleAdd}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onSetPrimary={handleSetPrimary}
 * />
 * ```
 */
export function AddressBook({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetPrimary,
  onDuplicate,
  maxAddresses = 10,
  validatePostalCode,
  className = '',
}: AddressBookProps) {
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)

  // Sort addresses: primary first, then by createdAt desc
  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => {
      if (a.isPrimary) return -1
      if (b.isPrimary) return 1
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })
  }, [addresses])

  const handleDelete = async (addressId: string) => {
    if (addresses.length === 1) {
      alert('U moet minimaal 1 adres hebben')
      return
    }

    if (confirm('Weet u zeker dat u dit adres wilt verwijderen?')) {
      if (onDelete) {
        await onDelete(addressId)
      }
    }
  }

  const handleSetPrimary = async (addressId: string) => {
    if (onSetPrimary) {
      await onSetPrimary(addressId)
    }
  }

  const handleDuplicate = (addressId: string) => {
    if (onDuplicate) {
      onDuplicate(addressId)
    }
    // Default behavior: open edit form with duplicated data
    const address = addresses.find((a) => a.id === addressId)
    if (address) {
      setEditingId('new')
    }
  }

  const handleSave = async (formData: any) => {
    if (formData.id) {
      // Update existing
      if (onEdit) {
        await onEdit(formData.id, formData)
      }
    } else {
      // Create new
      if (onAdd) {
        await onAdd(formData)
      }
    }
    setEditingId(null)
  }

  const canAddMore = addresses.length < maxAddresses

  return (
    <div className={`addr-manager ${className}`} role="region" aria-labelledby="addr-title">
      <div className="addr-header">
        <h2 id="addr-title">
          Mijn adressen <span className="addr-count">({addresses.length})</span>
        </h2>
      </div>

      <div className="addr-grid">
        {sortedAddresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={() => setEditingId(address.id)}
            onDelete={() => handleDelete(address.id)}
            onSetPrimary={() => handleSetPrimary(address.id)}
            onDuplicate={address.isPrimary ? () => handleDuplicate(address.id) : undefined}
          />
        ))}
        {canAddMore && (
          <button className="addr-add" onClick={() => setEditingId('new')}>
            <div className="addr-add-icon">
              <Plus size={18} />
            </div>
            <div className="addr-add-text">Nieuw adres toevoegen</div>
            <div className="addr-add-hint">Aflever- of factuuradres</div>
          </button>
        )}
      </div>

      {editingId && (
        <AddressEditForm
          address={editingId === 'new' ? null : addresses.find((a) => a.id === editingId) || null}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
          validatePostalCode={validatePostalCode}
        />
      )}

      <style jsx>{`
        .addr-manager {
          max-width: 700px;
        }

        .addr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-14);
        }

        .addr-header h2 {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
        }

        .addr-count {
          font-weight: 400;
          color: var(--grey-mid);
          font-size: 14px;
        }

        .addr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
        }

        .addr-add {
          border: 2px dashed var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-28);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-6);
          background: transparent;
        }

        .addr-add:hover {
          border-color: var(--teal);
          background: var(--teal-glow);
        }

        .addr-add-icon {
          width: 40px;
          height: 40px;
          background: var(--grey-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .addr-add-icon :global(svg) {
          color: var(--teal);
        }

        .addr-add-text {
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
        }

        .addr-add-hint {
          font-size: 12px;
          color: var(--grey-mid);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .addr-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
