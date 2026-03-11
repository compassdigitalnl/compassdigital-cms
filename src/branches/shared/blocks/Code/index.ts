import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-11 - Code Block Configuration
 *
 * Code display block with syntax highlighting, line numbers,
 * optional filename header, and copy-to-clipboard button.
 */

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  labels: {
    singular: 'Code',
    plural: 'Code',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'code',
              type: 'textarea',
              label: 'Code',
              required: true,
              admin: {
                description: 'Plak of typ de code hier',
                rows: 12,
              },
            },
            {
              name: 'language',
              type: 'select',
              label: 'Programmeertaal',
              defaultValue: 'javascript',
              options: [
                { label: 'JavaScript', value: 'javascript' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'PHP', value: 'php' },
                { label: 'Python', value: 'python' },
                { label: 'Bash / Shell', value: 'bash' },
                { label: 'JSON', value: 'json' },
                { label: 'SQL', value: 'sql' },
              ],
              admin: {
                description: 'Taal voor syntax highlighting',
              },
            },
            {
              name: 'filename',
              type: 'text',
              label: 'Bestandsnaam',
              admin: {
                description: 'Optionele bestandsnaam boven het codeblok (bijv. "src/index.ts")',
                placeholder: 'src/components/Button.tsx',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'showLineNumbers',
              type: 'checkbox',
              label: 'Regelnummers tonen',
              defaultValue: true,
              admin: {
                description: 'Toon regelnummers links van de code',
              },
            },
            {
              name: 'showCopyButton',
              type: 'checkbox',
              label: 'Kopieerknop tonen',
              defaultValue: true,
              admin: {
                description: 'Toon een kopieerknop rechtsboven',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
