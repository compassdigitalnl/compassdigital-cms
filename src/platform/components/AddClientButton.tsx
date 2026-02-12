'use client'

/**
 * Add Client Button
 * Opens modal to create new client
 */

import React, { useState } from 'react'
import AddClientModal from './AddClientModal'

export default function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Add New Client
      </button>

      <AddClientModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
