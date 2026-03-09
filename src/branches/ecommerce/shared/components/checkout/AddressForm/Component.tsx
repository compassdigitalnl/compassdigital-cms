'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  companyName: '',
  street: '',
  houseNumber: '',
  addition: '',
  postalCode: '',
  city: '',
  country: 'NL',
}

const POSTCODE_PATTERNS: Record<string, { regex: RegExp; example: string }> = {
  NL: { regex: /^\d{4}\s?[A-Z]{2}$/i, example: '1234 AB' },
  BE: { regex: /^\d{4}$/, example: '1000' },
  DE: { regex: /^\d{5}$/, example: '10115' },
  FR: { regex: /^\d{5}$/, example: '75001' },
  UK: { regex: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, example: 'SW1A 1AA' },
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

  // Keep a ref to onChange so the fetch callback always has the latest
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const validateField = (name: keyof Address, value: string, country?: string): string => {
    if (requiredFields.includes(name) && !value.trim()) {
      const labels: Record<keyof Address, string> = {
        firstName: 'Voornaam', lastName: 'Achternaam', companyName: 'Bedrijfsnaam',
        street: 'Straat', houseNumber: 'Huisnummer', addition: 'Toevoeging',
        postalCode: 'Postcode', city: 'Plaats', country: 'Land',
      }
      return `${labels[name]} is verplicht`
    }
    if (name === 'postalCode' && value) {
      const c = country || formData.country
      const p = POSTCODE_PATTERNS[c]
      if (p && !p.regex.test(value)) return `Voer een geldige postcode in (bijv. ${p.example})`
    }
    if ((name === 'firstName' || name === 'lastName') && value && value.trim().length < 2) {
      return 'Minimaal 2 tekens vereist'
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(formData).forEach((key) => {
      const k = key as keyof Address
      const err = validateField(k, formData[k] || '')
      if (err) newErrors[k] = err
    })
    setErrors(newErrors)
    if (onValidate) onValidate(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Core: fetch postcode with explicit parameters (no closure dependency)
  const doPostcodeLookup = async (postalCode: string, houseNumber: string) => {
    const nlPattern = POSTCODE_PATTERNS.NL
    if (!nlPattern || !nlPattern.regex.test(postalCode) || !houseNumber.trim()) return

    setAutocompleteLoading(true)
    setAutocompleteSuccess(false)

    try {
      const url = `/api/postcode-lookup?postal=${encodeURIComponent(postalCode)}&number=${encodeURIComponent(houseNumber)}`
      const res = await fetch(url)
      if (!res.ok) return

      const data = await res.json()
      if (!data.success || !data.street) return

      setFormData((prev) => {
        const updated = { ...prev, street: data.street, city: data.city || prev.city }
        if (onChangeRef.current) onChangeRef.current(updated)
        return updated
      })
      setAutocompleteFilled(true)
      setAutocompleteSuccess(true)
      setTimeout(() => setAutocompleteSuccess(false), 3000)
    } catch (err) {
      console.error('Postcode lookup failed:', err)
    } finally {
      setAutocompleteLoading(false)
    }
  }

  const handleChange = (name: keyof Address, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (onChange) onChange(updated)
      return updated
    })

    if (name === 'postalCode' || name === 'houseNumber') {
      setAutocompleteSuccess(false)
      setAutocompleteFilled(false)
    }

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof Address) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    // Read from latest state via functional update pattern
    setFormData((current) => {
      const error = validateField(name, current[name] || '', current.country)
      setErrors((prev) => ({ ...prev, [name]: error }))

      // Trigger autocomplete on blur of postcode or houseNumber
      if (enableAutocomplete && current.country === 'NL' && (name === 'postalCode' || name === 'houseNumber')) {
        doPostcodeLookup(current.postalCode, current.houseNumber)
      }

      return current // don't change formData
    })
  }

  const handlePostalCodeChange = (value: string) => {
    // Update state and then trigger autocomplete with the new value
    setFormData((prev) => {
      const updated = { ...prev, postalCode: value }
      if (onChange) onChange(updated)

      // Try autocomplete with the new postcode + existing houseNumber
      if (enableAutocomplete && updated.country === 'NL') {
        doPostcodeLookup(value, updated.houseNumber)
      }

      return updated
    })
    setAutocompleteSuccess(false)
    setAutocompleteFilled(false)

    if (touched.postalCode) {
      const error = validateField('postalCode', value)
      setErrors((prev) => ({ ...prev, postalCode: error }))
    }
  }

  const handleHouseNumberChange = (value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, houseNumber: value }
      if (onChange) onChange(updated)

      // Try autocomplete with existing postcode + new houseNumber
      if (enableAutocomplete && updated.country === 'NL') {
        doPostcodeLookup(updated.postalCode, value)
      }

      return updated
    })
    setAutocompleteSuccess(false)
    setAutocompleteFilled(false)

    if (touched.houseNumber) {
      const error = validateField('houseNumber', value)
      setErrors((prev) => ({ ...prev, houseNumber: error }))
    }
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
    setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {}))
    if (validateForm() && onSubmit) onSubmit(formData)
  }

  const hasError = (name: keyof Address) => touched[name] && errors[name]
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
          <select onChange={(e) => handleSavedAddressSelect(e.target.value)} aria-label="Selecteer opgeslagen adres">
            <option value="">Selecteer opgeslagen adres...</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>{addr.label}</option>
            ))}
            <option value="new">+ Nieuw adres toevoegen</option>
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        {/* Voornaam + Achternaam */}
        <div className={`form-group ${hasError('firstName') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="firstName">
            Voornaam{requiredFields.includes('firstName') && <span className="req">*</span>}
          </label>
          <input id="firstName" className="form-input" type="text" value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')} placeholder="Jan"
            required={requiredFields.includes('firstName')} aria-invalid={hasError('firstName') ? 'true' : 'false'} />
          {hasError('firstName') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.firstName}</div>}
        </div>

        <div className={`form-group ${hasError('lastName') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="lastName">
            Achternaam{requiredFields.includes('lastName') && <span className="req">*</span>}
          </label>
          <input id="lastName" className="form-input" type="text" value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')} placeholder="de Vries"
            required={requiredFields.includes('lastName')} aria-invalid={hasError('lastName') ? 'true' : 'false'} />
          {hasError('lastName') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.lastName}</div>}
        </div>

        {/* Bedrijfsnaam */}
        <div className="form-group span-2">
          <label className="form-label" htmlFor="companyName">
            Bedrijfsnaam <span className="text-xs text-[var(--color-text-muted)]">(optioneel)</span>
          </label>
          <input id="companyName" className="form-input" type="text" value={formData.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Optioneel — vul in bij zakelijke bestelling" />
        </div>

        {/* Land */}
        <div className={`form-group span-2 ${hasError('country') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="country">Land</label>
          <select id="country" className="form-input" value={formData.country}
            onChange={(e) => { handleChange('country', e.target.value); setAutocompleteFilled(false) }}
            onBlur={() => handleBlur('country')}>
            <option value="NL">Nederland</option>
            <option value="BE">België</option>
            <option value="DE">Duitsland</option>
            <option value="FR">Frankrijk</option>
            <option value="UK">Verenigd Koninkrijk</option>
          </select>
        </div>

        {/* Postcode + Huisnummer + Toevoeging */}
        <div className="form-group span-2">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16, 16px)' }}>
            <div className={`form-group ${hasError('postalCode') ? 'error' : ''}`}>
              <label className="form-label" htmlFor="postalCode">
                Postcode{requiredFields.includes('postalCode') && <span className="req">*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input id="postalCode" className="form-input" style={{ width: '100%' }} type="text"
                  value={formData.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('postalCode')}
                  placeholder={POSTCODE_PATTERNS[formData.country]?.example || '1234 AB'} />
                {autocompleteLoading && (
                  <Loader2 size={16} className="animate-spin"
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-mid)' }} />
                )}
              </div>
              {hasError('postalCode') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.postalCode}</div>}
            </div>

            <div className={`form-group ${hasError('houseNumber') ? 'error' : ''}`}>
              <label className="form-label" htmlFor="houseNumber">
                Huisnr.{requiredFields.includes('houseNumber') && <span className="req">*</span>}
              </label>
              <input id="houseNumber" className="form-input" type="text" value={formData.houseNumber}
                onChange={(e) => handleHouseNumberChange(e.target.value)}
                onBlur={() => handleBlur('houseNumber')} placeholder="42" />
              {hasError('houseNumber') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.houseNumber}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addition">Toevoeging</label>
              <input id="addition" className="form-input" type="text" value={formData.addition || ''}
                onChange={(e) => handleChange('addition', e.target.value)} placeholder="A, 2e etage" />
            </div>
          </div>

          {autocompleteSuccess && (
            <div className="autocomplete-hint" style={{ marginTop: 'var(--space-8, 8px)' }}>
              <Sparkles size={16} />
              Adres automatisch aangevuld
            </div>
          )}
        </div>

        {/* Straat */}
        <div className={`form-group ${hasError('street') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="street">
            Straat{requiredFields.includes('street') && <span className="req">*</span>}
          </label>
          <input id="street" className="form-input" type="text" value={formData.street}
            onChange={(e) => { handleChange('street', e.target.value); if (isNL) setAutocompleteFilled(false) }}
            onBlur={() => handleBlur('street')}
            placeholder={isNL && !autocompleteFilled ? 'Wordt automatisch ingevuld' : 'Breestraat'}
            readOnly={isNL && autocompleteFilled}
            style={isNL && autocompleteFilled ? { backgroundColor: 'var(--bg, #f8fafc)' } : undefined} />
          {hasError('street') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.street}</div>}
        </div>

        {/* Plaats */}
        <div className={`form-group ${hasError('city') ? 'error' : ''}`}>
          <label className="form-label" htmlFor="city">
            Plaats{requiredFields.includes('city') && <span className="req">*</span>}
          </label>
          <input id="city" className="form-input" type="text" value={formData.city}
            onChange={(e) => { handleChange('city', e.target.value); if (isNL) setAutocompleteFilled(false) }}
            onBlur={() => handleBlur('city')}
            placeholder={isNL && !autocompleteFilled ? 'Wordt automatisch ingevuld' : 'Amsterdam'}
            readOnly={isNL && autocompleteFilled}
            style={isNL && autocompleteFilled ? { backgroundColor: 'var(--bg, #f8fafc)' } : undefined} />
          {hasError('city') && <div className="error-message" role="alert"><AlertCircle size={14} />{errors.city}</div>}
        </div>

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
