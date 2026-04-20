import { z } from 'zod'

export const AwardKindSchema = z.enum([
  'competition',
  'employment',
  'grant',
  'hackathon',
  'honor',
  'innovation',
  'other',
  'scholarship',
  'travel',
])

export const ExperienceCategorySchema = z.enum(['academic', 'industry', 'leadership', 'research'])

export const ProjectCategorySchema = z.enum([
  'data',
  'healthcare',
  'nlp',
  'robotics',
  'tooling',
  'web-app',
])

export const ProjectStatusSchema = z.enum(['ongoing', 'completed', 'archived', 'planned'])

export const ProjectRoleSchema = z.enum(['independent', 'lead', 'maintainer', 'tech-lead'])

export const PublicationStatusSchema = z.enum(['accepted', 'preprint', 'published'])

export const RoleTypeSchema = z.enum(['leadership', 'mle', 'research', 'sde', 'teaching'])

export const TalkTypeSchema = z.enum([
  'invited',
  'keynote',
  'oral',
  'other',
  'panel',
  'poster',
  'tutorial',
  'workshop',
])

export const TeachingRoleSchema = z.enum([
  'co-instructor',
  'guest-lecturer',
  'instructor',
  'other',
  'ta',
])

// journal is used in real content files alongside the legacy set
export const VenueTypeSchema = z.enum(['conference', 'demo', 'journal', 'preprint', 'workshop'])

export const AwardSchema = z.object({
  date: z.string(),
  egg: z.string().optional(),
  kind: AwardKindSchema.optional(),
  link: z.string().optional(),
  org: z.string().optional(),
  title: z.string(),
})

export const NewsLinkSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
  url: z.url(),
})

export const NewsItemSchema = z.object({
  badge: z.string(),
  date: z.string().optional(),
  description: z.string(),
  emoji: z.string().optional(),
  icon: z.string(),
  iconColor: z.string(),
  links: z.array(NewsLinkSchema).default([]),
  sortDate: z.string().optional(),
  title: z.string(),
  type: z.string(),
})

