'use client'

import React, { useState } from 'react'
import { UserPortfolioCase } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Briefcase, Award, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  portfolioCases: UserPortfolioCase[]
  onChange: (cases: UserPortfolioCase[]) => void
}

export function WizardStepPortfolio({ portfolioCases, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCase, setNewCase] = useState<UserPortfolioCase>({
    projectName: '',
    client: '',
    industry: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: [],
    duration: '',
    imageUrl: '',
  })
  const [newTech, setNewTech] = useState('')

  const addCase = () => {
    if (newCase.projectName.trim() && newCase.client.trim() && newCase.description.trim()) {
      onChange([...portfolioCases, newCase])
      setNewCase({
        projectName: '',
        client: '',
        industry: '',
        description: '',
        challenge: '',
        solution: '',
        results: '',
        technologies: [],
        duration: '',
        imageUrl: '',
      })
      setIsAdding(false)
    }
  }

  const updateCase = (index: number, field: keyof UserPortfolioCase, value: any) => {
    const updated = portfolioCases.map((caseItem, i) =>
      i === index ? { ...caseItem, [field]: value } : caseItem,
    )
    onChange(updated)
  }

  const removeCase = (index: number) => {
    onChange(portfolioCases.filter((_, i) => i !== index))
  }

  const addTechnology = (index: number, tech: string) => {
    if (tech.trim()) {
      const currentCase = portfolioCases[index]
      const updatedTechs = [...(currentCase.technologies || []), tech.trim()]
      updateCase(index, 'technologies', updatedTechs)
    }
  }

  const removeTechnology = (caseIndex: number, techIndex: number) => {
    const currentCase = portfolioCases[caseIndex]
    const updatedTechs = currentCase.technologies?.filter((_, i) => i !== techIndex) || []
    updateCase(caseIndex, 'technologies', updatedTechs)
  }

  const addTechToNewCase = () => {
    if (newTech.trim()) {
      setNewCase({
        ...newCase,
        technologies: [...(newCase.technologies || []), newTech.trim()],
      })
      setNewTech('')
    }
  }

  const removeTechFromNewCase = (index: number) => {
    setNewCase({
      ...newCase,
      technologies: newCase.technologies?.filter((_, i) => i !== index) || [],
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Portfolio & Case Studies
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Laat je beste werk zien! AI genereert volledige case studies met resultaten en
          succesverhalen.
        </p>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {portfolioCases.map((caseItem, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`case-project-${index}`}>Project Naam *</Label>
                      <Input
                        id={`case-project-${index}`}
                        value={caseItem.projectName}
                        onChange={(e) => updateCase(index, 'projectName', e.target.value)}
                        placeholder="bijv. Website Redesign XYZ"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`case-client-${index}`}>Klant *</Label>
                      <Input
                        id={`case-client-${index}`}
                        value={caseItem.client}
                        onChange={(e) => updateCase(index, 'client', e.target.value)}
                        placeholder="bijv. ABC BV"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`case-industry-${index}`}>Industrie (optioneel)</Label>
                      <Input
                        id={`case-industry-${index}`}
                        value={caseItem.industry || ''}
                        onChange={(e) => updateCase(index, 'industry', e.target.value)}
                        placeholder="bijv. E-commerce, Healthcare"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`case-duration-${index}`}>Duur (optioneel)</Label>
                      <Input
                        id={`case-duration-${index}`}
                        value={caseItem.duration || ''}
                        onChange={(e) => updateCase(index, 'duration', e.target.value)}
                        placeholder="bijv. 3 maanden"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCase(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor={`case-desc-${index}`}>Beschrijving *</Label>
                <Textarea
                  id={`case-desc-${index}`}
                  value={caseItem.description}
                  onChange={(e) => updateCase(index, 'description', e.target.value)}
                  placeholder="Korte beschrijving van het project (1-2 zinnen)"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`case-challenge-${index}`}>Challenge (optioneel)</Label>
                  <Textarea
                    id={`case-challenge-${index}`}
                    value={caseItem.challenge || ''}
                    onChange={(e) => updateCase(index, 'challenge', e.target.value)}
                    placeholder="Wat was de uitdaging?"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`case-solution-${index}`}>Oplossing (optioneel)</Label>
                  <Textarea
                    id={`case-solution-${index}`}
                    value={caseItem.solution || ''}
                    onChange={(e) => updateCase(index, 'solution', e.target.value)}
                    placeholder="Hoe hebben jullie het opgelost?"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`case-results-${index}`}>Resultaten (optioneel)</Label>
                  <Textarea
                    id={`case-results-${index}`}
                    value={caseItem.results || ''}
                    onChange={(e) => updateCase(index, 'results', e.target.value)}
                    placeholder="Wat waren de resultaten?"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Technologieën (optioneel)</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {caseItem.technologies?.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tech}
                      <button
                        onClick={() => removeTechnology(index, techIndex)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Input
                    placeholder="Voeg technologie toe..."
                    className="w-40 h-7 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechnology(index, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`case-image-${index}`}>Afbeelding URL (optioneel)</Label>
                <Input
                  id={`case-image-${index}`}
                  value={caseItem.imageUrl || ''}
                  onChange={(e) => updateCase(index, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  💡 AI zal volledige case study artikelen genereren met professionele structuur,
                  impact metrics en succesverhalen
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Case */}
      {!isAdding && portfolioCases.length < 12 && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Voeg case study toe {portfolioCases.length > 0 && `(${portfolioCases.length}/12)`}
        </Button>
      )}

      {isAdding && (
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-lg">Nieuwe case study toevoegen</CardTitle>
            <CardDescription>Portfolio items zijn optioneel maar maken grote indruk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-case-project">Project Naam *</Label>
                <Input
                  id="new-case-project"
                  value={newCase.projectName}
                  onChange={(e) => setNewCase({ ...newCase, projectName: e.target.value })}
                  placeholder="bijv. Website Redesign"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-case-client">Klant *</Label>
                <Input
                  id="new-case-client"
                  value={newCase.client}
                  onChange={(e) => setNewCase({ ...newCase, client: e.target.value })}
                  placeholder="bijv. ABC BV"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-case-industry">Industrie (optioneel)</Label>
                <Input
                  id="new-case-industry"
                  value={newCase.industry}
                  onChange={(e) => setNewCase({ ...newCase, industry: e.target.value })}
                  placeholder="bijv. E-commerce"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-case-duration">Duur (optioneel)</Label>
                <Input
                  id="new-case-duration"
                  value={newCase.duration}
                  onChange={(e) => setNewCase({ ...newCase, duration: e.target.value })}
                  placeholder="bijv. 3 maanden"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-case-desc">Beschrijving *</Label>
              <Textarea
                id="new-case-desc"
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                placeholder="Korte beschrijving van het project"
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="new-case-challenge">Challenge (optioneel)</Label>
                <Textarea
                  id="new-case-challenge"
                  value={newCase.challenge}
                  onChange={(e) => setNewCase({ ...newCase, challenge: e.target.value })}
                  placeholder="Wat was de uitdaging?"
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-case-solution">Oplossing (optioneel)</Label>
                <Textarea
                  id="new-case-solution"
                  value={newCase.solution}
                  onChange={(e) => setNewCase({ ...newCase, solution: e.target.value })}
                  placeholder="Hoe hebben jullie het opgelost?"
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-case-results">Resultaten (optioneel)</Label>
                <Textarea
                  id="new-case-results"
                  value={newCase.results}
                  onChange={(e) => setNewCase({ ...newCase, results: e.target.value })}
                  placeholder="Wat waren de resultaten?"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Technologieën (optioneel)</Label>
              <div className="flex gap-2 mt-1 flex-wrap items-center">
                {newCase.technologies?.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tech}
                    <button
                      onClick={() => removeTechFromNewCase(techIndex)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="bijv. React, Next.js"
                    className="w-40 h-7 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechToNewCase()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addTechToNewCase}
                    className="h-7 px-2"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="new-case-image">Afbeelding URL (optioneel)</Label>
              <Input
                id="new-case-image"
                value={newCase.imageUrl}
                onChange={(e) => setNewCase({ ...newCase, imageUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addCase}
                disabled={
                  !newCase.projectName.trim() ||
                  !newCase.client.trim() ||
                  !newCase.description.trim()
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewCase({
                    projectName: '',
                    client: '',
                    industry: '',
                    description: '',
                    challenge: '',
                    solution: '',
                    results: '',
                    technologies: [],
                    duration: '',
                    imageUrl: '',
                  })
                  setNewTech('')
                }}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Message */}
      {portfolioCases.length === 0 && !isAdding && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-800">
              <strong>💼 Portfolio & Case Studies zijn optioneel</strong>
              <br />
              Heb je projecten waar je trots op bent? Voeg ze toe! AI genereert dan volledige case
              studies met:
            </p>
            <ul className="mt-2 text-sm text-purple-700 space-y-1 ml-4 list-disc">
              <li>Professionele project beschrijvingen</li>
              <li>Challenge-Solution-Results structuur</li>
              <li>Impact metrics en succesverhalen</li>
              <li>SEO-geoptimaliseerde content</li>
              <li>Visual showcase met afbeeldingen</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
