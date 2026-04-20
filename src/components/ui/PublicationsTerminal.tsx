import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Atom,
  BarChart3,
  Bot,
  ChevronRight,
  CloudSun,
  FileText,
  Globe,
  Hand,
  Network,
  Star,
  Trophy,
  Video,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { MotionBox, MotionHover } from '@/components/animations/MotionList'
import { TerminalEntrance } from '@/components/animations/TerminalEntrance'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { TerminalShell } from '@/components/ui/TerminalShell'
import { SyntaxText, TerminalInput } from '@/components/ui/TerminalSyntax'
import { useThemeConfig } from '@/config/theme'
import { getPublicationStats } from '@/data'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { cn } from '@/lib/utils'
import { withBase } from '@/utils/asset'
import { highlightData } from '@/utils/highlightData'

/* ── Emoji → Icon mapping ─────────────────────────────────────── */
const emojiIconMap: Record<string, React.ElementType | undefined> = {
  '⚽': Trophy,
  '🌀': Atom,
  '🌐': Globe,
  '🌟': Star,
  '🎬': Video,
  '💭': CloudSun,
  '📝': FileText,
  '🕸️': Network,
  '🤖': Bot,
  '🦾': Hand,
}

const PublicationsTerminal: React.FC = () => {
  'use no memo'
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { publications, siteOwner } = useLocalizedData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedVenue, setSelectedVenue] = useState<string>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [showStats, setShowStats] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentCommand, setCurrentCommand] = useState('')
  const [imagePreview, setImagePreview] = useState<null | { alt: string; src: string }>(null)
  const [isImageOpen, setIsImageOpen] = useState(false)

  // Terminal theme colors
  const { publicationVenueColors, terminalPalette } = useThemeConfig()
  const tc = terminalPalette.colors(isDark)
  const hlc = { kw: tc.command, num: tc.highlight, str: tc.success }

  const parentRef = useRef<HTMLDivElement>(null)

  const venueColors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(publicationVenueColors).map(([k, v]) => [
          k,
          { bg: v.bg(isDark), fg: v.fg(isDark), label: v.label },
        ]),
      ) as Record<string, { bg: string; fg: string; label: string }>,
    [publicationVenueColors, isDark],
  )

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

  const estimateSize = useCallback(() => 220, [])

  const virtualizer = useVirtualizer({
    count: filteredPublications.length,
    estimateSize,
    getScrollElement: () => parentRef.current,
    overscan: 5,
    useFlushSync: false,
  })

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
    const commandName = parts[0]
    switch (commandName) {
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
    setCurrentCommand('')
  }

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  })

  const showImagePreview = useCallback((src?: string, alt?: string) => {
    if (!src) return
    setImagePreview({ alt: alt ?? 'publication preview', src })
    setIsImageOpen(true)
  }, [])

  const closeImageModal = () => setIsImageOpen(false)

  return (
    <div className="py-8 w-full">
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto px-2 md:px-4 lg:px-6">
        <TerminalEntrance path="publications">
          <TerminalShell
            bodyClassName="p-0"
            headerRight={formattedTime}
            rainbowHeight="3px"
            rainbowOpacity={0.6}
            title={
              <div className="flex items-center gap-1">
                <SyntaxText type="keyword">const </SyntaxText>
                <SyntaxText className="font-bold" type="variable">
                  papers
                </SyntaxText>
                <SyntaxText type="punctuation"> = </SyntaxText>
                <SyntaxText type="keyword">new </SyntaxText>
                <SyntaxText className="font-bold" type="function">
                  Explorer
                </SyntaxText>
                <SyntaxText type="punctuation">(</SyntaxText>
                <SyntaxText type="string">'publications'</SyntaxText>
                <SyntaxText type="punctuation">)</SyntaxText>
              </div>
            }
            titleAlign="left"
            touchBar={
              <>
                <div style={{ color: tc.secondary }}>
                  <span className="font-bold" style={{ color: tc.prompt }}>
                    {siteOwner.terminalUsername}
                  </span>
                  <span className="mx-1" style={{ color: tc.border }}>
                    ·
                  </span>
                  <span style={{ color: tc.highlight }}>{stats.total.toString()}</span>
                  <span> papers, </span>
                  <span style={{ color: tc.success }}>
                    {stats.firstAuthor.toString()} first-authored
                  </span>
                  <span> across </span>
                  <span style={{ color: tc.command }}>
                    {Object.keys(stats.byVenue).length.toString()} venue types
                  </span>
                  <span className="mx-1" style={{ color: tc.border }}>
                    ·
                  </span>
                  <span style={{ color: tc.param }}>{stats.withCode.toString()} open-source</span>
                </div>
                <div className="flex-shrink-0" style={{ color: tc.command }}>
                  ~/publications
                </div>
              </>
            }
          >
            {/* Control Panel: Styled like terminal input */}
            <div
              className="px-4 py-3 border-b"
              style={{ backgroundColor: tc.bg, borderColor: tc.border }}
            >
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Bar */}
                <div
                  className={cn(
                    'flex items-center flex-1 px-3 py-1.5 rounded-md border transition-all duration-200 focus-within:ring-1',
                    isDark ? 'bg-black/20' : 'bg-black/5',
                  )}
                  style={{ borderColor: tc.border }}
                >
                  <ChevronRight className="text-[10px] mr-2" style={{ color: tc.prompt }} />
                  <span className="text-xs font-bold mr-2" style={{ color: tc.command }}>
                    grep
                  </span>
                  <span className="hidden sm:inline text-xs mr-2" style={{ color: tc.secondary }}>
                    -i
                  </span>
                  <input
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-mono placeholder:opacity-50"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="'robotics' papers/*"
                    style={{ color: tc.text }}
                    type="text"
                    value={searchQuery}
                  />
                </div>

                {/* Filter Controls Group */}
                <div className="flex flex-wrap gap-2 justify-between md:justify-end">
                  {/* Year Select */}
                  <div className="flex-1 md:flex-initial min-w-[100px] relative">
                    <select
                      className="w-full h-[34px] px-2.5 pr-6 text-[11px] font-mono rounded-md border outline-none cursor-pointer appearance-none"
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(tc.param)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
                        backgroundPosition: 'right 8px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '12px',
                        borderColor: tc.border,
                        color: tc.param,
                      }}
                      value={selectedYear}
                    >
                      <option value="all">--year=ALL</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year.toString()}>
                          --year={year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Venue Select */}
                  <div className="flex-[1.2] md:flex-initial min-w-[110px] relative">
                    <select
                      className="w-full h-[34px] px-2.5 pr-6 text-[11px] font-mono rounded-md border outline-none cursor-pointer appearance-none"
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      style={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'white',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(tc.param)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
                        backgroundPosition: 'right 8px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '12px',
                        borderColor: tc.border,
                        color: tc.param,
                      }}
                      value={selectedVenue}
                    >
                      <option value="all">--type=ALL</option>
                      <option value="conference">--type=CONF</option>
                      <option value="workshop">--type=WORKSHOP</option>
                      <option value="demo">--type=DEMO</option>
                      <option value="preprint">--type=PREPRINT</option>
                    </select>
                  </div>

                  {/* Stats Toggle Button */}
                  <button
                    className={cn(
                      'flex items-center justify-center flex-1 md:flex-initial h-[34px] px-3 rounded-md border text-xs font-bold font-mono transition-all duration-200 cursor-pointer',
                      showStats ? 'shadow-inner' : 'hover:opacity-80',
                    )}
                    onClick={() => setShowStats(!showStats)}
                    style={{
                      backgroundColor: showStats ? tc.highlight : 'transparent',
                      borderColor: showStats ? tc.highlight : tc.border,
                      color: showStats ? tc.bg : tc.info,
                    }}
                  >
                    <BarChart3 className="mr-2" />
                    <span>--stats</span>
                    {showStats && <span className="ml-1">:ON</span>}
                  </button>
                </div>
              </div>
            </div>

            <Collapsible open={showStats}>
              <CollapsibleContent>
                <MotionBox delay={0.1}>
                  <div
                    className="px-4 py-3 border-b flex flex-wrap gap-6"
                    style={{
                      backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                      borderColor: tc.border,
                    }}
                  >
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: tc.info }}
                      >
                        Total
                      </div>
                      <div className="text-xl font-bold" style={{ color: tc.highlight }}>
                        {stats.total.toString()}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: tc.info }}
                      >
                        First Author
                      </div>
                      <div className="text-xl font-bold" style={{ color: tc.success }}>
                        {stats.firstAuthor.toString()}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: tc.info }}
                      >
                        With Code
                      </div>
                      <div className="text-xl font-bold" style={{ color: tc.command }}>
                        {stats.withCode.toString()}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: tc.info }}
                      >
                        Conferences
                      </div>
                      <div className="text-xl font-bold" style={{ color: tc.param }}>
                        {(stats.byVenue.conference || 0).toString()}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: tc.info }}
                      >
                        Workshops
                      </div>
                      <div className="text-xl font-bold" style={{ color: tc.warning }}>
                        {(stats.byVenue.workshop || 0).toString()}
                      </div>
                    </div>
                  </div>
                </MotionBox>
              </CollapsibleContent>
            </Collapsible>

            {/* List */}
            <div
              className="overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-500/50"
              ref={parentRef}
              style={{ backgroundColor: tc.bg, color: tc.text }}
            >
              <div
                className="flex px-4 py-2 text-[10px] font-bold border-b sticky top-0 z-20"
                style={{ backgroundColor: tc.bg, borderColor: tc.border, color: tc.info }}
              >
                <div className="hidden md:block w-[320px] mr-6">PREVIEW</div>
                <div className="flex-1">PUBLICATION</div>
                <div className="hidden md:block w-[150px]">RESOURCES</div>
                <div className="w-[50px] text-center">MORE</div>
              </div>

              <div
                style={{
                  height: `${virtualizer.getTotalSize().toString()}px`,
                  position: 'relative',
                  width: '100%',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const pub = filteredPublications[virtualItem.index]
                  const vc = venueColors[pub.venueType]
                  return (
                    <div
                      data-index={virtualItem.index}
                      key={virtualItem.key}
                      ref={virtualizer.measureElement}
                      style={{
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateY(${virtualItem.start.toString()}px)`,
                        width: '100%',
                      }}
                    >
                      <MotionBox>
                        <div
                          className="border-b border-dotted transition-colors duration-150 hover:bg-white/[0.03] dark:hover:bg-white/[0.02]"
                          style={{ borderColor: tc.border }}
                        >
                          <div
                            className="flex items-center gap-4 px-4 py-6 min-h-[200px] cursor-pointer"
                            onClick={() => toggleExpanded(pub.id)}
                          >
                            {pub.featuredImage && (
                              <MotionHover>
                                <div
                                  className="hidden md:flex items-center justify-center flex-shrink-0 w-[320px] h-[180px] mr-6 rounded-lg border overflow-hidden cursor-zoom-in group"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    showImagePreview(pub.featuredImage, `${pub.title} thumbnail`)
                                  }}
                                  style={{
                                    backgroundColor: isDark
                                      ? 'rgba(0,0,0,0.05)'
                                      : 'rgba(255,255,255,0.8)',
                                    borderColor: tc.border,
                                  }}
                                >
                                  <img
                                    alt={pub.title}
                                    className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-105"
                                    loading="lazy"
                                    src={withBase(pub.featuredImage)}
                                  />
                                </div>
                              </MotionHover>
                            )}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-start gap-1 mb-1.5">
                                {(() => {
                                  const Icon = pub.emoji ? emojiIconMap[pub.emoji] : null
                                  if (!Icon) return null
                                  return (
                                    <Icon
                                      className="flex-shrink-0 mt-1 mr-1"
                                      style={{ color: vc.fg }}
                                    />
                                  )
                                })()}
                                <h3
                                  className="text-sm md:text-base font-semibold leading-relaxed"
                                  style={{ color: tc.text }}
                                >
                                  {highlightData(pub.title, hlc)}
                                </h3>
                              </div>
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <span
                                  className="px-1.5 py-0 text-[10px] font-mono border rounded-sm whitespace-normal text-left"
                                  style={{
                                    backgroundColor: `${vc.bg}20`,
                                    borderColor: vc.fg,
                                    color: vc.fg,
                                  }}
                                >
                                  {pub.venue.includes(pub.year.toString())
                                    ? pub.venue
                                    : `${pub.venue} ${pub.year.toString()}`}
                                </span>
                                <Badge
                                  className="text-[10px] border-none"
                                  style={{
                                    backgroundColor: `${vc.fg}20`,
                                    color: vc.fg,
                                  }}
                                >
                                  {vc.label}
                                </Badge>
                                {pub.specialBadges?.map((badge) => (
                                  <Badge
                                    className="text-[10px] border-none"
                                    key={badge}
                                    style={{
                                      backgroundColor:
                                        badge === 'Best Paper'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : 'rgba(107, 114, 128, 0.2)',
                                      color: badge === 'Best Paper' ? '#ef4444' : tc.secondary,
                                    }}
                                  >
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                              <div
                                className="text-xs leading-relaxed"
                                style={{ color: tc.secondary }}
                              >
                                {pub.authors.map((author, i) => {
                                  const cleanAuthor = author.replace('*', '')
                                  const hasAsterisk = author.includes('*')
                                  const isOwner = (
                                    siteOwner.name.authorVariants as readonly string[]
                                  ).includes(cleanAuthor)
                                  return (
                                    <span key={i}>
                                      {isOwner ? (
                                        <span className="font-bold" style={{ color: tc.success }}>
                                          {cleanAuthor}
                                          {hasAsterisk && (
                                            <span
                                              className="relative -top-0.5"
                                              style={{ color: tc.warning }}
                                            >
                                              *
                                            </span>
                                          )}
                                          {pub.isFirstAuthor && i === 0 && !hasAsterisk && ' (1st)'}
                                          {pub.isCorrespondingAuthor && ' (†)'}
                                        </span>
                                      ) : (
                                        <span>
                                          {cleanAuthor}
                                          {hasAsterisk && (
                                            <span
                                              className="relative -top-0.5"
                                              style={{ color: tc.warning }}
                                            >
                                              *
                                            </span>
                                          )}
                                        </span>
                                      )}
                                      {i < pub.authors.length - 1 ? ', ' : ''}
                                    </span>
                                  )
                                })}
                                {pub.coFirstAuthors && pub.coFirstAuthors.length > 0 && (
                                  <span className="ml-2 text-[10px]" style={{ color: tc.info }}>
                                    (* co-first)
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="hidden md:block w-[150px]">
                              <div className="flex flex-wrap gap-1">
                                {pub.links.paper && (
                                  <MotionHover>
                                    <a
                                      className="no-underline"
                                      href={pub.links.paper}
                                      onClick={(e) => e.stopPropagation()}
                                      target="_blank"
                                    >
                                      <Badge className="bg-blue-500/20 text-blue-400 border-none text-[10px]">
                                        PDF
                                      </Badge>
                                    </a>
                                  </MotionHover>
                                )}
                                {pub.links.code && (
                                  <MotionHover>
                                    <a
                                      className="no-underline"
                                      href={pub.links.code}
                                      onClick={(e) => e.stopPropagation()}
                                      target="_blank"
                                    >
                                      <Badge className="bg-green-500/20 text-green-400 border-none text-[10px]">
                                        CODE
                                      </Badge>
                                    </a>
                                  </MotionHover>
                                )}
                                {pub.links.projectPage && (
                                  <MotionHover>
                                    <a
                                      className="no-underline"
                                      href={pub.links.projectPage}
                                      onClick={(e) => e.stopPropagation()}
                                      target="_blank"
                                    >
                                      <Badge className="bg-purple-500/20 text-purple-400 border-none text-[10px]">
                                        PROJ
                                      </Badge>
                                    </a>
                                  </MotionHover>
                                )}
                              </div>
                            </div>
                            <div
                              className="w-[50px] text-center font-bold"
                              style={{ color: expandedItems[pub.id] ? tc.info : tc.command }}
                            >
                              {expandedItems[pub.id] ? '-' : '+'}
                            </div>
                          </div>

                          <Collapsible open={expandedItems[pub.id]}>
                            <CollapsibleContent>
                              <div
                                className="px-6 py-4 border-l-2 mb-4 mx-4"
                                style={{
                                  borderColor: vc.fg,
                                  marginLeft: pub.featuredImage
                                    ? 'calc(320px + var(--spacing) * 6 + 1rem)'
                                    : '1rem',
                                }}
                              >
                                {pub.abstract &&
                                  (!pub.Content || pub.abstract !== pub.bodyText) && (
                                    <div className="mb-4">
                                      <div
                                        className="text-[10px] font-bold uppercase tracking-widest mb-1"
                                        style={{ color: tc.info }}
                                      >
                                        // Abstract
                                      </div>
                                      <p
                                        className="text-xs leading-relaxed italic"
                                        style={{ color: tc.secondary }}
                                      >
                                        {pub.abstract}
                                      </p>
                                    </div>
                                  )}
                                {pub.keywords && (
                                  <div className="flex flex-wrap gap-2">
                                    {pub.keywords.map((kw) => (
                                      <span
                                        className="text-[10px] font-mono"
                                        key={kw}
                                        style={{ color: tc.highlight }}
                                      >
                                        #{kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {pub.Content && (
                                  <div className="mt-4">
                                    <pub.Content />
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </MotionBox>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Command line */}
            <div
              className="px-4 py-2 border-t"
              style={{ backgroundColor: tc.header, borderColor: tc.border }}
            >
              <TerminalInput
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommand(currentCommand)
                }}
                placeholder="type 'help' for commands..."
                promptClassName="text-[var(--prompt-color)]"
                style={{ color: tc.text }}
                value={currentCommand}
              />
            </div>
          </TerminalShell>
        </TerminalEntrance>
      </div>

      {/* Image Preview Dialog */}
      <Dialog onOpenChange={setIsImageOpen} open={isImageOpen}>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative group">
            {imagePreview && (
              <img
                alt={imagePreview.alt}
                className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
                src={withBase(imagePreview.src)}
              />
            )}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              onClick={closeImageModal}
            >
              <X />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicationsTerminal
