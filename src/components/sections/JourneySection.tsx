import { Box, Container, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

/** Parse **bold** markers in text */
const renderBoldText = (text: string, color: string, boldColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text as="span" color={boldColor} fontWeight="semibold" key={i}>
          {part.slice(2, -2)}
        </Text>
      )
    }
    return (
      <Text as="span" color={color} key={i}>
        {part}
      </Text>
    )
  })
}

const JourneySection: React.FC = () => {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const boldColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'gray.100')
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const dotBg = useColorModeValue('white', 'gray.800')
  const tagBg = useColorModeValue('gray.100', 'gray.800')
  const slashColor = useColorModeValue('gray.400', 'gray.600')
  const orgColor = useColorModeValue('gray.400', 'gray.500')
  const dotBorderColor = useColorModeValue('gray.300', 'gray.600')

  if (!about.journeyPhases || about.journeyPhases.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4} w="full">
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size={['sm', 'md']}>
            {t('about.myJourney')}
          </Heading>
          <Box bg={lineColor} flex="1" h="1px" />
        </Flex>

        <Box position="relative" w="full">
          <Box
            bg={lineColor}
            bottom="12px"
            left={['7px', '7px', '7px']}
            position="absolute"
            top="12px"
            w="1px"
          />

          <VStack align="stretch" gap={0}>
            {(about.journeyPhases ?? []).map((phase, index) => (
              <Flex align="start" gap={[3, 4]} key={index} position="relative" py={3}>
                <Box flexShrink={0} mt="6px">
                  <Box
                    bg={index === (about.journeyPhases ?? []).length - 1 ? 'cyan.400' : dotBg}
                    border="2px solid"
                    borderColor={
                      index === (about.journeyPhases ?? []).length - 1 ? 'cyan.400' : dotBorderColor
                    }
                    borderRadius="full"
                    h="14px"
                    w="14px"
                  />
                </Box>
                <Box flex={1} pb={2}>
                  <HStack flexWrap="wrap" gap={2} mb={1}>
                    <Text
                      color="cyan.400"
                      fontFamily="mono"
                      fontSize="2xs"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      {phase.period}
                    </Text>
                    <Text color={slashColor} fontSize="2xs">
                      /
                    </Text>
                    <Text color={orgColor} fontFamily="mono" fontSize="2xs">
                      {phase.org}
                    </Text>
                  </HStack>
                  <Text color={headingColor} fontSize="sm" fontWeight="semibold" mb={1}>
                    {phase.title}
                  </Text>
                  <Text fontSize="xs" lineHeight="tall" mb={2}>
                    {renderBoldText(phase.description, textColor, boldColor)}
                  </Text>
                  {phase.tags && (
                    <HStack flexWrap="wrap" gap={1.5}>
                      {phase.tags.map((tag) => (
                        <Text
                          bg={tagBg}
                          borderRadius="sm"
                          color={textColor}
                          fontFamily="mono"
                          fontSize="2xs"
                          key={tag}
                          px={1.5}
                          py={0.5}
                        >
                          {tag}
                        </Text>
                      ))}
                    </HStack>
                  )}
                </Box>
              </Flex>
            ))}
            {/* View all link */}
            <Flex align="start" gap={[3, 4]} position="relative" py={3}>
              <Box flexShrink={0} mt="6px">
                <Box
                  border="2px dashed"
                  borderColor={dotBorderColor}
                  borderRadius="full"
                  h="14px"
                  w="14px"
                />
              </Box>
              <Link _hover={{ textDecoration: 'none' }} href="/experience">
                <HStack
                  _hover={{ color: 'cyan.400' }}
                  color={textColor}
                  fontFamily="mono"
                  fontSize="xs"
                  gap={2}
                  mt="3px"
                  transition="all 0.15s"
                >
                  <Text>{t('about.viewAllExperience')}</Text>
                  <Text>→</Text>
                </HStack>
              </Link>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default JourneySection
