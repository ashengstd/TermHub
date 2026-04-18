import { ChakraProvider } from '@chakra-ui/react'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import React from 'react'

import { useLocalizedData } from '../hooks/useLocalizedData'
import { getResolvedSlots, getTemplate, SlotProvider } from '../templates'
import { ThemeProvider } from '../themes/ThemeContext'
import { ThemeInjector } from '../themes/ThemeInjector'
import SplashScreen from './SplashScreen'

export function RootLayout() {
  const { siteConfig } = useLocalizedData()
  const [showSplash, setShowSplash] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('splash-seen')
    }
    return true
  })

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem('splash-seen', 'true')
  }

  const cfg = siteConfig as Record<string, unknown>
  const template = getTemplate(cfg.template as string | undefined)
  const slots = getResolvedSlots(template, cfg.components as Record<string, string> | undefined)

  const { layout: TemplateLayout } = template

  return (
    <ChakraProvider value={template.theme}>
      <ThemeProvider>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <ThemeInjector />
        <SlotProvider slots={slots}>
          <TemplateLayout>
            <Outlet />
          </TemplateLayout>
        </SlotProvider>
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </ThemeProvider>
    </ChakraProvider>
  )
}
