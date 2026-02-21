'use client'

import React, { useState } from 'react'
import { UserTestimonial } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Button } from '@/branches/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { X, Plus, MessageSquare, Star } from 'lucide-react'

interface Props {
  testimonials: UserTestimonial[]
  onChange: (testimonials: UserTestimonial[]) => void
}

export function WizardStepTestimonials({ testimonials, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState<UserTestimonial>({
    name: '',
    role: '',
    company: '',
    quote: '',
    rating: 5,
  })

  const addTestimonial = () => {
    if (newTestimonial.name.trim() && newTestimonial.quote.trim()) {
      onChange([...testimonials, newTestimonial])
      setNewTestimonial({ name: '', role: '', company: '', quote: '', rating: 5 })
      setIsAdding(false)
    }
  }

  const updateTestimonial = (
    index: number,
    field: keyof UserTestimonial,
    value: string | number,
  ) => {
    const updated = testimonials.map((testimonial, i) =>
      i === index ? { ...testimonial, [field]: value } : testimonial,
    )
    onChange(updated)
  }

  const removeTestimonial = (index: number) => {
    onChange(testimonials.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Testimonials & Reviews
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Voeg echte testimonials toe van tevreden klanten. Als je er nog geen hebt, kan AI
          realistische voorbeelden genereren.
        </p>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`testimonial-name-${index}`}>Naam *</Label>
                      <Input
                        id={`testimonial-name-${index}`}
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        placeholder="bijv. Jan Jansen"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`testimonial-role-${index}`}>Functie (optioneel)</Label>
                      <Input
                        id={`testimonial-role-${index}`}
                        value={testimonial.role || ''}
                        onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                        placeholder="bijv. CEO, Marketing Manager"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`testimonial-company-${index}`}>Bedrijf (optioneel)</Label>
                    <Input
                      id={`testimonial-company-${index}`}
                      value={testimonial.company || ''}
                      onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                      placeholder="bijv. ABC BV"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`testimonial-rating-${index}`}>Rating</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateTestimonial(index, 'rating', star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (testimonial.rating || 5)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {testimonial.rating || 5} sterren
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Label htmlFor={`testimonial-quote-${index}`}>Review tekst *</Label>
              <Textarea
                id={`testimonial-quote-${index}`}
                value={testimonial.quote}
                onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                placeholder="Wat zei de klant over jouw diensten? Bijv: 'Uitstekende service, zeer tevreden!'"
                rows={3}
                className="mt-1"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Testimonial */}
      {!isAdding && testimonials.length < 10 && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Voeg testimonial toe {testimonials.length > 0 && `(${testimonials.length}/10)`}
        </Button>
      )}

      {isAdding && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Nieuwe testimonial toevoegen</CardTitle>
            <CardDescription>Testimonials zijn optioneel maar verhogen vertrouwen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-testimonial-name">Naam *</Label>
                <Input
                  id="new-testimonial-name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="bijv. Jan Jansen"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-testimonial-role">Functie (optioneel)</Label>
                <Input
                  id="new-testimonial-role"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  placeholder="bijv. CEO"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-testimonial-company">Bedrijf (optioneel)</Label>
              <Input
                id="new-testimonial-company"
                value={newTestimonial.company}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                placeholder="bijv. ABC BV"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-testimonial-rating">Rating</Label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (newTestimonial.rating || 5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {newTestimonial.rating || 5} sterren
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="new-testimonial-quote">Review tekst *</Label>
              <Textarea
                id="new-testimonial-quote"
                value={newTestimonial.quote}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                placeholder="Wat zei de klant?"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addTestimonial}
                disabled={!newTestimonial.name.trim() || !newTestimonial.quote.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewTestimonial({ name: '', role: '', company: '', quote: '', rating: 5 })
                }}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Message */}
      {testimonials.length === 0 && !isAdding && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Testimonials zijn optioneel</strong>
              <br />
              Heb je al testimonials van tevreden klanten? Voeg ze toe! Als je er nog geen hebt,
              kan AI realistische voorbeelden genereren voor demo-doeleinden.
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
              <li>Verhoogt vertrouwen en geloofwaardigheid</li>
              <li>Social proof voor potentiële klanten</li>
              <li>AI kan voorbeelden genereren als je er nog geen hebt</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
