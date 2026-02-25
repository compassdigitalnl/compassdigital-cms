'use client'

import React, { useState, FormEvent } from 'react'
import { Mail, Phone, Lock } from 'lucide-react'
import styles from './RegisterForm.module.css'
import { FormInput } from '../FormInput'
import { OAuthButtons } from '../OAuthButtons'
import { B2BNotice } from '../B2BNotice'
import { PasswordStrengthMeter } from '../PasswordStrengthMeter'
import type { RegisterFormProps, RegisterFormValues } from './types'

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onOAuthClick,
  onLoginClick,
  className = '',
  showOAuth = true,
  showB2BNotice = true,
}) => {
  const [formData, setFormData] = useState<RegisterFormValues>({
    firstName: '',
    lastName: '',
    organization: '',
    kvkNumber: '',
    email: '',
    phone: '',
    password: '',
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

  const updateField = (field: keyof RegisterFormValues, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className={`${styles.registerForm} ${className}`}>
      <h2 className={styles.formTitle}>Account aanmaken</h2>
      <p className={styles.formSubtitle}>
        Maak een zakelijk account aan voor persoonlijke prijzen en snelle nabestellingen.
      </p>

      {showOAuth && (
        <>
          <OAuthButtons
            providers={['google']}
            onProviderClick={onOAuthClick}
          />
        </>
      )}

      {showB2BNotice && <B2BNotice variant="pending" />}

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
          type="text"
          label="Organisatie / Praktijk"
          placeholder="Huisartsenpraktijk De Vries"
          value={formData.organization}
          onChange={(e) => updateField('organization', e.target.value)}
          required
        />

        <FormInput
          type="text"
          label="KvK-nummer"
          placeholder="12345678"
          maxLength={8}
          value={formData.kvkNumber}
          onChange={(e) => updateField('kvkNumber', e.target.value)}
        />

        <FormInput
          type="email"
          label="Zakelijk e-mailadres"
          placeholder="info@uwpraktijk.nl"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />

        <FormInput
          type="tel"
          label="Telefoonnummer"
          placeholder="06 12345678"
          leftIcon={<Phone className="h-4 w-4" />}
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />

        <div className={styles.formGroup}>
          <FormInput
            type="password"
            label="Wachtwoord"
            placeholder="Min. 8 tekens"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
          />
          <PasswordStrengthMeter password={formData.password} />
        </div>

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
          className={styles.btnSecondary}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Bezig...' : 'Account aanvragen'}
        </button>
      </form>

      <p className={styles.formFooter}>
        Al een account?{' '}
        <button
          type="button"
          className={styles.formLinkBtn}
          onClick={onLoginClick}
        >
          Log hier in
        </button>
      </p>
    </div>
  )
}

export default RegisterForm
