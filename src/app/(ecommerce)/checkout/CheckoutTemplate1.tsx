'use client'

import { Message } from '@/branches/shared/components/common/Message'
import { Price } from '@/branches/shared/components/features/ecommerce/Price'
import { Button } from '@/branches/shared/components/ui/button'
import { Input } from '@/branches/shared/components/ui/input'
import { Label } from '@/branches/shared/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, ShoppingBag, Lock, CreditCard, MapPin, Mail } from 'lucide-react'

import { cssVariables } from '@/cssVariables'
import { CheckoutForm } from '@/branches/shared/components/forms/CheckoutForm'
import { useAddresses, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { CheckoutAddresses } from '@/branches/ecommerce/components/checkout/CheckoutAddresses'
import { CreateAddressModal } from '@/branches/ecommerce/components/addresses/CreateAddressModal'
import { Address } from '@/payload-types'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'
import { AddressItem } from '@/branches/ecommerce/components/addresses/AddressItem'
import { FormItem } from '@/branches/shared/components/forms/FormItem'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/branches/shared/components/common/LoadingSpinner'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export default function CheckoutTemplate1() {
  const { user } = useAuth()
  const router = useRouter()
  const { items: cartItems, total: cartTotal, itemCount } = useCart()
  const [error, setError] = useState<null | string>(null)
  const { theme } = useTheme()
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  // Mobile-specific state
  const [showCartSummary, setShowCartSummary] = useState(false)
  const [currentStep, setCurrentStep] = useState<'contact' | 'address' | 'payment'>('contact')

  const cartIsEmpty = !cartItems || cartItems.length === 0

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Processing your payment...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Je winkelwagen is leeg.</p>
        <Link href="/shop/" className="text-[var(--color-primary)] font-semibold mt-4 inline-block">
          Verder winkelen
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 lg:pb-8">
      {/* MOBILE: Collapsible Cart Summary */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowCartSummary(!showCartSummary)}
          className="w-full rounded-2xl p-4 flex items-center justify-between transition-all duration-200"
          style={{
            background: 'var(--color-base-50, var(--color-surface))',
            border: '1px solid var(--color-border, var(--color-border))',
          }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" style={{ color: 'var(--color-primary, #2563EB)' }} />
            <div className="text-left">
              <div className="font-bold text-sm">Winkelwagen</div>
              <div className="text-xs opacity-60">
                {itemCount || 0} {itemCount === 1 ? 'product' : 'producten'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-lg">
              <Price amount={cartTotal || 0} />
            </div>
            {showCartSummary ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        {showCartSummary && (
          <div
            className="mt-3 rounded-2xl p-4 space-y-3"
            style={{
              background: 'var(--color-base-0, #FFFFFF)',
              border: '1px solid var(--color-border, var(--color-border))',
            }}
          >
            {cartItems?.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{
                    width: '56px',
                    height: '56px',
                    border: '1px solid var(--color-border, var(--color-border))',
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  {item.sku && (
                    <p className="text-xs opacity-60 font-mono">SKU: {item.sku}</p>
                  )}
                  <p className="text-xs mt-1">Aantal: {item.quantity}</p>
                </div>
                <div className="font-bold text-sm">
                  <Price amount={(item.unitPrice || item.price) * item.quantity} />
                </div>
              </div>
            ))}
            <div
              className="pt-3 mt-3 flex justify-between items-center"
              style={{ borderTop: '1px solid var(--color-border, var(--color-border))' }}
            >
              <span className="font-bold text-sm uppercase">Totaal</span>
              <span className="font-extrabold text-xl">
                <Price amount={cartTotal || 0} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN CHECKOUT FORM */}
        <div className="flex-1 space-y-6 lg:space-y-8">
          {/* CONTACT SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base"
                style={{
                  background: 'var(--color-primary, #2563EB)',
                  color: 'white',
                }}
              >
                1
              </div>
              <h2 className="font-bold text-xl lg:text-3xl">Contact</h2>
            </div>

            {!user && (
              <div
                className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                style={{
                  background: 'var(--color-base-50, var(--color-surface))',
                  border: '1px solid var(--color-border, var(--color-border))',
                }}
              >
                <div className="prose dark:prose-invert max-w-none">
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
                    <Button
                      asChild
                      className="no-underline text-inherit h-10 lg:h-11 text-sm lg:text-base"
                      variant="outline"
                    >
                      <Link href="/login/">Inloggen</Link>
                    </Button>
                    <span className="text-sm opacity-60">of</span>
                    <Link
                      href="/create-account/"
                      className="text-sm lg:text-base underline font-medium"
                    >
                      Account aanmaken
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {user ? (
              <div
                className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                style={{
                  background: 'var(--color-base-0, #FFFFFF)',
                  border: '1px solid var(--color-border, var(--color-border))',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5" style={{ color: 'var(--color-primary, #2563EB)' }} />
                  <p className="font-medium text-sm lg:text-base">{user.email}</p>
                </div>
                <p className="text-xs lg:text-sm opacity-60 ml-8">
                  Niet jij?{' '}
                  <Link className="underline font-medium" href="/logout/">
                    Uitloggen
                  </Link>
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl lg:rounded-2xl p-4 lg:p-6 space-y-4"
                style={{
                  background: 'var(--color-base-0, #FFFFFF)',
                  border: '1px solid var(--color-border, var(--color-border))',
                }}
              >
                <p className="text-sm lg:text-base opacity-80">
                  Vul je e-mailadres in om als gast af te rekenen.
                </p>

                <FormItem>
                  <Label htmlFor="email" className="text-sm lg:text-base font-medium">
                    E-mailadres
                  </Label>
                  <Input
                    disabled={!emailEditable}
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="h-12 lg:h-14 text-base"
                    placeholder="jouw@email.nl"
                  />
                </FormItem>

                <Button
                  disabled={!email || !emailEditable}
                  onClick={(e) => {
                    e.preventDefault()
                    setEmailEditable(false)
                  }}
                  className="w-full h-12 lg:h-14 text-base lg:text-lg font-bold"
                  variant="default"
                >
                  Doorgaan als gast
                </Button>
              </div>
            )}
          </div>

          {/* ADDRESS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base"
                style={{
                  background: 'var(--color-primary, #2563EB)',
                  color: 'white',
                }}
              >
                2
              </div>
              <h2 className="font-bold text-xl lg:text-3xl">Adres</h2>
            </div>

            {billingAddress ? (
              <div
                className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                style={{
                  background: 'var(--color-base-0, #FFFFFF)',
                  border: '1px solid var(--color-border, var(--color-border))',
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <MapPin
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-primary, #2563EB)' }}
                  />
                  <div className="flex-1">
                    <AddressItem
                      actions={
                        <Button
                          variant={'outline'}
                          disabled={Boolean(paymentData)}
                          onClick={(e) => {
                            e.preventDefault()
                            setBillingAddress(undefined)
                          }}
                          className="h-10 lg:h-11 text-sm lg:text-base mt-3"
                        >
                          Verwijderen
                        </Button>
                      }
                      address={billingAddress}
                    />
                  </div>
                </div>
              </div>
            ) : user ? (
              <CheckoutAddresses heading="Factuuradres" setAddress={setBillingAddress} />
            ) : (
              <CreateAddressModal
                disabled={!email || Boolean(emailEditable)}
                callback={(address) => {
                  setBillingAddress(address)
                }}
                skipSubmission={true}
              />
            )}

            <div
              className="flex gap-3 lg:gap-4 items-start p-4 rounded-xl lg:rounded-2xl"
              style={{
                background: 'var(--color-base-50, var(--color-surface))',
                border: '1px solid var(--color-border, var(--color-border))',
              }}
            >
              <Checkbox
                id="shippingTheSameAsBilling"
                checked={billingAddressSameAsShipping}
                disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
                onCheckedChange={(state) => {
                  setBillingAddressSameAsShipping(state as boolean)
                }}
                className="mt-0.5"
              />
              <Label
                htmlFor="shippingTheSameAsBilling"
                className="text-sm lg:text-base font-medium cursor-pointer"
              >
                Verzendadres is hetzelfde als factuuradres
              </Label>
            </div>

            {!billingAddressSameAsShipping && (
              <>
                {shippingAddress ? (
                  <div
                    className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                    style={{
                      background: 'var(--color-base-0, #FFFFFF)',
                      border: '1px solid var(--color-border, var(--color-border))',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-primary, #2563EB)' }}
                      />
                      <div className="flex-1">
                        <AddressItem
                          actions={
                            <Button
                              variant={'outline'}
                              disabled={Boolean(paymentData)}
                              onClick={(e) => {
                                e.preventDefault()
                                setShippingAddress(undefined)
                              }}
                              className="h-10 lg:h-11 text-sm lg:text-base mt-3"
                            >
                              Verwijderen
                            </Button>
                          }
                          address={shippingAddress}
                        />
                      </div>
                    </div>
                  </div>
                ) : user ? (
                  <CheckoutAddresses
                    heading="Verzendadres"
                    description="Selecteer een verzendadres."
                    setAddress={setShippingAddress}
                  />
                ) : (
                  <CreateAddressModal
                    callback={(address) => {
                      setShippingAddress(address)
                    }}
                    disabled={!email || Boolean(emailEditable)}
                    skipSubmission={true}
                  />
                )}
              </>
            )}
          </div>

          {/* GO TO PAYMENT BUTTON */}
          {!paymentData && (
            <Button
              disabled={!canGoToPayment}
              onClick={(e) => {
                e.preventDefault()
                void initiatePaymentIntent('stripe')
              }}
              className="w-full h-12 lg:h-14 text-base lg:text-lg font-bold flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Naar betaling
            </Button>
          )}

          {/* ERROR MESSAGE */}
          {!paymentData?.['clientSecret'] && error && (
            <div
              className="rounded-xl lg:rounded-2xl p-4 lg:p-6 space-y-4"
              style={{
                background: 'var(--color-error-bg)',
                border: '1px solid var(--color-error)',
              }}
            >
              <Message error={error} />

              <Button
                onClick={(e) => {
                  e.preventDefault()
                  router.refresh()
                }}
                variant="default"
                className="w-full h-12 lg:h-14 text-base lg:text-lg font-bold"
              >
                Opnieuw proberen
              </Button>
            </div>
          )}

          {/* PAYMENT SECTION */}
          <Suspense fallback={<React.Fragment />}>
            {/* @ts-ignore */}
            {paymentData && paymentData?.['clientSecret'] && (
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base"
                    style={{
                      background: 'var(--color-primary, #2563EB)',
                      color: 'white',
                    }}
                  >
                    3
                  </div>
                  <h2 className="font-bold text-xl lg:text-3xl">Betaling</h2>
                </div>

                {error && (
                  <div
                    className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                    style={{
                      background: 'var(--color-error-bg)',
                      border: '1px solid var(--color-error)',
                    }}
                  >
                    <p className="text-sm lg:text-base text-red-700">{`Fout: ${error}`}</p>
                  </div>
                )}

                <div
                  className="rounded-xl lg:rounded-2xl p-4 lg:p-6"
                  style={{
                    background: 'var(--color-base-0, #FFFFFF)',
                    border: '1px solid var(--color-border, var(--color-border))',
                  }}
                >
                  <Elements
                    options={{
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          borderRadius: '12px',
                          colorPrimary: '#2563EB',
                          gridColumnSpacing: '16px',
                          gridRowSpacing: '16px',
                          colorBackground: theme === 'dark' ? '#0a0a0a' : cssVariables.colors.base0,
                          colorDanger: cssVariables.colors.error500,
                          colorDangerText: cssVariables.colors.error500,
                          colorIcon:
                            theme === 'dark'
                              ? cssVariables.colors.base0
                              : cssVariables.colors.base1000,
                          colorText: theme === 'dark' ? '#858585' : cssVariables.colors.base1000,
                          colorTextPlaceholder: '#858585',
                          fontFamily: 'Geist, sans-serif',
                          fontSizeBase: '16px',
                          fontWeightBold: '600',
                          fontWeightNormal: '500',
                          spacingUnit: '4px',
                        },
                      },
                      clientSecret: paymentData['clientSecret'] as string,
                    }}
                    stripe={stripe}
                  >
                    <div className="space-y-4 lg:space-y-6">
                      <CheckoutForm
                        customerEmail={email}
                        billingAddress={billingAddress}
                        setProcessingPayment={setProcessingPayment}
                      />
                      <Button
                        variant="ghost"
                        className="w-full lg:w-auto h-10 lg:h-11 text-sm lg:text-base"
                        onClick={() => setPaymentData(null)}
                      >
                        Betaling annuleren
                      </Button>
                    </div>
                  </Elements>
                </div>
              </div>
            )}
          </Suspense>
        </div>

        {/* DESKTOP: Cart Summary Sidebar */}
        {!cartIsEmpty && (
          <div
            className="hidden lg:block lg:w-96 lg:sticky lg:top-8 lg:self-start rounded-2xl p-6 space-y-6"
            style={{
              background: 'var(--color-base-50, var(--color-surface))',
              border: '1px solid var(--color-border, var(--color-border))',
              maxHeight: 'calc(100vh - 4rem)',
              overflowY: 'auto',
            }}
          >
            <h2 className="text-2xl font-bold">Winkelwagen</h2>

            <div className="space-y-4">
              {cartItems?.map((item, index) => (
                <div key={item.id || index} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden"
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '1px solid var(--color-border, var(--color-border))',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base mb-1">{item.title}</p>
                    {item.sku && (
                      <p className="text-xs opacity-60 font-mono mb-2">SKU: {item.sku}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aantal: {item.quantity}</span>
                      <span className="font-bold">
                        <Price amount={(item.unitPrice || item.price) * item.quantity} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="pt-4"
              style={{ borderTop: '2px solid var(--color-border, var(--color-border))' }}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-base uppercase">Totaal</span>
                <span className="font-extrabold text-2xl">
                  <Price amount={cartTotal || 0} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
