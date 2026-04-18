import { Box, Container, Flex, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const BioSection: React.FC = () => {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const separatorColor = useColorModeValue('gray.200', 'gray.700')

  if (!about.journey) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.bio', 'About')}
          </Heading>
          <Box bg={separatorColor} flex="1" h="1px" />
        </Flex>
        <Box color={textColor} fontSize="sm" lineHeight="tall">
          {about.Content ? <about.Content /> : about.journey}
        </Box>
      </Container>
    </Box>
  )
}

export default BioSection
