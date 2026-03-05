import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const theme = await getCachedGlobal('theme', 1)()
  const settings = await getCachedGlobal('settings', 1)()

  return <HeaderClient header={header} theme={theme} settings={settings} />
}
