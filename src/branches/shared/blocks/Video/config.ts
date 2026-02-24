import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: {
    singular: 'Video Block',
    plural: 'Video Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Video Title (optional)',
      admin: {
        description: 'Optional heading displayed above the video',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          label: 'Video Source',
          defaultValue: 'youtube',
          required: true,
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Upload (Self-hosted)', value: 'upload' },
          ],
          admin: {
            width: '50%',
            description: 'Where the video is hosted',
          },
        },
        {
          name: 'aspectRatio',
          type: 'select',
          label: 'Aspect Ratio',
          defaultValue: '16-9',
          options: [
            { label: '16:9 (Standard)', value: '16-9' },
            { label: '4:3', value: '4-3' },
            { label: '1:1 (Square)', value: '1-1' },
            { label: '21:9 (Ultrawide)', value: '21-9' },
          ],
          admin: {
            width: '50%',
            description: 'Aspect ratio of the video player',
          },
        },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL',
      admin: {
        description: 'Full YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
        condition: (data, siblingData) => siblingData?.source === 'youtube',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'vimeoUrl',
      type: 'text',
      label: 'Vimeo URL',
      admin: {
        description: 'Full Vimeo video URL (e.g., https://vimeo.com/123456789)',
        condition: (data, siblingData) => siblingData?.source === 'vimeo',
        placeholder: 'https://vimeo.com/...',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Video File',
      admin: {
        description: 'Upload a video file (MP4 recommended for best browser compatibility)',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Poster Image (optional)',
      admin: {
        description: 'Thumbnail image shown before the video plays. Highly recommended for self-hosted videos.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption (optional)',
      admin: {
        description: 'Text displayed below the video',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Auto-play video when page loads (most browsers block autoplay with sound)',
          },
        },
        {
          name: 'controls',
          type: 'checkbox',
          label: 'Show Controls',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Display video player controls (play, pause, volume, etc.)',
          },
        },
      ],
    },
  ],
}
