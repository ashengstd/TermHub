import type { ReactNode } from 'react'

import { ThemeProvider } from '@wrksz/themes'

export function ColorModeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
