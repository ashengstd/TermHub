import { Check, Palette } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { MotionHover } from '@/components/animations/MotionList'
import { Button } from '@/components/ui/button'
import { useColorMode } from '@/hooks/useColorMode'
import { useT } from '@/hooks/useT'
import { type ThemeKey, themes, useThemeContext } from '@/themes/hooks'

export const ThemePicker: React.FC<{ showLabel?: boolean }> = ({ showLabel }) => {
  const { activeTheme, currentThemeKey, setTheme } = useThemeContext()
  const { colorMode } = useColorMode()
  const { t } = useT()
  const isDark = colorMode === 'dark'

  const iconColor = isDark ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' // gray-400 : gray-600
  const iconHoverColor = isDark ? 'white' : 'rgb(31, 41, 55)' // white : gray-800

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Terminal aesthetic colors for the dropdown
  const tc = activeTheme.terminal.colors(isDark)
  const menuBg = tc.bg
  const menuText = tc.text
  const menuBorder = tc.border
  const menuHoverBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'

  return (
    <div className="inline-flex relative" ref={menuRef}>
      <Button
        aria-label="Select Theme"
        className="flex items-center gap-2 transition-colors duration-200 hover:text-[var(--accent-color)] hover:bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.currentTarget.style.color = iconHoverColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = iconColor)}
        size={showLabel ? 'sm' : 'icon'}
        style={{ color: iconColor }}
        variant="ghost"
      >
        <MotionHover className="flex items-center gap-1.5">
          <Palette className="h-4 w-4" />
          {showLabel && (
            <span className="text-xs font-medium uppercase tracking-wider">{t('nav_theme')}</span>
          )}
        </MotionHover>
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 min-w-[180px] rounded-md shadow-lg py-1 z-[1000] overflow-hidden"
          style={{
            backgroundColor: menuBg,
            border: `1px solid ${menuBorder}`,
          }}
        >
          <div className="flex flex-col w-full">
            {(Object.keys(themes) as ThemeKey[]).map((key) => (
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-200"
                key={key}
                onClick={() => {
                  setTheme(key)
                  setIsOpen(false)
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = menuHoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span
                  className="font-mono text-xs"
                  style={{
                    color: menuText,
                    fontWeight: currentThemeKey === key ? 'bold' : 'normal',
                  }}
                >
                  {themes[key].name}
                </span>
                {currentThemeKey === key && (
                  <Check className="h-2.5 w-2.5" style={{ color: tc.success }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
