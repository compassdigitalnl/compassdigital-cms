'use client'

import React, { useState, FormEvent } from 'react'
import { Mail, Lock } from 'lucide-react'
import styles from './LoginForm.module.css'
import { FormInput } from '../FormInput'
import { OAuthButtons } from '../OAuthButtons'
import type { LoginFormProps, LoginFormValues } from './types'

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onOAuthClick,
  onRegisterClick,
  className = '',
  showOAuth = true,
}) => {
  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
    rememberMe: false,
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

  return (
    <div className={`${styles.loginForm} ${className}`}>
      <h2 className={styles.formTitle}>Welkom terug</h2>
      <p className={styles.formSubtitle}>Log in met uw account om verder te gaan.</p>

      {showOAuth && (
        <>
          <OAuthButtons
            providers={['google']}
            onProviderClick={onOAuthClick}
          />
        </>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          type="email"
          label="E-mailadres"
          placeholder="naam@organisatie.nl"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <FormInput
          type="password"
          label="Wachtwoord"
          placeholder="Minimaal 8 tekens"
          leftIcon={<Lock className="h-4 w-4" />}
          showPasswordToggle
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <div className={styles.formRememberForgot}>
          <label className={styles.formCheckbox}>
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            Onthoud mij
          </label>

          <button
            type="button"
            className={styles.formLinkBtn}
            onClick={onForgotPassword}
          >
            Wachtwoord vergeten?
          </button>
        </div>

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>

      <p className={styles.formFooter}>
        Nog geen account?{' '}
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

export default LoginForm
