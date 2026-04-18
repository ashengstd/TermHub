/**
 * Component slot definitions.
 *
 * Each slot has a well-defined props interface.
 * Templates provide default implementations; users can
 * override individual slots via `components` in site.json.
 */

import type { NewsItem } from '../types'

/* ── Slot prop interfaces ──────────────────────────────────── */

export interface AccomplishmentsSlotProps {}

export interface BioSlotProps {}

export interface ComponentSlots {
  accomplishments: React.ComponentType<AccomplishmentsSlotProps>
  bio: React.ComponentType<BioSlotProps>
  contact: React.ComponentType<ContactSlotProps>
  footer: React.ComponentType<FooterSlotProps>
  hero: React.ComponentType<HeroSlotProps>
  journey: React.ComponentType<JourneySlotProps>
  mentorship: React.ComponentType<MentorshipSlotProps>
  navbar: React.ComponentType<NavbarSlotProps>
  newsDisplay: React.ComponentType<NewsDisplaySlotProps>
  selectedPublications: React.ComponentType<SelectedPublicationsSlotProps>
  skills: React.ComponentType<SkillsSlotProps>
  talks: React.ComponentType<TalksSlotProps>
  teaching: React.ComponentType<TeachingSlotProps>
}

export interface ContactSlotProps {}

export interface FooterSlotProps {}
export interface HeroSlotProps {
  avatar: string
  education?: { course: string; institution: string; year: string }[]
  educationLogos?: Record<string, string>
  research?: { advisor?: string; emoji: string; focus: string; lab: string; link: string }[]
  researchLogos?: Record<string, string>
  title: string
}
export interface JourneySlotProps {}
export interface MentorshipSlotProps {}
export interface NavbarSlotProps {
  children?: React.ReactNode
}
export interface NewsDisplaySlotProps {
  news: NewsItem[]
  showHeader?: boolean
}
export interface SelectedPublicationsSlotProps {}
export interface SkillsSlotProps {}
export type SlotName = keyof ComponentSlots

/* ── Slot map type ─────────────────────────────────────────── */

export interface TalksSlotProps {}

export interface TeachingSlotProps {}

/**
 * Default section order for the home page.
 * Users can override via `"sections"` in site.json.
 */
export const DEFAULT_SECTIONS: SlotName[] = [
  'hero',
  'bio',
  'newsDisplay',
  'selectedPublications',
  'journey',
  'skills',
  'mentorship',
  'talks',
  'teaching',
  'accomplishments',
  'contact',
  'footer',
]

/** Sections that are rendered as home page sections (not layout-level) */
export const SECTION_SLOTS: SlotName[] = [
  'hero',
  'bio',
  'skills',
  'newsDisplay',
  'selectedPublications',
  'journey',
  'mentorship',
  'talks',
  'teaching',
  'accomplishments',
  'contact',
  'footer',
]

/**
 * Merge template default slots with user-selected variant overrides.
 *
 * @param templateSlots - Default slot implementations from the template
 * @param variantRegistry - All registered variants keyed by `slotName.variantId`
 * @param userOverrides - User selections from site.json `components` field
 */
export function resolveSlots(
  templateSlots: ComponentSlots,
  variantRegistry: Record<string, Record<string, React.ComponentType | undefined>>,
  userOverrides?: Record<string, string>,
): ComponentSlots {
  if (!userOverrides) return templateSlots

  const resolved = { ...templateSlots }

  for (const [slotName, variantId] of Object.entries(userOverrides)) {
    const component = variantRegistry[slotName][variantId]
    if (component) {
      ;(resolved as unknown as Record<string, React.ComponentType>)[slotName] = component
    }
  }

  return resolved
}
