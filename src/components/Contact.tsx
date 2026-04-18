import { Box, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import { MotionBox, MotionHover, MotionList } from './animations/MotionList'

const Contact = () => {
  const { t } = useTranslation()
  const { githubUsername, siteOwner } = useLocalizedData()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)

  const contactLinks = [
    {
      display: siteOwner.contact.email,
      href: `mailto:${siteOwner.contact.email}`,
      label: t('contact.email'),
      value: siteOwner.contact.email,
    },
    {
      display: `@${siteOwner.social.linkedin.split('/').filter(Boolean).pop() ?? ''}`,
      href: siteOwner.social.linkedin,
      label: t('contact.linkedin'),
      value: siteOwner.social.linkedin,
    },
    {
      display: `@${githubUsername}`,
      href: siteOwner.social.github,
      label: t('contact.github'),
      value: siteOwner.social.github,
    },
    {
      display: `@${siteOwner.social.medium.split('@').pop() ?? ''}`,
      href: siteOwner.social.medium,
      label: t('contact.medium'),
      value: siteOwner.social.medium,
    },
    {
      display: t('contact.viewProfile'),
      href: siteOwner.social.googleScholar,
      label: t('contact.googleScholar'),
      value: siteOwner.social.googleScholar,
    },
  ]

  return (
    <Container maxW="7xl" px={4} py={8}>
      <VStack align="stretch" gap={8}>
        <MotionBox delay={0.1}>
          <Heading as="h1" mb={6} size="xl">
            {t('contact.title')}
          </Heading>
          <Box className="meta" mb={4}>
            <Box className="meta-item" color={tc.secondary} fontSize="sm">
              <Box as="i" className="fa-solid fa-clock" mr={2} />
              {t('contact.responseTime')}
            </Box>
          </Box>

          <MotionBox delay={0.2}>
            <Box
              as="pre"
              bg={tc.header}
              border="1px solid"
              borderColor={tc.border}
              borderRadius="md"
              boxShadow="inner"
              color={tc.text}
              fontFamily="mono"
              mb={6}
              p={4}
            >
              {`# ${t('contact.contactInfo')}
EMAIL    = "${siteOwner.contact.email}"
LINKEDIN = "${siteOwner.social.linkedin}"
GITHUB   = "${siteOwner.social.github}"
LOCATION = "${siteOwner.contact.location}"`}
            </Box>
          </MotionBox>

          <MotionBox delay={0.3}>
            <Box
              bg={tc.bg}
              borderColor={tc.border}
              borderRadius="md"
              borderWidth="1px"
              boxShadow="lg"
              mt={8}
              p={6}
            >
              <Heading
                as="h2"
                color={tc.highlight}
                fontFamily="mono"
                letterSpacing="widest"
                mb={6}
                size="sm"
              >
                // {t('contact.quickLinks').toUpperCase()}
              </Heading>

              <MotionList staggerDelay={0.1}>
                {contactLinks.map((link) => (
                  <MotionBox key={link.label}>
                    <HStack gap={4} justify="space-between" mb={4} wrap="wrap">
                      <Text
                        as="span"
                        color={tc.prompt}
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight="bold"
                        w="120px"
                      >
                        {link.label}:
                      </Text>
                      <MotionHover>
                        <Box flex="1">
                          <a
                            href={link.href}
                            onMouseOut={(e) =>
                              (e.currentTarget.style.borderBottomColor = 'transparent')
                            }
                            onMouseOver={(e) =>
                              (e.currentTarget.style.borderBottomColor = tc.command)
                            }
                            rel="noopener noreferrer"
                            style={{
                              borderBottom: `1px solid transparent`,
                              color: tc.command,
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              transition: 'border-color 0.2s',
                            }}
                            target="_blank"
                          >
                            {link.display}
                          </a>
                        </Box>
                      </MotionHover>
                    </HStack>
                  </MotionBox>
                ))}
              </MotionList>
            </Box>
          </MotionBox>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default Contact
