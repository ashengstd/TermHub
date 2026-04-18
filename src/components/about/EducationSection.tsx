import { Box, Heading, HStack, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import React from 'react'

import { useColorModeValue } from '@/hooks/useColorMode'

interface Course {
  course: string
  institution: string
  year: string
}

interface EducationSectionProps {
  courses: Course[]
  logos?: Record<string, string>
}

const EducationSection: React.FC<EducationSectionProps> = ({ courses, logos = {} }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('white', 'gray.800')
  const accentBg = useColorModeValue('blue.50', 'blue.900')

  return (
    <SimpleGrid columns={[1, 1, 2]} gap={[3, 3, 4]} w="full">
      {courses.map((course, index) => {
        const logo = logos[course.institution]
        return (
          <Box
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            bg={bg}
            borderRadius="lg"
            key={index}
            p={[3, 4]}
            shadow="sm"
            transition="all 0.2s"
          >
            <HStack align="start" gap={3}>
              {logo ? (
                <Image
                  alt={course.institution}
                  borderRadius="md"
                  flexShrink={0}
                  h={['36px', '44px']}
                  mt={0.5}
                  objectFit="contain"
                  src={logo}
                  w={['36px', '44px']}
                />
              ) : (
                <Box
                  alignItems="center"
                  bg={accentBg}
                  borderRadius="md"
                  display="flex"
                  flexShrink={0}
                  h={['36px', '44px']}
                  justifyContent="center"
                  mt={0.5}
                  w={['36px', '44px']}
                >
                  <Text color="blue.500" fontSize={['md', 'lg']} fontWeight="bold">
                    {course.institution.charAt(0)}
                  </Text>
                </Box>
              )}
              <VStack align="start" flex={1} gap={1}>
                <Text color="blue.500" fontSize={['2xs', 'xs', 'sm']} fontWeight="medium">
                  {course.year}
                </Text>
                <Heading lineHeight="short" size={['xs', 'sm']}>
                  {course.course}
                </Heading>
                <Text color={textColor} fontSize={['2xs', 'xs', 'sm']}>
                  {course.institution}
                </Text>
              </VStack>
            </HStack>
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default EducationSection
