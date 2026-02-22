'use client'

import { AddressItem } from '@/branches/ecommerce/components/addresses/AddressItem'
import { CreateAddressModal } from '@/branches/ecommerce/components/addresses/CreateAddressModal'
import { Button } from '@/branches/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/branches/shared/components/ui/dialog'
import { Address } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmit?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddress,
  heading = 'Addresses',
  description = 'Please select or add your shipping and billing addresses.',
}) => {
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-medium mb-2">{heading}</h3>
          <p className="text-muted-foreground mb-4">Geen adressen gevonden. Voeg een adres toe om door te gaan.</p>
        </div>

        <CreateAddressModal
          callback={(address) => setAddress(address)}
          skipSubmission={false}
        >
          <Button variant="default" className="w-full sm:w-auto">
            Nieuw adres toevoegen
          </Button>
        </CreateAddressModal>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-medium mb-2">{heading}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <AddressesModal setAddress={setAddress} />
    </div>
  )
}

const AddressesModal: React.FC<Props> = ({ setAddress }) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p>No addresses found. Please add an address.</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>{'Select an address'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'Select an address'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-12">
          <ul className="flex flex-col gap-8">
            {addresses.map((address) => (
              <li key={address.id} className="border-b pb-8 last:border-none">
                <AddressItem
                  address={address}
                  beforeActions={
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        setAddress(address)
                        closeModal()
                      }}
                    >
                      Select
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <CreateAddressModal>
            <Button variant="outline" className="w-full">
              + Nieuw adres toevoegen
            </Button>
          </CreateAddressModal>
        </div>
      </DialogContent>
    </Dialog>
  )
}
