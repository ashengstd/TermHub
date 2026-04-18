import { useLocalizedData } from '@/hooks/useLocalizedData'
import { getTemplate } from '@/templates'

interface TemplatePageProps {
  pageKey:
    | 'about'
    | 'articles'
    | 'docs'
    | 'experience'
    | 'guide'
    | 'home'
    | 'projects'
    | 'publications'
}

export function TemplatePage({ pageKey }: TemplatePageProps) {
  const { siteConfig } = useLocalizedData()
  const template = getTemplate((siteConfig as unknown as { template: string }).template)
  const Page =
    template.pages[pageKey === 'about' ? 'aboutPage' : (pageKey as keyof typeof template.pages)]

  if (!Page) return null
  return <Page />
}
