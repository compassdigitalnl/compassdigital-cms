/**
 * RTE Variables Toolbar
 *
 * Adds a {{ }} button to the GrapesJS Rich Text Editor toolbar.
 * On click: shows a dropdown with all Listmonk template variables.
 * Selecting a variable inserts it at the cursor position.
 */

const LISTMONK_VARIABLES = [
  { label: 'Naam abonnee', value: '{{ .Subscriber.Name }}' },
  { label: 'E-mail abonnee', value: '{{ .Subscriber.Email }}' },
  { label: 'Abonnee UUID', value: '{{ .Subscriber.UUID }}' },
  { label: 'Campagne naam', value: '{{ .Campaign.Name }}' },
  { label: 'Campagne onderwerp', value: '{{ .Campaign.Subject }}' },
  { label: 'Uitschrijflink', value: '{{ .UnsubscribeURL }}' },
  { label: 'Aanmeldlink', value: '{{ .OptinURL }}' },
  { label: 'Bekijk in browser', value: '{{ .ArchiveURL }}' },
  { label: 'Huidige datum', value: '{{ .Date }}' },
  { label: 'Aangepast veld', value: '{{ .Subscriber.Attribs.custom_field }}' },
]

export function registerRteVariables(editor: any) {
  // Override the built-in RTE to add our custom button
  const rte = editor.RichTextEditor

  // Add the {{ }} button to the RTE toolbar
  rte.add('listmonk-variable', {
    icon: '<span style="font-family: monospace; font-weight: bold; font-size: 13px; letter-spacing: -1px;">{{ }}</span>',
    attributes: { title: 'Variabele invoegen' },
    result: (rteInstance: any) => {
      // Create dropdown container
      const existingDropdown = document.querySelector('.rte-variable-dropdown')
      if (existingDropdown) {
        existingDropdown.remove()
        return
      }

      const dropdown = document.createElement('div')
      dropdown.className = 'rte-variable-dropdown'

      // Header
      const header = document.createElement('div')
      header.className = 'rte-variable-dropdown__header'
      header.textContent = 'Variabele invoegen'
      dropdown.appendChild(header)

      // Variable list
      LISTMONK_VARIABLES.forEach((variable) => {
        const item = document.createElement('button')
        item.className = 'rte-variable-dropdown__item'
        item.type = 'button'

        const labelSpan = document.createElement('span')
        labelSpan.className = 'rte-variable-dropdown__label'
        labelSpan.textContent = variable.label

        const codeSpan = document.createElement('span')
        codeSpan.className = 'rte-variable-dropdown__code'
        codeSpan.textContent = variable.value

        item.appendChild(labelSpan)
        item.appendChild(codeSpan)

        item.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          rteInstance.insertHTML(variable.value)
          dropdown.remove()
        })

        dropdown.appendChild(item)
      })

      // Position the dropdown near the button
      const toolbar = document.querySelector('.gjs-rte-toolbar')
      if (toolbar) {
        toolbar.appendChild(dropdown)
      }

      // Close dropdown when clicking outside
      const closeHandler = (e: MouseEvent) => {
        if (!dropdown.contains(e.target as Node)) {
          dropdown.remove()
          document.removeEventListener('click', closeHandler, true)
        }
      }
      setTimeout(() => {
        document.addEventListener('click', closeHandler, true)
      }, 10)
    },
  })

  console.log('[RTE Variables] Registered Listmonk variable inserter')
}
