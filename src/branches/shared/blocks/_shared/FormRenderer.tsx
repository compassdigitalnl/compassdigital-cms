'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { RichText } from '@/branches/shared/components/common/RichText'
import { Button } from '@/branches/shared/components/ui/button'

import { buildInitialFormState } from '../Form/buildInitialFormState'
import { fields } from '../Form/fields'
import { getClientSideURL } from '@/utilities/getURL'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

interface FormRendererProps {
  form: FormType
  className?: string
}

/**
 * FormRenderer — Shared client component for rendering Payload CMS forms.
 *
 * Reuses the same logic as Form/Component.tsx (react-hook-form, submission
 * to /api/form-submissions, confirmation handling) but without container
 * styling, so parent blocks can control layout.
 */
export const FormRenderer: React.FC<FormRendererProps> = ({ form, className = '' }) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
    fields: formFields,
  } = form || {}

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText data={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 last:mb-0">
              {formFields &&
                formFields.map((field, index) => {
                  const Field: React.FC<any> | undefined =
                    fields?.[field.blockType as keyof typeof fields]

                  if (Field) {
                    return (
                      <div className="mb-6 last:mb-0" key={index}>
                        <Field
                          form={form}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
            </div>

            <Button form={formID} type="submit" variant="default">
              {submitButtonLabel}
            </Button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
