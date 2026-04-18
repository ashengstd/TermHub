import { Box, Container, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import DynamicIcon from '../DynamicIcon'

type SkillItem = string | { category?: string; icon?: string; name: string }

const SkillsSection: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const skills = siteOwner.skills as SkillItem[]
  const tagBg = useColorModeValue('gray.100', 'gray.800')
  const tagColor = useColorModeValue('gray.700', 'gray.300')
  const iconColor = useColorModeValue('gray.500', 'gray.400')
  const lineBg = useColorModeValue('gray.200', 'gray.700')

  if (skills.length === 0) return null

  const getName = (s: SkillItem) => (typeof s === 'string' ? s : s.name)
  const getIcon = (s: SkillItem) => (typeof s === 'string' ? undefined : s.icon)

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.skills', 'Skills')}
          </Heading>
          <Box bg={lineBg} flex="1" h="1px" />
        </Flex>
        <HStack flexWrap="wrap" gap={2}>
          {skills.map((skill) => (
            <HStack
              bg={tagBg}
              borderRadius="sm"
              color={tagColor}
              fontFamily="mono"
              fontSize="xs"
              gap={1.5}
              key={getName(skill)}
              px={2.5}
              py={1}
            >
              {getIcon(skill) && (
                <DynamicIcon boxSize={3} color={iconColor} name={getIcon(skill)} />
              )}
              <Text>{getName(skill)}</Text>
            </HStack>
          ))}
        </HStack>
      </Container>
    </Box>
  )
}

export default SkillsSection
