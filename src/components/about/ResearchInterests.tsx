import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'

import { useColorModeValue } from '@/hooks/useColorMode'

const MotionBox = motion(Box)

interface ResearchInterestsProps {
  interests: string[]
}

const ResearchInterests: React.FC<ResearchInterestsProps> = ({ interests }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <SimpleGrid columns={[2, 2, 3, 4]} gap={[2, 3]} w="full">
      {interests.map((interest, index) => (
        <MotionBox
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          key={index}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -2 }}
        >
          <Box
            bg={bg}
            borderRadius="md"
            fontSize={['xs', 'sm']}
            p={[2, 3]}
            shadow="sm"
            textAlign="center"
          >
            <Text color={textColor} fontWeight="medium">
              {interest}
            </Text>
          </Box>
        </MotionBox>
      ))}
    </SimpleGrid>
  )
}

export default ResearchInterests
