import {
  Box,
  Collapsible,
  Container,
  Dialog,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaTimes } from 'react-icons/fa'

import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { selectedPublicationIds } from '@/site.config'

import DynamicIcon from '../DynamicIcon'

const PubLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const hoverBg = isDark ? 'whiteAlpha.50' : 'gray.50'
  const borderColor = isDark ? 'gray.600' : 'gray.200'
  const textColor = isDark ? 'gray.400' : 'gray.600'

  return (
    <Link _hover={{ textDecoration: 'none' }} href={href} rel="noopener noreferrer" target="_blank">
      <HStack
        _hover={{
          bg: hoverBg,
          borderColor: 'cyan.400',
          color: 'cyan.400',
        }}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="sm"
        color={textColor}
        fontFamily="mono"
        fontSize="xs"
        gap={1.5}
        px={2.5}
        py={1}
        transition="all 0.15s"
      >
        <DynamicIcon boxSize={3} name={icon} />
        <Text>{label}</Text>
      </HStack>
    </Link>
  )
}

interface Publication {
  abstract?: string
  authors: string[]
  coFirstAuthors?: string[]
  featuredImage?: string
  id: string
  isCoFirst?: boolean
  keywords?: string[]
  links: {
    arxiv?: string
    code?: string
    dataset?: string
    demo?: string
    paper?: string
    projectPage?: string
  }
  specialBadges?: string[]
  title: string
  venue?: string
  venueType?: string
  year: number | string
}

