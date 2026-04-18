// ============================================================
// Type definitions — derived from Zod schemas in ../schemas.
//
// If you're just editing your portfolio content you can
// IGNORE this file entirely.  It's used internally by the
// template components for type safety.
// ============================================================

import type { z } from 'zod'

import type {
  AboutFrontmatterSchema,
  AwardKindSchema,
  AwardSchema,
  ExperienceCategorySchema,
  ExperienceEntrySchema,
  ExperienceJsonSchema,
  JourneyPhaseSchema,
  NewsItemSchema,
  NewsLinkSchema,
  ProjectCategorySchema,
  ProjectFrontmatterSchema,
  ProjectLinkSchema,
  PublicationFrontmatterSchema,
  ResearchSchema,
  RoleTypeSchema,
  SkillSchema,
  TalkSchema,
  TeachingEntrySchema,
  VenueTypeSchema,
} from '../schemas'

// ── Types that include a React MDX component ──────────────────────────────

/** Frontmatter fields + the MDX component tree rendered from the markdown body. */
export type About = z.infer<typeof AboutFrontmatterSchema> & {
  Content?: React.ComponentType
}

// ── Plain data types (no React dependencies) ───────────────────────────────

export type Award = z.infer<typeof AwardSchema>

// ── Enum types ─────────────────────────────────────────────────────────────

export type AwardKind = z.infer<typeof AwardKindSchema>

// ── Composite types ────────────────────────────────────────────────────────

/**
 * Legacy composite shape assembled in data/index.ts for backwards compat.
 * New code should prefer `ExperienceJson` or `ExperienceEntry[]` directly.
 */
export interface Experience {
  academic: {
    description?: string
    isCurrent?: boolean
    organization: string
    period?: string
    title: string
  }[]
  education: ExperienceJson['education']
  professional: {
    company: string
    description?: string
    isCurrent?: boolean
    period: string
    title: string
  }[]
  reviewing?: { role: string; venue: string }[]
}

export type ExperienceCategory = z.infer<typeof ExperienceCategorySchema>

export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>

/** Shape of experience.json — education block + timeline entries. */
export type ExperienceJson = z.infer<typeof ExperienceJsonSchema>

export type JourneyPhase = z.infer<typeof JourneyPhaseSchema>

export type NewsItem = z.infer<typeof NewsItemSchema>

export type NewsLink = z.infer<typeof NewsLinkSchema>

export type ProjectCategory = z.infer<typeof ProjectCategorySchema>

export type ProjectItem = z.infer<typeof ProjectFrontmatterSchema> & {
  Content?: React.ComponentType
}

export type ProjectLink = z.infer<typeof ProjectLinkSchema>

export type Publication = z.infer<typeof PublicationFrontmatterSchema> & {
  Content?: React.ComponentType
}

export type Research = z.infer<typeof ResearchSchema>

export type RoleType = z.infer<typeof RoleTypeSchema>

export type Skill = z.infer<typeof SkillSchema>

export type Talk = z.infer<typeof TalkSchema>

export type TeachingEntry = z.infer<typeof TeachingEntrySchema>

export type VenueType = z.infer<typeof VenueTypeSchema>
