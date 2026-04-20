import type { z } from 'zod'

import siteJson from '@content/site.json'
import siteJsonZh from '@content/zh/site.json'

import type { SiteConfigSchema } from './schemas'

/** Get GitHub username for a specific language */
export function getLocalizedGithubUsername(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return cfg.social?.github.split('/').pop() ?? ''
}

/** Get site config for a given language */
export function getLocalizedSiteConfig(lang: string) {
  const raw = lang === 'zh' ? siteJsonZh : siteJson
  return raw as z.infer<typeof SiteConfigSchema>
}

/** Selected publication IDs as a Set for fast lookup */
export const selectedPublicationIds = new Set<string>(siteJson.selectedPublicationIds)

/** Get hero social icons for a specific language */
export function getLocalizedHeroSocialIcons(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  const social = (cfg.social ?? {}) as Record<string, string | undefined>

  return (cfg.heroSocialIcons ?? []).map((item) => ({
    color: item.color,
    href: social[item.platform] ?? '',
    icon: item.icon,
    label: item.label,
  }))
}

/** Get navigation items for a specific language */
export function getLocalizedNavItems(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  const f = cfg.features ?? {}

  return [
    { labelKey: 'nav.home', path: '/' },
    ...(f.publications ? [{ labelKey: 'nav.publications', path: '/publications' }] : []),
    ...(f.experience ? [{ labelKey: 'nav.experience', path: '/experience' }] : []),
    ...(f.projects ? [{ labelKey: 'nav.projects', path: '/projects' }] : []),
    ...(f.articles ? [{ labelKey: 'nav.articles', path: '/articles' }] : []),
    ...(f.guide ? [{ labelKey: 'nav.guide', path: '/guide' }] : []),
    ...(f.about ? [{ labelKey: 'nav.about', path: '/about' }] : []),
  ] as const
}

/** Build a siteOwner-like object for a given language */
export function getLocalizedSiteOwner(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  const contact = cfg.contact ?? {}
  const social = cfg.social ?? {}
  const terminal = cfg.terminal ?? {}
  const branding = cfg.branding ?? {}

  return {
    branding: {
      authorLink: branding.authorLink ?? 'https://github.com/asckaya',
      authorName: branding.authorName ?? 'Ascka',
      repoUrl: branding.repoUrl ?? 'https://github.com/asckaya/Echo',
      siteName: branding.siteName ?? 'Echo',
    },
    contact: {
      academicEmail: contact.academicEmail,
      email: contact.email,
      hiringEmail: contact.hiringEmail,
      linkedin: social.linkedin,
      location: contact.location,
    },
    name: cfg.name,
    rotatingSubtitles: terminal.rotatingSubtitles ?? [],
    skills: terminal.skills ?? [],
    social: social,
    terminalHostname: terminal.hostname ?? 'hello',
    terminalPrompt: terminal.prompt ?? '$',
    terminalUsername: terminal.username ?? 'guest',
    timezone: terminal.timezone ?? 'UTC',
  }
}
