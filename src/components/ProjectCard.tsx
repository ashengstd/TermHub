import {
  Badge,
  Box,
  Button,
  Collapsible,
  Heading,
  HStack,
  Link,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'

import { useColorModeValue } from '@/hooks/useColorMode'

import type { ProjectItem } from '../types'

const categoryColors: Record<ProjectItem['category'], string> = {
  data: 'green',
  healthcare: 'red',
  nlp: 'pink',
  robotics: 'purple',
  tooling: 'cyan',
  'web-app': 'orange',
}

const linkColor = (label: string) => {
  const lower = label.toLowerCase()
  if (lower.includes('code') || lower.includes('github')) return 'green'
  if (lower.includes('project')) return 'cyan'
  if (lower.includes('demo')) return 'orange'
  if (lower.includes('article') || lower.includes('tutorial') || lower.includes('write'))
    return 'purple'
  if (lower.includes('dataset')) return 'teal'
  return 'blue'
}

interface ProjectCardProps {
  project: ProjectItem
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { onToggle, open: isOpen } = useDisclosure()
  const cardBg = useColorModeValue('white', 'gray.800')
  const chipBg = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const highlightBorderColor = useColorModeValue('blue.400', 'blue.600')

  const { category, date, extraLinks, highlights, link, summary, tags, title } = project

  const primaryLinks = [] as { label: string; url: string }[]
  if (link) primaryLinks.push({ label: 'Project', url: link })
  if (extraLinks && extraLinks.length > 0) {
    extraLinks.forEach((entry) => {
      if (!primaryLinks.some((item) => item.url === entry.url)) {
        primaryLinks.push({ label: entry.label, url: entry.url })
      }
    })
  }

  return (
    <Box
      _hover={{ shadow: 'lg' }}
      bg={cardBg}
      borderRadius="lg"
      p={[4, 5, 6]}
      shadow="md"
      transition="box-shadow 0.2s ease"
    >
      <VStack align="start" gap={[3, 4]} w="full">
        <HStack flexWrap="wrap" gap={2}>
          <Badge colorPalette={categoryColors[category]} fontSize="xs">
            {category.replace('_', ' ').toUpperCase()}
          </Badge>
          {date && (
            <Badge colorPalette="gray" fontSize="xs">
              {date}
            </Badge>
          )}
        </HStack>

        <Heading lineHeight="tall" size={['sm', 'md']}>
          {title}
        </Heading>

        <Text color={textColor} fontSize={['sm', 'md']}>
          {summary}
        </Text>

        {tags.length > 0 && (
          <HStack flexWrap="wrap" gap={2}>
            {tags.map((tag) => (
              <Badge colorPalette="blue" fontSize="xs" key={tag} variant="subtle">
                {tag}
              </Badge>
            ))}
          </HStack>
        )}

        {primaryLinks.length > 0 && (
          <HStack flexWrap="wrap" gap={2}>
            {primaryLinks.map(({ label, url }) => (
              <Link href={url} key={`${label}-${url}`} rel="noopener noreferrer" target="_blank">
                <Button colorPalette={linkColor(label)} size="xs" variant="solid">
                  {label} →
                </Button>
              </Link>
            ))}
          </HStack>
        )}

        {highlights && highlights.length > 0 && (
          <>
            <Button colorPalette="gray" onClick={onToggle} size="xs" variant="outline">
              {isOpen ? 'Hide Highlights' : 'Show Highlights'}
            </Button>
            <Collapsible.Root open={isOpen}>
              <Collapsible.Content>
                <Box
                  bg={chipBg}
                  borderLeft="4px solid"
                  borderLeftColor={highlightBorderColor}
                  borderRadius="md"
                  mt={2}
                  p={4}
                  w="full"
                >
                  <VStack align="start" as="ul" color={textColor} fontSize="sm" gap={2} pl={2}>
                    {highlights.map((item, idx) => (
                      <Box as="li" key={idx}>
                        {item}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default ProjectCard
