// ─────────────────────────────────────────────────────────────────────────────
// Active theme — change this one import to switch the entire colour scheme.
//
// ── Available themes ─────────────────────────────────────────────────────────
//
//  Nord (default)
//    import { nordTheme as activeTheme } from './nord'
//
//  Catppuccin Mocha      darkest, most color-rich (dark) + Latte (light)
//    import { catppuccinoMochaTheme as activeTheme } from './catppuccin'
//
//  Catppuccin Macchiato  medium contrast, soothing (dark) + Latte (light)
//    import { catppuccinoMacchiatoTheme as activeTheme } from './catppuccin'
//
//  Catppuccin Frappé     subdued and muted (dark) + Latte (light)
//    import { catppuccinoFrappeTheme as activeTheme } from './catppuccin'
//
//  Catppuccin Latte      light-only; uses Frappé as the dark-mode fallback
//    import { catppuccinoLatteTheme as activeTheme } from './catppuccin'
//
//  Ayu Dark              saturated, high contrast (dark) + Ayu Light (light)
//    import { ayuDarkTheme as activeTheme } from './ayu'
//
//  Ayu Mirage            soothing, low contrast (dark) + Ayu Light (light)
//    import { ayuMirageTheme as activeTheme } from './ayu'
//
// ── To add your own theme ────────────────────────────────────────────────────
//   1. Duplicate `nord.ts` → e.g. `dracula.ts`
//   2. Replace colour values inside the ThemeDefinition object
//   3. Change the import below to point at your new file
//
// Nothing else needs to change — all components import through the adapter
// in `src/config/theme.ts`, which always resolves to the active theme.
// ─────────────────────────────────────────────────────────────────────────────

export { catppuccinoMochaTheme as activeTheme } from './catppuccin'

// Re-export types so consumers can import from one place.
export type { ThemeDefinition, CSSVarTokens, TerminalColors, CatTheme } from './types'
