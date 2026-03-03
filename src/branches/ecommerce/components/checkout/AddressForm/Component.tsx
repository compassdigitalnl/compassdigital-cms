'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Bookmark, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import type { AddressFormProps, Address, ValidationErrors } from './types'

const DEFAULT_REQUIRED_FIELDS: (keyof Address)[] = [
  'firstName',
  'lastName',
  'street',
  'houseNumber',
  'postalCode',
  'city',
  'country',
]

const INITIAL_ADDRESS: Address = {
  firstName: '',
  lastName: '',
  street: '',
  houseNumber: '',
  addition: '',
  postalCode: '',
  city: '',
  country: 'NL',
}

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
  const [formData, setFormData] = useState<Address>({
    ...INITIAL_ADDRESS,
    ...initialValues,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [autocompleteLoading, setAutocompleteLoading] = useState(false)
  const [autocompleteSuccess, setAutocompleteSuccess] = useState(false)
  const [autocompleteFilled, setAutocompleteFilled] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  // Postcode validation patterns per country
  const POSTCODE_PATTERNS: Record<string, { regex: RegExp; example: string }> = {
    NL: { regex: /^\d{4}\s?[A-Z]{2}$/i, example: '1234 AB' },
    BE: { regex: /^\d{4}$/, example: '1000' },
    DE: { regex: /^\d{5}$/, example: '10115' },
    FR: { regex: /^\d{5}$/, example: '75001' },
    UK: { regex: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, example: 'SW1A 1AA' },
  }

  const validateField = (name: keyof Address, value: string): string => {
    if (requiredFields.includes(name) && !value.trim()) {
      const fieldLabels: Record<keyof Address, string> = {
        firstName: 'Voornaam',
        lastName: 'Achternaam',
        street: 'Straat',
        houseNumber: 'Huisnummer',
        addition: 'Toevoeging',
        postalCode: 'Postcode',
        city: 'Plaats',
        country: 'Land',
      }
      return `${fieldLabels[name]} is verplicht`
    }

    if (name === 'postalCode' && value) {
      const pattern = POSTCODE_PATTERNS[formData.country]
      if (pattern && !pattern.regex.test(value)) {
        return `Voer een geldige postcode in (bijv. ${pattern.example})`
      }
    }

    if ((name === 'firstName' || name === 'lastName') && value && value.trim().length < 2) {
      return 'Minimaal 2 tekens vereist'
    }

    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof Address
      const error = validateField(fieldName, formData[fieldName] || '')
      if (error) newErrors[fieldName] = error
    })
    setErrors(newErrors)
    if (onValidate) onValidate(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name: keyof Address, value: string) => {
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    if (name === 'postalCode' || name === 'houseNumber') {
      setAutocompleteSuccess(false)
      setAutocompleteFilled(false)
    }

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }

    if (onChange) onChange(newFormData)
  }

  const handleBlur = (name: keyof Address) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name] || '')
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Trigger autocomplete when both postcode and house number are filled (NL only)
  const tryAutocomplete = async (postalCode: string, houseNumber: string) => {
    const nlPattern = POSTCODE_PATTERNS.NL
    if (!enableAutocomplete || formData.country !== 'NL' || !nlPattern) return
    if (!nlPattern.regex.test(postalCode) || !houseNumber.trim()) return

    setAutocompleteLoading(true)
    setAutocompleteSuccess(false)

    try {
      const params = new URLSearchParams({ postal: postalCode, number: houseNumber })
      const response = await fetch(`/api/postcode-lookup?${params}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.street) {
          setFormData((prev) => {
            const updated = {
              ...prev,
              street: data.street || prev.street,
              city: data.city || prev.city,
            }
            if (onChange) onChange(updated)
            return updated
          })
          setAutocompleteFilled(true)
          setAutocompleteSuccess(true)
          setTimeout(() => setAutocompleteSuccess(false), 3000)
        }
      }
    } catch (error) {
      console.error('Postcode lookup failed:', error)
    } finally {
      setAutocompleteLoading(false)
    }
  }

  const handlePostalCodeChange = (value: string) => {
    handleChange('postalCode', value)
    tryAutocomplete(value, formData.houseNumber)
  }

  const handleHouseNumberChange = (value: string) => {
    handleChange('houseNumber', value)
    tryAutocomplete(formData.postalCode, value)
  }

  const handleSavedAddressSelect = (addressId: string) => {
    if (addressId === 'new') {
      setFormData(INITIAL_ADDRESS)
      setErrors({})
      setTouched({})
      setAutocompleteFilled(false)
      return
    }
    const saved = savedAddresses.find((a) => a.id === addressId)
    if (saved) {
      setFormData(saved.address)
      setErrors({})
      setTouched({})
      if (onChange) onChange(saved.address)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)
    if (validateForm() && onSubmit) onSubmit(formData)
  }

  const hasError = (name: keyof Address) => touched[name] && errors[name]

  // NL layout: postcode + huisnummer → autocomplete → straat/stad readonly
  const isNL = formData.country === 'NL'

  return (
    <div className={`form-section ${className}`}>
      <h2 className="form-section-title">
        <MapPin size={20} />
        {title}
      </h2>

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
            <option value="new">+ Nieuw adres toevoegen</option>
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        {/* Country */}
        <div className={`form-group span-2 ${hasError('country') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="country">Land</label>
          <select
            id="country"
            className="form-input"
            name="country"
            value={formData.country}
            onChange={(e) => {
              handleChange('country', e.target.value)
              setAutocompleteFilled(false)
            }}
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
        </div>

        {/* Row: Postcode + Huisnummer + Toevoeging */}
        <div className="form-group span-2">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16, 16px)' }}>
            {/* Postcode */}
            <div className={`form-group ${hasError('postalCode') ? 'error' : ''}`}>
              <label className="form-label" htmlFor="postalCode">
                Postcode
                {requiredFields.includes('postalCode') && <span className="req">*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="postalCode"
                  className="form-input"
                  style={{ width: '100%' }}
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('postalCode')}
                  placeholder={POSTCODE_PATTERNS[formData.country]?.example || '1234 AB'}
                  required={requiredFields.includes('postalCode')}
                  aria-required={requiredFields.includes('postalCode')}
                  aria-invalid={hasError('postalCode') ? 'true' : 'false'}
                />
                {autocompleteLoading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-mid)' }}
                  />
                )}
              </div>
              {hasError('postalCode') && (
                <div className="error-message" id="postalCode-error" role="alert">
                  <AlertCircle size={14} />
                  {errors.postalCode}
                </div>
              )}
            </div>

            {/* Huisnummer */}
            <div className={`form-group ${hasError('houseNumber') ? 'error' : ''}`}>
              <label className="form-label" htmlFor="houseNumber">
                Huisnr.
                {requiredFields.includes('houseNumber') && <span className="req">*</span>}
              </label>
              <input
                id="houseNumber"
                className="form-input"
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => handleHouseNumberChange(e.target.value)}
                onBlur={() => handleBlur('houseNumber')}
                placeholder="42"
                required={requiredFields.includes('houseNumber')}
                aria-required={requiredFields.includes('houseNumber')}
                aria-invalid={hasError('houseNumber') ? 'true' : 'false'}
              />
              {hasError('houseNumber') && (
                <div className="error-message" id="houseNumber-error" role="alert">
                  <AlertCircle size={14} />
                  {errors.houseNumber}
                </div>
              )}
            </div>

            {/* Toevoeging */}
            <div className="form-group">
              <label className="form-label" htmlFor="addition">Toevoeging</label>
              <input
                id="addition"
                className="form-input"
                type="text"
                name="addition"
                value={formData.addition || ''}
                onChange={(e) => handleChange('addition', e.target.value)}
                placeholder="A, 2e etage"
              />
            </div>
          </div>

          {/* Autocomplete success message */}
          {autocompleteSuccess && (
            <div className="autocomplete-hint" id="postalCode-hint" style={{ marginTop: 'var(--space-8, 8px)' }}>
              <Sparkles size={16} />
              Adres automatisch aangevuld
            </div>
          )}
        </div>

        {/* Straat (auto-filled for NL, manual for other countries) */}
        <div className={`form-group ${hasError('street') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="street">
            Straat
            {requiredFields.includes('street') && <span className="req">*</span>}
          </label>
          <input
            id="street"
            className="form-input"
            type="text"
            name="street"
            value={formData.street}
            onChange={(e) => {
              handleChange('street', e.target.value)
              if (isNL) setAutocompleteFilled(false)
            }}
            onBlur={() => handleBlur('street')}
            placeholder={isNL && !autocompleteFilled ? 'Wordt automatisch ingevuld' : 'Breestraat'}
            readOnly={isNL && autocompleteFilled}
            style={isNL && autocompleteFilled ? { backgroundColor: 'var(--bg, #f8fafc)', color: 'var(--navy)' } : undefined}
            required={requiredFields.includes('street')}
            aria-required={requiredFields.includes('street')}
            aria-invalid={hasError('street') ? 'true' : 'false'}
          />
          {hasError('street') && (
            <div className="error-message" id="street-error" role="alert">
              <AlertCircle size={14} />
              {errors.street}
            </div>
          )}
        </div>

        {/* Plaats (auto-filled for NL, manual for other countries) */}
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
            onChange={(e) => {
              handleChange('city', e.target.value)
              if (isNL) setAutocompleteFilled(false)
            }}
            onBlur={() => handleBlur('city')}
            placeholder={isNL && !autocompleteFilled ? 'Wordt automatisch ingevuld' : 'Amsterdam'}
            readOnly={isNL && autocompleteFilled}
            style={isNL && autocompleteFilled ? { backgroundColor: 'var(--bg, #f8fafc)', color: 'var(--navy)' } : undefined}
            required={requiredFields.includes('city')}
            aria-required={requiredFields.includes('city')}
            aria-invalid={hasError('city') ? 'true' : 'false'}
          />
          {hasError('city') && (
            <div className="error-message" id="city-error" role="alert">
              <AlertCircle size={14} />
              {errors.city}
            </div>
          )}
        </div>

        {/* Voornaam */}
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
          />
          {hasError('firstName') && (
            <div className="error-message" id="firstName-error" role="alert">
              <AlertCircle size={14} />
              {errors.firstName}
            </div>
          )}
        </div>

        {/* Achternaam */}
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
          />
          {hasError('lastName') && (
            <div className="error-message" id="lastName-error" role="alert">
              <AlertCircle size={14} />
              {errors.lastName}
            </div>
          )}
        </div>

        {/* Submit */}
        {submitLabel !== false && (
          <div className="form-group span-2">
            <button type="submit" className="form-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Bezig...' : submitLabel}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