export const JourneyPhaseSchema = z.object({
  description: z.string(),
  kind: z.enum(['education', 'work', 'other']).optional(),
  org: z.string(),
  period: z.string(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
})

export const ExperienceEntrySchema = z.object({
  category: ExperienceCategorySchema,
  company: z.string(),
  companyUrl: z.url().optional(),
  end: z.string().optional(),
  highlights: z.array(z.string()),
  isCurrent: z.boolean().optional(),
  location: z.string().optional(),
  roleType: RoleTypeSchema.optional(),
  start: z.string(),
  summary: z.string().optional(),
  title: z.string(),
})

export const ProjectLinkSchema = z.object({
  label: z.string(),
  url: z.url(),
})

export const PublicationLinksSchema = z.object({
  arxiv: z.url().optional(),
  code: z.url().optional(),
  dataset: z.url().optional(),
  demo: z.url().optional(),
  paper: z.url().optional(),
  projectPage: z.url().optional(),
})

export const SkillSchema = z.object({
  category: z.string().optional(),
  level: z.number().optional(),
  name: z.string(),
})

export const TalkSchema = z.object({
  date: z.string(),
  description: z.string().optional(),
  event: z.string(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  location: z.string().optional(),
  slidesUrl: z.string().optional(),
  title: z.string(),
  type: TalkTypeSchema.optional(),
  videoUrl: z.string().optional(),
})

export const TeachingEntrySchema = z.object({
  course: z.string(),
  description: z.string().optional(),
  institution: z.string(),
  link: z.string().optional(),
  role: TeachingRoleSchema,
  semester: z.string(),
})

/** Frontmatter-only shape (no Content component) */
export const ProjectFrontmatterSchema = z
  .object({
    badge: z.string().optional(),
    bodyText: z.string().optional(),
    category: ProjectCategorySchema,
    date: z.string().optional(),
    extraLinks: z.array(ProjectLinkSchema).optional(),
    featured: z.boolean().optional(),
    featuredImage: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    isOpenSource: z.boolean().optional(),
    link: z.string().optional(),
    role: ProjectRoleSchema.optional(),
    status: ProjectStatusSchema.optional(),
    story: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()),
    title: z.string(),
  })
  .transform((data) => {
    const summary = data.summary ?? data.bodyText
    if (!summary) {
      throw new Error(`Project "${data.title}" is missing both 'summary' and body content.`)
    }
    return { ...data, summary }
  })

/** Frontmatter-only shape (no Content component) */
export const PublicationFrontmatterSchema = z
  .object({
    abstract: z.string().optional(),
    authors: z.array(z.string()),
    bodyText: z.string().optional(),
    citations: z.number().optional(),
    coFirstAuthors: z.array(z.string()).optional(),
    emoji: z.string().optional(),
    featuredImage: z.string().optional(),
    id: z.string(),
    isCoFirst: z.boolean().optional(),
    isCorrespondingAuthor: z.boolean().optional(),
    isFirstAuthor: z.boolean().optional(),
    keywords: z.array(z.string()).optional(),
    links: PublicationLinksSchema.default({}),
    month: z.string().optional(),
    specialBadges: z.array(z.string()).optional(),
    status: PublicationStatusSchema,
    title: z.string(),
    venue: z.string(),
    venueType: VenueTypeSchema,
    year: z.number(),
  })
  .transform((data) => {
    const abstract = data.abstract ?? data.bodyText
    if (!abstract) {
      throw new Error(`Publication "${data.title}" is missing both 'abstract' and body content.`)
    }
    return { ...data, abstract }
  })

/** Frontmatter-only shape (no Content component) */
export const AboutFrontmatterSchema = z.object({
  bio: z.string(),
  journey: z.string(),
  mentorship: z
    .object({
      description: z.string().optional(),
      heading: z.string(),
      mentees: z.array(
        z.object({ name: z.string(), note: z.string().optional(), url: z.string() }),
      ),
    })
    .optional(),
  researchTitle: z.string().optional(),
  version: z
    .object({
      current: z.string(),
      history: z.array(
        z.object({ features: z.array(z.string()), title: z.string(), version: z.string() }),
      ),
    })
    .optional(),
})

export const AwardsJsonSchema = z.array(AwardSchema)

/** experience.json — education + optional reviewing + timeline */
export const ExperienceJsonSchema = z.object({
  education: z.object({
    courses: z.array(
      z.object({
        course: z.string(),
        detail: z.string().optional(),
        institution: z.string(),
        year: z.string(),
      }),
    ),
  }),
  reviewing: z
    .array(z.object({ role: z.string(), venue: z.string() }))
    .optional()
    .default([]),
  timeline: z.array(ExperienceEntrySchema),
})

export const LogosJsonSchema = z.record(z.string(), z.string())

export const NewsJsonSchema = z.array(NewsItemSchema)

export const ResearchSchema = z.object({
  currentResearch: z.array(
    z.object({
      advisor: z.string().optional(),
      emoji: z.string(),
      focus: z.string(),
      institution: z.string().optional(),
      lab: z.string(),
      link: z.string(),
    }),
  ),
})

export const SiteConfigSchema = z.object({
  avatar: z.string().optional(),
  branding: z
    .object({
      authorLink: z.string().optional(),
      authorName: z.string().optional(),
      repoUrl: z.string().optional(),
      siteName: z.string().optional(),
    })
    .optional(),
  contact: z
    .object({
      academicEmail: z.email().optional(),
      email: z.email().optional(),
      hiringEmail: z.email().optional(),
      location: z.string().optional(),
    })
    .optional(),
  features: z.record(z.string(), z.boolean()).optional(),
  heroSocialIcons: z
    .array(
      z.object({
        color: z.string().optional(),
        icon: z.string(),
        label: z.string(),
        platform: z.string(),
      }),
    )
    .optional(),
  name: z.object({
    authorVariants: z.array(z.string()).optional(),
    display: z.string(),
    first: z.string(),
    full: z.string(),
    last: z.string(),
  }),
  sections: z.array(z.string()).optional(),
  selectedPublicationIds: z.array(z.string()).optional(),
  social: z.record(z.string(), z.string()).optional(),
  tagline: z.string().optional(),
  terminal: z
    .object({
      hostname: z.string().optional(),
      prompt: z.string().optional(),
      rotatingSubtitles: z.array(z.string()).optional(),
      skills: z.array(z.union([z.string(), SkillSchema])).optional(),
      timezone: z.string().optional(),
      username: z.string().optional(),
    })
    .optional(),
})

export const TalksJsonSchema = z.array(TalkSchema)

export const TeachingJsonSchema = z.array(TeachingEntrySchema)
