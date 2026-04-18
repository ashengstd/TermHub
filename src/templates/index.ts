import type { ComponentSlots } from './slots'
import type { TemplateConfig } from './types'

import { resolveSlots } from './slots'
import terminalTemplate from './terminal'

/** All registered templates keyed by id */
const templates: Record<string, TemplateConfig> = {
  terminal: terminalTemplate,
}

/**
 * Variant registry — all known variants for each slot.
 *
 * Structure: { slotName: { variantId: Component } }
 *
 * Each template's default components are automatically registered
 * under the template id. Additional variants can be added here.
 *
 * @example
 * variantRegistry.hero.minimal = MinimalHero
 * // then in site.json: { "components": { "hero": "minimal" } }
 */
export const variantRegistry: Record<
  string,
  Record<string, React.ComponentType>
> = Object.fromEntries(
  Object.entries(terminalTemplate.slots as unknown as Record<string, React.ComponentType>).map(
    ([slotName, component]) => [slotName, { terminal: component }],
  ),
)

/** Default template id when none is specified in site.json */
const DEFAULT_TEMPLATE = 'terminal'

/**
 * Resolve final slot map: template defaults merged with user overrides.
 */
export function getResolvedSlots(
  template: TemplateConfig,
  userOverrides?: Record<string, string>,
): ComponentSlots {
  return resolveSlots(template.slots, variantRegistry, userOverrides)
}

/** List all variant ids available for a given slot */
export function getSlotVariants(slotName: string): string[] {
  return Object.keys(variantRegistry[slotName] ?? {})
}

/**
 * Resolve a template by id.
 * Falls back to the default template if the id is unknown.
 */
export function getTemplate(id?: string): TemplateConfig {
  if (id && id in templates) {
    return templates[id]
  }
  return templates[DEFAULT_TEMPLATE]
}

/** List all available template ids */
export function getTemplateIds(): string[] {
  return Object.keys(templates)
}

/** List all available templates */
export function getTemplates(): TemplateConfig[] {
  return Object.values(templates)
}

export { SlotProvider } from './context'
export { useSlot } from './hooks'
export type { ComponentSlots, SlotName } from './slots'
export { DEFAULT_SECTIONS, SECTION_SLOTS } from './slots'
export type { LayoutProps, TemplateConfig, TemplatePages } from './types'
export default templates
