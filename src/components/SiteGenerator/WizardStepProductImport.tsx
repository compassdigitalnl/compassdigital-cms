'use client'

import React, { useState, useMemo } from 'react'
import { EcommerceSettings } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Zap,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProductTemplateGenerator } from '@/lib/siteGenerator/productTemplateGenerator'

interface Props {
  ecommerceSettings: EcommerceSettings
}

export function WizardStepProductImport({ ecommerceSettings }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<'basis' | 'advanced' | 'enterprise'>(
    'enterprise',
  )

  // Generate template info
  const templateGenerator = useMemo(
    () => new ProductTemplateGenerator(ecommerceSettings, selectedTemplate),
    [ecommerceSettings, selectedTemplate],
  )

  const columnCount = templateGenerator.getTotalColumnCount()
  const requiredColumns = templateGenerator.getRequiredColumns().length
  const categories = templateGenerator.getColumnCategories()

  const handleDownloadTemplate = () => {
    // Generate CSV content
    const headers = templateGenerator.getCSVHeaders()
    const exampleRow = templateGenerator.getCSVExampleRow()

    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n')

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const filename = `product-template-${selectedTemplate}-${ecommerceSettings.shopType}-${Date.now()}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const templateOptions = [
    {
      type: 'basis' as const,
      name: 'Basis Template',
      description: 'Essentiele product velden voor een simpele webshop',
      columnCount: 25,
      recommended: ecommerceSettings.shopType === 'B2C',
      features: [
        'Basis product informatie',
        'Simpele prijzen',
        'Voorraad management',
        'Basis media (1-2 afbeeldingen)',
      ],
    },
    {
      type: 'advanced' as const,
      name: 'Advanced Template',
      description: 'Uitgebreid met SEO, media en meer opties',
      columnCount: 45,
      recommended: false,
      features: [
        'Alles van Basis',
        'SEO optimalisatie velden',
        'Meerdere afbeeldingen (5x)',
        'Verzend informatie',
        'Product attributen',
      ],
    },
    {
      type: 'enterprise' as const,
      name: 'Enterprise Template',
      description: 'Complete feature set met variants en custom pricing',
      columnCount: columnCount,
      recommended: ecommerceSettings.shopType === 'B2B' || ecommerceSettings.shopType === 'Hybrid',
      features: [
        'Alles van Advanced',
        'Product variants (kleur, maat, etc.)',
        'Volume pricing / Bulk discounts',
        `Custom rol pricing (${ecommerceSettings.customRoles.length} rollen)`,
        'Uitgebreide specificaties',
      ],
    },
  ]

  const selectedTemplateInfo = templateOptions.find((t) => t.type === selectedTemplate)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-green-600" />
          Product Import
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Download een product template, vul je producten in, en upload deze voor AI-verificatie.
        </p>
      </div>

      {/* Configuration Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-sm">
                Je E-commerce Configuratie
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-800">
                <div>
                  <strong>Shop Type:</strong> {ecommerceSettings.shopType}
                </div>
                <div>
                  <strong>Pricing:</strong> {ecommerceSettings.pricingStrategy}
                </div>
                {ecommerceSettings.customRoles.length > 0 && (
                  <div className="col-span-2">
                    <strong>Custom Roles:</strong>{' '}
                    {ecommerceSettings.customRoles.map((r) => r.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="text-lg">1. Selecteer Template Type</CardTitle>
          <CardDescription>
            Kies het template dat past bij jouw behoeften. Meer velden = meer controle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templateOptions.map((template) => {
            const isSelected = selectedTemplate === template.type
            return (
              <div
                key={template.type}
                onClick={() => setSelectedTemplate(template.type)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      {template.recommended && (
                        <Badge variant="default" className="text-xs">
                          Aanbevolen
                        </Badge>
                      )}
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Geselecteerd
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📊 {template.columnCount} kolommen</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {template.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 flex items-start gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Template Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Template Details - {selectedTemplateInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{columnCount}</div>
              <div className="text-xs text-gray-600 mt-1">Totaal Kolommen</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-900">{requiredColumns}</div>
              <div className="text-xs text-gray-600 mt-1">Verplichte Velden</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-900">{categories.length}</div>
              <div className="text-xs text-gray-600 mt-1">Categorieën</div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Veld Categorieën:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => {
                const count = templateGenerator.getColumnsByCategory(category as any).length
                return (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category} ({count})
                  </Badge>
                )
              })}
            </div>
          </div>

          {ecommerceSettings.customRoles.length > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-purple-800">
                  <strong>Custom Pricing Kolommen Toegevoegd!</strong>
                  <br />
                  Template bevat {ecommerceSettings.customRoles.length} extra pricing kolommen voor
                  je custom rollen:{' '}
                  <span className="font-mono">
                    {ecommerceSettings.customRoles.map((r) => r.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Template */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="text-lg">2. Download Template</CardTitle>
          <CardDescription>
            Download de CSV template en vul je producten in Excel, Google Sheets, of Numbers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleDownloadTemplate} size="lg" className="w-full">
            <Download className="w-5 h-5 mr-2" />
            Download {selectedTemplateInfo.name} (.CSV)
          </Button>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">📋 Instructies:</h4>
            <ol className="text-xs text-gray-700 space-y-1 ml-4 list-decimal">
              <li>Download de template en open deze in Excel, Google Sheets, of Numbers</li>
              <li>Regel 1 bevat de kolomnamen (niet aanpassen!)</li>
              <li>Regel 2 bevat voorbeelddata (kan je verwijderen)</li>
              <li>
                Vul je producten in, één product per regel (verplichte velden: SKU, Naam,
                Categorie, Prijs, Status)
              </li>
              <li>Sla op als .CSV formaat</li>
              <li>Upload hieronder voor AI-verificatie</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Upload (Placeholder for now) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Upload Producten</CardTitle>
          <CardDescription>
            Upload je ingevulde CSV voor AI-verificatie en import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Sleep je CSV hier of klik om te uploaden
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Max 10MB • Ondersteunt .CSV en .XLSX formaten
            </p>
            <Button variant="outline" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Selecteer Bestand
            </Button>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  <strong>Coming Soon!</strong> Upload functionaliteit wordt in de volgende versie
                  toegevoegd. Voor nu: download de template en bewaar je producten lokaal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Verification Info */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900">AI Verificatie & Enrichment</h3>
              <p className="text-sm text-purple-700 mt-1">
                Wanneer je producten uploadt, voert AI automatisch de volgende controles uit:
              </p>
              <ul className="mt-2 text-sm text-purple-700 space-y-1 ml-4 list-disc">
                <li>
                  <strong>Data validatie</strong>: Controleert verplichte velden, formaten, en
                  datatypes
                </li>
                <li>
                  <strong>Prijzen check</strong>: Valideert prijzen, marges, en role-based pricing
                </li>
                <li>
                  <strong>SEO optimalisatie</strong>: Genereert meta titles, descriptions, en slugs
                </li>
                <li>
                  <strong>Content enrichment</strong>: Verbetert beschrijvingen met SEO keywords
                </li>
                <li>
                  <strong>Image verificatie</strong>: Controleert of image URLs werken
                </li>
                <li>
                  <strong>Categorie matching</strong>: Matcht producten aan juiste categorieën
                </li>
              </ul>
              <p className="text-xs text-purple-600 mt-2">
                Verwerking gebeurt op de achtergrond, je kunt de wizard afsluiten tijdens import.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
