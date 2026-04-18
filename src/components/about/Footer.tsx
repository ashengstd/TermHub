import { Box, Container, HStack, Link, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SiCloudflare, SiGithub } from 'react-icons/si'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const footerBg = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box
      as="footer"
      bg={footerBg}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      borderTop="1px"
      mt={[6, 8]}
      py={[6, 8]}
      w="full"
    >
      <Container maxW="7xl" px={[4, 6, 8]}>
        <VStack gap={[3, 4]} textAlign="center">
          {/* Logo */}
          {/* Icons Row */}
          <HStack gap={6} mb={2}>
            <Link
              _hover={{ color: 'var(--accent-color)', transform: 'translateY(-2px)' }}
              color={textColor}
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
              transition="all 0.2s"
            >
              <Box as={SiGithub} boxSize="20px" />
            </Link>
            <Link
              _hover={{ color: 'orange.500', transform: 'translateY(-2px)' }}
              color={textColor}
              href="https://cloudflare.com"
              rel="noopener noreferrer"
              target="_blank"
              transition="all 0.2s"
            >
              <Box as={SiCloudflare} boxSize="22px" />
            </Link>
          </HStack>

          <HStack color={textColor} fontSize={['xs', 'sm']} gap={1}>
            <Text>{t('footer.poweredBy')}</Text>
            <Link
              _hover={{ textDecoration: 'underline' }}
              color="cyan.500"
              fontWeight="medium"
              href="https://github.com/H-Freax/TermHub"
              rel="noopener noreferrer"
              target="_blank"
            >
              TermHub
            </Link>
            <Text>{t('footer.forkedBy', 'forked by')}</Text>
            <Text fontWeight="bold">Ascka</Text>
          </HStack>

          <Text color={textColor} fontSize={['2xs', 'xs']}>
            © {new Date().getFullYear()} {siteOwner.name.display}
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default Footer
