import { FaBrain, FaChartBar, FaGlobe, FaHeartbeat, FaRobot, FaWrench } from 'react-icons/fa'

import type { ThemeDefinition } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Internal types
// ─────────────────────────────────────────────────────────────────────────────

interface CatppuccinoFlavor {
  base: string
  blue: string
  // ── Neutral scale (dark → light within each flavor) ──
  crust: string
  flamingo: string
  green: string
  lavender: string
  mantle: string
  maroon: string
  mauve: string
  overlay0: string
  overlay1: string
  overlay2: string
  peach: string
  pink: string
  red: string
  // ── Accent colors ──────────────────────────────────
  rosewater: string
  sapphire: string
  sky: string
  subtext0: string
  subtext1: string
  surface0: string
  surface1: string
  surface2: string
  teal: string
  text: string
  yellow: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a 6-digit hex color to a comma-separated RGB triplet for use in rgba(). */
function hex2rgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r.toString()}, ${g.toString()}, ${b.toString()}`
}

/** Build a semi-transparent overlay: rgba(accentHex, alpha). */
const tint = (hex: string, alpha: number) => `rgba(${hex2rgb(hex)}, ${alpha.toString()})`

// ─────────────────────────────────────────────────────────────────────────────
// Flavor palettes — exact values from https://catppuccin.com/palette/
// ─────────────────────────────────────────────────────────────────────────────

/** Latte — the one light flavor; used as the light-mode companion for every theme. */
const latte: CatppuccinoFlavor = {
  base: '#eff1f5',
  blue: '#1e66f5',
  crust: '#dce0e8',
  flamingo: '#dd7878',
  green: '#40a02b',
  lavender: '#7287fd',
  mantle: '#e6e9ef',
  maroon: '#e64553',
  mauve: '#8839ef',
  overlay0: '#9ca0b0',
  overlay1: '#8c8fa1',
  overlay2: '#7c7f93',
  peach: '#fe640b',
  pink: '#ea76cb',
  red: '#d20f39',
  rosewater: '#dc8a78',
  sapphire: '#209fb5',
  sky: '#04a5e5',
  subtext0: '#6c6f85',
  subtext1: '#5c5f77',
  surface0: '#ccd0da',
  surface1: '#bcc0cc',
  surface2: '#acb0be',
  teal: '#179299',
  text: '#4c4f69',
  yellow: '#df8e1d',
}

/** Frappé — subdued dark with muted, cooler tones. */
const frappe: CatppuccinoFlavor = {
  base: '#303446',
  blue: '#8caaee',
  crust: '#232634',
  flamingo: '#eebebe',
  green: '#a6d189',
  lavender: '#babbf1',
  mantle: '#292c3c',
  maroon: '#ea999c',
  mauve: '#ca9ee6',
  overlay0: '#737994',
  overlay1: '#838ba7',
  overlay2: '#949cbb',
  peach: '#ef9f76',
  pink: '#f4b8e4',
  red: '#e78284',
  rosewater: '#f2d5cf',
  sapphire: '#85c1dc',
  sky: '#99d1db',
  subtext0: '#a5adce',
  subtext1: '#b5bfe2',
  surface0: '#414559',
  surface1: '#51576d',
  surface2: '#626880',
  teal: '#81c8be',
  text: '#c6d0f5',
  yellow: '#e5c890',
}

/** Macchiato — medium contrast with gentle, soothing colors. */
const macchiato: CatppuccinoFlavor = {
  base: '#24273a',
  blue: '#8aadf4',
  crust: '#181926',
  flamingo: '#f0c6c6',
  green: '#a6da95',
  lavender: '#b7bdf8',
  mantle: '#1e2030',
  maroon: '#ee99a0',
  mauve: '#c6a0f6',
  overlay0: '#6e738d',
  overlay1: '#8087a2',
  overlay2: '#939ab7',
  peach: '#f5a97f',
  pink: '#f5bde6',
  red: '#ed8796',
  rosewater: '#f4dbd6',
  sapphire: '#7dc4e4',
  sky: '#91d7e3',
  subtext0: '#a5adcb',
  subtext1: '#b8c0e0',
  surface0: '#363a4f',
  surface1: '#494d64',
  surface2: '#5b6078',
  teal: '#8bd5ca',
  text: '#cad3f5',
  yellow: '#eed49f',
}

/** Mocha — the original; darkest variant with color-rich accents. */
const mocha: CatppuccinoFlavor = {
  base: '#1e1e2e',
  blue: '#89b4fa',
  crust: '#11111b',
  flamingo: '#f2cdcd',
  green: '#a6e3a1',
  lavender: '#b4befe',
  mantle: '#181825',
  maroon: '#eba0ac',
  mauve: '#cba6f7',
  overlay0: '#6c7086',
  overlay1: '#7f849c',
  overlay2: '#9399b2',
  peach: '#fab387',
  pink: '#f5c2e7',
  red: '#f38ba8',
  rosewater: '#f5e0dc',
  sapphire: '#74c7ec',
  sky: '#89dceb',
  subtext0: '#a6adc8',
  subtext1: '#bac2de',
  surface0: '#313244',
  surface1: '#45475a',
  surface2: '#585b70',
  teal: '#94e2d5',
  text: '#cdd6f4',
  yellow: '#f9e2af',
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a complete ThemeDefinition for a Catppuccin flavor pair.
 *
 * @param name        Human-readable theme name shown in dev tooling.
 * @param darkFlavor  The dark-mode Catppuccin flavor (Frappé / Macchiato / Mocha).
 * @param lightFlavor The light-mode flavor — defaults to Latte, the only light flavor.
 */
function makeCatppuccinoTheme(
  name: string,
  darkFlavor: CatppuccinoFlavor,
  lightFlavor: CatppuccinoFlavor = latte,
): ThemeDefinition {
  // ── CSS custom properties ──────────────────────────────────────────────────
  const cssVars: ThemeDefinition['cssVars'] = {
    dark: {
      '--accent-color': darkFlavor.blue,
      '--accent-light': tint(darkFlavor.blue, 0.15),
      '--bg-color': darkFlavor.base,
      '--border-color': darkFlavor.surface1,
      '--card-bg': darkFlavor.mantle,
      '--header-bg': darkFlavor.mantle,
      '--hover-color': darkFlavor.surface0,
      '--secondary-text': darkFlavor.subtext0,
      '--text-color': darkFlavor.text,
    },
    light: {
      '--accent-color': lightFlavor.blue,
      '--accent-light': tint(lightFlavor.blue, 0.1),
      '--bg-color': lightFlavor.base,
      '--border-color': lightFlavor.surface1,
      '--card-bg': lightFlavor.mantle,
      '--header-bg': lightFlavor.mantle,
      '--hover-color': lightFlavor.surface0,
      '--secondary-text': lightFlavor.subtext0,
      '--text-color': lightFlavor.text,
    },
  }

  // ── Terminal palette ───────────────────────────────────────────────────────
  const terminal: ThemeDefinition['terminal'] = {
    colors: (isDark) => {
      const p = isDark ? darkFlavor : lightFlavor
      return {
        bg: p.base,
        border: p.surface1,
        command: p.sky,
        error: p.red,
        header: p.mantle,
        highlight: p.yellow,
        info: p.sapphire,
        muted: p.overlay1,
        param: p.mauve,
        prompt: p.green,
        secondary: p.subtext1,
        success: p.green,
        tabBar: p.mantle,
        text: p.text,
        touchBar: p.crust,
        warning: p.peach,
      }
    },

    // 7-colour rainbow: red → peach → yellow → green → sky → blue → mauve
    // (follows the Catppuccin accent hue wheel)
    rainbow: [
      darkFlavor.red,
      darkFlavor.peach,
      darkFlavor.yellow,
      darkFlavor.green,
      darkFlavor.sky,
      darkFlavor.blue,
      darkFlavor.mauve,
    ],
  }

  // ── Category card themes ───────────────────────────────────────────────────
  // Each card gets a semi-transparent accent tint layered over the base
  // background, keeping the palette's character without fully saturating.

  type CatFn = (
    accent: string,
    isDark: boolean,
  ) => {
    bg: string
    border: string
    color: string
    glow: string
    stripe: string
  }

  const catColors: CatFn = (accent, isDark) => ({
    bg: tint(accent, isDark ? 0.12 : 0.08),
    border: tint(accent, isDark ? 0.55 : 0.45),
    color: accent,
    glow: tint(accent, isDark ? 0.28 : 0.14),
    stripe: `linear-gradient(180deg, ${tint(accent, 0.65)}, transparent)`,
  })

  const categoryThemes: ThemeDefinition['categoryThemes'] = (isDark) => {
    const p = isDark ? darkFlavor : lightFlavor
    return {
      data: {
        ...catColors(p.green, isDark),
        cmd: '$ jupyter execute',
        icon: FaChartBar,
        label: 'DATA / ML',
      },
      healthcare: {
        ...catColors(p.red, isDark),
        cmd: '$ python recommend.py',
        icon: FaHeartbeat,
        label: 'HEALTHCARE',
      },
      nlp: {
        ...catColors(p.pink, isDark),
        cmd: '$ python train.py',
        icon: FaBrain,
        label: 'NLP / AI',
      },
      robotics: {
        ...catColors(p.mauve, isDark),
        cmd: '$ ros2 launch planner',
        icon: FaRobot,
        label: 'ROBOTICS',
      },
      tooling: {
        ...catColors(p.teal, isDark),
        cmd: '$ make install',
        icon: FaWrench,
        label: 'TOOLING',
      },
      'web-app': {
        ...catColors(p.peach, isDark),
        cmd: '$ npm run dev',
        icon: FaGlobe,
        label: 'WEB / APP',
      },
    }
  }

  // ── Article category badge colors ──────────────────────────────────────────
  const articleCategoryColors: ThemeDefinition['articleCategoryColors'] = {
    data: {
      bg: (dk) => tint(dk ? darkFlavor.green : lightFlavor.green, 0.15),
      fg: (dk) => (dk ? darkFlavor.green : lightFlavor.green),
    },
    healthcare: {
      bg: (dk) => tint(dk ? darkFlavor.red : lightFlavor.red, 0.15),
      fg: (dk) => (dk ? darkFlavor.red : lightFlavor.red),
    },
    nlp: {
      bg: (dk) => tint(dk ? darkFlavor.pink : lightFlavor.pink, 0.15),
      fg: (dk) => (dk ? darkFlavor.pink : lightFlavor.pink),
    },
    robotics: {
      bg: (dk) => tint(dk ? darkFlavor.mauve : lightFlavor.mauve, 0.15),
      fg: (dk) => (dk ? darkFlavor.mauve : lightFlavor.mauve),
    },
    tooling: {
      bg: (dk) => tint(dk ? darkFlavor.teal : lightFlavor.teal, 0.15),
      fg: (dk) => (dk ? darkFlavor.teal : lightFlavor.teal),
    },
    'web-app': {
      bg: (dk) => tint(dk ? darkFlavor.peach : lightFlavor.peach, 0.15),
      fg: (dk) => (dk ? darkFlavor.peach : lightFlavor.peach),
    },
  }

  // ── Publication venue badge colors ─────────────────────────────────────────
  const publicationVenueColors: ThemeDefinition['publicationVenueColors'] = {
    conference: {
      bg: (dk) => tint(dk ? darkFlavor.sky : lightFlavor.sky, 0.15),
      fg: (dk) => (dk ? darkFlavor.sky : lightFlavor.sky),
      label: 'CONFERENCE',
    },
    demo: {
      bg: (dk) => tint(dk ? darkFlavor.peach : lightFlavor.peach, 0.15),
      fg: (dk) => (dk ? darkFlavor.peach : lightFlavor.peach),
      label: 'DEMO TRACK',
    },
    journal: {
      bg: (dk) => tint(dk ? darkFlavor.yellow : lightFlavor.yellow, 0.15),
      fg: (dk) => (dk ? darkFlavor.yellow : lightFlavor.yellow),
      label: 'JOURNAL',
    },
    preprint: {
      bg: (dk) => tint(dk ? darkFlavor.green : lightFlavor.green, 0.15),
      fg: (dk) => (dk ? darkFlavor.green : lightFlavor.green),
      label: 'PREPRINT',
    },
    workshop: {
      bg: (dk) => tint(dk ? darkFlavor.mauve : lightFlavor.mauve, 0.15),
      fg: (dk) => (dk ? darkFlavor.mauve : lightFlavor.mauve),
      label: 'WORKSHOP',
    },
  }

  return {
    articleCategoryColors,
    categoryThemes,
    cssVars,
    name,
    publicationVenueColors,
    terminal,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported themes
//
// Each dark flavor is paired with Latte as the light-mode companion —
// this matches Catppuccin's own design intent.
//
// To activate one of these, edit src/themes/index.ts:
//   export { catppuccinoMochaTheme as activeTheme } from './catppuccin'
// ─────────────────────────────────────────────────────────────────────────────

/** Mocha — the original Catppuccin; darkest and most color-rich. */
export const catppuccinoMochaTheme = makeCatppuccinoTheme('Catppuccin Mocha', mocha)

/** Macchiato — medium contrast, a soothing middle ground. */
export const catppuccinoMacchiatoTheme = makeCatppuccinoTheme('Catppuccin Macchiato', macchiato)

/** Frappé — subdued and muted, the gentlest dark flavor. */
export const catppuccinoFrappeTheme = makeCatppuccinoTheme('Catppuccin Frappé', frappe)

/**
 * Latte — the single light flavor.
 * Since ThemeDefinition requires both a light and a dark variant, the "dark"
 * slot here uses Frappé (the lightest dark flavor) so the toggle remains
 * visually sensible for users who switch modes unexpectedly.
 */
export const catppuccinoLatteTheme = makeCatppuccinoTheme('Catppuccin Latte', frappe, latte)
