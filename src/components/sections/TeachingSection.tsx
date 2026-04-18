import { Box, Container, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import DynamicIcon from '../DynamicIcon'

const roleIcons: Record<string, string> = {
  'co-instructor': 'FaUsers',
  'guest-lecturer': 'FaMicrophone',
  instructor: 'FaChalkboardTeacher',
  other: 'FaBook',
  ta: 'FaUserGraduate',
}

const TeachingSection: React.FC = () => {
  const { t } = useTranslation()
  const { teaching } = useLocalizedData()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')

  const lineBg = useColorModeValue('gray.200', 'gray.700')

  if (teaching.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.teaching', 'Teaching')}
          </Heading>
          <Box bg={lineBg} flex="1" h="1px" />
        </Flex>
        <VStack align="stretch" gap={0}>
          {teaching.map((entry, i) => (
            <Flex
              align="start"
              borderBottom="1px solid"
              borderColor={borderColor}
              gap={3}
              key={i}
              py={2.5}
            >
              <Box flexShrink={0} mt="2px">
                <DynamicIcon
                  boxSize={3.5}
                  color="cyan.400"
                  name={roleIcons[entry.role] || roleIcons.other}
                />
              </Box>
              <Box flex={1} minW={0}>
                <Text color={titleColor} fontSize="xs" fontWeight="medium" lineHeight="short">
                  {entry.link ? (
                    <Link
                      _hover={{ color: 'cyan.400' }}
                      href={entry.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {entry.course}
                    </Link>
                  ) : (
                    entry.course
                  )}
                </Text>
                <HStack flexWrap="wrap" gap={2} mt={0.5}>
                  <Text color={textColor} fontSize="2xs">
                    {entry.institution}
                  </Text>
                  <Text color={mutedColor} fontSize="2xs">
                    · {entry.role}
                  </Text>
                </HStack>
                {entry.description && (
                  <Text color={textColor} fontSize="2xs" mt={1}>
                    {entry.description}
                  </Text>
                )}
              </Box>
              <Text
                color={mutedColor}
                flexShrink={0}
                fontFamily="mono"
                fontSize="2xs"
                whiteSpace="nowrap"
              >
                {entry.semester}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default TeachingSection
