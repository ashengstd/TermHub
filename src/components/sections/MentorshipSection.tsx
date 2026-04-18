import { Box, Container, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MentorshipSection: React.FC = () => {
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const nameColor = useColorModeValue('gray.700', 'gray.200')
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const borderColor = useColorModeValue('gray.100', 'gray.800')

  if (!about.mentorship) return null

  return (
    <Box w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={3}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size={['sm', 'md']}>
            {about.mentorship.heading}
          </Heading>
          <Box bg={lineColor} flex="1" h="1px" />
        </Flex>
        {about.mentorship.description && (
          <Text color={textColor} fontSize="xs" lineHeight="tall" mb={4}>
            {about.mentorship.description}
          </Text>
        )}
        <VStack align="stretch" gap={0}>
          {about.mentorship.mentees.map((mentee, index) => (
            <Flex
              align="center"
              borderBottom="1px solid"
              borderColor={borderColor}
              gap={3}
              key={index}
              py={2.5}
            >
              <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="6px" w="6px" />
              <Link
                _hover={{ textDecoration: 'none' }}
                href={mentee.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Text
                  _hover={{ color: 'cyan.400' }}
                  color={nameColor}
                  fontSize="sm"
                  fontWeight="medium"
                  transition="color 0.15s"
                >
                  {mentee.name}
                </Text>
              </Link>
              {mentee.note && (
                <Text color={textColor} fontFamily="mono" fontSize="2xs">
                  {mentee.note}
                </Text>
              )}
            </Flex>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default MentorshipSection
