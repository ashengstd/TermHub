import { ChevronDown } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import type { RoleType } from '@/types'

import { MotionBox, MotionHover, MotionList } from '@/components/animations/MotionList'
import { TerminalEntrance } from '@/components/animations/TerminalEntrance'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TerminalShell } from '@/components/ui/TerminalShell'
import { SyntaxText } from '@/components/ui/TerminalSyntax'
import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLanguage } from '@/hooks/useLanguage'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import { highlightData } from '@/utils/highlightData'

/* ── Types & config ────────────────────────────────────────────── */
type FilterType = 'academic' | 'all' | 'industry'

const categoryFilter: Record<string, FilterType> = {
  academic: 'academic',
  industry: 'industry',
  leadership: 'academic',
  research: 'academic',
}

const roleTypeConfig: Record<RoleType, { color: (dk: boolean) => string; labelKey: string }> = {
  leadership: {
    color: (dk: boolean) => (dk ? '#ebcb8b' : '#c47d46'),
    labelKey: 'experience.roleLeadership',
  },
  mle: { color: (dk: boolean) => (dk ? '#88c0d0' : '#2a769c'), labelKey: 'experience.roleMLE' },
  research: {
    color: (dk: boolean) => (dk ? '#b48ead' : '#9a56a2'),
    labelKey: 'experience.roleResearch',
  },
  sde: { color: (dk: boolean) => (dk ? '#d08770' : '#b35a2e'), labelKey: 'experience.roleSDE' },
  teaching: {
    color: (dk: boolean) => (dk ? '#a3be8c' : '#34744e'),
    labelKey: 'experience.roleTeaching',
  },
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
  const { locale } = useLanguage()
  const { t } = useT()
  const {
    experience: experienceData,
    experienceTimeline,
    institutionLogos,
    siteOwner,
  } = useLocalizedData()
  const fmtDate = (v?: string) => fmtDateFn(v, t('experience.present'), locale)

  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [command, setCommand] = useState('')
  const [cmdOutput, setCmdOutput] = useState<string[]>([])
  /* Palette (centralized) */
  const { terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const hlc = { kw: tc.command, num: tc.highlight, str: tc.success }

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
        if (parts[1] === 'skills')
          out([siteOwner.skills.map((s) => (typeof s === 'string' ? s : s.name)).join(' · ')])
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
            `Email: ${siteOwner.contact.hiringEmail ?? ''}`,
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

  return (
    <div className="py-8 w-full">
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto px-2 md:px-4 lg:px-8">
        <TerminalEntrance path="experience">
          <TerminalShell
            bodyClassName="p-0"
            headerRight={
              <div style={{ color: tc.highlight }}>
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  hour12: false,
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            }
            title={
              <div className="flex items-center gap-1">
                <SyntaxText type="keyword">const </SyntaxText>
                <SyntaxText className="font-bold" type="variable">
                  career
                </SyntaxText>
                <SyntaxText type="punctuation"> = </SyntaxText>
                <SyntaxText type="keyword">new </SyntaxText>
                <SyntaxText className="font-bold" type="function">
                  Explorer
                </SyntaxText>
                <SyntaxText type="punctuation">(</SyntaxText>
                <SyntaxText type="string">'experience'</SyntaxText>
                <SyntaxText type="punctuation">)</SyntaxText>
              </div>
            }
            titleAlign="left"
            touchBar={
              <div className="flex items-center justify-between w-full">
                <div
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: tc.secondary }}
                >
                  <span className="font-bold" style={{ color: tc.prompt }}>
                    {siteOwner.terminalUsername}
                  </span>
                  <span className="mx-1" style={{ color: tc.border }}>
                    ·
                  </span>
                  <span style={{ color: tc.highlight }}>{stats.total.toString()}</span>
                  <span> {t('experience.rolesAcross')} </span>
                  <span style={{ color: tc.success }}>
                    {stats.current.toString()} {t('experience.currentlyActive')}
                  </span>
                  <span className="mx-1" style={{ color: tc.border }}>
                    ·
                  </span>
                  <span style={{ color: tc.param }}>
                    {stats.academic.toString()} {t('experience.research')}
                  </span>
                  <span>, </span>
                  <span style={{ color: tc.warning }}>
                    {stats.industry.toString()} {t('experience.industry')}
                  </span>
                </div>
                <div className="flex-shrink-0" style={{ color: tc.command }}>
                  ~/experience
                </div>
              </div>
            }
          >
            {/* Education */}
            <MotionBox delay={0.1}>
              <div
                className="px-3 md:px-5 py-3 border-b"
                style={{ backgroundColor: tc.bg, borderColor: tc.border }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="rounded-full h-[3px] w-[14px]"
                    style={{ backgroundColor: tc.command }}
                  />
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: tc.info }}
                  >
                    {t('experience.education')}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: tc.border }} />
                </div>
                <div className="flex flex-col gap-1.5 pl-1">
                  {education.map((edu) => {
                    const logo = institutionLogos[edu.institution]
                    return (
                      <div className="flex items-center gap-2 text-xs" key={edu.course}>
                        {logo ? (
                          <img
                            alt=""
                            className="flex-shrink-0 h-4 w-4 object-contain rounded-sm"
                            src={logo}
                          />
                        ) : (
                          <div
                            className="flex-shrink-0 h-4 w-4 rounded-sm"
                            style={{ backgroundColor: `${tc.command}20` }}
                          />
                        )}
                        <span className="font-medium" style={{ color: tc.text }}>
                          {edu.course}
                        </span>
                        <span style={{ color: tc.secondary }}>·</span>
                        <span style={{ color: tc.command }}>{edu.institution}</span>
                        <span className="ml-auto flex-shrink-0" style={{ color: tc.secondary }}>
                          {edu.year}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </MotionBox>

            {/* Filter bar */}
            <div
              className="flex items-center gap-1.5 px-3 md:px-5 py-2 border-b"
              style={{ backgroundColor: tc.bg, borderColor: tc.border }}
            >
              {(['all', 'academic', 'industry'] as FilterType[]).map((f) => {
                const active = filter === f
                const count =
                  f === 'all' ? stats.total : f === 'academic' ? stats.academic : stats.industry
                return (
                  <button
                    className={cn(
                      'px-3 py-1 text-xs rounded-full transition-all duration-150 cursor-pointer',
                      active ? 'font-bold' : 'font-medium',
                    )}
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      backgroundColor: active
                        ? isDark
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.07)'
                        : 'transparent',
                      color: active ? tc.text : tc.secondary,
                    }}
                  >
                    {f === 'all'
                      ? t('experience.filterAll')
                      : f === 'academic'
                        ? t('experience.filterAcademic')
                        : t('experience.filterIndustry')}{' '}
                    ({count.toString()})
                  </button>
                )
              })}
            </div>

            {/* Experience list */}
            <div
              className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-500/50"
              style={{ backgroundColor: tc.bg, color: tc.text }}
            >
              <MotionList staggerDelay={0.1}>
                {grouped.map((group) => (
                  <div key={group.year}>
                    {/* Year heading */}
                    <div
                      className="flex items-center gap-2 px-3 md:px-5 py-2 border-b"
                      style={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.03)',
                        borderColor: tc.border,
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full border-2"
                        style={{
                          backgroundColor: group.year === 'Present' ? tc.success : 'transparent',
                          borderColor: group.year === 'Present' ? tc.success : tc.highlight,
                        }}
                      />
                      <span
                        className="text-xs font-bold tracking-wider uppercase"
                        style={{ color: group.year === 'Present' ? tc.success : tc.highlight }}
                      >
                        {group.year === 'Present'
                          ? t('experience.present').toUpperCase()
                          : group.year}
                      </span>
                      <span className="text-[10px]" style={{ color: tc.secondary }}>
                        {group.year === 'Present'
                          ? `${group.items.length.toString()} ${t('experience.active')}`
                          : group.items.length.toString()}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: tc.border }} />
                    </div>

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
                          <div
                            className="border-b transition-colors duration-150"
                            style={{
                              borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                            }}
                          >
                            <div
                              className="flex items-start gap-3 px-3 md:px-5 py-3 cursor-pointer group hover:bg-white/5 dark:hover:bg-white/[0.03]"
                              onClick={() => toggleExpanded(id)}
                            >
                              {/* Logo */}
                              <div className="flex-shrink-0 mt-0.5">
                                <MotionHover>
                                  {icon ? (
                                    <img
                                      alt=""
                                      className="h-8 w-8 object-contain rounded-md"
                                      src={icon}
                                    />
                                  ) : (
                                    <div
                                      className="flex items-center justify-center h-8 w-8 rounded-md text-sm font-bold"
                                      style={{
                                        backgroundColor: `${rtColor}18`,
                                        color: rtColor,
                                      }}
                                    >
                                      {exp.company.charAt(0)}
                                    </div>
                                  )}
                                </MotionHover>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-2 mb-0.5">
                                  <span
                                    className="text-sm font-semibold"
                                    style={{ color: tc.text }}
                                  >
                                    {exp.title}
                                  </span>
                                  <span
                                    className="px-1.5 py-0 text-[10px] font-bold tracking-wider uppercase rounded-sm"
                                    style={{
                                      backgroundColor: `${rtColor}15`,
                                      color: rtColor,
                                    }}
                                  >
                                    {t(rtCfg.labelKey)}
                                  </span>
                                  {exp.isCurrent && (
                                    <div
                                      className="flex-shrink-0 h-1.5 w-1.5 rounded-full"
                                      style={{ backgroundColor: tc.success }}
                                    />
                                  )}
                                </div>
                                <div className="flex items-center flex-wrap gap-1 text-xs">
                                  {exp.companyUrl ? (
                                    <a
                                      className="hover:underline transition-all"
                                      href={exp.companyUrl}
                                      onClick={(e) => e.stopPropagation()}
                                      rel="noopener noreferrer"
                                      style={{ color: tc.command }}
                                      target="_blank"
                                    >
                                      {exp.company}
                                    </a>
                                  ) : (
                                    <span style={{ color: tc.command }}>{exp.company}</span>
                                  )}
                                  {exp.location && (
                                    <span style={{ color: tc.secondary }}>· {exp.location}</span>
                                  )}
                                </div>
                                <div
                                  className="md:hidden mt-0.5 text-[10px]"
                                  style={{ color: tc.secondary }}
                                >
                                  {fmtDate(exp.start)} – {fmtDate(exp.end)}
                                </div>
                              </div>

                              <div
                                className="hidden md:block flex-shrink-0 w-40 pt-0.5 text-right text-xs"
                                style={{ color: tc.secondary }}
                              >
                                {fmtDate(exp.start)} – {fmtDate(exp.end)}
                              </div>

                              <ChevronDown
                                className={cn(
                                  'flex-shrink-0 mt-1.5 w-2.5 h-2.5 transition-transform duration-200',
                                  isExpanded && 'rotate-180',
                                )}
                                style={{ color: tc.secondary }}
                              />
                            </div>

                            <Collapsible open={isExpanded}>
                              <CollapsibleContent>
                                <div
                                  className="mb-3 mx-3 md:mx-5 pl-3 border-l-2"
                                  style={{
                                    borderColor: rtColor,
                                    marginLeft: 'calc(var(--spacing) * 3 + 32px)',
                                  }}
                                >
                                  {exp.summary && (
                                    <div
                                      className="mb-2 text-xs leading-relaxed"
                                      style={{ color: tc.highlight }}
                                    >
                                      {highlightData(exp.summary, hlc)}
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-1">
                                    {exp.highlights.map((line: string, i: number) => (
                                      <div className="flex items-start gap-2 text-xs" key={i}>
                                        <span
                                          className="flex-shrink-0 mt-0.5"
                                          style={{ color: rtColor }}
                                        >
                                          ·
                                        </span>
                                        <span
                                          className="leading-relaxed"
                                          style={{ color: tc.text }}
                                        >
                                          {highlightData(line, hlc)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </MotionBox>
                      )
                    })}
                  </div>
                ))}
              </MotionList>
            </div>

            {/* Academic Reviewing */}
            {reviewingItems.length > 0 && (
              <MotionBox delay={0.2}>
                <div
                  className="px-3 md:px-5 py-4 border-t"
                  style={{ backgroundColor: tc.bg, borderColor: tc.border }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="rounded-full h-[3px] w-[14px]"
                      style={{ backgroundColor: tc.param }}
                    />
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: tc.info }}
                    >
                      {t('experience.academicReviewing')}
                    </span>
                    <span className="text-[10px]" style={{ color: tc.secondary }}>
                      {reviewingItems.length.toString()}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: tc.border }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {reviewingByYear.map(([year, items]) => (
                      <div className="flex flex-wrap items-start gap-3" key={year}>
                        <span
                          className="flex-shrink-0 w-9 text-xs font-bold"
                          style={{ color: tc.highlight }}
                        >
                          {year}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item, idx) => (
                            <MotionHover key={`${item.venue}-${idx.toString()}`}>
                              <span
                                className="px-2 py-0.5 text-xs rounded-full border cursor-default transition-colors"
                                style={{
                                  borderColor: isDark
                                    ? 'rgba(255,255,255,0.15)'
                                    : 'rgba(0,0,0,0.1)',
                                  color: tc.command,
                                }}
                              >
                                {item.venue.replace(/\s*\d{4}\s*/, ' ').trim()}
                              </span>
                            </MotionHover>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Command output */}
            {cmdOutput.length > 0 && (
              <div
                className="px-3 md:px-5 py-2 border-t font-mono text-xs whitespace-pre-wrap"
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                  borderColor: tc.border,
                  color: tc.text,
                }}
              >
                {cmdOutput.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {/* Command line */}
            <div
              className="flex items-center px-3 md:px-5 py-2 border-t text-xs font-mono"
              style={{ backgroundColor: tc.header, borderColor: tc.border }}
            >
              <span className="flex-shrink-0 mr-2" style={{ color: tc.prompt }}>
                $
              </span>
              <input
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-mono placeholder:opacity-50"
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommand(command)
                }}
                placeholder={t('experience.typeHelp')}
                style={{ color: tc.text }}
                type="text"
                value={command}
              />
              <div
                className="ml-1 h-3 w-1.5 animate-pulse"
                style={{ backgroundColor: tc.prompt }}
              />
            </div>
          </TerminalShell>
        </TerminalEntrance>
      </div>
    </div>
  )
}

export default Experience
