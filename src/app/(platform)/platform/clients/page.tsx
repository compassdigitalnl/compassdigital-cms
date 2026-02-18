'use client'

/**
 * Clients List Page - Professional Edition
 *
 * Features:
 * - Full table with all client data
 * - Filters (status, template, billing)
 * - Search (name, domain)
 * - Pagination
 * - Actions (view, edit, visit site, open admin)
 * - Responsive design
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Eye,
  RefreshCw,
  Settings,
} from 'lucide-react'

interface Client {
  id: string
  name: string
  domain: string
  template: string
  status: string
  billingStatus: string
  monthlyFee: number
  plan: string
  healthStatus: string
  createdAt: string
  deploymentUrl?: string
  adminUrl?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [templateFilter, setTemplateFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    fetchClients()
  }, [page, statusFilter, templateFilter, search])

  async function fetchClients() {
    try {
      setLoading(true)

      // Build query params
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      })

      // Add filters
      if (statusFilter !== 'all') {
        params.append('where[status][equals]', statusFilter)
      }
      if (templateFilter !== 'all') {
        params.append('where[template][equals]', templateFilter)
      }
      if (search) {
        params.append('where[or][0][name][contains]', search)
        params.append('where[or][1][domain][contains]', search)
      }

      const response = await fetch(`/api/clients?${params.toString()}`, { credentials: 'include' })
      const data = await response.json()

      if (data.docs) {
        setClients(data.docs)
        setTotal(data.totalDocs)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status: string) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      deploying: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Deploying' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' },
    }
    const style = config[status] || config.pending
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} hover:${style.bg}`}>
        {style.label}
      </Badge>
    )
  }

  function getTemplateBadge(template: string) {
    const labels: Record<string, string> = {
      ecommerce: 'E-commerce',
      blog: 'Blog',
      b2b: 'B2B',
      portfolio: 'Portfolio',
      corporate: 'Corporate',
    }
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        {labels[template] || template}
      </Badge>
    )
  }

  const totalPages = Math.ceil(total / limit)

  if (loading && clients.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage all client websites and configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/collections/clients">
              <Settings className="mr-2 h-4 w-4" />
              CMS Admin
            </Link>
          </Button>
          <Button asChild>
            <Link href="/site-generator">
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or domain..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deploying">Deploying</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Template Filter */}
            <Select
              value={templateFilter}
              onValueChange={(value) => {
                setTemplateFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="b2b">B2B</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {total} Client{total !== 1 ? 's' : ''}
              </CardTitle>
              <CardDescription>
                {totalPages > 0 ? `Page ${page} of ${totalPages}` : 'No results'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchClients()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No clients found</p>
              <p className="text-sm mb-4">Create your first client to get started</p>
              <Button asChild>
                <Link href="/site-generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Client via Site Generator
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Domain</TableHead>
                      <TableHead className="font-semibold">Template</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Plan</TableHead>
                      <TableHead className="font-semibold">Revenue</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {client.domain}
                          </code>
                        </TableCell>
                        <TableCell>{getTemplateBadge(client.template)}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {client.plan || 'starter'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {client.monthlyFee > 0 ? (
                            <span className="font-medium text-green-600">
                              €{client.monthlyFee}/mo
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Free</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" asChild title="View Details">
                              <Link href={`/platform/clients/${client.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild title="Edit Client">
                              <Link href={`/admin/collections/clients/${client.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            {client.deploymentUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Visit Site"
                                onClick={() => window.open(client.deploymentUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} clients
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1 || loading}
                    >
                      Previous
                    </Button>
                    <div className="text-sm font-medium px-2">
                      {page} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
