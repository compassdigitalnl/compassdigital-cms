import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideContentCollection } from '@/lib/tenant/shouldHideCollection'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'
import { bookingStatusHook } from '@/branches/shared/hooks/bookingStatusHook'
import { reservationStatusHook } from '@/branches/shared/hooks/reservationStatusHook'
import { viewingStatusHook } from '@/branches/shared/hooks/viewingStatusHook'

/**
 * Content Bookings — Unified collection
 *
 * Vervangt: beautyBookings, appointments, reservations
 * Alle boekingen en reserveringen in één collection.
 */
export const ContentBookings: CollectionConfig = {
  slug: 'content-bookings',
  labels: {
    singular: 'Boeking',
    plural: 'Boekingen',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'branch', 'date', 'status'],
    hidden: shouldHideContentCollection('content-bookings'),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Public form submission
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.branch) {
          data.branch = getCachedSiteBranch()
        }
        return data
      },
    ],
    afterChange: [
      bookingStatusHook,
      reservationStatusHook,
      viewingStatusHook,
    ],
  },
  fields: [
    // ─── SIDEBAR ───────────────────────────────────────────
    {
      name: 'branch',
      type: 'select',
      required: true,
      label: 'Branche',
      options: branchOptions,
      defaultValue: () => getCachedSiteBranch(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'Bevestigd', value: 'confirmed' },
        { label: 'Afgerond', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
        { label: 'No-show', value: 'no-show' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Klantgegevens ──
        {
          label: 'Klantgegevens',
          fields: [
            { name: 'firstName', type: 'text', required: true, label: 'Voornaam' },
            { name: 'lastName', type: 'text', required: true, label: 'Achternaam' },
            { name: 'email', type: 'email', required: true, label: 'E-mail' },
            { name: 'phone', type: 'text', required: true, label: 'Telefoon' },
            // Zorg-specifiek
            {
              name: 'birthDate',
              type: 'date',
              label: 'Geboortedatum',
              admin: {
                condition: (_, s) => s?.branch === 'zorg',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
            {
              name: 'insuranceProvider',
              type: 'select',
              label: 'Zorgverzekeraar',
              admin: { condition: (_, s) => s?.branch === 'zorg' },
              options: [
                { label: 'Zilveren Kruis', value: 'zilveren-kruis' },
                { label: 'CZ', value: 'cz' },
                { label: 'VGZ', value: 'vgz' },
                { label: 'Menzis', value: 'menzis' },
                { label: 'ONVZ', value: 'onvz' },
                { label: 'ASR', value: 'asr' },
                { label: 'Anders', value: 'other' },
              ],
            },
          ],
        },

        // ── TAB 2: Boeking ──
        {
          label: 'Boeking',
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
              label: 'Datum',
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
            {
              name: 'time',
              type: 'text',
              label: 'Tijd',
              admin: { placeholder: '14:00' },
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'content-services',
              label: 'Dienst / Behandeling',
            },
            {
              name: 'staffMember',
              type: 'relationship',
              relationTo: 'content-team',
              label: 'Medewerker',
            },
            { name: 'remarks', type: 'textarea', label: 'Opmerkingen' },
            // Beauty-specifiek
            {
              name: 'isFirstVisit',
              type: 'checkbox',
              label: 'Eerste bezoek',
              admin: { condition: (_, s) => s?.branch === 'beauty' },
            },
            // Zorg-specifiek
            {
              name: 'complaint',
              type: 'textarea',
              label: 'Klacht / Reden bezoek',
              admin: { condition: (_, s) => s?.branch === 'zorg' },
            },
            {
              name: 'hasReferral',
              type: 'select',
              label: 'Verwijzing',
              admin: { condition: (_, s) => s?.branch === 'zorg' },
              options: [
                { label: 'Geen', value: 'no' },
                { label: 'Huisarts', value: 'gp' },
                { label: 'Specialist', value: 'specialist' },
              ],
            },
            // Horeca-specifiek
            {
              name: 'guests',
              type: 'number',
              label: 'Aantal gasten',
              min: 1,
              max: 20,
              admin: { condition: (_, s) => s?.branch === 'horeca' },
            },
            {
              name: 'preferences',
              type: 'select',
              hasMany: true,
              label: 'Voorkeuren',
              admin: { condition: (_, s) => s?.branch === 'horeca' },
              options: [
                { label: 'Raam', value: 'window' },
                { label: 'Terras', value: 'terrace' },
                { label: 'Binnen', value: 'inside' },
                { label: 'Rustig', value: 'quiet' },
                { label: 'Bar', value: 'bar' },
              ],
            },
            {
              name: 'occasion',
              type: 'select',
              label: 'Gelegenheid',
              admin: { condition: (_, s) => s?.branch === 'horeca' },
              options: [
                { label: 'Regulier', value: 'regular' },
                { label: 'Verjaardag', value: 'birthday' },
                { label: 'Jubileum', value: 'anniversary' },
                { label: 'Zakelijk', value: 'business' },
                { label: 'Romantisch', value: 'romantic' },
                { label: 'Groep', value: 'group' },
                { label: 'Anders', value: 'other' },
              ],
            },
            {
              name: 'assignedTable',
              type: 'text',
              label: 'Toegewezen tafel',
              admin: { condition: (_, s) => s?.branch === 'horeca' },
            },
            // Automotive-specifiek
            {
              name: 'licensePlate',
              type: 'text',
              label: 'Kenteken',
              admin: { condition: (_, s) => s?.branch === 'automotive' },
            },
            {
              name: 'vehicleBrand',
              type: 'text',
              label: 'Merk',
              admin: { condition: (_, s) => s?.branch === 'automotive' },
            },
            {
              name: 'vehicleModel',
              type: 'text',
              label: 'Model',
              admin: { condition: (_, s) => s?.branch === 'automotive' },
            },
            // Toerisme-specifiek (relationship fields removed — collections not yet committed)
            {
              name: 'departureDate',
              type: 'date',
              label: 'Vertrekdatum',
              admin: {
                condition: (_, s) => s?.branch === 'toerisme',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
            {
              name: 'returnDate',
              type: 'date',
              label: 'Retourdatum',
              admin: {
                condition: (_, s) => s?.branch === 'toerisme',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
            {
              name: 'travelers',
              type: 'number',
              label: 'Aantal reizigers',
              min: 1,
              admin: { condition: (_, s) => s?.branch === 'toerisme' },
            },
            {
              name: 'travelInsurance',
              type: 'checkbox',
              label: 'Reisverzekering',
              admin: { condition: (_, s) => s?.branch === 'toerisme' },
            },
            // Vastgoed-specifiek
            {
              name: 'property',
              type: 'relationship',
              relationTo: 'properties',
              label: 'Gekoppelde woning',
              admin: { condition: (_, s) => s?.branch === 'vastgoed' },
            },
            {
              name: 'viewingType',
              type: 'select',
              label: 'Type bezichtiging',
              options: [
                { label: 'Fysiek', value: 'fysiek' },
                { label: 'Online', value: 'online' },
              ],
              admin: { condition: (_, s) => s?.branch === 'vastgoed' },
            },
            {
              name: 'preferredDate',
              type: 'date',
              label: 'Gewenste datum',
              admin: {
                condition: (_, s) => s?.branch === 'vastgoed',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
            {
              name: 'preferredTime',
              type: 'text',
              label: 'Gewenst tijdstip',
              admin: {
                condition: (_, s) => s?.branch === 'vastgoed',
                placeholder: '14:00',
              },
            },
            {
              name: 'isValuation',
              type: 'checkbox',
              label: 'Waardebepaling (i.p.v. bezichtiging)',
              defaultValue: false,
              admin: { condition: (_, s) => s?.branch === 'vastgoed' },
            },
            {
              name: 'propertyAddress',
              type: 'text',
              label: 'Adres (voor waardebepaling)',
              admin: {
                condition: (_, s) => s?.branch === 'vastgoed',
                description: 'Adres wanneer er geen gekoppelde woning is',
              },
            },
            {
              name: 'propertyType',
              type: 'select',
              label: 'Woningtype (voor waardebepaling)',
              options: [
                { label: 'Appartement', value: 'appartement' },
                { label: 'Woonhuis', value: 'woonhuis' },
                { label: 'Villa', value: 'villa' },
                { label: 'Penthouse', value: 'penthouse' },
              ],
              admin: { condition: (_, s) => s?.branch === 'vastgoed' },
            },
            {
              name: 'propertyArea',
              type: 'number',
              label: 'Oppervlakte (m²)',
              admin: { condition: (_, s) => s?.branch === 'vastgoed' },
            },
          ],
        },

        // ── TAB 3: Administratie ──
        {
          label: 'Administratie',
          fields: [
            { name: 'notes', type: 'textarea', label: 'Interne notities' },
            { name: 'confirmationSent', type: 'checkbox', label: 'Bevestiging verstuurd', defaultValue: false },
            { name: 'reminderSent', type: 'checkbox', label: 'Herinnering verstuurd', defaultValue: false },
          ],
        },
      ],
    },
  ],
}
