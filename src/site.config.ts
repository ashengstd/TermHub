/**
 * Site configuration — imports from content/site.json
 *
 * Users edit content/site.json (pure JSON, no code needed).
 * This file computes derived values used by components.
 */

import siteJson from '@content/site.json'
import siteJsonZh from '@content/zh/site.json'

// ═══════════════════════════════════════════════════════════════
// The config object — mirrors content/site.json
// ═══════════════════════════════════════════════════════════════

export const siteConfig = siteJson
export const siteConfigZh = siteJsonZh

/** Get GitHub username for a specific language */
export function getLocalizedGithubUsername(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return cfg.social.github.split('/').pop() ?? ''
}

// ═══════════════════════════════════════════════════════════════
// Derived values — computed automatically, do NOT edit
// ═══════════════════════════════════════════════════════════════

/** Get site config for a given language */
export function getLocalizedSiteConfig(lang: string) {
  return lang === 'zh' ? siteConfigZh : siteJson
}

/** GitHub username extracted from URL (static English default) */
export const githubUsername = getLocalizedGithubUsername('en')

/** Selected publication IDs as a Set for fast lookup */
export const selectedPublicationIds = new Set<string>(siteConfig.selectedPublicationIds)

/** Get navigation items for a specific language */
export function getLocalizedNavItems(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return [
    { labelKey: 'nav.home', path: '/' },
    ...(cfg.features.publications ? [{ labelKey: 'nav.publications', path: '/publications' }] : []),
    ...(cfg.features.experience ? [{ labelKey: 'nav.experience', path: '/experience' }] : []),
    ...(cfg.features.projects ? [{ labelKey: 'nav.projects', path: '/projects' }] : []),
    ...(cfg.features.articles ? [{ labelKey: 'nav.articles', path: '/articles' }] : []),
    ...(cfg.features.guide ? [{ labelKey: 'nav.guide', path: '/guide' }] : []),
    ...((cfg.features as Record<string, boolean>).about
      ? [{ labelKey: 'nav.about', path: '/about' }]
      : []),
  ] as const
}

/** Auto-generated navigation from enabled features (static English default) */
export const navItems = getLocalizedNavItems('en')

/** Get hero social icons for a specific language */
export function getLocalizedHeroSocialIcons(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return cfg.heroSocialIcons.map((item) => ({
    color: item.color,
    href: (cfg.social as Record<string, string>)[item.platform] ?? '',
    icon: item.icon,
    label: item.label,
  }))
}

/** Hero social icons with resolved URLs (static English default) */
export const heroSocialIcons = getLocalizedHeroSocialIcons('en')

/** Build a siteOwner-like object for a given language */
export function getLocalizedSiteOwner(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return {
    contact: {
      academicEmail: cfg.contact.academicEmail,
      email: cfg.contact.email,
      hiringEmail: cfg.contact.hiringEmail,
      linkedin: cfg.social.linkedin,
      location: cfg.contact.location,
    },
    name: cfg.name,
    pets: cfg.pets as {
      description: string
      emoji: string
      image: string
      name: string
      title: string
    }[],
    rotatingSubtitles: cfg.terminal.rotatingSubtitles,
    skills: cfg.terminal.skills,
    social: cfg.social,
    terminalUsername: cfg.terminal.username,
    timezone: cfg.terminal.timezone,
  }
}

/**
 * Backward-compatible `siteOwner` (static English default).
 * Components should prefer using getLocalizedSiteOwner(lang).
 */
export const siteOwner = getLocalizedSiteOwner('en')
