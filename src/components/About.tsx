import { Badge, Box, Container, Flex, Heading, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { SlotName } from '@/templates/slots'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useSlot } from '@/templates/hooks'
import { DEFAULT_SECTIONS } from '@/templates/slots'

function About() {
  const { t } = useTranslation()
  const { experience, institutionLogos, news, research, siteConfig } = useLocalizedData()
  const researchLogos = institutionLogos
  const universityLogos = institutionLogos
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const newsBadgeBg = useColorModeValue('green.100', 'rgba(154,230,180,0.16)')
  const newsBadgeColor = useColorModeValue('green.800', 'green.200')

  const cfg = siteConfig as Record<string, unknown>
  const sectionOrder = (cfg.sections as string[] | undefined) ?? DEFAULT_SECTIONS

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      if (!a.sortDate && !b.sortDate) return 0
      if (!a.sortDate) return 1
      if (!b.sortDate) return -1
      return b.sortDate.localeCompare(a.sortDate)
    })
  }, [news])

  const HeroSection = useSlot('hero')
  const NewsDisplay = useSlot('newsDisplay')
  const Footer = useSlot('footer')
  const Bio = useSlot('bio')
  const Skills = useSlot('skills')
  const Journey = useSlot('journey')
  const Mentorship = useSlot('mentorship')
  const SelectedPublications = useSlot('selectedPublications')
  const Talks = useSlot('talks')
  const Teaching = useSlot('teaching')
  const Accomplishments = useSlot('accomplishments')
  const Contact = useSlot('contact')

  const renderSection = (sectionId: string, index: number) => {
    const key = `${sectionId}-${index.toString()}`
    switch (sectionId as SlotName) {
      case 'accomplishments':
        return <Accomplishments key={key} />
      case 'bio':
        return <Bio key={key} />
      case 'contact':
        return <Contact key={key} />
      case 'footer':
        return <Footer key={key} />
      case 'hero':
        return (
          <HeroSection
            avatar={siteConfig.avatar}
            education={experience.education.courses}
            educationLogos={universityLogos}
            key={key}
            research={research.currentResearch}
            researchLogos={researchLogos}
            title={siteConfig.title}
          />
        )
      case 'journey':
        return <Journey key={key} />
      case 'mentorship':
        return <Mentorship key={key} />
      case 'newsDisplay':
        return (
          <Box key={key} w="full">
            <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
              <Flex align="center" gap={3} mb={4}>
                <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
                <Heading fontWeight="semibold" size="md">
                  {t('about.recentUpdates')}
                </Heading>
                <Badge bg={newsBadgeBg} color={newsBadgeColor} fontFamily="mono" fontSize="2xs">
                  {t('about.news')}
                </Badge>
                <Box bg={lineColor} flex="1" h="1px" />
              </Flex>
              <NewsDisplay news={sortedNews} />
            </Container>
          </Box>
        )
      case 'selectedPublications':
        return <SelectedPublications key={key} />
      case 'skills':
        return <Skills key={key} />
      case 'talks':
        return <Talks key={key} />
      case 'teaching':
        return <Teaching key={key} />
      default:
        return null
    }
  }

  return (
    <Box w="full">
      <VStack align="stretch" gap={[4, 6, 8]} w="full">
        {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
      </VStack>
    </Box>
  )
}

export default About
