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
      defaults: [],
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
          name: 'Afmetingen',
          open: false,
          buildProps: ['width', 'min-height', 'padding'],
          properties: [
            {
              type: 'integer',
              name: 'Breedte',
              property: 'width',
              units: ['px', '%'],
              defaults: 'auto',
              min: 0,
            },
          ],
        },
        {
          name: 'Typografie',
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
            { name: 'Lettertype', property: 'font-family' },
            { name: 'Gewicht', property: 'font-weight' },
            { name: 'Tekstkleur', property: 'color' },
            {
              property: 'text-align',
              type: 'radio',
              defaults: 'left',
              list: [
                { value: 'left', name: 'Links', className: 'fa fa-align-left' },
                { value: 'center', name: 'Midden', className: 'fa fa-align-center' },
                { value: 'right', name: 'Rechts', className: 'fa fa-align-right' },
                { value: 'justify', name: 'Uitvullen', className: 'fa fa-align-justify' },
              ],
            },
          ],
        },
        {
          name: 'Decoratie',
          open: false,
          buildProps: [
            'background-color',
            'border-radius',
            'border',
            'box-shadow',
            'background',
          ],
          properties: [
            { name: 'Achtergrond', property: 'background-color' },
            {
              property: 'border-radius',
              properties: [
                { name: 'Boven', property: 'border-top-left-radius' },
                { name: 'Rechts', property: 'border-top-right-radius' },
                { name: 'Onder', property: 'border-bottom-right-radius' },
                { name: 'Links', property: 'border-bottom-left-radius' },
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
                { name: 'Eigenschap', property: 'transition-property' },
                { name: 'Duur', property: 'transition-duration' },
                { name: 'Verloop', property: 'transition-timing-function' },
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
      uploadText: 'Sleep bestanden hierheen of klik om te uploaden',
      addBtnText: 'Afbeelding toevoegen',
      modalTitle: 'Afbeelding selecteren',
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
          name: 'Mobiel liggend',
          width: '568px',
          widthMedia: '768px',
        },
        {
          id: 'mobilePortrait',
          name: 'Mobiel staand',
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
      appendTo: '.styles-container',
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
