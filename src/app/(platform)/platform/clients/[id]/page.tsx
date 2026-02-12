/**
 * Client Details Page
 * Shows detailed information about a single client
 */

import React from 'react'
import ClientDetailsView from '@/platform/components/ClientDetailsView'

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  return <ClientDetailsView clientId={params.id} />
}
