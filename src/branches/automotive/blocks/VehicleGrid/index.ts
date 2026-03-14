import type { Block } from 'payload'

export const VehicleGrid: Block = {
  slug: 'vehicle-grid',
  labels: {
    singular: 'Voertuigen Grid',
    plural: 'Voertuigen Grids',
  },
  interfaceName: 'VehicleGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Ons aanbod',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 24,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
      defaultValue: '3',
    },
    {
      name: 'fuelFilter',
      type: 'select',
      label: 'Filter op brandstof',
      options: [
        { label: 'Alle', value: 'alle' },
        { label: 'Benzine', value: 'benzine' },
        { label: 'Diesel', value: 'diesel' },
        { label: 'Elektrisch', value: 'elektrisch' },
        { label: 'Hybride', value: 'hybride' },
      ],
      defaultValue: 'alle',
    },
    {
      name: 'bodyTypeFilter',
      type: 'select',
      label: 'Filter op carrosserie',
      options: [
        { label: 'Alle', value: '' },
        { label: 'Sedan', value: 'sedan' },
        { label: 'Hatchback', value: 'hatchback' },
        { label: 'Stationwagen', value: 'stationwagen' },
        { label: 'SUV', value: 'suv' },
        { label: 'Cabrio', value: 'cabrio' },
        { label: 'Coup\u00e9', value: 'coupe' },
        { label: 'MPV', value: 'mpv' },
        { label: 'Bestelwagen', value: 'bestelwagen' },
      ],
      defaultValue: '',
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      label: 'Toon prijs',
      defaultValue: true,
    },
  ],
}

export default VehicleGrid
