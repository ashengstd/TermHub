import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  HStack,
  IconButton,
  Image,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FaEnvelope, FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa'
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { SiGooglescholar } from 'react-icons/si'

import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import { MotionHover } from './animations/MotionList'
import { ThemePicker } from './ThemePicker'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { onClose, onOpen, open: isOpen } = useDisclosure()
  const { i18n, t } = useTranslation()
  const { navItems, siteOwner } = useLocalizedData()

  const toggleLanguage = () => {
    void i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  const socialLinks = [
    { href: `mailto:${siteOwner.contact.email}`, icon: FaEnvelope, label: 'Email' },
    { href: siteOwner.social.github, icon: FaGithub, label: 'GitHub' },
    { href: siteOwner.social.linkedin, icon: FaLinkedin, label: 'LinkedIn' },
    { href: siteOwner.social.medium, icon: FaMedium, label: 'Medium' },
    { href: siteOwner.social.googleScholar, icon: SiGooglescholar, label: 'Google Scholar' },
  ].filter((link) => link.href)

  return (
    <Box
      as="nav"
      bg="var(--bg-color)"
      borderBottom="1px solid"
      borderColor="var(--border-color)"
      position="sticky"
      py={4}
      top={0}
      w="full"
      zIndex={1000}
    >
      <Flex align="center" justify="space-between" position="relative" px={4} w="full">
        {/* Left Section: Mobile hamburger + Always-visible Logo */}
        <HStack gap={2}>
          <Box display={{ base: 'block', md: 'none' }}>
            <MotionHover>
              <IconButton
                aria-label={t('aria.openNav')}
                color="var(--text-color)"
                onClick={isOpen ? onClose : onOpen}
                variant="ghost"
              >
                {isOpen ? <FiX /> : <FiMenu />}
              </IconButton>
            </MotionHover>
          </Box>
          <MotionHover>
            <Link style={{ alignItems: 'center', display: 'flex' }} to="/">
              <Image
                _hover={{ opacity: 0.8 }}
                alt="TermHub"
                h="28px"
                src={`${import.meta.env.BASE_URL}logo-icon.svg`}
                transition="opacity 0.15s"
                w="28px"
              />
            </Link>
          </MotionHover>
        </HStack>

        {/* Desktop nav (centered-right) */}
        <HStack display={{ base: 'none', md: 'flex' }} gap={8} ml="auto" mr={{ base: 0, md: 6 }}>
          {navItems.map((item) => {
            return (
              <MotionHover key={item.path}>
                <Link
                  activeProps={{
                    style: {
                      borderBottom: '2px solid var(--accent-color)',
                      fontWeight: '600',
                    },
                  }}
                  inactiveProps={{
                    style: {
                      borderBottom: 'none',
                      fontWeight: '400',
                    },
                  }}
                  style={{
                    color: 'var(--text-color)',
                    fontSize: '1rem',
                    paddingBottom: '2px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  to={item.path}
                >
                  {t(item.labelKey)}
                </Link>
              </MotionHover>
            )
          })}
        </HStack>

        {/* Global Action Items */}
        <HStack gap={4}>
          {/* Desktop-only: Socials and Language switcher */}
          <HStack display={{ base: 'none', md: 'flex' }} gap={4}>
            {socialLinks.map((link) => (
              <MotionHover key={link.label}>
                <ChakraLink
                  _hover={{
                    bg:
                      link.label === 'LinkedIn' || link.label === 'Email'
                        ? 'var(--hover-color)'
                        : 'transparent',
                    color: 'var(--accent-color)',
                  }}
                  borderRadius="md"
                  color="var(--secondary-text)"
                  href={link.href}
                  p={1.5}
                  rel="noopener noreferrer"
                  target="_blank"
                  transition="all 0.2s"
                >
                  <Box as={link.icon} fontSize="1.2rem" />
                </ChakraLink>
              </MotionHover>
            ))}
            <MotionHover>
              <Button
                _hover={{
                  bg: 'var(--hover-color)',
                  transform: 'translateY(-2px)',
                }}
                aria-label={t('aria.toggleLanguage')}
                color="var(--text-color)"
                fontSize="xs"
                fontWeight="medium"
                minW="auto"
                onClick={toggleLanguage}
                px={2}
                size="xs"
                transition="all 0.2s"
                variant="ghost"
              >
                {i18n.language === 'zh' ? 'EN' : '中'}
              </Button>
            </MotionHover>
          </HStack>

          {/* Theme & Color Mode (Always visible for quick access) */}
          <HStack gap={1}>
            <MotionHover>
              <ThemePicker />
            </MotionHover>
            <MotionHover>
              <IconButton
                _hover={{
                  bg: 'var(--hover-color)',
                  transform: 'translateY(-2px)',
                }}
                aria-label={t('aria.toggleColorMode')}
                color="var(--text-color)"
                onClick={(e) => toggleColorMode(e)}
                transition="all 0.2s"
                variant="ghost"
              >
                {colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              </IconButton>
            </MotionHover>
          </HStack>
        </HStack>
      </Flex>

      {isOpen && (
        <Box display={{ base: 'block', md: 'none' }} mt={3} px={4}>
          <VStack align="stretch" bg="var(--bg-color)" gap={3}>
            {navItems.map((item) => {
              return (
                <MotionHover key={item.path}>
                  <Link
                    activeProps={{
                      style: {
                        color: 'var(--accent-color)',
                        fontWeight: 600,
                      },
                    }}
                    inactiveProps={{
                      style: {
                        color: 'var(--text-color)',
                        fontWeight: 400,
                      },
                    }}
                    onClick={onClose}
                    style={{
                      display: 'block',
                      padding: '4px 0',
                      textDecoration: 'none',
                    }}
                    to={item.path}
                  >
                    {t(item.labelKey)}
                  </Link>
                </MotionHover>
              )
            })}

            <VStack align="stretch" gap={2}>
              {socialLinks.map((link) => (
                <ChakraLink
                  _hover={{ color: 'var(--accent-color)' }}
                  color="var(--secondary-text)"
                  href={link.href}
                  key={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Box as={link.icon} display="inline-block" mr={2} /> {link.label}
                </ChakraLink>
              ))}
            </VStack>

            <HStack gap={2}>
              <Button
                color="var(--text-color)"
                flex={1}
                onClick={toggleLanguage}
                size="sm"
                variant="outline"
              >
                {i18n.language === 'zh' ? 'English' : '中文'}
              </Button>
              <ThemePicker />
              <IconButton
                aria-label={t('aria.toggleColorMode')}
                color="var(--text-color)"
                onClick={(e) => toggleColorMode(e)}
                variant="outline"
              >
                {colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              </IconButton>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  )
}

export default Navbar
