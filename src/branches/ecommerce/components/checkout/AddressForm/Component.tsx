'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Bookmark, Sparkles, AlertCircle } from 'lucide-react'
import type { AddressFormProps, Address, ValidationErrors } from './types'

const DEFAULT_REQUIRED_FIELDS: (keyof Address)[] = [
  'firstName',
  'lastName',
  'street',
  'postalCode',
  'city',
  'country',
]

const INITIAL_ADDRESS: Address = {
  firstName: '',
  lastName: '',
  street: '',
  addition: '',
  postalCode: '',
  city: '',
  country: 'NL',
}

/**
 * AddressForm Component
 *
 * Shipping address form for checkout flow with validation, postcode autocomplete,
 * and saved addresses support for B2B customers.
 *
 * @example
 * ```tsx
 * <AddressForm
 *   onSubmit={(address) => saveShippingAddress(address)}
 *   enableAutocomplete={true}
 * />
 * ```
 */
export function AddressForm({
  initialValues,
  savedAddresses = [],
  showSavedAddresses = false,
  enableAutocomplete = true,
  onSubmit,
  onValidate,
  onChange,
  isSubmitting = false,
  requiredFields = DEFAULT_REQUIRED_FIELDS,
  title = 'Afleveradres',
  submitLabel = 'Opslaan en doorgaan',
  className = '',
}: AddressFormProps) {
  // Form state
  const [formData, setFormData] = useState<Address>({
    ...INITIAL_ADDRESS,
    ...initialValues,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [autocompleteLoading, setAutocompleteLoading] = useState(false)
  const [autocompleteSuccess, setAutocompleteSuccess] = useState(false)

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  // Postcode validation pattern for NL
  const POSTCODE_PATTERN_NL = /^\d{4}\s?[A-Z]{2}$/i

  // Validate a single field
  const validateField = (name: keyof Address, value: string): string => {
    if (requiredFields.includes(name) && !value.trim()) {
      const fieldLabels: Record<keyof Address, string> = {
        firstName: 'Voornaam',
        lastName: 'Achternaam',
        street: 'Straat + huisnummer',
        addition: 'Toevoeging',
        postalCode: 'Postcode',
        city: 'Plaats',
        country: 'Land',
      }
      return `${fieldLabels[name]} is verplicht`
    }

    // Postcode-specific validation (NL)
    if (name === 'postalCode' && value && formData.country === 'NL') {
      if (!POSTCODE_PATTERN_NL.test(value)) {
        return 'Voer een geldige postcode in (bijv. 1234 AB)'
      }
    }

    // Name minimum length
    if ((name === 'firstName' || name === 'lastName') && value && value.trim().length < 2) {
      return 'Minimaal 2 tekens vereist'
    }

    return ''
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof Address
      const error = validateField(fieldName, formData[fieldName] || '')
      if (error) {
        newErrors[fieldName] = error
      }
    })

    setErrors(newErrors)
    if (onValidate) {
      onValidate(newErrors)
    }

    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (name: keyof Address, value: string) => {
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    // Clear autocomplete success when postcode changes
    if (name === 'postalCode') {
      setAutocompleteSuccess(false)
    }

    // Validate field if it was already touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }

    // Notify parent of changes
    if (onChange) {
      onChange(newFormData)
    }
  }

  // Handle input blur (mark field as touched)
  const handleBlur = (name: keyof Address) => {
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate field on blur
    const error = validateField(name, formData[name] || '')
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  // Postcode autocomplete handler
  const handlePostalCodeChange = async (value: string) => {
    handleChange('postalCode', value)

    // Only autocomplete for NL postcodes
    if (enableAutocomplete && formData.country === 'NL' && POSTCODE_PATTERN_NL.test(value)) {
      setAutocompleteLoading(true)
      setAutocompleteSuccess(false)

      try {
        const response = await fetch(`/api/postcode-lookup?postal=${encodeURIComponent(value)}`)

        if (response.ok) {
          const data = await response.json()

          setFormData((prev) => ({
            ...prev,
            city: data.city || prev.city,
            street: data.street || prev.street,
          }))

          setAutocompleteSuccess(true)

          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setAutocompleteSuccess(false)
          }, 3000)
        }
      } catch (error) {
        console.error('Postcode lookup failed:', error)
      } finally {
        setAutocompleteLoading(false)
      }
    }
  }

  // Load saved address
  const handleSavedAddressSelect = (addressId: string) => {
    if (addressId === 'new') {
      setFormData(INITIAL_ADDRESS)
      setErrors({})
      setTouched({})
      return
    }

    const saved = savedAddresses.find((a) => a.id === addressId)
    if (saved) {
      setFormData(saved.address)
      setErrors({})
      setTouched({})

      if (onChange) {
        onChange(saved.address)
      }
    }
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)

    // Validate and submit
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  // Check if field has error and is touched
  const hasError = (name: keyof Address) => touched[name] && errors[name]

  return (
    <div className={`address-form-section ${className}`}>
      {/* Section title */}
      <h2 className="form-section-title">
        <MapPin size={20} />
        {title}
      </h2>

      {/* Saved addresses dropdown (B2B only) */}
      {showSavedAddresses && savedAddresses.length > 0 && (
        <div className="saved-addresses">
          <Bookmark size={20} />
          <select
            onChange={(e) => handleSavedAddressSelect(e.target.value)}
            aria-label="Selecteer opgeslagen adres"
          >
            <option value="">Selecteer opgeslagen adres...</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.label}
              </option>
            ))}
            <option value="new">➕ Nieuw adres toevoegen</option>
          </select>
        </div>
      )}

      {/* Address form */}
      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        {/* First Name */}
        <div className={`form-group ${hasError('firstName') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="firstName">
            Voornaam
            {requiredFields.includes('firstName') && <span className="req">*</span>}
          </label>
          <input
            id="firstName"
            className="form-input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Jan"
            required={requiredFields.includes('firstName')}
            aria-required={requiredFields.includes('firstName')}
            aria-invalid={hasError('firstName') ? 'true' : 'false'}
            aria-describedby={hasError('firstName') ? 'firstName-error' : undefined}
          />
          {hasError('firstName') && (
            <div className="error-message" id="firstName-error" role="alert">
              <AlertCircle size={14} />
              {errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className={`form-group ${hasError('lastName') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="lastName">
            Achternaam
            {requiredFields.includes('lastName') && <span className="req">*</span>}
          </label>
          <input
            id="lastName"
            className="form-input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="de Vries"
            required={requiredFields.includes('lastName')}
            aria-required={requiredFields.includes('lastName')}
            aria-invalid={hasError('lastName') ? 'true' : 'false'}
            aria-describedby={hasError('lastName') ? 'lastName-error' : undefined}
          />
          {hasError('lastName') && (
            <div className="error-message" id="lastName-error" role="alert">
              <AlertCircle size={14} />
              {errors.lastName}
            </div>
          )}
        </div>

        {/* Street + Number */}
        <div className={`form-group ${hasError('street') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="street">
            Straat + huisnummer
            {requiredFields.includes('street') && <span className="req">*</span>}
          </label>
          <input
            id="street"
            className="form-input"
            type="text"
            name="street"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            onBlur={() => handleBlur('street')}
            placeholder="Breestraat 42"
            required={requiredFields.includes('street')}
            aria-required={requiredFields.includes('street')}
            aria-invalid={hasError('street') ? 'true' : 'false'}
            aria-describedby={hasError('street') ? 'street-error' : undefined}
          />
          {hasError('street') && (
            <div className="error-message" id="street-error" role="alert">
              <AlertCircle size={14} />
              {errors.street}
            </div>
          )}
        </div>

        {/* Addition (optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="addition">
            Toevoeging
          </label>
          <input
            id="addition"
            className="form-input"
            type="text"
            name="addition"
            value={formData.addition || ''}
            onChange={(e) => handleChange('addition', e.target.value)}
            placeholder="Bijv. A, 2e etage"
          />
          <span className="helper-text">Appartement, verdieping, etc.</span>
        </div>

        {/* Postal Code (with autocomplete) */}
        <div className={`form-group ${hasError('postalCode') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="postalCode">
            Postcode
            {requiredFields.includes('postalCode') && <span className="req">*</span>}
          </label>
          <input
            id="postalCode"
            className="form-input"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={(e) => handlePostalCodeChange(e.target.value.toUpperCase())}
            onBlur={() => handleBlur('postalCode')}
            placeholder="1234 AB"
            required={requiredFields.includes('postalCode')}
            aria-required={requiredFields.includes('postalCode')}
            aria-invalid={hasError('postalCode') ? 'true' : 'false'}
            aria-describedby={
              hasError('postalCode')
                ? 'postalCode-error'
                : autocompleteSuccess
                  ? 'postalCode-hint'
                  : undefined
            }
          />
          {hasError('postalCode') && (
            <div className="error-message" id="postalCode-error" role="alert">
              <AlertCircle size={14} />
              {errors.postalCode}
            </div>
          )}
          {autocompleteSuccess && !hasError('postalCode') && (
            <div className="autocomplete-hint" id="postalCode-hint">
              <Sparkles size={16} />
              Adres automatisch aangevuld
            </div>
          )}
        </div>

        {/* City */}
        <div className={`form-group ${hasError('city') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="city">
            Plaats
            {requiredFields.includes('city') && <span className="req">*</span>}
          </label>
          <input
            id="city"
            className="form-input"
            type="text"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            placeholder="Amsterdam"
            required={requiredFields.includes('city')}
            aria-required={requiredFields.includes('city')}
            aria-invalid={hasError('city') ? 'true' : 'false'}
            aria-describedby={hasError('city') ? 'city-error' : undefined}
          />
          {hasError('city') && (
            <div className="error-message" id="city-error" role="alert">
              <AlertCircle size={14} />
              {errors.city}
            </div>
          )}
        </div>

        {/* Country (full width) */}
        <div className={`form-group span-2 ${hasError('country') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="country">
            Land
          </label>
          <select
            id="country"
            className="form-input"
            name="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            required={requiredFields.includes('country')}
            aria-required={requiredFields.includes('country')}
            aria-invalid={hasError('country') ? 'true' : 'false'}
          >
            <option value="NL">Nederland</option>
            <option value="BE">België</option>
            <option value="DE">Duitsland</option>
            <option value="FR">Frankrijk</option>
            <option value="UK">Verenigd Koninkrijk</option>
          </select>
          {hasError('country') && (
            <div className="error-message" id="country-error" role="alert">
              <AlertCircle size={14} />
              {errors.country}
            </div>
          )}
        </div>

        {/* Submit button */}
        {submitLabel !== false && (
          <div className="form-group span-2">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bezig...' : submitLabel}
            </button>
          </div>
        )}
      </form>

      <style jsx>{`
        .address-form-section {
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-24);
          margin-bottom: var(--space-24);
        }

        .form-section-title {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: var(--space-20);
          padding-bottom: var(--space-12);
          border-bottom: 1px solid var(--grey);
        }

        .form-section-title :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        /* Saved addresses dropdown */
        .saved-addresses {
          background: var(--bg);
          border: 1px solid var(--grey);
          border-radius: var(--radius-sm);
          padding: var(--space-12);
          margin-bottom: var(--space-16);
          display: flex;
          align-items: center;
          gap: var(--space-12);
        }

        .saved-addresses :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        .saved-addresses select {
          flex: 1;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--navy);
          background: white;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          cursor: pointer;
          transition: all var(--transition);
        }

        .saved-addresses select:focus {
          border-color: var(--teal);
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Form grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-16);
        }

        /* Form group */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .form-group.span-2 {
          grid-column: 1 / -1;
        }

        /* Form label */
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        /* Required indicator */
        .req {
          color: var(--coral);
          font-weight: 700;
        }

        /* Form input */
        .form-input {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--navy);
          background: var(--white);
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          transition: all var(--transition);
          outline: none;
        }

        .form-input::placeholder {
          color: var(--grey-mid);
        }

        .form-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Error state */
        .form-group.error .form-input {
          border-color: var(--coral);
        }

        .form-group.error .form-input:focus {
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.12);
        }

        /* Error message */
        .error-message {
          font-size: 12px;
          color: var(--coral);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: -2px;
        }

        .error-message :global(svg) {
          flex-shrink: 0;
        }

        /* Helper text */
        .helper-text {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: -2px;
        }

        /* Autocomplete hint */
        .autocomplete-hint {
          background: var(--teal-glow);
          border: 1px solid var(--teal);
          border-radius: var(--radius-sm);
          padding: var(--space-8) var(--space-12);
          font-size: 12px;
          color: var(--teal);
          display: flex;
          align-items: center;
          gap: var(--space-6);
          margin-top: -2px;
        }

        .autocomplete-hint :global(svg) {
          flex-shrink: 0;
        }

        /* Submit button */
        .submit-button {
          width: 100%;
          padding: 12px 24px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 700;
          color: white;
          background: var(--teal);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition);
          margin-top: var(--space-8);
        }

        .submit-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive: Mobile */
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.span-2 {
            grid-column: 1;
          }

          .address-form-section {
            padding: var(--space-16);
          }
        }
      `}</style>
    </div>
  )
}
