import { useEffect } from 'react'

import { useColorMode } from '@/hooks/useColorMode'

import { useThemeContext } from './hooks'

/**
 * Renderless component — mounts once inside <ChakraProvider> and keeps the
 * CSS custom properties on `document.documentElement` in sync with the active
 * Chakra colour mode.
 *
 * Place it as a direct child of <ChakraProvider> so it always has access to
 * the colour-mode context:
 *
 *   <ChakraProvider theme={theme}>
 *     <ThemeInjector />
 *     ...
 *   </ChakraProvider>
 *
 * Switching colour schemes is done in `src/themes/index.ts` — no changes are
 * needed here.
 */
export function ThemeInjector() {
  const { colorMode } = useColorMode()

  const { activeTheme } = useThemeContext()

  useEffect(() => {
    const tokens = activeTheme.cssVars[colorMode === 'dark' ? 'dark' : 'light']
    const root = document.documentElement

    for (const [property, value] of Object.entries(tokens) as [string, string][]) {
      root.style.setProperty(property, value)
    }
  }, [colorMode, activeTheme])

  // Also run once on mount with the initial colour mode captured above.
  // The effect dependency on `colorMode` already covers this, but an explicit
  // boot-time call ensures vars are present before the first paint even if
  // React batches the initial effect slightly late.
  // The effect dependency on `colorMode` and `activeTheme` already covers this
  // so this duplicate boot-time call is no longer strictly needed in the React flow.

  return null
}
