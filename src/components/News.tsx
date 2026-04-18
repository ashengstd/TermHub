import {
  Badge,
  Box,
  Link as ChakraLink,
  Code,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { useLocalizedData } from '@/hooks/useLocalizedData'

import type { NewsItem } from '../types'

const MotionBox = motion(Box)

const sortNews = (arr: NewsItem[]) => {
  return [...arr].sort((a, b) => {
    if (!a.sortDate && !b.sortDate) return 0
    if (!a.sortDate) return 1
    if (!b.sortDate) return -1
    return b.sortDate.localeCompare(a.sortDate)
  })
}

const News = () => {
  const { t } = useTranslation()
  const { news: dataNews } = useLocalizedData()
  const news = sortNews(dataNews)
  const lastUpdated = news.length > 0 ? news[0].date ?? 'N/A' : 'N/A'

  return (
    <Container maxW="7xl" px={4}>
      <VStack align="stretch" gap={8}>
        <MotionBox
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" mb={6} size="xl">
            {t('news.title')}
          </Heading>
          <Box className="meta">
            <Box className="meta-item">
              <i className="fa-solid fa-clock-rotate-left"></i>
              {t('news.lastUpdated')} {lastUpdated}
            </Box>
            <Box className="meta-item">
              <i className="fa-solid fa-sort"></i>
              {t('news.sortedByDate')}
            </Box>
          </Box>

          <VStack align="stretch" gap={6}>
            {news.map((item, index) => (
              <MotionBox
                animate={{ opacity: 1, y: 0 }}
                borderRadius="md"
                borderWidth="1px"
                className="card"
                initial={{ opacity: 0, y: 20 }}
                key={index}
                p={5}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Box mb={2}>
                  <Code>{item.date}</Code>{' '}
                  {item.badge !== '' && (
                    <Badge colorPalette={item.iconColor.split('.')[0] ?? 'gray'} ml={2}>
                      {item.badge}
                    </Badge>
                  )}{' '}
                  <Text as="span" fontWeight="bold">
                    {item.title}
                  </Text>
                </Box>
                <Text>{item.description}</Text>
                {item.links.length > 0 && (
                  <HStack gap={3} mt={3} wrap="wrap">
                    {item.links.map((l, i) => (
                      <ChakraLink color="var(--accent-color)" href={l.url} key={i} rel="noopener noreferrer" target="_blank">
                        {l.text} →
                      </ChakraLink>
                    ))}
                  </HStack>
                )}
              </MotionBox>
            ))}
          </VStack>
        </MotionBox>

        <MotionBox
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Heading as="h2" mb={4} size="lg">
            {t('news.currentFocus')}
          </Heading>
          <Box as="pre" bg="var(--header-bg)" borderRadius="md" fontFamily="mono" p={4}>
            {`# Active Projects (2024-Q4)
- ThinkGrasp extensions    // Working on improved vision-language integration
- Equivariant Models       // Refining SE(2) models for grasping
- Technical blog series    // Writing about LLMs and robotics
- PyTorch upgrades         // Maintaining open source contributions`}
          </Box>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default News
