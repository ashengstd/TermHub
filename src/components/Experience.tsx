import {
  Box,
  Collapsible,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown } from 'react-icons/fa'

import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

import type { RoleType } from '../types'

import { highlightData } from '../utils/highlightData'
import { MotionBox, MotionHover, MotionList } from './animations/MotionList'

/* ── Keyframes ─────────────────────────────────────────────────── */
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`

/* ── Types & config ────────────────────────────────────────────── */
type FilterType = 'academic' | 'all' | 'industry'

const categoryFilter: Record<string, FilterType> = {
  academic: 'academic',
  industry: 'industry',
  leadership: 'academic',
  research: 'academic',
}

const roleTypeConfig: Record<RoleType, { color: (dk: boolean) => string; labelKey: string; }> = {
  leadership: {
    color: (dk) => (dk ? '#ebcb8b' : '#c47d46'),
    labelKey: 'experience.roleLeadership',
  },
  mle: { color: (dk) => (dk ? '#88c0d0' : '#2a769c'), labelKey: 'experience.roleMLE' },
  research: { color: (dk) => (dk ? '#b48ead' : '#9a56a2'), labelKey: 'experience.roleResearch' },
  sde: { color: (dk) => (dk ? '#d08770' : '#b35a2e'), labelKey: 'experience.roleSDE' },
  teaching: { color: (dk) => (dk ? '#a3be8c' : '#34744e'), labelKey: 'experience.roleTeaching' },
}

/* ── Logos helper ────────────────────────────────────────────── */
const getIconUrl = (url?: string, company?: string, logos?: Record<string, string>) => {
  if (company && logos?.[company]) return logos[company]
  if (url) {
    try {
      return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
    } catch {
      /* fall through */
    }
  }
  return null
}

/* ── Helpers ────────────────────────────────────────────────────── */
// fmtDate is called inside the component where t() is available
const fmtDateFn = (v: string | undefined, presentLabel: string, lang: string) => {
  if (!v) return presentLabel
  if (v.toLowerCase() === 'present') return presentLabel
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/* ── Component ─────────────────────────────────────────────────── */
const Experience: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { i18n, t } = useTranslation()
  const {
    experience: experienceData,
    experienceTimeline,
    institutionLogos,
    siteOwner,
  } = useLocalizedData()
  const fmtDate = (v?: string) => fmtDateFn(v, t('experience.present'), i18n.language)

  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [command, setCommand] = useState('')
  const [cmdOutput, setCmdOutput] = useState<string[]>([])
  const [tick, setTick] = useState(0)

  /* Palette (centralized) */
  const { terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const termBg = tc.bg
  const termText = tc.text
  const termHeader = tc.header
  const termBorder = tc.border
  const termPrompt = tc.prompt
  const termCommand = tc.command
  const termInfo = tc.info
  const termHighlight = tc.highlight
  const termSuccess = tc.success
  const termSecondary = tc.secondary
  const hlc = { kw: termCommand, num: termHighlight, str: termSuccess }
  const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'

  useEffect(() => {
     
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  /* ── Data ──────────────────────────────────────────────────── */
  const sorted = useMemo(() => {
    return experienceTimeline
      .map((e) => ({ ...e, isCurrent: !e.end || e.end.toLowerCase() === 'present' }))
      .sort((a, b) => {
        if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
        return new Date(b.start).getTime() - new Date(a.start).getTime()
      })
  }, [experienceTimeline])

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    return sorted.filter((e) => categoryFilter[e.category] === filter)
  }, [sorted, filter])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const e of filtered) {
      const key = e.isCurrent ? 'Present' : new Date(e.end ?? '').getFullYear().toString()
      const list = map.get(key) ?? []
      list.push(e)
      map.set(key, list)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        if (a === 'Present') return -1
        if (b === 'Present') return 1
        return Number(b) - Number(a)
      })
      .map(([year, items]) => ({
        items: items.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
        year,
      }))
  }, [filtered])

  const stats = useMemo(() => {
    const current = sorted.filter((e) => e.isCurrent).length
    const academic = sorted.filter((e) => categoryFilter[e.category] === 'academic').length
    const industry = sorted.filter((e) => categoryFilter[e.category] === 'industry').length
    return { academic, current, industry, total: sorted.length }
  }, [sorted])

  const education = experienceData.education.courses
  const reviewingItems = useMemo(() => experienceData.reviewing, [experienceData.reviewing])
  const reviewingByYear = useMemo(() => {
    const groups: Record<string, typeof reviewingItems> = {}
    for (const item of reviewingItems) {
      const m = /\b(20\d{2})\b/.exec(item.venue)
      const y = m ? m[1] : 'Other'
      if (!(y in groups)) groups[y] = []
      groups[y].push(item)
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
  }, [reviewingItems])

  const toggleExpanded = (id: string) => setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))

  /* ── Command handler ───────────────────────────────────────── */
  const handleCommand = (cmd: string) => {
    const raw = cmd.trim()
    if (!raw) return
    const parts = raw.toLowerCase().split(' ')
    const out = (lines: string[]) => setCmdOutput(lines)
    switch (parts[0]) {
      case 'cat':
        if (parts[1] === 'skills') out([siteOwner.skills.join(' · ')])
        else out([`cat: ${parts[1] || ''}: not found`])
        break
      case 'clear':
        setFilter('all')
        setCmdOutput([])
        break
      case 'filter':
        if (parts[1] === 'academic' || parts[1] === 'industry') {
          setFilter(parts[1])
          out([`filter: ${parts[1]}`])
        } else {
          setFilter('all')
          out(['filter: all'])
        }
        break
      case 'help':
        out(['filter [all|academic|industry]  clear  whoami', 'sudo hire-me  cat skills'])
        break
      case 'sudo':
        if (parts.slice(1).join(' ') === 'hire-me')
          out([
            'initiating hire sequence...',
            `Email: ${siteOwner.contact.hiringEmail}`,
            'Status: Open to opportunities!',
          ])
        else out([`sudo: ${parts.slice(1).join(' ')}: permission denied`])
        break
      case 'whoami':
        out([siteOwner.name.full, 'researcher · ml engineer · builder'])
        break
      default:
        out([`bash: ${parts[0]}: command not found`])
    }
    setCommand('')
  }

  const termParam = tc.param
  const termWarning = tc.warning

  return (
    <Box py={8} w="full">
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
              const total = 28
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % terminalPalette.rainbow.length
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3))
                return (
                  <Box
                    bg={terminalPalette.rainbow[colorIdx]}
                    flex={1}
                    h="full"
                    key={i}
                    opacity={brightness}
                  />
                )
              })
            })()}
          </Flex>

          {/* ═══ Title bar ═══ */}
          <Flex
            align="center"
            bg={termHeader}
            borderBottom={`1px solid ${termBorder}`}
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
                  career
                </Box>
                <Box as="span" color={termSecondary}>
                  {' '}
                  ={' '}
                </Box>
                <Box as="span" color={termParam}>
                  new{' '}
                </Box>
                <Box as="span" color={termCommand} fontWeight="bold">
                  Explorer
                </Box>
                <Box as="span" color={termSecondary}>
                  (
                </Box>
                <Box as="span" color={termHighlight}>
                  'experience'
                </Box>
                <Box as="span" color={termSecondary}>
                  )
                </Box>
              </Text>
            </HStack>
            <Text color={termHighlight}>
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                hour12: false,
                minute: '2-digit',
                second: '2-digit',
              })}
            </Text>
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
                {stats.total}
              </Text>
              <Text as="span"> {t('experience.rolesAcross')} </Text>
              <Text as="span" color={termSuccess}>
                {stats.current} {t('experience.currentlyActive')}
              </Text>
              <Text as="span" color={tc.border}>
                {' '}
                ·{' '}
              </Text>
              <Text as="span" color={termParam}>
                {stats.academic} {t('experience.research')}
              </Text>
              <Text as="span">, </Text>
              <Text as="span" color={termWarning}>
                {stats.industry} {t('experience.industry')}
              </Text>
            </Text>
            <Text color={termCommand} flexShrink={0}>
              ~/career
            </Text>
          </Flex>

          {/* Education */}
          <MotionBox delay={0.1}>
            <Box bg={termBg} borderBottom={`1px solid ${termBorder}`} px={[3, 5]} py={3}>
              <Flex align="center" gap={2} mb={2.5}>
                <Box bg={termCommand} borderRadius="full" h="3px" w="14px" />
                <Text color={termInfo} fontSize="xs" fontWeight="bold" letterSpacing="0.06em">
                  {t('experience.education')}
                </Text>
                <Box bg={termBorder} flex="1" h="1px" />
              </Flex>
              <VStack align="stretch" gap={1.5} pl={1}>
                {education.map((edu) => {
                  const logo = institutionLogos[edu.institution]
                  return (
                    <HStack fontSize="xs" gap={2} key={edu.course}>
                      {logo ? (
                        <Image
                          alt=""
                          borderRadius="sm"
                          flexShrink={0}
                          h="16px"
                          objectFit="contain"
                          src={logo}
                          w="16px"
                        />
                      ) : (
                        <Box
                          bg={`${termCommand}20`}
                          borderRadius="sm"
                          flexShrink={0}
                          h="16px"
                          w="16px"
                        />
                      )}
                      <Text color={termText} fontWeight="medium">
                        {edu.course}
                      </Text>
                      <Text color={termSecondary}>·</Text>
                      <Text color={termCommand}>{edu.institution}</Text>
                      <Text color={termSecondary} flexShrink={0} ml="auto">
                        {edu.year}
                      </Text>
                    </HStack>
                  )
                })}
              </VStack>
            </Box>
          </MotionBox>

          {/* Filter bar */}
          <Flex
            align="center"
            bg={termBg}
            borderBottom={`1px solid ${termBorder}`}
            gap={1.5}
            px={[3, 5]}
            py={2}
          >
            {(['all', 'academic', 'industry'] as FilterType[]).map((f) => {
              const active = filter === f
              const count =
                f === 'all' ? stats.total : f === 'academic' ? stats.academic : stats.industry
              return (
                <Text
                  _hover={{ bg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                  as="button"
                  bg={
                    active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : 'transparent'
                  }
                  borderRadius="full"
                  color={active ? termText : termSecondary}
                  cursor="pointer"
                  fontSize="xs"
                  fontWeight={active ? 'bold' : 'medium'}
                  key={f}
                  onClick={() => setFilter(f)}
                  px={3}
                  py={1}
                  transition="all 0.15s"
                >
                  {f === 'all'
                    ? t('experience.filterAll')
                    : f === 'academic'
                      ? t('experience.filterAcademic')
                      : t('experience.filterIndustry')}{' '}
                  ({count})
                </Text>
              )
            })}
          </Flex>

          {/* ── Experience list ───────────────────────────── */}
          <Box bg={termBg} color={termText}>
            <MotionList staggerDelay={0.1}>
              {grouped.map((group) => (
                <Box key={group.year}>
                  {/* Year heading */}
                  <Flex
                    align="center"
                    bg={isDark ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.03)'}
                    borderBottom={`1px solid ${termBorder}`}
                    gap={2}
                    px={[3, 5]}
                    py={2}
                  >
                    <Box
                      bg={group.year === 'Present' ? termSuccess : 'transparent'}
                      border="2px solid"
                      borderColor={group.year === 'Present' ? termSuccess : termHighlight}
                      borderRadius="full"
                      h="8px"
                      w="8px"
                    />
                    <Text
                      color={group.year === 'Present' ? termSuccess : termHighlight}
                      fontSize="xs"
                      fontWeight="bold"
                      letterSpacing="0.04em"
                    >
                      {group.year === 'Present' ? t('experience.present').toUpperCase() : group.year}
                    </Text>
                    <Text color={termSecondary} fontSize="2xs">
                      {group.year === 'Present'
                        ? `${group.items.length.toString()} ${t('experience.active')}`
                        : group.items.length.toString()}
                    </Text>
                    <Box bg={termBorder} flex="1" h="1px" />
                  </Flex>

                  {/* Entries */}
                  {group.items.map((exp) => {
                    const id = `${exp.title}-${exp.company}-${exp.start}`
                    const isExpanded = expandedItems[id] ?? false
                    const rt: RoleType =
                      exp.roleType ??
                      (categoryFilter[exp.category] === 'industry' ? 'sde' : 'research')
                    const rtCfg = roleTypeConfig[rt]
                    const rtColor = rtCfg.color(isDark)
                    const icon = getIconUrl(exp.companyUrl, exp.company, institutionLogos)

                    return (
                      <MotionBox key={id}>
                        <Box
                          _hover={{ bg: hoverBg }}
                          borderBottom={`1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`}
                          transition="background 0.15s"
                        >
                          <Flex
                            align="start"
                            cursor="pointer"
                            gap={3}
                            onClick={() => toggleExpanded(id)}
                            px={[3, 5]}
                            py={3}
                          >
                            {/* Logo */}
                            <Box flexShrink={0} mt="2px">
                              <MotionHover>
                                {icon ? (
                                  <Image
                                    alt=""
                                    borderRadius="md"
                                    h="32px"
                                    objectFit="contain"
                                    src={icon}
                                    w="32px"
                                  />
                                ) : (
                                  <Flex
                                    align="center"
                                    bg={`${rtColor}18`}
                                    borderRadius="md"
                                    color={rtColor}
                                    fontSize="sm"
                                    fontWeight="bold"
                                    h="32px"
                                    justify="center"
                                    w="32px"
                                  >
                                    {exp.company.charAt(0)}
                                  </Flex>
                                )}
                              </MotionHover>
                            </Box>

                            {/* Content */}
                            <Box flex="1" minW={0}>
                              {/* Title + role badge */}
                              <Flex align="center" flexWrap="wrap" gap={2} mb={0.5}>
                                <Text color={termText} fontSize="sm" fontWeight="semibold">
                                  {exp.title}
                                </Text>
                                <Text
                                  bg={`${rtColor}15`}
                                  borderRadius="sm"
                                  color={rtColor}
                                  fontSize="2xs"
                                  fontWeight="bold"
                                  letterSpacing="0.04em"
                                  px={1.5}
                                  py={0}
                                  textTransform="uppercase"
                                >
                                  {t(rtCfg.labelKey)}
                                </Text>
                                {exp.isCurrent && (
                                  <Box
                                    bg={termSuccess}
                                    borderRadius="full"
                                    flexShrink={0}
                                    h="6px"
                                    w="6px"
                                  />
                                )}
                              </Flex>

                              {/* Company + location */}
                              <Flex align="center" flexWrap="wrap" fontSize="xs" gap={1}>
                                {exp.companyUrl ? (
                                  <Link
                                    _hover={{ textDecoration: 'underline' }}
                                    color={termCommand}
                                    fontSize="xs"
                                    href={exp.companyUrl}
                                    onClick={(e) => e.stopPropagation()}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    {exp.company}
                                  </Link>
                                ) : (
                                  <Text color={termCommand}>{exp.company}</Text>
                                )}
                                {exp.location && <Text color={termSecondary}>· {exp.location}</Text>}
                              </Flex>

                              {/* Date on mobile */}
                              <Text color={termSecondary} display={{ base: "block", md: "none" }} fontSize="2xs" mt={0.5}>
                                {fmtDate(exp.start)} – {fmtDate(exp.end)}
                              </Text>
                            </Box>

                            {/* Period (desktop) */}
                            <Text
                              color={termSecondary}
                              display={{ base: "none", md: "block" }}
                              flexShrink={0}
                              fontSize="xs"
                              pt="2px"
                              textAlign="right"
                              w="160px"
                            >
                              {fmtDate(exp.start)} – {fmtDate(exp.end)}
                            </Text>

                            {/* Chevron */}
                            <Icon
                              as={FaChevronDown}
                              boxSize="10px"
                              color={termSecondary}
                              flexShrink={0}
                              mt="6px"
                              transform={isExpanded ? 'rotate(180deg)' : 'rotate(0)'}
                              transition="transform 0.2s"
                            />
                          </Flex>

                          {/* Expanded */}
                          <Collapsible.Root open={isExpanded}>
                            <Collapsible.Content>
                              <Box
                                borderLeft={`2px solid ${rtColor}`}
                                mb={3}
                                ml={[3, '69px']}
                                mx={[3, 5]}
                                pl={3}
                              >
                                {exp.summary && (
                                  <Text color={termHighlight} fontSize="xs" lineHeight="1.6" mb={2}>
                                    {highlightData(exp.summary, hlc)}
                                  </Text>
                                )}
                                <VStack align="stretch" gap={1}>
                                  {exp.highlights.map((line: string, i: number) => (
                                    <HStack align="start" fontSize="xs" gap={2} key={i}>
                                      <Text color={rtColor} flexShrink={0} mt="1px">
                                        ·
                                      </Text>
                                      <Text color={termText} lineHeight="1.5">
                                        {highlightData(line, hlc)}
                                      </Text>
                                    </HStack>
                                  ))}
                                </VStack>
                              </Box>
                            </Collapsible.Content>
                          </Collapsible.Root>
                        </Box>
                      </MotionBox>
                    )
                  })}
                </Box>
              ))}
            </MotionList>
          </Box>

          {/* Academic Reviewing */}
          {reviewingItems.length > 0 && (
            <MotionBox delay={0.2}>
              <Box bg={termBg} borderTop={`1px solid ${termBorder}`} px={[3, 5]} py={4}>
                <Flex align="center" gap={2} mb={3}>
                  <Box bg={tc.param} borderRadius="full" h="3px" w="14px" />
                  <Text color={termInfo} fontSize="xs" fontWeight="bold" letterSpacing="0.06em">
                    {t('experience.academicReviewing')}
                  </Text>
                  <Text color={termSecondary} fontSize="2xs">
                    {reviewingItems.length}
                  </Text>
                  <Box bg={termBorder} flex="1" h="1px" />
                </Flex>
                <VStack align="stretch" gap={2}>
                  {reviewingByYear.map(([year, items]) => (
                    <HStack align="start" flexWrap="wrap" gap={3} key={year}>
                      <Text
                        color={termHighlight}
                        flexShrink={0}
                        fontSize="xs"
                        fontWeight="bold"
                        w="35px"
                      >
                        {year}
                      </Text>
                      <HStack flexWrap="wrap" gap={1.5}>
                        {items.map((item, idx) => (
                          <MotionHover key={`${item.venue}-${idx.toString()}`}>
                            <Text
                              border="1px solid"
                              borderColor={isDark ? 'whiteAlpha.150' : 'blackAlpha.100'}
                              borderRadius="full"
                              color={termCommand}
                              cursor="default"
                              fontSize="xs"
                              px={2}
                              py={0.5}
                            >
                              {item.venue.replace(/\s*\d{4}\s*/, ' ').trim()}
                            </Text>
                          </MotionHover>
                        ))}
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </MotionBox>
          )}

          {/* Command output */}
          {cmdOutput.length > 0 && (
            <Box
              bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'}
              borderTop={`1px solid ${termBorder}`}
              px={[3, 5]}
              py={2}
            >
              {cmdOutput.map((line, i) => (
                <Text
                  color={termText}
                  fontFamily="mono"
                  fontSize="xs"
                  key={i}
                  whiteSpace="pre-wrap"
                >
                  {line}
                </Text>
              ))}
            </Box>
          )}

          {/* Command line */}
          <Flex
            align="center"
            bg={termHeader}
            borderTop={`1px solid ${termBorder}`}
            fontSize="xs"
            px={[3, 5]}
            py={2}
          >
            <Text color={termPrompt} flexShrink={0} fontFamily="mono" mr={2}>
              $
            </Text>
              <Input
                color={termText}
                flex="1"
                fontFamily="mono"
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommand(command)
                }}
              placeholder={t('experience.typeHelp')}
              size="xs"
              value={command}
              variant="flushed"
            />
            <Box
              bg={termPrompt}
              css={{ animation: `${blink} 1s step-end infinite` }}
              h="12px"
              ml={1}
              w="6px"
            />
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
}

export default Experience
