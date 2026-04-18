import { Box, Container, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import DynamicIcon from '../DynamicIcon'

const ContactSection: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('gray.700', 'gray.200')

  const items = [
    siteOwner.contact.email && {
      href: `mailto:${siteOwner.contact.email}`,
      icon: 'FaEnvelope',
      label: t('contact.email', 'Email'),
      value: siteOwner.contact.email,
    },
    siteOwner.contact.academicEmail && {
      href: `mailto:${siteOwner.contact.academicEmail}`,
      icon: 'FaGraduationCap',
      label: t('contact.academicEmail', 'Academic'),
      value: siteOwner.contact.academicEmail,
    },
    siteOwner.contact.location && {
      icon: 'FaMapMarkerAlt',
      label: t('contact.location', 'Location'),
      value: siteOwner.contact.location,
    },
    siteOwner.social.github && {
      href: siteOwner.social.github,
      icon: 'FaGithub',
      label: 'GitHub',
      value: siteOwner.social.github,
    },
    siteOwner.social.linkedin && {
      href: siteOwner.social.linkedin,
      icon: 'FaLinkedin',
      label: 'LinkedIn',
      value: 'LinkedIn',
    },
    siteOwner.social.googleScholar && {
      href: siteOwner.social.googleScholar,
      icon: 'SiGooglescholar',
      label: 'Scholar',
      value: 'Google Scholar',
    },
  ].filter(Boolean) as { href?: string; icon: string; label: string; value: string }[]

  const lineBg = useColorModeValue('gray.200', 'gray.700')
  if (items.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.contact', 'Contact')}
          </Heading>
          <Box bg={lineBg} flex="1" h="1px" />
        </Flex>
        <VStack align="stretch" gap={2}>
          {items.map((item) => (
            <HStack gap={3} key={item.label}>
              <DynamicIcon boxSize={3.5} color="cyan.400" name={item.icon} />
              <Text color={textColor} fontSize="xs" minW="60px">
                {item.label}
              </Text>
              {item.href ? (
                <Link
                  _hover={{ color: 'cyan.400' }}
                  color={linkColor}
                  fontFamily="mono"
                  fontSize="xs"
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.value}
                </Link>
              ) : (
                <Text color={linkColor} fontFamily="mono" fontSize="xs">
                  {item.value}
                </Text>
              )}
            </HStack>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default ContactSection
