'use client'

import React, { useState, FormEvent } from 'react'
import { Mail, Phone } from 'lucide-react'
import styles from './GuestCheckoutForm.module.css'
import { FormInput } from '../FormInput'
import { GuestInfoBox } from '../GuestInfoBox'
import type { GuestCheckoutFormProps, GuestCheckoutFormValues } from './types'

export const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
  onSubmit,
  onRegisterClick,
  className = '',
}) => {
  const [formData, setFormData] = useState<GuestCheckoutFormValues>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit?.(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof GuestCheckoutFormValues, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className={`${styles.guestCheckoutForm} ${className}`}>
      <h2 className={styles.formTitle}>Gast bestellen</h2>
      <p className={styles.formSubtitle}>
        Bestel snel en eenvoudig zonder account. U kunt altijd later een account aanmaken.
      </p>

      <GuestInfoBox />

      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <FormInput
            type="text"
            label="Voornaam"
            placeholder="Jan"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            required
          />

          <FormInput
            type="text"
            label="Achternaam"
            placeholder="de Vries"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            required
          />
        </div>

        <FormInput
          type="email"
          label="E-mailadres"
          placeholder="naam@voorbeeld.nl"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          helperText="We sturen de orderbevestiging naar dit adres"
          required
        />

        <FormInput
          type="tel"
          label="Telefoonnummer (optioneel)"
          placeholder="06 12345678"
          leftIcon={<Phone className="h-4 w-4" />}
          value={formData.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
        />

        <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
          <label className={styles.formCheckbox}>
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => updateField('acceptTerms', e.target.checked)}
              required
            />
            Ik ga akkoord met de{' '}
            <a href="#" className={styles.formLink} onClick={(e) => e.preventDefault()}>
              algemene voorwaarden
            </a>
          </label>
        </div>

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Bezig...' : 'Doorgaan naar bestellen'}
        </button>
      </form>

      <p className={styles.formFooter}>
        Toch een account aanmaken?{' '}
        <button
          type="button"
          className={styles.formLinkBtn}
          onClick={onRegisterClick}
        >
          Registreer hier
        </button>
      </p>
    </div>
  )
}

export default GuestCheckoutForm
