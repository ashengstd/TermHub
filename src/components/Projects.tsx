import {
  Box,
  Collapsible,
  Dialog,
  Flex,
  HStack,
  Image,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type IconType } from 'react-icons'
import {
  FaChevronDown,
  FaCog,
  FaCrown,
  FaExternalLinkAlt,
  FaFolderOpen,
  FaGithub,
  FaMedium,
  FaSync,
  FaTimes,
  FaUser,
  FaYoutube,
} from 'react-icons/fa'
import { SiCsdn, SiZhihu } from 'react-icons/si'

import { type CatTheme, useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { withBase } from '@/utils/asset'
import { highlightData } from '@/utils/highlightData'

import type { ProjectItem } from '../types'

import { MotionHover, MotionList } from './animations/MotionList'

const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`
const bob = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}`

type CatThemeWithAnim = CatTheme & { anim: string }
type TabKey = 'all' | ProjectItem['category']
type TP = ProjectItem & { id: string }

const buildThemes = (
  base: Record<ProjectItem['category'], CatTheme>,
): Record<ProjectItem['category'], CatThemeWithAnim> => {
  const b = bob
  const durations: Record<ProjectItem['category'], number> = {
    data: 2.4,
    healthcare: 1.6,
    nlp: 1.8,
    robotics: 2.2,
    tooling: 2.6,
    'web-app': 2.0,
  }
  const result = {} as Record<ProjectItem['category'], CatThemeWithAnim>
  for (const [k, v] of Object.entries(base) as [ProjectItem['category'], CatTheme][]) {
    result[k] = { ...v, anim: `${b} ${durations[k].toString()}s ease-in-out infinite` }
  }
  return result
}

const roleConfig: Record<
  string,
  { color: (d: boolean) => string; icon: IconType; textKey: string }
> = {
  independent: {
    color: (d) => (d ? '#ebcb8b' : '#c47d46'),
    icon: FaUser,
    textKey: 'projects.independent',
  },
  lead: { color: (d) => (d ? '#d08770' : '#b35a2e'), icon: FaCrown, textKey: 'projects.lead' },
  maintainer: {
    color: (d) => (d ? '#a3be8c' : '#36805a'),
    icon: FaSync,
    textKey: 'projects.maintainer',
  },
  'tech-lead': {
    color: (d) => (d ? '#88c0d0' : '#2a769c'),
    icon: FaCog,
    textKey: 'projects.techLead',
  },
}

const linkIcon = (url: string): IconType => {
  if (url.includes('github.com')) return FaGithub
  if (url.includes('medium.com')) return FaMedium
  if (url.includes('youtu.be') || url.includes('youtube.com')) return FaYoutube
  if (url.includes('zhihu.com')) return SiZhihu
  if (url.includes('csdn.net')) return SiCsdn
  return FaExternalLinkAlt
}

const fmtDate = (v?: string) => {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
const getYear = (v?: string) => {
  if (!v) return 'Unknown'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? 'Unknown' : d.getFullYear().toString()
}

const FlowNode: React.FC<{
  ct: CatTheme
  hlc: { kw: string; num: string; str: string }
  isDark: boolean
  isLast: boolean
  item: TP
  onImageClick: (src: string, alt: string) => void
  termBorder: string
  termMuted: string
  termSecondary: string
  termText: string
}> = ({ ct, hlc, isDark, item, onImageClick, termBorder, termMuted, termSecondary, termText }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const role = roleConfig[item.role ?? 'independent']
  const hasImg = item.featuredImage !== undefined && item.featuredImage !== ''
  const res: { label: string; url: string }[] = []
  if (item.link) res.push({ label: t('projects.source'), url: item.link })
  item.extraLinks?.forEach((l) => {
    if (!res.some((r) => r.url === l.url)) res.push(l)
  })
  const hasExpandable =
    (item.highlights !== undefined && item.highlights.length > 0) || item.story !== undefined

  return (
    <Flex align="start" gap={[3, 3, 4]} position="relative" py={3}>
      <Box flexShrink={0} mt="6px">
        <Box
          bg={item.featured ? ct.color : 'transparent'}
          border="2px solid"
          borderColor={item.featured ? ct.color : termBorder}
          borderRadius="full"
          boxShadow={item.featured ? `0 0 8px ${ct.glow}` : undefined}
          h="14px"
          transition="all 0.2s"
          w="14px"
        />
      </Box>

      <Box flex={1} minW={0}>
        <HStack align="center" flexWrap="wrap" gap={2} mb={1}>
          <Box bg={ct.color} borderRadius="full" h="2px" w="16px" />
          <HStack color={ct.color} gap={1}>
            <Icon as={ct.icon} boxSize="10px" />
            <Text
              fontFamily="mono"
              fontSize="2xs"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {ct.label}
            </Text>
          </HStack>
          <Text color={termBorder} fontSize="2xs">
            /
          </Text>
          <HStack gap={1}>
            <Icon as={role.icon} boxSize="9px" color={role.color(isDark)} />
            <Text color={role.color(isDark)} fontFamily="mono" fontSize="2xs" fontWeight="bold">
              {t(role.textKey)}
            </Text>
          </HStack>
          <Text color={termMuted} flexShrink={0} fontFamily="mono" fontSize="2xs" ml="auto">
            {fmtDate(item.date)}
          </Text>
        </HStack>

        <Text
          _hover={hasExpandable ? { color: ct.color } : undefined}
          color={termText}
          cursor={hasExpandable ? 'pointer' : undefined}
          fontSize={['sm', 'md']}
          fontWeight="semibold"
          lineHeight="tall"
          mb={1}
          onClick={hasExpandable ? () => setExpanded((p) => !p) : undefined}
          transition="color 0.15s"
        >
          {item.title}
          {item.featured && (
            <Text as="span" color={hlc.num} fontSize="xs" ml={2}>
              ★
            </Text>
          )}
        </Text>

        {item.badge && (
          <HStack flexWrap="wrap" gap={1.5} mb={2}>
            <Text
              bg={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
              border={`1px solid ${ct.border}`}
              borderRadius="sm"
              color={ct.color}
              fontFamily="mono"
              fontSize="2xs"
              px={2}
              py={0.5}
            >
              {item.badge}
            </Text>
          </HStack>
        )}

        <Flex
          align="stretch"
          direction={['column', 'column', hasImg ? 'row' : 'column']}
          gap={[3, 3, 4]}
        >
          {hasImg && (
            <MotionHover>
              <Box
                borderRadius="sm"
                cursor="zoom-in"
                flexShrink={0}
                minH={['180px', '200px', 'auto']}
                onClick={() => {
                  if (item.featuredImage)
                    onImageClick(withBase(item.featuredImage) ?? '', item.title)
                }}
                overflow="hidden"
                w={['full', 'full', '260px']}
              >
                <Image
                  _hover={{ transform: 'scale(1.03)' }}
                  alt={item.title}
                  bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'}
                  h="full"
                  objectFit="contain"
                  p={1}
                  src={withBase(item.featuredImage)}
                  transition="transform 0.3s"
                  w="full"
                />
              </Box>
            </MotionHover>
          )}

          <VStack align="start" flex={1} gap={2.5} justify="center" minW={0}>
            <Text color={termSecondary} fontSize="xs" lineHeight="tall">
              {highlightData(item.summary, hlc)}
            </Text>
            <Box bg={termBorder} h="1px" opacity={0.4} w="full" />

            <HStack flexWrap="wrap" gap={1.5}>
              {res.map((r) => (
                <MotionHover key={r.url}>
                  <Link
                    _hover={{ textDecoration: 'none' }}
                    href={r.url}
                    onClick={(e) => e.stopPropagation()}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <HStack
                      _hover={{ borderColor: ct.color, color: ct.color }}
                      border="1px solid"
                      borderColor={termBorder}
                      borderRadius="sm"
                      color={termSecondary}
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
              {hasExpandable && (
                <MotionHover>
                  <HStack
                    _hover={{ borderColor: ct.color, color: ct.color }}
                    as="button"
                    border="1px solid"
                    borderColor={expanded ? ct.color : termBorder}
                    borderRadius="sm"
                    color={expanded ? ct.color : termSecondary}
                    fontFamily="mono"
                    fontSize="xs"
                    gap={1.5}
                    onClick={() => setExpanded((p) => !p)}
                    px={2.5}
                    py={1}
                    transition="all 0.15s"
                  >
                    <Icon
                      as={FaChevronDown}
                      boxSize="8px"
                      transform={expanded ? 'rotate(180deg)' : undefined}
                      transition="transform 0.15s"
                    />
                    <Text>{expanded ? t('projects.less') : t('projects.details')}</Text>
                  </HStack>
                </MotionHover>
              )}
            </HStack>

            {item.tags.length > 0 && (
              <HStack flexWrap="wrap" gap={1.5}>
                {item.tags.map((t) => (
                  <Text
                    bg={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
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
          </VStack>
        </Flex>

        <Collapsible.Root open={expanded}>
          <Collapsible.Content>
            <VStack align="stretch" gap={3} mt={3}>
              {item.Content && (
                <Box color={termSecondary} fontSize="xs" lineHeight="tall">
                  <item.Content />
                </Box>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <Box>
                  {item.highlights.map((h, i) => (
                    <Text color={termSecondary} fontSize="xs" key={i} lineHeight="1.8">
                      <Text as="span" color={ct.color} mr={1.5}>
                        ▸
                      </Text>
                      {highlightData(h, hlc)}
                    </Text>
                  ))}
                </Box>
              )}
              {item.story && (
                <Box
                  bg={isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)'}
                  borderLeft="2px solid"
                  borderLeftColor={ct.color}
                  borderRadius="md"
                  p={3}
                >
                  <Text color={termMuted} fontSize="xs" fontStyle="italic" lineHeight="tall">
                    "{highlightData(item.story, hlc)}"
                  </Text>
                </Box>
              )}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </Flex>
  )
}

const Projects: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { t } = useTranslation()
  const { projects: projectData, siteOwner } = useLocalizedData()

  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [imgPreview, setImgPreview] = useState<null | { alt: string; src: string }>(null)
  const [isImgOpen, setImgOpen] = useState(false)
  const [tick, setTick] = useState(0)

  const { buildCategoryThemes, terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const termBg = tc.bg
  const termText = tc.text
  const termHeader = tc.header
  const termTabBar = tc.tabBar
  const termBorder = tc.border
  const termPrompt = tc.prompt
  const termInfo = tc.info
  const termHighlight = tc.highlight
  const termSecondary = tc.secondary
  const termMuted = tc.muted
  const termCommand = tc.command
  const termSuccess = tc.success
  const hlc = { kw: termCommand, num: termHighlight, str: termSuccess }

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  const themes = useMemo(
    () => buildThemes(buildCategoryThemes(isDark)),
    [isDark, buildCategoryThemes],
  )
  const projects = useMemo<TP[]>(
    () => projectData.map((p, i) => ({ ...p, id: `p-${i.toString()}` })),
    [projectData],
  )

  const tabs = useMemo(() => {
    const cnt: Record<string, number> = { all: projects.length }
    projects.forEach((p) => {
      cnt[p.category] = (cnt[p.category] ?? 0) + 1
    })
    const cats: ProjectItem['category'][] = [
      'robotics',
      'nlp',
      'web-app',
      'data',
      'tooling',
      'healthcare',
    ]
    return [
      {
        color: termInfo,
        count: cnt.all,
        icon: FaFolderOpen,
        key: 'all' as TabKey,
        label: t('projects.all'),
      },
      ...cats
        .filter((k) => (cnt[k] ?? 0) > 0)
        .map((k) => ({
          color: themes[k].color,
          count: cnt[k],
          icon: themes[k].icon,
          key: k as TabKey,
          label: t(`category.${k}`),
        })),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, themes, isDark, t])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return projects
      .filter((p) => {
        if (activeTab !== 'all' && p.category !== activeTab) return false
        if (!q) return true
        return [p.title, p.summary, p.tags.join(' '), p.highlights?.join(' ')]
          .filter((s): s is string => s != null && s !== '')
          .some((s) => s.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0
        const db = b.date ? Date.parse(b.date) : 0
        if (da !== db) return db - da
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return (a.title || '').localeCompare(b.title || '')
      })
  }, [projects, searchQuery, activeTab])

  const yearGroups = useMemo(() => {
    const g: Record<string, TP[]> = {}
    filtered.forEach((p) => {
      const y = getYear(p.date)
      ;(g[y] ??= []).push(p)
    })
    return Object.entries(g)
      .sort(([a], [b]) => (a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : Number(b) - Number(a)))
      .map(([year, items]) => ({ items, year }))
  }, [filtered])

  const totalIndep = useMemo(
    () => projects.filter((p) => !p.role || p.role === 'independent').length,
    [projects],
  )
  const filteredIndep = useMemo(
    () => filtered.filter((p) => !p.role || p.role === 'independent').length,
    [filtered],
  )

  const onImgClick = useCallback((src: string, alt: string) => {
    setImgPreview({ alt, src })
    setImgOpen(true)
  }, [])

  const promptPath = activeTab === 'all' ? '~' : `~/${activeTab}`

  return (
    <Box py={8} w="full">
      <VStack gap={4} maxW="1400px" mx="auto" px={[2, 4, 8]}>
        <Box
          border="1px solid"
          borderColor={termBorder}
          borderRadius="md"
          boxShadow="lg"
          fontFamily="mono"
          overflow="hidden"
          w="full"
        >
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
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % palette.length
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3))
                return <Box bg={palette[colorIdx]} flex={1} h="full" key={i} opacity={brightness} />
              })
            })()}
          </Flex>

          <Flex
            align="center"
            bg={termHeader}
            color={termText}
            fontSize="xs"
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
                <Box as="span" color={tc.param}>
                  const{' '}
                </Box>
                <Box as="span" color={termPrompt} fontWeight="bold">
                  projects
                </Box>
                <Box as="span" color={termMuted}>
                  {' '}
                  ={' '}
                </Box>
                <Box as="span" color={tc.param}>
                  new{' '}
                </Box>
                <Box as="span" color={termInfo} fontWeight="bold">
                  Portfolio
                </Box>
                <Box as="span" color={termMuted}>
                  (
                </Box>
                <Box as="span" color={termHighlight}>
                  'showcase'
                </Box>
                <Box as="span" color={termMuted}>
                  )
                </Box>
              </Text>
            </HStack>
            <Text color={termHighlight} fontSize="xs">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                hour12: false,
                minute: '2-digit',
                second: '2-digit',
              })}
            </Text>
          </Flex>

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
            <Text color={termSecondary} truncate>
              <Text as="span" color={termPrompt} fontWeight="bold">
                {siteOwner.terminalUsername}
              </Text>
              <Text as="span" color={tc.border}>
                {' '}
                ·{' '}
              </Text>
              <Text as="span" color={termHighlight}>
                {projects.length}
              </Text>
              <Text as="span"> {t('projects.projectsAcross')} </Text>
              <Text as="span" color={termPrompt}>
                {totalIndep} {t('projects.independentlyBuilt')}
              </Text>
            </Text>
            <Text color={termInfo} flexShrink={0}>
              ~/projects/{promptPath === '~' ? 'all' : activeTab}
            </Text>
          </Flex>

          <Flex
            bg={termTabBar}
            borderBottom={`1px solid ${termBorder}`}
            css={{ '&::-webkit-scrollbar': { height: '0' } }}
            overflowX="auto"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.key
              return (
                <MotionHover key={tab.key}>
                  <Flex
                    _hover={{
                      bg: active ? termBg : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      color: tab.color,
                    }}
                    align="center"
                    as="button"
                    bg={active ? termBg : 'transparent'}
                    borderBottom={active ? `2px solid ${tab.color}` : '2px solid transparent'}
                    color={active ? tab.color : termMuted}
                    flexShrink={0}
                    fontFamily="mono"
                    fontSize="xs"
                    fontWeight={active ? 'bold' : 'normal'}
                    gap={1.5}
                    onClick={() => setActiveTab(tab.key)}
                    px={4}
                    py={2}
                    transition="all 0.15s"
                    whiteSpace="nowrap"
                  >
                    <Box
                      css={
                        active && tab.key !== 'all'
                          ? { animation: themes[tab.key].anim }
                          : undefined
                      }
                    >
                      <Icon as={tab.icon} boxSize="12px" />
                    </Box>
                    {tab.label}
                    <Text as="span" opacity={0.7}>
                      ({tab.count})
                    </Text>
                  </Flex>
                </MotionHover>
              )
            })}
          </Flex>

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
              {siteOwner.terminalUsername}@projects:{promptPath}$
            </Text>
            <Input
              _focus={{ outline: 'none' }}
              _placeholder={{ color: termSecondary }}
              border="none"
              color={termText}
              flex="1"
              fontFamily="mono"
              minW="120px"
              onChange={(e) => setSearchQuery(e.target.value)}
              outline="none"
              placeholder="grep -i '...'"
              size="xs"
              value={searchQuery}
            />
          </Flex>

          <Box
            bg={termBg}
            color={termText}
            css={{
              '&::-webkit-scrollbar': { background: 'transparent', width: '6px' },
              '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '3px' },
            }}
            key={activeTab}
            maxH="75vh"
            overflowY="auto"
          >
            <Box px={[3, 4, 5]} py={4}>
              <MotionList staggerDelay={0.15}>
                {yearGroups.map((group, gi) => (
                  <Box key={group.year} mb={gi < yearGroups.length - 1 ? 6 : 0}>
                    <HStack gap={2} mb={2} pl="2px">
                      <Text
                        color={termHighlight}
                        fontFamily="mono"
                        fontSize="2xs"
                        fontWeight="semibold"
                        letterSpacing="wide"
                      >
                        {group.year}
                      </Text>
                      <Box bg={termBorder} flex="1" h="1px" opacity={0.3} />
                      <Text color={termMuted} fontFamily="mono" fontSize="2xs">
                        {group.items.length} {t('projects.projects')}
                      </Text>
                    </HStack>
                    <Box position="relative">
                      <Box
                        bg={termBorder}
                        bottom="12px"
                        left="7px"
                        opacity={0.3}
                        position="absolute"
                        top="12px"
                        w="1px"
                      />
                      <VStack align="stretch" gap={0}>
                        {group.items.map((item, idx) => (
                          <FlowNode
                            ct={themes[item.category]}
                            hlc={hlc}
                            isDark={isDark}
                            isLast={idx === group.items.length - 1}
                            item={item}
                            key={item.id}
                            onImageClick={onImgClick}
                            termBorder={termBorder}
                            termMuted={termMuted}
                            termSecondary={termSecondary}
                            termText={termText}
                          />
                        ))}
                      </VStack>
                    </Box>
                  </Box>
                ))}
              </MotionList>
            </Box>
            {filtered.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <Text color={termHighlight} fontSize="sm">
                  {t('projects.noMatches')}
                </Text>
                <Text color={termSecondary} fontSize="xs" mt={1}>
                  {t('projects.tryAdjustingSearch')}
                </Text>
              </Box>
            )}
          </Box>

          <Flex
            align="center"
            bg={termHeader}
            borderTop={`1px solid ${termBorder}`}
            color={termMuted}
            flexWrap="wrap"
            fontSize="2xs"
            gap={2}
            justify="space-between"
            px={4}
            py={1.5}
          >
            <HStack gap={3}>
              <Text>
                {filtered.length}/{projects.length} {t('projects.shown')}
              </Text>
              <HStack color={termHighlight} gap={1}>
                <Icon as={FaUser} boxSize="9px" />
                <Text fontWeight="bold">
                  {filteredIndep} {t('projects.independent')}
                </Text>
              </HStack>
            </HStack>
            <HStack gap={1}>
              <Text color={termPrompt}>
                {siteOwner.terminalUsername}@projects:{promptPath}$
              </Text>
              <Box
                bg={termPrompt}
                css={{ animation: `${blink} 1s step-end infinite` }}
                h="11px"
                w="6px"
              />
            </HStack>
          </Flex>
        </Box>

        {imgPreview && (
          <Dialog.Root
            onOpenChange={(e) => {
              if (!e.open) setImgOpen(false)
            }}
            open={isImgOpen}
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
                  <Box as="button" color="white" onClick={() => setImgOpen(false)}>
                    <Icon as={FaTimes} boxSize={6} />
                  </Box>
                </Flex>
                <Dialog.Body alignItems="center" display="flex" justifyContent="center" p={0}>
                  <Image
                    alt={imgPreview.alt}
                    bg={isDark ? 'rgba(0,0,0,0.85)' : 'white'}
                    border={`1px solid ${termBorder}`}
                    borderRadius="md"
                    maxH="80vh"
                    maxW="90vw"
                    objectFit="contain"
                    p={4}
                    src={imgPreview.src}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
      </VStack>
    </Box>
  )
}

export default Projects
