import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getLocalizedData } from '../data'
import {
  getLocalizedGithubUsername,
  getLocalizedHeroSocialIcons,
  getLocalizedNavItems,
  getLocalizedSiteConfig,
  getLocalizedSiteOwner,
} from '../site.config'

/**
 * Returns content data + site config for the current language.
 * Re-renders automatically when the user switches language.
 */
export function useLocalizedData() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return useMemo(() => {
    const data = getLocalizedData(lang)
    const siteConfig = getLocalizedSiteConfig(lang)
    const siteOwner = getLocalizedSiteOwner(lang)
    const navItems = getLocalizedNavItems(lang)
    const heroSocialIcons = getLocalizedHeroSocialIcons(lang)
    const githubUsername = getLocalizedGithubUsername(lang)

    return {
      ...data,
      githubUsername,
      heroSocialIcons,
      navItems,
      siteConfig,
      siteOwner,
    }
  }, [lang])
}
