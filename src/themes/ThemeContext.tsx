import React, { createContext, useContext, useEffect, useState } from 'react'

import { nordTheme } from './nord'
import {
  catppuccinoMochaTheme,
  catppuccinoMacchiatoTheme,
  catppuccinoFrappeTheme,
} from './catppuccin'
import { ayuDarkTheme, ayuMirageTheme } from './ayu'
import { draculaTheme } from './dracula'
import { oneDarkTheme } from './onedark'
import { everforestTheme } from './everforest'
import { githubTheme } from './github'
import type { ThemeDefinition } from './types'

export const themes = {
  nord: nordTheme,
  'catppuccin-mocha': catppuccinoMochaTheme,
  'catppuccin-macchiato': catppuccinoMacchiatoTheme,
  'catppuccin-frappe': catppuccinoFrappeTheme,
  'ayu-dark': ayuDarkTheme,
  'ayu-mirage': ayuMirageTheme,
  dracula: draculaTheme,
  'one-dark': oneDarkTheme,
  everforest: everforestTheme,
  github: githubTheme,
}

export type ThemeKey = keyof typeof themes

interface ThemeContextValue {
  currentThemeKey: ThemeKey
  setTheme: (key: ThemeKey) => void
  activeTheme: ThemeDefinition
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>('catppuccin-mocha')

  useEffect(() => {
    const saved = localStorage.getItem('termhub-theme') as ThemeKey
    if (saved && themes[saved]) {
      setThemeKey(saved)
    }
  }, [])

  const handleSetTheme = (key: ThemeKey) => {
    setThemeKey(key)
    localStorage.setItem('termhub-theme', key)
  }

  return (
    <ThemeContext.Provider value={{ currentThemeKey: themeKey, setTheme: handleSetTheme, activeTheme: themes[themeKey] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider')
  return context
}
