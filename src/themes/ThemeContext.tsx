import React, { useState } from 'react'

import type { ThemeKey } from './registry'

import { themes } from './registry'
import { ThemeContext } from './ThemeContextCore'

export { ThemeContext }

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'catppuccin-mocha'
    const saved = localStorage.getItem('termhub-theme')
    if (saved && saved in themes) return saved as ThemeKey
    return 'catppuccin-mocha'
  })

  const handleSetTheme = (key: ThemeKey) => {
    setThemeKey(key)
    localStorage.setItem('termhub-theme', key)
  }

  return (
    <ThemeContext.Provider
      value={{ activeTheme: themes[themeKey], currentThemeKey: themeKey, setTheme: handleSetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
