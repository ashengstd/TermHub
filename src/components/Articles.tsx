import { Box, Collapsible, Flex, HStack, Icon, Input, Link, Text, VStack } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type IconType } from 'react-icons'
import { FaExternalLinkAlt, FaGithub, FaMedium, FaYoutube } from 'react-icons/fa'
import { SiCsdn, SiZhihu } from 'react-icons/si'

import { useThemeConfig } from '@/config/theme'
import { useColorMode, useColorModeValue } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import type { ProjectItem } from '../types'

import { highlightData } from '../utils/highlightData'
import { MotionBox, MotionHover, MotionList } from './animations/MotionList'

/* ── Keyframes ─────────────────────────────────────────────────── */
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`

/* ── Types ─────────────────────────────────────────────────────── */
type CategoryFilter = 'all' | ProjectItem['category']

/* ── Category config (from config/theme.ts) ──────────────────── */

/* ── Helpers ───────────────────────────────────────────────────── */
const linkIcon = (url: string): IconType => {
  if (!url) return FaExternalLinkAlt
  if (url.includes('github.com')) return FaGithub
  if (url.includes('medium.com')) return FaMedium
  if (url.includes('youtu.be') || url.includes('youtube.com')) return FaYoutube
  if (url.includes('zhihu.com')) return SiZhihu
  if (url.includes('csdn.net')) return SiCsdn
  return FaExternalLinkAlt
}

const fmtDate = (v?: string) => {
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getYear = (v?: string) => {
  if (!v) return ''
  return new Date(v).getFullYear().toString()
}

/** Known article-type tags — first match becomes the type label */
const typeTags = new Set([
  'case study',
  'deep dive',
  'guide',
  'notes',
  'overview',
  'review',
  'setup notes',
  'troubleshooting',
  'tutorial',
  'walkthrough',
])

const getArticleType = (tags?: string[]): null | string => {
  if (!tags) return null
  const found = tags.find((t) => typeTags.has(t.toLowerCase()))
  return found ?? null
}

/* ── Component ─────────────────────────────────────────────────── */
const Articles: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { t } = useTranslation()
  const { articles: articleData, siteOwner } = useLocalizedData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')

  /* Terminal palette (centralized) */
  const { articleCategoryColors: categoryColors, terminalPalette } = useThemeConfig()
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
  const termSuccess = tc.success
  const termSecondary = tc.secondary
  const termMuted = tc.muted
  const pageBg = useColorModeValue('gray.50', 'gray.900')
  const articleHoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const expandedBg = isDark ? 'rgba(76,86,106,0.1)' : 'rgba(203,213,225,0.15)'
  const tagBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  })

  const articles = useMemo(
    () => articleData.map((a, i) => ({ ...a, id: `article-${i.toString()}` })),
    [articleData],
  )

  const availableCategories = useMemo(() => {
    const set = new Set<ProjectItem['category']>()
    articles.forEach((e) => set.add(e.category))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [articles])

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return articles
      .filter((e) => {
        if (selectedCategory !== 'all' && e.category !== selectedCategory) return false
        if (!q) return true
        return [e.title, e.summary, e.tags.join(' ')]
          .filter((s) => s !== '')
          .some((t) => t.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0
        const db = b.date ? Date.parse(b.date) : 0
        return db - da
      })
  }, [articles, searchQuery, selectedCategory])

  const yearGroups = useMemo(() => {
    const map = new Map<string, typeof filteredArticles>()
    filteredArticles.forEach((a) => {
      const y = getYear(a.date) || 'Unknown'
      const list = map.get(y) ?? []
      list.push(a)
      map.set(y, list)
    })
    return Array.from(map.entries()).sort(([a], [b]) =>
      a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : Number(b) - Number(a),
    )
  }, [filteredArticles])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const promptPath = selectedCategory === 'all' ? '~' : `~/${selectedCategory}`

  return (
    <Box bg={pageBg} minH="100vh" py={8} w="full">
      <VStack gap={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>
        <Box
          bg={termBg}
          borderRadius="md"
          boxShadow={`0 0 0 1px ${termBorder}, 0 4px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`}
          fontFamily="mono"
          overflow="hidden"
          w="full"
        >
          {/* ═══ Pixel RGB light bar ═══ */}
          <Flex borderTopRadius="md" h="3px" overflow="hidden" w="full">
            {(() => {
              const palette = [
                '#bf616a',
                '#d08770',
                '#ebcb8b',
                '#a3be8c',
                '#88c0d0',
                '#5e81ac',
                '#b48ead',
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

          {/* ═══ Title bar ═══ */}
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
                <Box as="span" color={termParam}>
                  const{' '}
                </Box>
                <Box as="span" color={termPrompt} fontWeight="bold">
                  articles
                </Box>
                <Box as="span" color={termSecondary}>
                  {' '}
                  ={' '}
                </Box>
                <Box as="span" color={termParam}>
                  new{' '}
                </Box>
                <Box as="span" color={termCommand} fontWeight="bold">
                  Reader
                </Box>
                <Box as="span" color={termSecondary}>
                  (
                </Box>
                <Box as="span" color={termHighlight}>
                  'blog'
                </Box>
                <Box as="span" color={termSecondary}>
                  )
                </Box>
              </Text>
            </HStack>
            <Text color={termHighlight}>{formattedTime}</Text>
          </Flex>

          {/* ═══ Touch bar ═══ */}
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
            <Text
              color={termSecondary}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              <Text as="span" color={termPrompt} fontWeight="bold">
                {siteOwner.terminalUsername}
              </Text>
              <Text as="span" color={tc.border}>
                {' '}
                ·{' '}
              </Text>
              <Text as="span" color={termHighlight}>
                {articles.length}
              </Text>
              <Text as="span"> {t('articles.technicalArticles')} </Text>
              <Text as="span" color={termCommand}>
                {availableCategories.length} {t('articles.domains')}
              </Text>
            </Text>
            <Text color={termInfo} flexShrink={0}>
              ~/blog
            </Text>
          </Flex>

          {/* ═══ Toolbar ═══ */}
          <Flex
            align="center"
            bg={termBg}
            borderBottom={`1px solid ${termBorder}`}
            fontSize="xs"
            gap={2}
            px={4}
            py={2}
          >
            <Text color={termPrompt} flexShrink={0}>
              {siteOwner.terminalUsername}@blog:{promptPath}$
            </Text>
            <Input
              _placeholder={{ color: termSecondary }}
              color={termText}
              flex="1"
              fontFamily="mono"
              minW="120px"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="grep -i '...'"
              size="xs"
              value={searchQuery}
              variant="flushed"
            />
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value as CategoryFilter)
              }
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                border: `1px solid ${termBorder}`,
                borderRadius: '4px',
                color: termText,
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '2px 6px',
                width: '130px',
              }}
              value={selectedCategory}
            >
              <option value="all">{t('articles.allTopics')}</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {t(`categoryLabel.${c}`)}
                </option>
              ))}
            </select>
          </Flex>

          {/* ═══ Content ═══ */}
          <Box
            bg={termBg}
            color={termText}
            css={{
              '&::-webkit-scrollbar': { background: 'transparent', width: '6px' },
              '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '3px' },
            }}
            maxH="70vh"
            overflowY="auto"
          >
            <Box px={[3, 4, 5]} py={4}>
              <MotionList staggerDelay={0.08}>
                {yearGroups.map(([year, items], gi) => (
                  <Box key={year} mb={gi < yearGroups.length - 1 ? 6 : 0}>
                    {/* Year heading */}
                    <HStack gap={2} mb={2} pl="2px">
                      <Text
                        color={termHighlight}
                        fontFamily="mono"
                        fontSize="2xs"
                        fontWeight="semibold"
                        letterSpacing="wide"
                      >
                        {year}
                      </Text>
                      <Box bg={termBorder} flex="1" h="1px" opacity={0.3} />
                      <Text color={termMuted} fontFamily="mono" fontSize="2xs">
                        {items.length}{' '}
                        {items.length === 1 ? t('articles.article') : t('articles.articles')}
                      </Text>
                    </HStack>

                    {/* Articles in year */}
                    <VStack align="stretch" gap={0}>
                      {items.map((item) => {
                        const ct = categoryColors[item.category]
                        const articleType = getArticleType(item.tags)
                        const resources: { label: string; url: string }[] = []
                        if (item.link) resources.push({ label: 'Source', url: item.link })
                        if (item.extraLinks) {
                          item.extraLinks.forEach((l) => {
                            if (!resources.some((r) => r.url === l.url))
                              resources.push({ label: l.label, url: l.url })
                          })
                        }
                        const isExpanded = expandedItems[item.id]

                        return (
                          <MotionBox key={item.id}>
                            <Box
                              _hover={{ bg: articleHoverBg }}
                              borderBottom={`1px dotted ${termBorder}`}
                            >
                              <Flex
                                align="center"
                                cursor="pointer"
                                fontSize="sm"
                                onClick={() => toggleExpanded(item.id)}
                                px={[0, 0.5]}
                                py={3}
                              >
                                {/* Date */}
                                <Text
                                  color={termHighlight}
                                  flexShrink={0}
                                  fontSize="xs"
                                  w={['70px', '90px']}
                                >
                                  {fmtDate(item.date)}
                                </Text>

                                {/* Category badge */}
                                <Flex
                                  align="center"
                                  bg={ct.bg(isDark)}
                                  borderRadius="sm"
                                  color={ct.fg(isDark)}
                                  flexShrink={0}
                                  fontSize="2xs"
                                  fontWeight="bold"
                                  gap={1}
                                  justifyContent="center"
                                  px={1.5}
                                  py={0.5}
                                  textTransform="uppercase"
                                  w={['60px', '80px']}
                                >
                                  {t(`categoryLabel.${item.category}`).split(' ')[0]}
                                </Flex>

                                {/* Title + type */}
                                <Box flex="1" minW={0} px={[2, 3]}>
                                  <Text
                                    color={termText}
                                    fontWeight="medium"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                  >
                                    {item.title}
                                  </Text>
                                  {articleType && (
                                    <Text color={termSecondary} fontSize="2xs" mt={0.5}>
                                      {articleType}
                                    </Text>
                                  )}
                                </Box>

                                {/* Links (desktop) */}
                                <HStack display={['none', 'flex']} flexShrink={0} gap={1.5}>
                                  {resources.slice(0, 3).map((r) => (
                                    <MotionHover key={r.url}>
                                      <Link
                                        _hover={{ textDecoration: 'none' }}
                                        href={r.url}
                                        onClick={(e) => e.stopPropagation()}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        <Flex
                                          _hover={{
                                            borderColor: ct.fg(isDark),
                                            color: ct.fg(isDark),
                                          }}
                                          align="center"
                                          border="1px solid"
                                          borderColor={termBorder}
                                          borderRadius="sm"
                                          color={termCommand}
                                          fontFamily="mono"
                                          fontSize="2xs"
                                          gap={1}
                                          px={2}
                                          py={0.5}
                                          transition="all 0.15s"
                                          whiteSpace="nowrap"
                                        >
                                          <Icon as={linkIcon(r.url)} boxSize="10px" />
                                          <Text>{r.label}</Text>
                                        </Flex>
                                      </Link>
                                    </MotionHover>
                                  ))}
                                </HStack>

                                {/* Expand */}
                                <Flex flexShrink={0} justify="center" w="40px">
                                  <Box
                                    color={isExpanded ? termInfo : termCommand}
                                    fontSize="xs"
                                    fontWeight="bold"
                                  >
                                    {isExpanded ? '[-]' : '[+]'}
                                  </Box>
                                </Flex>
                              </Flex>

                              {/* Expanded details */}
                              <Collapsible.Root open={isExpanded}>
                                <Collapsible.Content>
                                  <Box
                                    bg={expandedBg}
                                    borderLeft={`2px solid ${ct.fg(isDark)}`}
                                    px={[3, 4, 8]}
                                    py={3}
                                  >
                                    {/* Summary */}
                                    <Text color={termText} fontSize="xs" lineHeight="1.7" mb={2}>
                                      {highlightData(item.summary, {
                                        kw: termCommand,
                                        num: termHighlight,
                                        str: termSuccess,
                                      })}
                                    </Text>

                                    {/* Tags */}
                                    {item.tags.length > 0 && (
                                      <HStack flexWrap="wrap" gap={1.5} mb={2}>
                                        {item.tags.map((t) => (
                                          <Text
                                            bg={tagBg}
                                            borderRadius="sm"
                                            color={termMuted}
                                            fontFamily="mono"
                                            fontSize="2xs"
                                            key={t}
                                            px={1.5}
                                            py={0.5}
                                          >
                                            {t}
                                          </Text>
                                        ))}
                                      </HStack>
                                    )}

                                    {/* All links (visible on all screens when expanded) */}
                                    {resources.length > 0 && (
                                      <Flex gap={2} wrap="wrap">
                                        {resources.map((r) => (
                                          <MotionHover key={r.url}>
                                            <Link
                                              _hover={{ textDecoration: 'none' }}
                                              href={r.url}
                                              key={r.url}
                                              onClick={(e) => e.stopPropagation()}
                                              rel="noopener noreferrer"
                                              target="_blank"
                                            >
                                              <HStack
                                                _hover={{
                                                  borderColor: ct.fg(isDark),
                                                  color: ct.fg(isDark),
                                                }}
                                                border="1px solid"
                                                borderColor={termBorder}
                                                borderRadius="sm"
                                                color={termCommand}
                                                fontFamily="mono"
                                                fontSize="xs"
                                                gap={1.5}
                                                px={2.5}
                                                py={1}
                                                transition="all 0.15s"
                                              >
                                                <Icon as={linkIcon(r.url)} boxSize="11px" />
                                                <Text>{r.label}</Text>
                                              </HStack>
                                            </Link>
                                          </MotionHover>
                                        ))}
                                      </Flex>
                                    )}
                                  </Box>
                                </Collapsible.Content>
                              </Collapsible.Root>
                            </Box>
                          </MotionBox>
                        )
                      })}
                    </VStack>
                  </Box>
                ))}
              </MotionList>
            </Box>

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <Text color={termHighlight} fontSize="sm">
                  {t('articles.noMatches')}
                </Text>
                <Text color={termSecondary} fontSize="xs" mt={1}>
                  {t('articles.tryAdjustingFilter')}
                </Text>
              </Box>
            )}
          </Box>

          {/* ═══ Status bar ═══ */}
          <Flex
            align="center"
            bg={termHeader}
            borderTop={`1px solid ${termBorder}`}
            color={termMuted}
            fontSize="2xs"
            justify="space-between"
            px={4}
            py={1.5}
          >
            <Text>
              {filteredArticles.length}/{articles.length} {t('articles.shown')}
            </Text>
            <MotionBox delay={0.6}>
              <HStack gap={1}>
                <Text color={termPrompt}>
                  {siteOwner.terminalUsername}@blog:{promptPath}$
                </Text>
                <Box
                  bg={termPrompt}
                  css={{ animation: `${blink} 1s step-end infinite` }}
                  h="11px"
                  w="6px"
                />
              </HStack>
            </MotionBox>
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
}

export default Articles
