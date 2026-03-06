'use client'

import React from 'react'
import { MailCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface StepVerificationProps {
  email: string
}

export const StepVerification: React.FC<StepVerificationProps> = ({ email }) => {
  return (
    <div
      className="rounded-[20px] border bg-white p-9 text-center"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-glow)]">
        <MailCheck className="h-8 w-8 text-theme-teal" />
      </div>

      <h2 className="mb-2 font-heading text-[22px] font-extrabold text-theme-navy">
        Controleer uw e-mail
      </h2>

      <p className="mx-auto mb-6 max-w-md text-[15px] leading-relaxed text-theme-grey-dark">
        We hebben een bevestigingsmail verstuurd naar{' '}
        <strong className="text-theme-navy">{email}</strong>.
        Klik op de link in de e-mail om uw account te activeren.
      </p>

      <div
        className="mx-auto mb-6 max-w-sm rounded-xl border p-4 text-left text-sm text-theme-grey-dark"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-grey-light)' }}
      >
        <p className="mb-2 font-bold text-theme-navy">Geen e-mail ontvangen?</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Controleer uw spam/ongewenste map</li>
          <li>Controleer of het e-mailadres correct is</li>
          <li>Wacht enkele minuten en probeer opnieuw</li>
        </ul>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          className="
            text-sm font-bold text-theme-teal
            transition-colors hover:text-theme-navy cursor-pointer
          "
          onClick={() => {
            // TODO: Resend verification email
            console.log('Resend verification')
          }}
        >
          Bevestigingsmail opnieuw versturen
        </button>

        <Link
          href="/inloggen"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-theme-teal px-6 py-3 text-sm font-bold text-white
            no-underline shadow-[0_4px_16px_var(--color-primary-glow)]
            transition-all duration-200
            hover:-translate-y-px hover:bg-theme-teal-light
          "
        >
          Naar inloggen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