const PublicationCard = ({ pub }: { pub: Publication }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const [isAbstractOpen, setAbstractOpen] = useState(false)
  const [isImageOpen, setImageOpen] = useState(false)

  const borderColor = isDark ? 'gray.700' : 'gray.200'
  const cardBg = isDark ? 'gray.800' : 'white'
  const hoverBorderColor = isDark ? 'cyan.600' : 'cyan.300'
  const imageBg = isDark ? 'gray.900' : 'gray.50'
  const metaColor = isDark ? 'gray.500' : 'gray.400'
  const titleColor = isDark ? 'gray.100' : 'gray.800'
  const authorColor = isDark ? 'gray.400' : 'gray.500'
  const highlightAuthorColor = isDark ? 'gray.200' : 'gray.700'
  const separatorColor = isDark ? 'gray.700' : 'gray.100'
  const abstractBg = isDark ? 'gray.900' : 'gray.50'
  const abstractBorderColor = isDark ? 'cyan.600' : 'cyan.300'
  const abstractTextColor = isDark ? 'gray.400' : 'gray.600'
  const imagePreviewBg = isDark ? 'gray.900' : 'white'

  return (
    <Box
      _hover={{ borderColor: hoverBorderColor }}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={[4, 5, 6]}
      transition="all 0.2s"
    >
      <Flex align="stretch" direction={['column', 'column', 'row']} gap={[4, 4, 6]}>
        {pub.featuredImage && (
          <Box
            borderRadius="sm"
            cursor="zoom-in"
            flexShrink={0}
            minH={['200px', '220px', 'auto']}
            onClick={() => setImageOpen(true)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setImageOpen(true)
              }
            }}
            overflow="hidden"
            role="button"
            tabIndex={0}
            w={['full', 'full', '300px']}
          >
            <Image
              _hover={{ transform: 'scale(1.03)' }}
              alt={pub.title}
              bg={imageBg}
              h="full"
              objectFit="contain"
              p={1}
              src={pub.featuredImage}
              transition="transform 0.3s"
              w="full"
            />
          </Box>
        )}
        <VStack align="start" flex={1} gap={2.5} justify="center">
          <HStack align="center" flexWrap="wrap" gap={2}>
            <Box bg="cyan.400" borderRadius="full" h="2px" w="16px" />
            <Text
              color="cyan.400"
              fontFamily="mono"
              fontSize="xs"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {pub.venue?.includes(pub.year.toString())
                ? pub.venue
                : `${pub.venue ?? ''} ${pub.year.toString()}`}
            </Text>
            {pub.venueType && (
              <Text color={metaColor} fontFamily="mono" fontSize="2xs">
                / {pub.venueType}
              </Text>
            )}
          </HStack>
          <Heading color={titleColor} fontWeight="semibold" lineHeight="tall" size="sm">
            {pub.title}
          </Heading>
          <VStack align="start" gap={1.5} w="full">
            <Text color={authorColor} fontSize="xs" lineClamp={2} lineHeight="base">
              {pub.authors.map((author: string, idx: number) => {
                const isHighlighted = pub.isCoFirst && pub.coFirstAuthors?.includes(author)
                return (
                  <Text
                    as="span"
                    color={isHighlighted ? highlightAuthorColor : undefined}
                    fontWeight={isHighlighted ? 'semibold' : 'normal'}
                    key={idx}
                  >
                    {author}
                    {isHighlighted && (
                      <Text as="sup" color="cyan.400" fontSize="2xs">
                        *
                      </Text>
                    )}
                    {idx < pub.authors.length - 1 && ', '}
                  </Text>
                )
              })}
            </Text>
            {pub.specialBadges && pub.specialBadges.length > 0 && (
              <HStack flexWrap="wrap" gap={1.5}>
                {pub.specialBadges.map((badge: string) => {
                  const isPrimary = badge === 'First Author' || badge === 'Co-First'
                  const isHighlight =
                    badge === 'Oral' || badge === 'Spotlight' || badge === 'Best Paper'

                  let badgeBg = 'transparent'
                  let badgeBorder = isDark ? 'gray.600' : 'gray.200'
                  let badgeText = isDark ? 'gray.400' : 'gray.500'

                  if (isPrimary) {
                    badgeBg = isDark ? 'whiteAlpha.50' : 'cyan.50'
                    badgeBorder = isDark ? 'cyan.700' : 'cyan.200'
                    badgeText = isDark ? 'cyan.300' : 'cyan.600'
                  } else if (isHighlight) {
                    badgeBg = isDark ? 'whiteAlpha.50' : 'orange.50'
                    badgeBorder = isDark ? 'orange.700' : 'orange.200'
                    badgeText = isDark ? 'orange.300' : 'orange.600'
                  }

                  return (
                    <Text
                      bg={badgeBg}
                      border="1px solid"
                      borderColor={badgeBorder}
                      borderRadius="sm"
                      color={badgeText}
                      fontFamily="mono"
                      fontSize="2xs"
                      key={badge}
                      px={2}
                      py={0.5}
                    >
                      {badge}
                    </Text>
                  )
                })}
                {pub.isCoFirst && (
                  <Text color={metaColor} fontSize="2xs" fontStyle="italic">
                    {t('about.equalContribution')}
                  </Text>
                )}
              </HStack>
            )}
          </VStack>
          <Box bg={separatorColor} h="1px" w="full" />
          <HStack flexWrap="wrap" gap={1.5}>
            {pub.links.paper && (
              <PubLink href={pub.links.paper} icon="FaFileAlt" label={t('about.paper')} />
            )}
            {pub.links.arxiv && (
              <PubLink href={pub.links.arxiv} icon="SiArxiv" label={t('about.arXiv')} />
            )}
            {pub.links.projectPage && (
              <PubLink href={pub.links.projectPage} icon="FaGlobe" label={t('about.project')} />
            )}
            {pub.links.code && (
              <PubLink href={pub.links.code} icon="FaGithub" label={t('about.code')} />
            )}
            {pub.links.demo && (
              <PubLink href={pub.links.demo} icon="FaPlay" label={t('about.demo')} />
            )}
            {pub.links.dataset && (
              <PubLink href={pub.links.dataset} icon="FaDatabase" label={t('about.dataset')} />
            )}
            {pub.abstract && (
              <HStack
                _hover={{ borderColor: 'cyan.400', color: 'cyan.400' }}
                as="button"
                border="1px solid"
                borderColor={isAbstractOpen ? abstractBorderColor : borderColor}
                borderRadius="sm"
                color={isAbstractOpen ? 'cyan.400' : abstractTextColor}
                fontFamily="mono"
                fontSize="xs"
                gap={1.5}
                onClick={() => setAbstractOpen(!isAbstractOpen)}
                px={2.5}
                py={1}
                transition="all 0.15s"
              >
                <DynamicIcon
                  boxSize={2.5}
                  name="FaChevronRight"
                  style={{
                    transform: isAbstractOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                />
                <Text>{t('about.abstract')}</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </Flex>
      {pub.abstract && (
        <Collapsible.Root open={isAbstractOpen}>
          <Collapsible.Content>
            <Box
              bg={abstractBg}
              borderLeft="2px solid"
              borderLeftColor="cyan.400"
              borderRadius="md"
              mt={4}
              p={4}
            >
              <Text color={authorColor} fontSize={['xs', 'sm']} lineHeight="tall">
                {pub.abstract}
              </Text>
              {pub.keywords && (
                <HStack flexWrap="wrap" gap={1.5} mt={3}>
                  {pub.keywords.map((keyword: string) => (
                    <Text
                      bg={separatorColor}
                      borderRadius="sm"
                      color={metaColor}
                      fontFamily="mono"
                      fontSize="2xs"
                      key={keyword}
                      px={1.5}
                      py={0.5}
                    >
                      {keyword}
                    </Text>
                  ))}
                </HStack>
              )}
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {pub.featuredImage && (
        <Dialog.Root
          onOpenChange={(e) => {
            if (!e.open) setImageOpen(false)
          }}
          open={isImageOpen}
        >
          <Dialog.Backdrop bg="rgba(0,0,0,0.8)" />
          <Dialog.Positioner
            alignItems="center"
            display="flex"
            inset={0}
            justifyContent="center"
            position="fixed"
            zIndex={1400}
          >
            <Dialog.Content bg="transparent" boxShadow="none" p={0}>
              <Flex justify="flex-end" mb={2} w="full">
                <Box as="button" color="white" onClick={() => setImageOpen(false)}>
                  <Icon as={FaTimes} boxSize={6} />
                </Box>
              </Flex>
              <Dialog.Body alignItems="center" display="flex" justifyContent="center" p={0}>
                <Image
                  alt={`${pub.title} large preview`}
                  bg={imagePreviewBg}
                  borderRadius="lg"
                  maxH="80vh"
                  maxW="90vw"
                  objectFit="contain"
                  p={4}
                  src={pub.featuredImage}
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Box>
  )
}

const SelectedPublicationsSection: React.FC = () => {
  const { t } = useTranslation()
  const { publications } = useLocalizedData()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const lineBg = isDark ? 'gray.700' : 'gray.200'
  const viewAllColor = isDark ? 'gray.400' : 'gray.500'

  const selectedPubs = useMemo(
    () => publications.filter((pub) => selectedPublicationIds.has(pub.id)),
    [publications],
  )

  if (selectedPubs.length === 0) return null

  return (
    <Box py={6} w="full">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={[3, 4]}>
          <Box bg="cyan.400" borderRadius="full" flexShrink={0} h="2px" w="20px" />
          <Heading fontWeight="semibold" size="md">
            {t('about.selectedPublications')}
          </Heading>
          <Box bg={lineBg} flex="1" h="1px" />
        </Flex>
        <VStack align="stretch" gap={[4, 5, 6]}>
          {selectedPubs.map((pub) => (
            <PublicationCard key={pub.id} pub={pub as unknown as Publication} />
          ))}
          <Box pt={2} textAlign="center">
            <Link _hover={{ textDecoration: 'none' }} href="/publications">
              <HStack
                _hover={{ color: 'cyan.400' }}
                color={viewAllColor}
                fontFamily="mono"
                fontSize="sm"
                gap={2}
                justify="center"
                transition="all 0.15s"
              >
                <Text>{t('about.viewAllPublications')}</Text>
                <Text>→</Text>
              </HStack>
            </Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default SelectedPublicationsSection
