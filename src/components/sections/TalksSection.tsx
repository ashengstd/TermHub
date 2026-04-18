import { Box, Container, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import DynamicIcon from '../DynamicIcon'

const typeLabels: Record<string, { color: string; icon: string }> = {
  invited: { color: 'purple.400', icon: 'FaUserTie' },
  keynote: { color: 'yellow.400', icon: 'FaStar' },
  oral: { color: 'cyan.400', icon: 'FaMicrophone' },
  other: { color: 'gray.400', icon: 'FaComments' },
  panel: { color: 'pink.400', icon: 'FaUsers' },
  poster: { color: 'green.400', icon: 'FaImage' },
  tutorial: { color: 'orange.400', icon: 'FaChalkboardTeacher' },
  workshop: { color: 'blue.400', icon: 'FaTools' },
}

const TalksSection: React.FC = () => {
  const { t } = useTranslation()
  const { talks } = useLocalizedData()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')

  const lineBg = useColorModeValue('gray.200', 'gray.700')

  if (talks.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.talks', 'Talks')}
          </Heading>
          <Box bg={lineBg} flex="1" h="1px" />
        </Flex>
        <VStack align="stretch" gap={0}>
          {talks.map((talk, i) => {
            const meta = typeLabels[talk.type ?? 'other'] ?? typeLabels.other
            return (
              <Flex
                align="start"
                borderBottom="1px solid"
                borderColor={borderColor}
                gap={3}
                key={i}
                py={2.5}
              >
                <Box flexShrink={0} mt="2px">
                  <DynamicIcon boxSize={3.5} color={meta.color} name={meta.icon} />
                </Box>
                <Box flex={1} minW={0}>
                  <Text color={titleColor} fontSize="xs" fontWeight="medium" lineHeight="short">
                    {talk.title}
                  </Text>
                  <HStack flexWrap="wrap" gap={2} mt={0.5}>
                    <Text color={textColor} fontSize="2xs">
                      {talk.event}
                    </Text>
                    {talk.location && (
                      <Text color={mutedColor} fontSize="2xs">
                        · {talk.location}
                      </Text>
                    )}
                  </HStack>
                  {(talk.slidesUrl ?? talk.videoUrl) && (
                    <HStack gap={2} mt={1}>
                      {talk.slidesUrl && (
                        <Link
                          _hover={{ textDecoration: 'underline' }}
                          color="cyan.400"
                          fontFamily="mono"
                          fontSize="2xs"
                          href={talk.slidesUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          slides
                        </Link>
                      )}
                      {talk.videoUrl && (
                        <Link
                          _hover={{ textDecoration: 'underline' }}
                          color="cyan.400"
                          fontFamily="mono"
                          fontSize="2xs"
                          href={talk.videoUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          video
                        </Link>
                      )}
                    </HStack>
                  )}
                </Box>
                <Text
                  color={mutedColor}
                  flexShrink={0}
                  fontFamily="mono"
                  fontSize="2xs"
                  whiteSpace="nowrap"
                >
                  {talk.date}
                </Text>
              </Flex>
            )
          })}
        </VStack>
      </Container>
    </Box>
  )
}

export default TalksSection
