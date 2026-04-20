import { ExternalLink } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { FaGithub, FaYoutube } from 'react-icons/fa'
import { SiCsdn, SiMedium, SiZhihu } from 'react-icons/si'

import type { ProjectItem } from '@/types'

import { MotionBox, MotionHover, MotionList } from '@/components/animations/MotionList'
import { TerminalEntrance } from '@/components/animations/TerminalEntrance'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TerminalShell } from '@/components/ui/TerminalShell'
import { useThemeConfig } from '@/config/theme'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import { highlightData } from '@/utils/highlightData'

/* ── Types ─────────────────────────────────────────────────────── */
type CategoryFilter = 'all' | ProjectItem['category']

/* ── Helpers ───────────────────────────────────────────────────── */
const linkIcon = (url: string): React.ElementType => {
  if (!url) return ExternalLink
  if (url.includes('github.com')) return FaGithub
  if (url.includes('medium.com')) return SiMedium
  if (url.includes('youtu.be') || url.includes('youtube.com')) return FaYoutube
  if (url.includes('zhihu.com')) return SiZhihu
  if (url.includes('csdn.net')) return SiCsdn
  return ExternalLink
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
  const { t } = useT()
  const { articles: articleData, siteOwner } = useLocalizedData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')

  /* Terminal palette (centralized) */
  const { articleCategoryColors: categoryColors, terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const hlc = { kw: tc.command, num: tc.highlight, str: tc.success }

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
    <div
      className="min-h-screen py-8 w-full transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}
    >
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto px-2 md:px-4 lg:px-8">
        <TerminalEntrance path="articles">
          <TerminalShell
            bodyClassName="p-0"
            headerRight={formattedTime}
            statusBar={
              <>
                <div>
                  {filteredArticles.length.toString()}/{articles.length.toString()}{' '}
                  {t('articles.shown')}
                </div>
                <MotionBox delay={0.6}>
                  <div className="flex items-center gap-1">
                    <span style={{ color: tc.prompt }}>
                      {siteOwner.terminalUsername}@articles:{promptPath}$
                    </span>
                    <div
                      className="w-1.5 h-3 animate-pulse"
                      style={{ backgroundColor: tc.prompt }}
                    />
                  </div>
                </MotionBox>
              </>
            }
            title={
              <div className="flex items-center gap-1">
                <span style={{ color: tc.param }}>const </span>
                <span className="font-bold" style={{ color: tc.prompt }}>
                  articles
                </span>
                <span style={{ color: tc.secondary }}> = </span>
                <span style={{ color: tc.param }}>new </span>
                <span className="font-bold" style={{ color: tc.command }}>
                  Reader
                </span>
                <span style={{ color: tc.secondary }}>(</span>
                <span style={{ color: tc.highlight }}>'blog'</span>
                <span style={{ color: tc.secondary }}>)</span>
              </div>
            }
            touchBar={
              <>
                <div className="truncate" style={{ color: tc.secondary }}>
                  <span className="font-bold" style={{ color: tc.prompt }}>
                    {siteOwner.terminalUsername}
                  </span>
                  <span className="mx-1" style={{ color: tc.border }}>
                    ·
                  </span>
                  <span style={{ color: tc.highlight }}>{articles.length.toString()}</span>
                  <span> {t('articles.technicalArticles')} </span>
                  <span style={{ color: tc.command }}>
                    {availableCategories.length.toString()} {t('articles.domains')}
                  </span>
                </div>
                <div className="flex-shrink-0" style={{ color: tc.info }}>
                  ~/articles
                </div>
              </>
            }
          >
            {/* Toolbar */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-2 border-b"
              style={{ backgroundColor: tc.bg, borderColor: tc.border }}
            >
              <div className="flex items-center gap-2 flex-1 text-xs font-mono">
                <span className="flex-shrink-0" style={{ color: tc.prompt }}>
                  {siteOwner.terminalUsername}@articles:{promptPath}$
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-mono placeholder:opacity-50"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="grep -i '...'"
                  style={{ color: tc.text }}
                  type="text"
                  value={searchQuery}
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="px-2 py-1 text-[12px] font-mono rounded border outline-none cursor-pointer appearance-none pr-6"
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(tc.text)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
                    backgroundPosition: 'right 6px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '10px',
                    borderColor: tc.border,
                    color: tc.text,
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
              </div>
            </div>

            {/* Content */}
            <div
              className="overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-500/50"
              style={{ backgroundColor: tc.bg, color: tc.text }}
            >
              <div className="px-3 md:px-4 lg:px-5 py-4">
                <MotionList staggerDelay={0.08}>
                  {yearGroups.map(([year, items], gi) => (
                    <div className={cn(gi < yearGroups.length - 1 ? 'mb-6' : '')} key={year}>
                      {/* Year heading */}
                      <div className="flex items-center gap-2 mb-2 pl-0.5">
                        <span
                          className="font-mono text-[10px] font-semibold tracking-wide"
                          style={{ color: tc.highlight }}
                        >
                          {year}
                        </span>
                        <div
                          className="flex-1 h-px opacity-30"
                          style={{ backgroundColor: tc.border }}
                        />
                        <span className="font-mono text-[10px]" style={{ color: tc.muted }}>
                          {items.length.toString()}{' '}
                          {items.length === 1 ? t('articles.article') : t('articles.articles')}
                        </span>
                      </div>

                      {/* Articles in year */}
                      <div className="flex flex-col">
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
                              <div
                                className="border-b border-dotted transition-colors duration-150 hover:bg-white/[0.03] dark:hover:bg-white/[0.02]"
                                style={{ borderColor: tc.border }}
                              >
                                <div
                                  className="flex items-center gap-2 px-0.5 py-3 cursor-pointer"
                                  onClick={() => toggleExpanded(item.id)}
                                >
                                  {/* Date */}
                                  <span
                                    className="flex-shrink-0 w-[70px] md:w-[90px] text-xs"
                                    style={{ color: tc.highlight }}
                                  >
                                    {fmtDate(item.date)}
                                  </span>

                                  {/* Category badge */}
                                  <div
                                    className="flex-shrink-0 w-[60px] md:w-[80px] px-1.5 py-0.5 rounded-sm text-[10px] font-bold text-center uppercase"
                                    style={{
                                      backgroundColor: ct.bg(isDark),
                                      color: ct.fg(isDark),
                                    }}
                                  >
                                    {t(`categoryLabel.${item.category}`).split(' ')[0]}
                                  </div>

                                  {/* Title + type */}
                                  <div className="flex-1 min-w-0 px-2 md:px-3">
                                    <div
                                      className="font-medium truncate"
                                      style={{ color: tc.text }}
                                    >
                                      {item.title}
                                    </div>
                                    {articleType && (
                                      <div
                                        className="text-[10px] mt-0.5"
                                        style={{ color: tc.secondary }}
                                      >
                                        {articleType}
                                      </div>
                                    )}
                                  </div>

                                  {/* Links (desktop) */}
                                  <div className="hidden md:flex flex-shrink-0 items-center gap-1.5">
                                    {resources.slice(0, 3).map((r) => (
                                      <MotionHover key={r.url}>
                                        <a
                                          className="flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] border rounded-sm transition-all duration-150 no-underline"
                                          href={r.url}
                                          onClick={(e) => e.stopPropagation()}
                                          rel="noopener noreferrer"
                                          style={{
                                            borderColor: tc.border,
                                            color: tc.command,
                                          }}
                                          target="_blank"
                                        >
                                          {React.createElement(linkIcon(r.url), {
                                            className: 'w-2.5 h-2.5',
                                          })}
                                          <span>{r.label}</span>
                                        </a>
                                      </MotionHover>
                                    ))}
                                  </div>

                                  {/* Expand */}
                                  <div className="flex-shrink-0 w-10 text-center font-bold text-xs">
                                    <span style={{ color: isExpanded ? tc.info : tc.command }}>
                                      {isExpanded ? '[-]' : '[+]'}
                                    </span>
                                  </div>
                                </div>

                                {/* Expanded details */}
                                <Collapsible open={isExpanded}>
                                  <CollapsibleContent>
                                    <div
                                      className="px-3 md:px-4 lg:px-8 py-3 border-l-2 mb-2"
                                      style={{
                                        backgroundColor: isDark
                                          ? 'rgba(76,86,106,0.1)'
                                          : 'rgba(203,213,225,0.15)',
                                        borderColor: ct.fg(isDark),
                                      }}
                                    >
                                      {/* Summary */}
                                      <p
                                        className="text-xs leading-relaxed mb-2"
                                        style={{ color: tc.text }}
                                      >
                                        {highlightData(item.summary, hlc)}
                                      </p>

                                      {/* Tags */}
                                      {item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                          {item.tags.map((t) => (
                                            <span
                                              className="px-1.5 py-0.5 font-mono text-[10px] rounded-sm"
                                              key={t}
                                              style={{
                                                backgroundColor: isDark
                                                  ? 'rgba(255,255,255,0.05)'
                                                  : 'rgba(0,0,0,0.04)',
                                                color: tc.muted,
                                              }}
                                            >
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* All links (visible on all screens when expanded) */}
                                      {resources.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {resources.map((r) => (
                                            <MotionHover key={r.url}>
                                              <a
                                                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs rounded-sm border transition-all duration-150 no-underline"
                                                href={r.url}
                                                onClick={(e) => e.stopPropagation()}
                                                rel="noopener noreferrer"
                                                style={{
                                                  borderColor: tc.border,
                                                  color: tc.command,
                                                }}
                                                target="_blank"
                                              >
                                                {React.createElement(linkIcon(r.url), {
                                                  className: 'w-[11px] h-[11px]',
                                                })}
                                                <span>{r.label}</span>
                                              </a>
                                            </MotionHover>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </MotionBox>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </MotionList>
              </div>

              {/* Empty state */}
              {filteredArticles.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm" style={{ color: tc.highlight }}>
                    {t('articles.noMatches')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: tc.secondary }}>
                    {t('articles.tryAdjustingFilter')}
                  </p>
                </div>
              )}
            </div>
          </TerminalShell>
        </TerminalEntrance>
      </div>
    </div>
  )
}

export default Articles
