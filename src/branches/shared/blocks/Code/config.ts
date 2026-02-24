import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'language',
          type: 'select',
          label: 'Language',
          defaultValue: 'typescript',
          required: true,
          options: [
            { label: 'TypeScript', value: 'typescript' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'Python', value: 'python' },
            { label: 'Java', value: 'java' },
            { label: 'C#', value: 'csharp' },
            { label: 'Go', value: 'go' },
            { label: 'Rust', value: 'rust' },
            { label: 'PHP', value: 'php' },
            { label: 'Ruby', value: 'ruby' },
            { label: 'Swift', value: 'swift' },
            { label: 'Kotlin', value: 'kotlin' },
            { label: 'HTML', value: 'html' },
            { label: 'CSS', value: 'css' },
            { label: 'SQL', value: 'sql' },
            { label: 'Bash/Shell', value: 'bash' },
            { label: 'JSON', value: 'json' },
            { label: 'YAML', value: 'yaml' },
            { label: 'Markdown', value: 'markdown' },
            { label: 'Plain Text', value: 'plaintext' },
          ],
          admin: {
            width: '50%',
            description: 'Programming language for syntax highlighting',
          },
        },
        {
          name: 'showLineNumbers',
          type: 'checkbox',
          label: 'Show Line Numbers',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Display line numbers in the code block',
          },
        },
      ],
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Filename (optional)',
      admin: {
        description: 'Display a filename/path above the code (e.g., "src/components/Button.tsx")',
      },
    },
    {
      name: 'code',
      type: 'code',
      label: 'Code',
      required: true,
      admin: {
        description: 'Paste or type your code here. It will be syntax highlighted on the frontend.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption (optional)',
      admin: {
        description: 'Optional explanation or context displayed below the code block',
      },
    },
  ],
}
