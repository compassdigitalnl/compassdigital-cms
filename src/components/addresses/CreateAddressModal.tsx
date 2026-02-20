'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CreateAddressModalProps {
  onAddressCreated?: (address: any) => void
  children?: React.ReactNode
}

export const CreateAddressModal: React.FC<CreateAddressModalProps> = ({
  onAddressCreated,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuw adres toevoegen</DialogTitle>
          <DialogDescription>Voeg een nieuw bezorg- of factuuradres toe</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Address form coming soon...</p>
          <Button onClick={() => onAddressCreated?.({})}>Opslaan</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
