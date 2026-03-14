import type { Block } from 'payload'

export const KnowledgeBasePreview: Block = {
  slug: 'knowledge-base-preview',
  labels: {
    singular: 'Kennisbank Preview',
    plural: 'Kennisbank Previews',
  },
  interfaceName: 'KnowledgeBasePreviewBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Koptekst',
      defaultValue: 'Kennisbank',
      admin: {
        description: 'Titel boven de kennisbank preview',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Aantal kennisbank-items om te tonen',
      },
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      label: 'Toon filters',
      defaultValue: false,
      admin: {
        description: 'Toon content-type filterknoppen (gids, e-learning, etc.)',
      },
    },
    {
      name: 'showStats',
      type: 'checkbox',
      label: 'Toon statistieken',
      defaultValue: true,
      admin: {
        description: 'Toon het aantal artikelen, premium content en totale leestijd',
      },
    },
  ],
}

export default KnowledgeBasePreview
