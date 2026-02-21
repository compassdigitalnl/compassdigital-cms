'use client'

import React from 'react'
import { ContactInfo } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'

interface Props {
  contactInfo: ContactInfo | undefined
  onChange: (contactInfo: ContactInfo) => void
}

export function WizardStepContact({ contactInfo, onChange }: Props) {
  const data = contactInfo || {
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
    },
    openingHours: '',
    formConfig: {
      enableNameField: true,
      enablePhoneField: true,
      enableCompanyField: false,
      enableSubjectField: true,
      requirePhoneField: false,
      requireCompanyField: false,
      notificationEmail: '',
      confirmationMessage: '',
    },
  }

  const updateField = (field: keyof ContactInfo, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const updateAddress = (field: string, value: string) => {
    onChange({
      ...data,
      address: {
        ...data.address,
        [field]: value,
      },
    })
  }

  const updateSocialMedia = (field: string, value: string) => {
    onChange({
      ...data,
      socialMedia: {
        ...data.socialMedia,
        [field]: value,
      },
    })
  }

  const updateFormConfig = (field: string, value: any) => {
    onChange({
      ...data,
      formConfig: {
        ...data.formConfig!,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Phone className="w-6 h-6 text-blue-600" />
          Contact Informatie
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Vul je contactgegevens in en configureer het contactformulier voor je website.
        </p>
      </div>

      {/* Basic Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basis Contactgegevens *</CardTitle>
          <CardDescription>Deze informatie wordt getoond op je contactpagina</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="info@bedrijf.nl"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefoon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+31 6 12345678"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="openingHours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Openingstijden (optioneel)
            </Label>
            <Textarea
              id="openingHours"
              value={data.openingHours}
              onChange={(e) => updateField('openingHours', e.target.value)}
              placeholder="Ma-Vr: 9:00 - 17:00&#10;Za: 10:00 - 14:00&#10;Zo: Gesloten"
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Adres (optioneel)
          </CardTitle>
          <CardDescription>Bedrijfsadres voor op je contactpagina en Google Maps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Straat + Huisnummer</Label>
            <Input
              id="street"
              value={data.address?.street}
              onChange={(e) => updateAddress('street', e.target.value)}
              placeholder="Hoofdstraat 123"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="postalCode">Postcode</Label>
              <Input
                id="postalCode"
                value={data.address?.postalCode}
                onChange={(e) => updateAddress('postalCode', e.target.value)}
                placeholder="1234 AB"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">Plaats</Label>
              <Input
                id="city"
                value={data.address?.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                placeholder="Amsterdam"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={data.address?.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                placeholder="Nederland"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Media (optioneel)</CardTitle>
          <CardDescription>Voeg links naar je social media profielen toe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              value={data.socialMedia?.facebook}
              onChange={(e) => updateSocialMedia('facebook', e.target.value)}
              placeholder="https://facebook.com/jouwbedrijf"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4 text-sky-500" />
              Twitter / X
            </Label>
            <Input
              id="twitter"
              value={data.socialMedia?.twitter}
              onChange={(e) => updateSocialMedia('twitter', e.target.value)}
              placeholder="https://twitter.com/jouwbedrijf"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={data.socialMedia?.linkedin}
              onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/jouwbedrijf"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              Instagram
            </Label>
            <Input
              id="instagram"
              value={data.socialMedia?.instagram}
              onChange={(e) => updateSocialMedia('instagram', e.target.value)}
              placeholder="https://instagram.com/jouwbedrijf"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
            </Label>
            <Input
              id="youtube"
              value={data.socialMedia?.youtube}
              onChange={(e) => updateSocialMedia('youtube', e.target.value)}
              placeholder="https://youtube.com/@jouwbedrijf"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Configuration */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-lg">Contactformulier Configuratie</CardTitle>
          <CardDescription>
            Stel in welke velden je wilt tonen in het contactformulier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notificationEmail">
              Email voor notificaties *
            </Label>
            <Input
              id="notificationEmail"
              type="email"
              value={data.formConfig?.notificationEmail}
              onChange={(e) => updateFormConfig('notificationEmail', e.target.value)}
              placeholder="formulieren@bedrijf.nl"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Formulier inzendingen worden naar dit emailadres gestuurd
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label className="text-sm font-semibold">Formuliervelden</Label>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Checkbox
                  id="enablePhoneField"
                  checked={data.formConfig?.enablePhoneField}
                  onCheckedChange={(checked) => updateFormConfig('enablePhoneField', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="enablePhoneField" className="cursor-pointer font-normal">
                    Telefoonnummer veld
                  </Label>
                </div>
                {data.formConfig?.enablePhoneField && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requirePhoneField"
                      checked={data.formConfig?.requirePhoneField}
                      onCheckedChange={(checked) => updateFormConfig('requirePhoneField', checked)}
                    />
                    <Label htmlFor="requirePhoneField" className="cursor-pointer text-xs">
                      Verplicht
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Checkbox
                  id="enableCompanyField"
                  checked={data.formConfig?.enableCompanyField}
                  onCheckedChange={(checked) => updateFormConfig('enableCompanyField', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="enableCompanyField" className="cursor-pointer font-normal">
                    Bedrijfsnaam veld
                  </Label>
                </div>
                {data.formConfig?.enableCompanyField && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requireCompanyField"
                      checked={data.formConfig?.requireCompanyField}
                      onCheckedChange={(checked) => updateFormConfig('requireCompanyField', checked)}
                    />
                    <Label htmlFor="requireCompanyField" className="cursor-pointer text-xs">
                      Verplicht
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Checkbox
                  id="enableSubjectField"
                  checked={data.formConfig?.enableSubjectField}
                  onCheckedChange={(checked) => updateFormConfig('enableSubjectField', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="enableSubjectField" className="cursor-pointer font-normal">
                    Onderwerp veld
                  </Label>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Naam, email en bericht velden zijn altijd verplicht en kunnen niet worden
              uitgeschakeld
            </p>
          </div>

          <div>
            <Label htmlFor="confirmationMessage">
              Bevestigingsbericht (optioneel)
            </Label>
            <Textarea
              id="confirmationMessage"
              value={data.formConfig?.confirmationMessage}
              onChange={(e) => updateFormConfig('confirmationMessage', e.target.value)}
              placeholder="Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op."
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Dit bericht wordt getoond na het versturen van het formulier
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Message */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>💡 AI Verrijking</strong>
            <br />
            Op basis van deze informatie genereert AI:
          </p>
          <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
            <li>Professionele contactpagina content</li>
            <li>Geoptimaliseerde formulier labels en placeholders</li>
            <li>Gebruiksvriendelijke error messages</li>
            <li>SEO-geoptimaliseerde contact content</li>
            <li>Embedded Google Maps (als adres is opgegeven)</li>
            <li>Social media integratie</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
