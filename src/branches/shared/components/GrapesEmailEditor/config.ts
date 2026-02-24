/**
 * GrapesJS Configuration
 *
 * Base configuration for GrapesJS email editor
 * Optimized for email template creation
 */

export interface GrapesConfigOptions {
  container: HTMLElement
  height?: string
  width?: string
  readOnly?: boolean
}

export function getGrapesConfig(options: GrapesConfigOptions) {
  const { container, height = '600px', width = '100%', readOnly = false } = options

  return {
    // Container
    container,
    height,
    width,

    // Storage
    storageManager: {
      type: 'none', // We handle storage ourselves via Payload
    },

    // Panels
    panels: {
      defaults: [
        {
          id: 'layers',
          el: '.panel__right',
          // buttons: [...], // Defined by preset
        },
        {
          id: 'panel-switcher',
          el: '.panel__switcher',
          buttons: [
            {
              id: 'show-layers',
              active: true,
              label: 'Layers',
              command: 'show-layers',
              togglable: false,
            },
            {
              id: 'show-style',
              active: true,
              label: 'Styles',
              command: 'show-styles',
              togglable: false,
            },
            {
              id: 'show-traits',
              active: true,
              label: 'Settings',
              command: 'show-traits',
              togglable: false,
            },
            {
              id: 'show-blocks',
              active: true,
              label: 'Blocks',
              command: 'show-blocks',
              togglable: false,
            },
          ],
        },
      ],
    },

    // Block Manager
    blockManager: {
      appendTo: '#blocks',
      blocks: [], // Will be populated by custom blocks
    },

    // Layer Manager
    layerManager: {
      appendTo: '.layers-container',
    },

    // Style Manager
    styleManager: {
      appendTo: '.styles-container',
      sectors: [
        {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'min-height', 'padding'],
          properties: [
            {
              type: 'integer',
              name: 'Width',
              property: 'width',
              units: ['px', '%'],
              defaults: 'auto',
              min: 0,
            },
          ],
        },
        {
          name: 'Typography',
          open: false,
          buildProps: [
            'font-family',
            'font-size',
            'font-weight',
            'letter-spacing',
            'color',
            'line-height',
            'text-align',
          ],
          properties: [
            { name: 'Font', property: 'font-family' },
            { name: 'Weight', property: 'font-weight' },
            { name: 'Font color', property: 'color' },
            {
              property: 'text-align',
              type: 'radio',
              defaults: 'left',
              list: [
                { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' },
              ],
            },
          ],
        },
        {
          name: 'Decorations',
          open: false,
          buildProps: [
            'background-color',
            'border-radius',
            'border',
            'box-shadow',
            'background',
          ],
          properties: [
            { name: 'Background', property: 'background-color' },
            {
              property: 'border-radius',
              properties: [
                { name: 'Top', property: 'border-top-left-radius' },
                { name: 'Right', property: 'border-top-right-radius' },
                { name: 'Bottom', property: 'border-bottom-right-radius' },
                { name: 'Left', property: 'border-bottom-left-radius' },
              ],
            },
          ],
        },
        {
          name: 'Extra',
          open: false,
          buildProps: ['transition', 'perspective', 'transform'],
          properties: [
            {
              property: 'transition',
              properties: [
                { name: 'Property', property: 'transition-property' },
                { name: 'Duration', property: 'transition-duration' },
                { name: 'Easing', property: 'transition-timing-function' },
              ],
            },
          ],
        },
      ],
    },

    // Trait Manager (component settings)
    traitManager: {
      appendTo: '.traits-container',
    },

    // Asset Manager
    assetManager: {
      embedAsBase64: false,
      multiUpload: false,
      autoAdd: true,
      uploadText: 'Drop files here or click to upload',
      addBtnText: 'Add image',
      modalTitle: 'Select Image',
      // Custom upload endpoint would go here
      // upload: '/api/email/upload-asset',
    },

    // Canvas
    canvas: {
      styles: [
        // Reset styles for email compatibility
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      ],
      scripts: [],
    },

    // Device Manager (responsive preview)
    deviceManager: {
      devices: [
        {
          id: 'desktop',
          name: 'Desktop',
          width: '100%',
        },
        {
          id: 'tablet',
          name: 'Tablet',
          width: '768px',
          widthMedia: '992px',
        },
        {
          id: 'mobileLandscape',
          name: 'Mobile Landscape',
          width: '568px',
          widthMedia: '768px',
        },
        {
          id: 'mobilePortrait',
          name: 'Mobile Portrait',
          width: '320px',
          widthMedia: '480px',
        },
      ],
    },

    // Plugin options
    plugins: [
      // Newsletter preset loaded separately
    ],

    // Commands
    commands: {
      defaults: [
        // Custom commands will be added in GrapesEditorCore
      ],
    },

    // General
    noticeOnUnload: !readOnly,
    showOffsets: true,
    showOffsetsSelected: true,
    forceClass: false, // Don't force class names
    avoidInlineStyle: false, // Allow inline styles (needed for emails)
    undoManager: {
      trackSelection: false,
    },

    // Modal
    modal: {
      backdrop: true,
    },

    // Selectors
    selectorManager: {
      componentFirst: true,
      custom: false, // Disable custom classes (use inline styles for emails)
    },

    // Read-only mode
    ...(readOnly && {
      noticeOnUnload: false,
      showToolbar: false,
      commands: {
        defaults: [],
      },
    }),
  }
}
