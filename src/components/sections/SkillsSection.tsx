import React from 'react'

import DynamicIcon from '@/components/ui/DynamicIcon'
import { useColorMode } from '@/hooks/useColorMode'
import { useLocalizedData } from '@/hooks/useLocalizedData'

type SkillItem = string | { category?: string; icon?: string; name: string }

const SkillsSection: React.FC = () => {
  const { siteOwner } = useLocalizedData()
  const skills = siteOwner.skills as SkillItem[]
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const tc = {
    icon: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)', // gray-400 : gray-500
    line: isDark ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)', // gray-700 : gray-200
    tagBg: isDark ? 'rgb(31, 41, 55)' : 'rgb(243, 244, 246)', // gray-800 : gray-100
    tagColor: isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)', // gray-300 : gray-700
  }

  if (skills.length === 0) return null

  const getName = (s: SkillItem) => (typeof s === 'string' ? s : s.name)
  const getIcon = (s: SkillItem) => (typeof s === 'object' ? s.icon : undefined)
  const getCategory = (s: SkillItem) =>
    typeof s === 'object' ? (s.category ?? 'Others') : 'Others'

  const groups = skills.reduce<Record<string, SkillItem[] | undefined>>((acc, s) => {
    const cat = getCategory(s)
    acc[cat] ??= []
    acc[cat].push(s)
    return acc
  }, {}) as Record<string, SkillItem[]>

  return (
    <section className="w-full">
      <div className="max-w-full lg:max-w-7xl px-2 md:px-4 lg:px-8 mx-auto">
        <div className="flex flex-col gap-6">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-cyan-400 rounded-full flex-shrink-0 h-0.5 w-3" />
                <h4
                  className="text-xs font-mono font-semibold uppercase tracking-wider"
                  style={{ color: tc.tagColor }}
                >
                  {category}
                </h4>
                <div className="flex-1 h-px opacity-10" style={{ backgroundColor: tc.line }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <div
                    className="inline-flex items-center rounded-sm font-mono text-[11px] gap-1.5 px-2 py-1 transition-colors hover:bg-cyan-400/10 group"
                    key={getName(skill)}
                    style={{ backgroundColor: tc.tagBg, color: tc.tagColor }}
                  >
                    {(() => {
                      const iconName = getIcon(skill)
                      if (!iconName) return null
                      return (
                        <DynamicIcon
                          className="h-3 w-3"
                          name={iconName}
                          style={{ color: tc.icon }}
                        />
                      )
                    })()}
                    <span>{getName(skill)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
