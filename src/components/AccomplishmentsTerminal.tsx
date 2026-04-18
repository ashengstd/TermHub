import { Box, Container, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import type { Award } from '../types'

import DynamicIcon from './DynamicIcon'

const iconFor = (a: Award): string => {
  if (a.kind === 'grant') return 'FaCoins'
  if (a.kind === 'hackathon') return 'FaTrophy'
  if (a.kind === 'travel') return 'FaPlane'
  if (a.kind === 'scholarship') return 'FaGraduationCap'
  if (a.kind === 'honor') return 'FaMedal'
  if (a.kind === 'employment') return 'FaBriefcase'
  if (a.kind === 'innovation') return 'FaLightbulb'
  if (a.kind === 'competition') {
    const t = (a.title + ' ' + (a.org ?? '')).toLowerCase()
    if (t.includes('first')) return 'FaTrophy'
    if (t.includes('second')) return 'FaMedal'
    if (t.includes('third')) return 'FaAward'
    if (t.includes('meritorious')) return 'FaStar'
    if (t.includes('honorable')) return 'FaAward'
    return 'FaChartBar'
  }
  return 'FaCoins'
}

const kindMeta: Record<string, { color: [string, string]; labelKey: string; }> = {
  competition: { color: ['orange.400', 'orange.300'], labelKey: 'awards.competition' },
  employment: { color: ['blue.500', 'blue.300'], labelKey: 'awards.employment' },
  grant: { color: ['yellow.500', 'yellow.300'], labelKey: 'awards.grant' },
  hackathon: { color: ['purple.500', 'purple.300'], labelKey: 'awards.hackathon' },
  honor: { color: ['green.500', 'green.300'], labelKey: 'awards.honor' },
  innovation: { color: ['cyan.500', 'cyan.300'], labelKey: 'awards.innovation' },
  other: { color: ['gray.400', 'gray.500'], labelKey: 'awards.other' },
  scholarship: { color: ['purple.500', 'purple.300'], labelKey: 'awards.scholarship' },
  travel: { color: ['blue.400', 'blue.300'], labelKey: 'awards.travel' },
}

const AwardRow = ({ award }: { award: Award }) => {
  const { t } = useTranslation()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')
  const eggTextColor = useColorModeValue('gray.600', 'gray.300')
  const meta = kindMeta[award.kind ?? 'other']
  const kindColor = useColorModeValue(meta.color[0], meta.color[1])

  const content = (
    <Flex
      _hover={award.egg ? { pl: 1 } : undefined}
      align="start"
      borderBottom="1px solid"
      borderColor={borderColor}
      cursor={award.egg ? 'pointer' : 'default'}
      gap={3}
      py={2.5}
      transition="all 0.15s"
    >
      <Box flexShrink={0} mt="2px">
        <DynamicIcon boxSize={3.5} color={kindColor} name={iconFor(award)} />
      </Box>
      <Box flex={1} minW={0}>
        <Text color={titleColor} fontSize="xs" fontWeight="medium" lineHeight="short">
          {award.title}
        </Text>
        <HStack flexWrap="wrap" gap={2} mt={0.5}>
          {award.org && (
            <Text color={mutedColor} fontSize="2xs">
              {award.org}
            </Text>
          )}
        </HStack>
      </Box>
      <VStack align="end" flexShrink={0} gap={0.5}>
        <Text color={mutedColor} fontFamily="mono" fontSize="2xs" whiteSpace="nowrap">
          {award.date}
        </Text>
        <Text
          color={kindColor}
          fontFamily="mono"
          fontSize="2xs"
          letterSpacing="wide"
          textTransform="uppercase"
        >
          {t(meta.labelKey)}
        </Text>
      </VStack>
    </Flex>
  )

  if (award.egg) {
    return (
      <VStack align="stretch" gap={1} title={award.egg}>
        {content}
        <Text color={eggTextColor} fontSize="xs" pl={8}>
          {award.egg}
        </Text>
      </VStack>
    )
  }

  return content
}

const AccomplishmentsTerminal: React.FC = () => {
  const { t } = useTranslation()
  const { awards } = useLocalizedData()
  const mutedColor = useColorModeValue('gray.500', 'gray.400')
  return (
    <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
      <Heading mb={3} size={['sm', 'md']}>
        {t('about.awardsAndHonors')}
      </Heading>
      <Text color={mutedColor} fontSize="xs" mb={4}>
        {awards.length} {t('about.awardsSpanning')} {new Set(awards.map((a) => a.kind)).size}{' '}
        {t('about.categories')}
      </Text>
      <VStack align="stretch" gap={0}>
        {awards.map((a, i) => (
          <AwardRow award={a} key={i} />
        ))}
      </VStack>
    </Container>
  )
}

export default AccomplishmentsTerminal
