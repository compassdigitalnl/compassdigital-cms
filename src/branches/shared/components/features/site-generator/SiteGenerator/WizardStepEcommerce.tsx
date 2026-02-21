'use client'

import React, { useState } from 'react'
import { EcommerceSettings, CustomPricingRole } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Button } from '@/branches/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import {
  ShoppingCart,
  Store,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Settings,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/branches/shared/components/ui/badge'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/branches/shared/components/ui/select'

interface Props {
  ecommerceSettings: EcommerceSettings | undefined
  onChange: (settings: EcommerceSettings) => void
}

export function WizardStepEcommerce({ ecommerceSettings, onChange }: Props) {
  const data = ecommerceSettings || {
    enabled: true,
    shopType: '',
    pricingStrategy: 'simple',
    customRoles: [],
    currency: '€',
    taxRate: 21,
    shippingEnabled: true,
    stockManagement: true,
    productImportMethod: 'xlsx',
  }

  const [isAddingRole, setIsAddingRole] = useState(false)
  const [newRole, setNewRole] = useState<CustomPricingRole>({
    id: '',
    name: '',
    description: '',
    isDefault: false,
    priority: (data.customRoles.length || 0) + 1,
  })

  const updateField = (field: keyof EcommerceSettings, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addRole = () => {
    if (newRole.name.trim()) {
      const role: CustomPricingRole = {
        ...newRole,
        id: `role_${Date.now()}`,
        priority: data.customRoles.length + 1,
      }
      onChange({ ...data, customRoles: [...data.customRoles, role] })
      setNewRole({
        id: '',
        name: '',
        description: '',
        isDefault: false,
        priority: data.customRoles.length + 2,
      })
      setIsAddingRole(false)
    }
  }

  const removeRole = (id: string) => {
    const updated = data.customRoles.filter((r) => r.id !== id)
    // Re-order priorities
    const reordered = updated.map((r, index) => ({ ...r, priority: index + 1 }))
    onChange({ ...data, customRoles: reordered })
  }

  const updateRole = (id: string, field: keyof CustomPricingRole, value: any) => {
    const updated = data.customRoles.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    onChange({ ...data, customRoles: updated })
  }

  const moveRolePriority = (id: string, direction: 'up' | 'down') => {
    const currentIndex = data.customRoles.findIndex((r) => r.id === id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === data.customRoles.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const reordered = [...data.customRoles]
    const [removed] = reordered.splice(currentIndex, 1)
    reordered.splice(newIndex, 0, removed)

    // Update priorities
    const withPriorities = reordered.map((r, index) => ({ ...r, priority: index + 1 }))
    onChange({ ...data, customRoles: withPriorities })
  }

  const shopTypes = [
    {
      value: 'B2C',
      label: 'B2C - Business to Consumer',
      description: 'Verkoop direct aan consumenten. Standaard prijzen voor iedereen.',
      icon: ShoppingCart,
    },
    {
      value: 'B2B',
      label: 'B2B - Business to Business',
      description:
        'Verkoop aan bedrijven. Pricing per debiteur/rol, volume discounts, MOQ, etc.',
      icon: Store,
    },
    {
      value: 'Hybrid',
      label: 'Hybrid - B2C + B2B',
      description: 'Verkoop aan zowel consumenten als bedrijven met verschillende prijzen.',
      icon: Users,
    },
  ]

  const pricingStrategies = [
    {
      value: 'simple',
      label: 'Simpele Prijzen',
      description: 'Eén prijs per product voor iedereen',
      available: ['B2C', 'B2B', 'Hybrid'],
    },
    {
      value: 'role-based',
      label: 'Role-based Pricing',
      description: 'Verschillende prijzen per klantenrol (retail, wholesale, VIP, etc.)',
      available: ['B2B', 'Hybrid'],
    },
    {
      value: 'volume-based',
      label: 'Volume Discounts',
      description: 'Kortingen bij bulk afname (10+, 50+, 100+ stuks)',
      available: ['B2B', 'Hybrid'],
    },
    {
      value: 'hybrid',
      label: 'Hybrid Pricing',
      description: 'Combinatie van role-based + volume discounts',
      available: ['B2B', 'Hybrid'],
    },
  ]

  const availableStrategies = pricingStrategies.filter((s) =>
    s.available.includes(data.shopType),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-green-600" />
          E-commerce Setup
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Configureer je webshop instellingen, pricing strategie en product import.
        </p>
      </div>

      {/* Shop Type Selection */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="text-lg">Shop Type *</CardTitle>
          <CardDescription>Welk type webshop wil je opzetten?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {shopTypes.map((type) => {
            const Icon = type.icon
            const isSelected = data.shopType === type.value
            return (
              <div
                key={type.value}
                onClick={() => updateField('shopType', type.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{type.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="ml-2">
                      Geselecteerd
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Pricing Strategy */}
      {data.shopType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pricing Strategie *
            </CardTitle>
            <CardDescription>Hoe wil je je prijzen beheren?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={data.pricingStrategy}
              onValueChange={(value) =>
                updateField('pricingStrategy', value as EcommerceSettings['pricingStrategy'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStrategies.map((strategy) => (
                  <SelectItem key={strategy.value} value={strategy.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{strategy.label}</span>
                      <span className="text-xs text-gray-500">{strategy.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(data.pricingStrategy === 'role-based' || data.pricingStrategy === 'hybrid') && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Role-based pricing is actief.</strong>
                    <br />
                    Definieer hieronder je custom prijsrollen. Deze zullen worden gebruikt in de
                    product template.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Pricing Roles */}
      {(data.pricingStrategy === 'role-based' || data.pricingStrategy === 'hybrid') && (
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Custom Pricing Rollen
            </CardTitle>
            <CardDescription>
              Definieer je eigen prijsrollen (bijv. Retail, Wholesale, VIP, Partner, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Roles */}
            {data.customRoles.length > 0 && (
              <div className="space-y-2">
                {data.customRoles
                  .sort((a, b) => a.priority - b.priority)
                  .map((role, index) => (
                    <div
                      key={role.id}
                      className={`p-3 border-2 rounded-lg ${role.isDefault ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveRolePriority(role.id, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveRolePriority(role.id, 'down')}
                            disabled={index === data.customRoles.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            ↓
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Prioriteit {role.priority}
                            </Badge>
                            <Input
                              value={role.name}
                              onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                              placeholder="Rol naam"
                              className="flex-1 h-8 text-sm font-semibold"
                            />
                            {role.isDefault && (
                              <Badge variant="default" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <Input
                            value={role.description || ''}
                            onChange={(e) => updateRole(role.id, 'description', e.target.value)}
                            placeholder="Beschrijving (optioneel)"
                            className="text-xs h-7"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <Checkbox
                              id={`default-${role.id}`}
                              checked={role.isDefault}
                              onCheckedChange={(checked) =>
                                updateRole(role.id, 'isDefault', checked)
                              }
                            />
                            <Label
                              htmlFor={`default-${role.id}`}
                              className="text-xs cursor-pointer"
                            >
                              Gebruik als default prijsrol
                            </Label>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRole(role.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Add New Role */}
            {!isAddingRole && data.customRoles.length < 20 && (
              <Button
                onClick={() => setIsAddingRole(true)}
                variant="outline"
                className="w-full border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Voeg prijsrol toe {data.customRoles.length > 0 && `(${data.customRoles.length}/20)`}
              </Button>
            )}

            {isAddingRole && (
              <Card className="border-2 border-purple-500">
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label htmlFor="new-role-name">Rol Naam *</Label>
                    <Input
                      id="new-role-name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="bijv. Retail, Wholesale, VIP, Partner"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role-desc">Beschrijving (optioneel)</Label>
                    <Input
                      id="new-role-desc"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Korte uitleg van deze rol"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="new-role-default"
                      checked={newRole.isDefault}
                      onCheckedChange={(checked) =>
                        setNewRole({ ...newRole, isDefault: checked as boolean })
                      }
                    />
                    <Label htmlFor="new-role-default" className="cursor-pointer text-sm">
                      Gebruik als default prijsrol
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addRole} disabled={!newRole.name.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Toevoegen
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsAddingRole(false)
                        setNewRole({
                          id: '',
                          name: '',
                          description: '',
                          isDefault: false,
                          priority: data.customRoles.length + 1,
                        })
                      }}
                    >
                      Annuleren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.customRoles.length === 0 && !isAddingRole && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Nog geen custom prijsrollen gedefinieerd.
                  <br />
                  Klik op "Voeg prijsrol toe" om te beginnen.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Basic Settings */}
      {data.shopType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Basis Instellingen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Valuta *</Label>
                <Input
                  id="currency"
                  value={data.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  placeholder="€"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="taxRate">BTW % (optioneel)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={data.taxRate || ''}
                  onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || undefined)}
                  placeholder="21"
                  min="0"
                  max="100"
                  step="0.1"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Checkbox
                  id="shipping"
                  checked={data.shippingEnabled}
                  onCheckedChange={(checked) => updateField('shippingEnabled', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="shipping" className="cursor-pointer font-normal flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Verzending inschakelen
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Voeg verzendkosten en opties toe aan de checkout
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Checkbox
                  id="stock"
                  checked={data.stockManagement}
                  onCheckedChange={(checked) => updateField('stockManagement', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="stock" className="cursor-pointer font-normal flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Voorraadbeheer inschakelen
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track voorraad niveaus en toon "Op voorraad" / "Uitverkocht"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Import Method */}
      {data.shopType && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Product Import</h3>
                <p className="text-sm text-green-700 mt-1">
                  In de volgende stap kun je een product template downloaden (XLSX/CSV) en uploaden
                  met je producten.
                </p>
                <ul className="mt-2 text-sm text-green-700 space-y-1 ml-4 list-disc">
                  <li>
                    Enterprise template met 63+ velden (SKU, EAN, pricing, variants, specs, etc.)
                  </li>
                  {(data.pricingStrategy === 'role-based' ||
                    data.pricingStrategy === 'hybrid') && (
                    <li>
                      Custom pricing kolommen voor jouw rollen:{' '}
                      {data.customRoles.map((r) => r.name).join(', ')}
                    </li>
                  )}
                  <li>AI verificatie tijdens import (data validation & enrichment)</li>
                  <li>Background processing voor grote catalogi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
