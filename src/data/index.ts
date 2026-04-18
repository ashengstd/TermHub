import type { z } from 'zod'

import type {
  About,
  Experience,
  ProjectItem,
  Publication,
} from '../types'

import {
  AboutFrontmatterSchema,
  AwardsJsonSchema,
  ExperienceJsonSchema,
  LogosJsonSchema,
  NewsJsonSchema,
  ProjectFrontmatterSchema,
  PublicationFrontmatterSchema,
  ResearchSchema,
  SiteConfigSchema,
  TalksJsonSchema,
  TeachingJsonSchema,
} from '../schemas'

// ── Glob Imports ──────────────────────────────────────────────────────────

const globsEn = {
  about: import.meta.glob('@content/about.mdx', { eager: true }),
  articles: import.meta.glob('@content/articles/*.mdx', { eager: true }),
  projects: import.meta.glob('@content/projects/*.mdx', { eager: true }),
  pubs: import.meta.glob('@content/publications/*.mdx', { eager: true }),
}

const globsZh = {
  about: import.meta.glob('@content/zh/about.mdx', { eager: true }),
  articles: import.meta.glob('@content/zh/articles/*.mdx', { eager: true }),
  projects: import.meta.glob('@content/zh/projects/*.mdx', { eager: true }),
  pubs: import.meta.glob('@content/zh/publications/*.mdx', { eager: true }),
}

// ── Helpers ───────────────────────────────────────────────────────────────

interface MdxModule {
  default: React.ComponentType
  frontmatter?: Record<string, unknown>
}

function collectMd<T extends Record<string, unknown>>(
  modules: Record<string, unknown>,
  schema: z.ZodType<T>,
  label: string,
): (T & { Content?: React.ComponentType })[] {
  return Object.entries(modules).map(([path, m]) => {
    const mod = m as MdxModule
    const raw = mod.frontmatter ?? {}
    const enriched = {
      ...raw,
      abstract: (raw.abstract as string | undefined) ?? (raw.bodyText as string | undefined) ?? '',
      journey: (raw.journey as string | undefined) ?? (raw.bodyText as string | undefined) ?? '',
      summary: (raw.summary as string | undefined) ?? (raw.bodyText as string | undefined) ?? '',
    }
    const fileLabel = `${label} (${path.split('/').pop() ?? path})`
    return { ...parseContent(schema, enriched, fileLabel), Content: mod.default }
  })
}

/**
 * Parse `data` against `schema`.  In development, failed validation emits a
 * console warning so content authors catch typos immediately.  The raw data
 * is returned as fallback so the app never hard-crashes due to a content mismatch.
 */
function parseContent<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.warn(`[TermHub] Content validation warning — ${label}:`, result.error.issues)
    }
    return data as T
  }
  return result.data
}

// ── JSON imports ──────────────────────────────────────────────────────────

import awardsEn from '@content/awards.json'
import expEn from '@content/experience.json'
import logosEn from '@content/logos.json'
import newsEn from '@content/news.json'
import resEn from '@content/research.json'
import siteEn from '@content/site.json'
import talksEn from '@content/talks.json'
import teachEn from '@content/teaching.json'
import awardsZh from '@content/zh/awards.json'
import expZh from '@content/zh/experience.json'
import logosZh from '@content/zh/logos.json'
import newsZh from '@content/zh/news.json'
import resZh from '@content/zh/research.json'
import siteZh from '@content/zh/site.json'
import talksZh from '@content/zh/talks.json'
import teachZh from '@content/zh/teaching.json'

// ── Data assembly ─────────────────────────────────────────────────────────

const build = (lang: 'en' | 'zh') => {
  const g = lang === 'en' ? globsEn : globsZh
  const raw =
    lang === 'en'
      ? { awards: awardsEn, exp: expEn, logos: logosEn, news: newsEn, res: resEn, site: siteEn, talks: talksEn, teach: teachEn }
      : { awards: awardsZh, exp: expZh, logos: logosZh, news: newsZh, res: resZh, site: siteZh, talks: talksZh, teach: teachZh }

  const L = lang.toUpperCase()
  const expParsed = parseContent(ExperienceJsonSchema, raw.exp, `experience.json [${L}]`)

  return {
    about: (collectMd(g.about, AboutFrontmatterSchema, `about.mdx [${L}]`)[0] ?? {}) as About,
    articles: collectMd(g.articles, ProjectFrontmatterSchema, `articles [${L}]`) as ProjectItem[],
    awards: parseContent(AwardsJsonSchema, raw.awards, `awards.json [${L}]`),
    experience: {
      academic: [] as Experience['academic'],
      education: expParsed.education,
      professional: [] as Experience['professional'],
      reviewing: expParsed.reviewing,
    },
    experienceTimeline: expParsed.timeline,
    institutionLogos: parseContent(LogosJsonSchema, raw.logos, `logos.json [${L}]`),
    news: parseContent(NewsJsonSchema, raw.news, `news.json [${L}]`),
    projects: collectMd(g.projects, ProjectFrontmatterSchema, `projects [${L}]`) as ProjectItem[],
    publications: collectMd(g.pubs, PublicationFrontmatterSchema, `publications [${L}]`) as Publication[],
    research: parseContent(ResearchSchema, raw.res, `research.json [${L}]`),
    siteConfig: parseContent(SiteConfigSchema, raw.site, `site.json [${L}]`),
    talks: parseContent(TalksJsonSchema, raw.talks, `talks.json [${L}]`),
    teaching: parseContent(TeachingJsonSchema, raw.teach, `teaching.json [${L}]`),
  }
}

const cache = { en: build('en'), zh: build('zh') }
export const getLocalizedData = (l: string) => (l === 'zh' ? cache.zh : cache.en)

// ── Static exports ────────────────────────────────────────────────────────

export const projects = cache.en.projects
export const publications = cache.en.publications
export const about = cache.en.about

export const getPublicationStats = (p: Publication[]) => {
  const s = {
    byVenue: {} as Record<string, number>,
    byYear: {} as Record<number | string, number>,
    firstAuthor: 0,
    total: p.length,
    withCode: 0,
  }
  p.forEach((x) => {
    s.byYear[x.year] = (s.byYear[x.year] ?? 0) + 1
    s.byVenue[x.venueType] = (s.byVenue[x.venueType] ?? 0) + 1
    if (x.isFirstAuthor) s.firstAuthor++
    if (x.links.code) s.withCode++
  })
  return s
}
