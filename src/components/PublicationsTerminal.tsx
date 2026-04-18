import {
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Collapsible, Dialog } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { type IconType } from 'react-icons'
import {
  FaAtom,
  FaChartBar,
  FaChevronRight,
  FaCloudSun,
  FaFileAlt,
  FaFutbol,
  FaGlobe,
  FaHandRock,
  FaProjectDiagram,
  FaRobot,
  FaStar,
  FaTimes,
  FaVideo,
} from 'react-icons/fa'

import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import { getPublicationStats } from '../data'
import { highlightData } from '../utils/highlightData'
import { MotionBox, MotionHover, MotionList } from './animations/MotionList'

/* ── Emoji → Icon mapping ─────────────────────────────────────── */
const emojiIconMap: Record<string, IconType> = {
  '⚽': FaFutbol,
  '🌀': FaAtom,
  '🌐': FaGlobe,
  '🌟': FaStar,
  '🎬': FaVideo,
  '💭': FaCloudSun,
  '📝': FaFileAlt,
  '🕸️': FaProjectDiagram,
  '🤖': FaRobot,
  '🦾': FaHandRock,
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const PublicationsTerminal: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { publications, siteOwner } = useLocalizedData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedVenue, setSelectedVenue] = useState<string>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [showStats, setShowStats] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [, setCommandHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [imagePreview, setImagePreview] = useState<null | { alt: string; src: string; }>(null)
  const { onClose: closeImageModal, onOpen: openImageModal, open: isImageOpen } = useDisclosure()

  // Terminal theme colors
  const { publicationVenueColors, terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const termBg = tc.bg
  const termText = tc.text
  const termHeader = tc.header
  const termBorder = tc.border
  const termPrompt = tc.prompt
  const termCommand = tc.command
  const termParam = tc.param
  const termInfo = tc.info
  const termHighlight = tc.highlight
  const termError = tc.error
  const termSuccess = tc.success
  const termWarning = tc.warning
  const termSecondary = tc.secondary
  const hlc = { kw: termCommand, num: termHighlight, str: termSuccess }

  const venueColors = Object.fromEntries(
    Object.entries(publicationVenueColors).map(([k, v]) => [
      k,
      { bg: v.bg(isDark), fg: v.fg(isDark), label: v.label },
    ]),
  ) as Record<string, { bg: string; fg: string; label: string }>

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const stats = useMemo(() => getPublicationStats(publications), [publications])

  const filteredPublications = useMemo(() => {
    let filtered = [...publications]
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(query) ||
          pub.authors.some((author) => author.toLowerCase().includes(query)) ||
          pub.venue.toLowerCase().includes(query) ||
          pub.keywords?.some((keyword) => keyword.toLowerCase().includes(query)),
      )
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter((pub) => pub.year.toString() === selectedYear)
    }
    if (selectedVenue !== 'all') {
      filtered = filtered.filter((pub) => pub.venueType === selectedVenue)
    }
    filtered.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year
      return 0
    })
    return filtered
  }, [publications, searchQuery, selectedYear, selectedVenue])

  const availableYears = useMemo(() => {
    const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a)
    return years
  }, [publications])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleCommand = (cmd: string) => {
    const parts = cmd.toLowerCase().split(' ')
    const command = parts[0]
    switch (command) {
      case 'clear':
        setSearchQuery('')
        setSelectedYear('all')
        setSelectedVenue('all')
        break
      case 'filter':
        if (parts[1] === 'year' && parts[2]) setSelectedYear(parts[2])
        else if (parts[1] === 'venue' && parts[2]) setSelectedVenue(parts[2])
        break
      case 'help':
        alert(
          'Commands: search <query>, filter year <year>, filter venue <type>, stats, clear, help',
        )
        break
      case 'search':
        setSearchQuery(parts.slice(1).join(' '))
        break
      case 'stats':
        setShowStats(!showStats)
        break
    }
    setCommandHistory((prev) => [...prev, cmd])
    setCurrentCommand('')
  }

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  })

  const showImagePreview = useCallback(
    (src?: string, alt?: string) => {
      if (!src) return
      setImagePreview({ alt: alt ?? 'publication preview', src })
      openImageModal()
    },
    [openImageModal],
  )

  return (
    <Box py={8} w="full">
      <VStack gap={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>
        <Box
          bg={termBg}
          border={"1px solid"}
          borderColor={termBorder}
          borderRadius="md"
          boxShadow={"lg"}
          fontFamily="mono"
          overflow="hidden"
          w="full"
        >
          {/* RGB Light Bar */}
          <Flex h="3px" overflow="hidden" w="full">
            {(() => {
              const palette = [
                '#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#88c0d0', '#5e81ac', '#b48ead',
              ]
              const total = 28
              const tick = Math.floor(currentTime.getTime() / 200)
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % palette.length
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3))
                return <Box bg={palette[colorIdx]} flex={1} h="full" key={i} opacity={brightness} />
              })
            })()}
          </Flex>

          {/* Title Bar */}
          <Flex
            align="center"
            bg={termHeader}
            borderBottom={`1px solid ${termBorder}`}
            color={termText}
            fontSize="xs"
            fontWeight="medium"
            justify="space-between"
            px={4}
            py={2}
          >
            <HStack gap={3}>
              <HStack gap={1.5}>
                <Box bg="#bf616a" borderRadius="full" h="10px" w="10px" />
                <Box bg="#ebcb8b" borderRadius="full" h="10px" w="10px" />
                <Box bg="#a3be8c" borderRadius="full" h="10px" w="10px" />
              </HStack>
              <Text>
                <Box as="span" color={termParam}>const </Box>
                <Box as="span" color={termPrompt} fontWeight="bold">papers</Box>
                <Box as="span" color={termSecondary}> = </Box>
                <Box as="span" color={termParam}>new </Box>
                <Box as="span" color={termCommand} fontWeight="bold">Explorer</Box>
                <Box as="span" color={termSecondary}>(</Box>
                <Box as="span" color={termHighlight}>'publications'</Box>
                <Box as="span" color={termSecondary}>)</Box>
              </Text>
            </HStack>
            <Text color={termHighlight}>{formattedTime}</Text>
          </Flex>

          {/* Touch Bar */}
          <Flex
            align="center"
            bg={tc.touchBar}
            borderBottom={`1px solid ${termBorder}`}
            fontSize="2xs"
            justify="space-between"
            overflow="hidden"
            px={4}
            py={1}
          >
            <Text color={termSecondary}>
              <Text as="span" color={termPrompt} fontWeight="bold">{siteOwner.terminalUsername}</Text>
              <Text as="span" color={tc.border}> · </Text>
              <Text as="span" color={termHighlight}>{stats.total}</Text>
              <Text as="span"> papers, </Text>
              <Text as="span" color={termSuccess}>{stats.firstAuthor} first-authored</Text>
              <Text as="span"> across </Text>
              <Text as="span" color={termCommand}>{Object.keys(stats.byVenue).length} venue types</Text>
              <Text as="span" color={tc.border}> · </Text>
              <Text as="span" color={termParam}>{stats.withCode} open-source</Text>
            </Text>
            <Text color={termCommand} flexShrink={0}>~/papers</Text>
          </Flex>

          {/* Control Panel: Styled like terminal input */}
          <Box bg={termBg} borderBottom={`1px solid ${termBorder}`} px={4} py={3}>
            <Flex align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
              {/* Search Bar */}
              <Flex
                _focusWithin={{ borderColor: termHighlight, boxShadow: `0 0 0 1px ${termHighlight}` }}
                align="center"
                bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'}
                border={`1px solid ${termBorder}`}
                borderRadius="md"
                flex="1"
                px={3}
                py={1.5}
                transition="all 0.2s"
              >
                <Icon as={FaChevronRight} color={termPrompt} fontSize="xs" mr={2} />
                <Text color={termCommand} fontFamily="mono" fontSize="xs" fontWeight="bold" mr={2}>grep</Text>
                <Text color={termSecondary} display={{ base: "none", sm: "block" }} fontFamily="mono" fontSize="xs" mr={2}>-i</Text>
                <Input
                  _focus={{ border: 'none', outline: 'none' }}
                  _placeholder={{ color: termSecondary, opacity: 0.6 }}
                  border="none"
                  color={termText}
                  flex="1"
                  fontFamily="mono"
                  h="auto"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  outline="none"
                  p={0}
                  placeholder="'robotics' papers/*"
                  size="xs"
                  value={searchQuery}
                  variant="flushed"
                />
              </Flex>

              {/* Filter Controls Group */}
              <Flex flexWrap="wrap" gap={2} justify={{ base: "space-between", md: "flex-end" }}>
                {/* Year Select */}
                <Box flex={{ base: "1", md: "initial" }} minW="100px" position="relative">
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
                    style={{
                      appearance: 'none',
                      backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(termParam)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px',
                      border: `1px solid ${termBorder}`,
                      borderRadius: '6px',
                      color: termParam,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      height: '34px',
                      MozAppearance: 'none',
                      outline: 'none',
                      padding: '0 24px 0 10px',
                      WebkitAppearance: 'none',
                      width: '100%',
                    }}
                    value={selectedYear}
                  >
                    <option value="all">--year=ALL</option>
                    {availableYears.map((year) => (<option key={year} value={year}>--year={year}</option>))}
                  </select>
                </Box>

                {/* Venue Select */}
                <Box flex={{ base: "1.2", md: "initial" }} minW="110px" position="relative">
                  <select
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVenue(e.target.value)}
                    style={{
                      appearance: 'none',
                      backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(termParam)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px',
                      border: `1px solid ${termBorder}`,
                      borderRadius: '6px',
                      color: termParam,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      height: '34px',
                      MozAppearance: 'none',
                      outline: 'none',
                      padding: '0 24px 0 10px',
                      WebkitAppearance: 'none',
                      width: '100%',
                    }}
                    value={selectedVenue}
                  >
                    <option value="all">--type=ALL</option>
                    <option value="conference">--type=CONF</option>
                    <option value="workshop">--type=WORKSHOP</option>
                    <option value="demo">--type=DEMO</option>
                    <option value="preprint">--type=PREPRINT</option>
                  </select>
                </Box>

                {/* Stats Toggle Button */}
                <Box
                  _hover={{ opacity: 0.8 }}
                  alignItems="center"
                  as="button"
                  bg={showStats ? termHighlight : 'transparent'}
                  border={`1px solid ${showStats ? termHighlight : termBorder}`}
                  borderRadius="md"
                  color={showStats ? termBg : termInfo}
                  cursor="pointer"
                  display="flex"
                  flex={{ base: "1", md: "initial" }}
                  fontFamily="mono"
                  fontSize="xs"
                  fontWeight="bold"
                  height="34px"
                  justifyContent="center"
                  onClick={() => setShowStats(!showStats)}
                  px={3}
                  transition="all 0.2s"
                >
                  <Icon as={FaChartBar} mr={2} />
                  <Text as="span">--stats</Text>
                  <Text as="span" display={showStats ? "inline" : "none"} ml={1}>:ON</Text>
                </Box>
              </Flex>
            </Flex>
          </Box>

          <Collapsible.Root open={showStats}>
            <Collapsible.Content>
              <MotionBox delay={0.1}>
                <Box bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'} borderBottom={`1px solid ${termBorder}`} px={4} py={3}>
                  <Flex flexWrap="wrap" gap={4}>
                    <Box><Text color={termInfo} fontSize="xs">Total</Text><Text color={termHighlight} fontSize="lg" fontWeight="bold">{stats.total}</Text></Box>
                    <Box><Text color={termInfo} fontSize="xs">First Author</Text><Text color={termSuccess} fontSize="lg" fontWeight="bold">{stats.firstAuthor}</Text></Box>
                    <Box><Text color={termInfo} fontSize="xs">With Code</Text><Text color={termCommand} fontSize="lg" fontWeight="bold">{stats.withCode}</Text></Box>
                    <Box><Text color={termInfo} fontSize="xs">Conferences</Text><Text color={termParam} fontSize="lg" fontWeight="bold">{stats.byVenue.conference || 0}</Text></Box>
                    <Box><Text color={termInfo} fontSize="xs">Workshops</Text><Text color={termWarning} fontSize="lg" fontWeight="bold">{stats.byVenue.workshop || 0}</Text></Box>
                  </Flex>
                </Box>
              </MotionBox>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* List */}
          <Box bg={termBg} color={termText} css={{ '&::-webkit-scrollbar': { background: 'transparent', width: '8px' }, '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '4px' } }} maxH="70vh"
            overflowY="auto"
          >
            <Flex borderBottom={`1px solid ${termBorder}`} color={termInfo} fontSize="xs" fontWeight="bold" px={4} py={2}>
              <Text display={{ base: "none", md: "block" }} mr={6} w="320px">PREVIEW</Text>
              <Text flex="1">PUBLICATION</Text>
              <Text display={{ base: "none", md: "block" }} w="150px">RESOURCES</Text>
              <Text textAlign="center" w="50px">MORE</Text>
            </Flex>

            <MotionList staggerDelay={0.08}>
              {filteredPublications.map((pub) => (
                <MotionBox key={pub.id}>
                  <Box _hover={{ bg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} borderBottom={`1px dotted ${termBorder}`}>
                    <Flex align="center" cursor="pointer" fontSize="sm" minH="200px" onClick={() => toggleExpanded(pub.id)} position="relative" px={4} py={6}>
                      {pub.featuredImage && (
                        <MotionHover>
                          <Box
                            alignItems="center" bg={isDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.8)'} border={`1px solid ${termBorder}`} borderRadius="lg" cursor="zoom-in" display={{ base: "none", md: "flex" }} flexShrink={0}
                            h="180px" justifyContent="center" mr={6}
                            onClick={(e) => { e.stopPropagation(); showImagePreview(pub.featuredImage, `${pub.title} thumbnail`) }} overflow="hidden" role="button" tabIndex={0}
                            w="320px"
                          >
                            <Image alt={pub.title} h="full" objectFit="contain" p={3} src={pub.featuredImage} transition="transform 0.2s" w="full" />
                          </Box>
                        </MotionHover>
                      )}
                      <Box flex="1" minW={0} pr={2}>
                        <HStack align="start" flexWrap="wrap" gap={1} mb={1}>
                          {pub.emoji !== undefined && (emojiIconMap as Record<string, React.ComponentType | undefined>)[pub.emoji] !== undefined && (
                            <Icon
                              as={emojiIconMap[pub.emoji]}
                              color={venueColors[pub.venueType].fg}
                              mr={1}
                              mt="3px"
                            />
                          )}
                          <Text
                            color={termText}
                            fontSize={['sm', 'md']}
                            fontWeight="600"
                            lineHeight="1.4"
                          >
                            {highlightData(pub.title, hlc)}
                          </Text>
                        </HStack>
                        <HStack align="center" flexWrap="wrap" gap={2}>
                          <Badge
                            bg={`${venueColors[pub.venueType].bg}20`}
                            borderColor={venueColors[pub.venueType].fg}
                            borderRadius="sm"
                            color={venueColors[pub.venueType].fg}
                            fontFamily="mono"
                            fontSize="2xs"
                            px={1.5}
                            py={0}
                            textAlign="left"
                            variant="outline"
                            whiteSpace="normal"
                          >
                            {pub.venue.includes(pub.year.toString())
                              ? pub.venue
                              : `${pub.venue} ${pub.year.toString()}`}
                          </Badge>
                          <Badge
                            colorPalette={
                              pub.venueType === 'conference'
                                ? 'blue'
                                : pub.venueType === 'workshop'
                                  ? 'purple'
                                  : pub.venueType === 'demo'
                                    ? 'orange'
                                    : 'green'
                            }
                            fontSize="2xs"
                          >
                            {venueColors[pub.venueType].label}
                          </Badge>
                          {pub.specialBadges?.map((badge, i) => (
                            <Badge
                              colorPalette={
                                badge === 'Best Paper'
                                  ? 'red'
                                  : badge === 'Oral'
                                    ? 'orange'
                                    : badge === 'Spotlight'
                                      ? 'yellow'
                                      : badge === 'First Author'
                                        ? 'green'
                                        : 'gray'
                              }
                              fontSize="2xs"
                              key={i}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </HStack>
                        <Text
                          color={termSecondary}
                          fontSize="xs"
                          overflowWrap="anywhere"
                          whiteSpace="normal"
                        >
                          {pub.authors.map((author, i) => {
                            const cleanAuthor = author.replace('*', '')
                            const hasAsterisk = author.includes('*')
                            const isOwner = (siteOwner.name.authorVariants as readonly string[]).includes(
                              cleanAuthor,
                            )
                            return (
                              <Text as="span" key={i}>
                                {isOwner ? (
                                  <Text as="span" color={termSuccess} fontWeight="bold">
                                    {cleanAuthor}
                                    {hasAsterisk && (
                                      <Text as="span" color={termWarning} position="relative" top="-0.2em">
                                        *
                                      </Text>
                                    )}
                                    {pub.isFirstAuthor && i === 0 && !hasAsterisk && ' (1st)'}
                                    {pub.isCorrespondingAuthor && ' (†)'}
                                  </Text>
                                ) : (
                                  <>
                                    {cleanAuthor}
                                    {hasAsterisk && (
                                      <Text as="span" color={termWarning} position="relative" top="-0.2em">
                                        *
                                      </Text>
                                    )}
                                  </>
                                )}
                                {i < pub.authors.length - 1 ? ', ' : ''}
                              </Text>
                            )
                          })}
                          {pub.coFirstAuthors && pub.coFirstAuthors.length > 0 && (
                            <Text as="span" color={termInfo} fontSize="2xs" ml={2}>
                              (* co-first)
                            </Text>
                          )}
                        </Text>
                      </Box>

                      <Box display={{ base: "none", md: "block" }} w="150px">
                        <HStack gap={1}>
                          {pub.links.paper && <MotionHover><Box title="Paper"><Link href={pub.links.paper} onClick={(e) => e.stopPropagation()} target="_blank"><Badge colorPalette="blue" fontSize="2xs">PDF</Badge></Link></Box></MotionHover>}
                          {pub.links.code && <MotionHover><Box title="Code"><Link href={pub.links.code} onClick={(e) => e.stopPropagation()} target="_blank"><Badge colorPalette="green" fontSize="2xs">CODE</Badge></Link></Box></MotionHover>}
                          {pub.links.projectPage && <MotionHover><Box title="Project"><Link href={pub.links.projectPage} onClick={(e) => e.stopPropagation()} target="_blank"><Badge colorPalette="purple" fontSize="2xs">PROJ</Badge></Link></Box></MotionHover>}
                        </HStack>
                      </Box>
                      <Text color={expandedItems[pub.id] ? termInfo : termCommand} fontWeight="bold" textAlign="center" w="50px">
                        {expandedItems[pub.id] ? '[-]' : '[+]'}
                      </Text>
                    </Flex>

                    <Collapsible.Root open={expandedItems[pub.id]}>
                      <Collapsible.Content>
                        <Box bg={isDark ? 'rgba(76, 86, 106, 0.15)' : 'rgba(203, 213, 225, 0.15)'} borderLeft={`3px solid ${venueColors[pub.venueType].fg || termBorder}`} px={8} py={4}>
                          <Flex flexDirection={{ base: "column", md: "row" }} gap={4}>
                            <Box flex="1">
                              {pub.Content && (
                                <Box mb={3}>
                                  <pub.Content />
                                </Box>
                              )}
                              {pub.abstract && (
                                <Box mb={3}>
                                  <Text color={termInfo} fontSize="xs" mb={1}>── ABSTRACT ─────────────</Text>
                                  <Text color={termText} fontSize="sm" lineHeight="tall">
                                    {highlightData(pub.abstract, { kw: termCommand, num: termHighlight, str: termSuccess })}
                                  </Text>
                                </Box>
                              )}
                              {pub.keywords && (
                                <Box mb={3}>
                                  <Text color={termInfo} fontSize="xs" mb={1}>── KEYWORDS ─────────────</Text>
                                  <HStack flexWrap="wrap" gap={2}>
                                    {pub.keywords.map((k, i) => <Badge colorPalette="cyan" fontSize="2xs" key={i}>{k}</Badge>)}
                                  </HStack>
                                </Box>
                              )}
                            </Box>
                            {pub.featuredImage && (
                              <MotionHover>
                                <Box
                                  alignItems="center"
                                  bg={isDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)'}
                                  border={`1px solid ${termBorder}`} borderRadius="lg" cursor="zoom-in" display="flex"
                                  flexShrink={0} h={{ base: "auto", md: "300px" }} justifyContent="center"
                                  onClick={(e) => { e.stopPropagation(); showImagePreview(pub.featuredImage, pub.title) }} overflow="hidden" w={{ base: "full", md: "450px" }}
                                >
                                  <Image alt={pub.title} h="full" objectFit="contain" p={4} src={pub.featuredImage} transition="transform 0.3s" w="full"/>
                                </Box>
                              </MotionHover>
                            )}
                          </Flex>
                        </Box>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </Box>
                </MotionBox>
              ))}
            </MotionList>

            {filteredPublications.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <Text color={termError} fontSize="sm">No publications found matching criteria</Text>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Flex align="center" bg={tc.header} borderTop={`1px solid ${termBorder}`} fontSize="xs" px={4} py={2}>
            <Text color={termPrompt} mr={2}>{siteOwner.terminalUsername}@research:~/papers$</Text>
              <Input
                _focus={{ outline: "none" }}
                border="none"
                color={termText}
                flex="1"
                fontFamily="mono"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentCommand(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') handleCommand(currentCommand)
                }}
                outline="none"
                placeholder="type 'help' for commands"
                size="xs"
                value={currentCommand}
              />
            <Box bg={termPrompt} css={{ animation: `${blink} 1s step-end infinite` }} h="12px" ml={1} w="6px" />
          </Flex>
        </Box>

        {imagePreview && (
          <Dialog.Root onOpenChange={(e) => { if (!e.open) closeImageModal() }} open={isImageOpen}>
            <Dialog.Backdrop bg="rgba(0,0,0,0.8)" />
            <Dialog.Positioner>
              <Dialog.Content bg="transparent" boxShadow="none" p={0}>
                <Flex justify="flex-end" mb={2} w="full">
                  <Box as="button" color="white" onClick={closeImageModal}><Icon as={FaTimes} boxSize={6} /></Box>
                </Flex>
                <Dialog.Body alignItems="center" display="flex" justifyContent="center" p={0}>
                  <Image alt={imagePreview.alt} bg={isDark ? 'rgba(0,0,0,0.85)' : 'white'} borderRadius="lg" maxH="80vh" maxW="90vw" objectFit="contain" p={4} src={imagePreview.src} />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}

        <MotionBox delay={0.4}>
          <Flex bg={termHeader} border={`1px solid ${termBorder}`} borderRadius="md" flexWrap="wrap" fontFamily="mono" fontSize="xs" gap={2} justify="space-between" px={4} py={2} w="full">
            <Text color={termInfo}>Showing <Text as="span" color={termHighlight} fontWeight="bold">{filteredPublications.length}</Text> of {publications.length} papers</Text>
            <HStack gap={4}>
              <Text color={termSuccess}>First Author: {filteredPublications.filter((p) => p.isFirstAuthor).length}</Text>
              <Text color={termCommand}>With Code: {filteredPublications.filter((p) => p.links.code).length}</Text>
            </HStack>
          </Flex>
        </MotionBox>
      </VStack>
    </Box>
  )
}

export default PublicationsTerminal
