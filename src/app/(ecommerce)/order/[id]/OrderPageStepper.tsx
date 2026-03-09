'use client'

import { CheckoutProgressStepper } from '@/branches/ecommerce/shared/components/checkout/CheckoutProgressStepper'
import { UNIFIED_STEPS } from '@/branches/ecommerce/shared/lib/checkoutFlows'

export function OrderPageStepper() {
  return (
    <div className="bg-white border-b border-gray-200 py-5">
      <CheckoutProgressStepper
        currentStep={5}
        steps={UNIFIED_STEPS}
      />
    </div>
  )
}
