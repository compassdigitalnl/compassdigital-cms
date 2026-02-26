import type { Block } from 'payload'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Team Block',
    plural: 'Team Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          admin: {
            width: '50%',
            description: 'Small overline text above main title (optional)',
            placeholder: 'Meet the Team',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          admin: {
            width: '50%',
            description: 'Main section heading (optional)',
            placeholder: 'Our Leadership Team',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Brief introduction to the team (optional, 1-2 sentences)',
        placeholder: 'Experienced professionals dedicated to delivering excellence.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: 'Grid Columns',
          defaultValue: '3',
          required: true,
          options: [
            {
              label: '2 Columns (Best for detailed bios)',
              value: '2',
            },
            {
              label: '3 Columns (Recommended)',
              value: '3',
            },
            {
              label: '4 Columns (Compact grid)',
              value: '4',
            },
          ],
          admin: {
            width: '50%',
            description: 'Number of team members per row on desktop',
          },
        },
        {
          name: 'photoStyle',
          type: 'select',
          label: 'Photo Style',
          defaultValue: 'square',
          options: [
            {
              label: 'Square (Modern, professional)',
              value: 'square',
            },
            {
              label: 'Circle (Friendly, approachable)',
              value: 'circle',
            },
          ],
          admin: {
            width: '50%',
            description: 'Shape of team member photos',
          },
        },
      ],
    },
    {
      name: 'members',
      type: 'array',
      label: 'Team Members',
      minRows: 2,
      maxRows: 20,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Profile Photo',
          admin: {
            description:
              'Team member headshot (recommended: square aspect ratio, 500x500px minimum for best quality)',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Full Name',
              required: true,
              admin: {
                width: '50%',
                placeholder: 'John Doe',
              },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Job Title / Role',
              required: true,
              admin: {
                width: '50%',
                placeholder: 'CEO & Founder',
              },
            },
          ],
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Bio',
          admin: {
            description:
              'Short biography (2-3 sentences). Highlight expertise, experience, or achievements.',
            placeholder:
              '20+ years of experience in e-commerce and digital transformation. Previously led growth at Fortune 500 companies.',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            description: 'Contact email (optional). Will be displayed as a clickable mailto: link.',
            placeholder: 'john@company.com',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
              admin: {
                width: '33.33%',
                description: 'Full LinkedIn profile URL',
                placeholder: 'https://linkedin.com/in/username',
              },
              validate: (val: any) => {
                if (!val) return true
                if (val.includes('linkedin.com')) return true
                return 'Must be a LinkedIn URL'
              },
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X URL',
              admin: {
                width: '33.33%',
                description: 'Full Twitter/X profile URL',
                placeholder: 'https://twitter.com/username',
              },
              validate: (val: any) => {
                if (!val) return true
                if (val.includes('twitter.com') || val.includes('x.com')) return true
                return 'Must be a Twitter/X URL'
              },
            },
            {
              name: 'github',
              type: 'text',
              label: 'GitHub URL',
              admin: {
                width: '33.33%',
                description: 'Full GitHub profile URL',
                placeholder: 'https://github.com/username',
              },
              validate: (val: any) => {
                if (!val) return true
                if (val.includes('github.com')) return true
                return 'Must be a GitHub URL'
              },
            },
          ],
        },
      ],
      admin: {
        description:
          'Add 2-20 team members. Each member has a photo, name, role, bio, email, and optional social links.',
        initCollapsed: true,
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'bg',
      options: [
        { label: 'White (theme.colors.white)', value: 'white' },
        { label: 'Light Background (theme.colors.bg)', value: 'bg' },
        { label: 'Light Grey (theme.colors.grey)', value: 'grey' },
      ],
      admin: {
        description:
          'Background color from Theme global. Light backgrounds work best for team sections.',
      },
    },
  ],
}
