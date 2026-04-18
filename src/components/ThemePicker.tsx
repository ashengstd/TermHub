import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { FaCheck, FaPalette } from 'react-icons/fa'

import { useColorMode, useColorModeValue } from '@/hooks/useColorMode'
import { type ThemeKey, themes, useThemeContext } from '@/themes/hooks'

export const ThemePicker: React.FC = () => {
  const { activeTheme, currentThemeKey, setTheme } = useThemeContext()
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('gray.800', 'white')

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
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const tc = activeTheme.terminal.colors(isDark)
  const menuBg = tc.bg
  const menuText = tc.text
  const menuBorder = tc.border
  const menuHoverBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'

  return (
    <Box display="inline-flex" position="relative" ref={menuRef}>
      <IconButton
        _hover={{ bg: 'transparent', color: iconHoverColor }}
        aria-label="Select Theme"
        color={iconColor}
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="ghost"
      >
        <FaPalette />
      </IconButton>

      {isOpen && (
        <Box
          bg={menuBg}
          border={`1px solid ${menuBorder}`}
          borderRadius="md"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
          minW="180px"
          mt={2}
          overflow="hidden"
          position="absolute"
          py={1}
          right={0}
          top="100%"
          zIndex={1000}
        >
          <VStack align="stretch" gap={0} w="full">
            {(Object.keys(themes) as ThemeKey[]).map((key) => (
              <Flex
                _hover={{ bg: menuHoverBg }}
                align="center"
                cursor="pointer"
                justify="space-between"
                key={key}
                onClick={() => {
                  setTheme(key)
                  setIsOpen(false)
                }}
                px={3}
                py={2}
                transition="background 0.2s"
                w="full"
              >
                <Text
                  color={menuText}
                  fontFamily="mono"
                  fontSize="xs"
                  fontWeight={currentThemeKey === key ? 'bold' : 'normal'}
                >
                  {themes[key].name}
                </Text>
                {currentThemeKey === key && <FaCheck color={tc.success} size={10} />}
              </Flex>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  )
}
