import { FaRobot, FaBrain, FaGlobe, FaChartBar, FaWrench, FaHeartbeat } from 'react-icons/fa'
import type { ThemeDefinition, CSSVarTokens, TerminalColors } from './types'

/**
 * Ayu Light colors
 */
const ayuLight = {
  bg: '#fafafa',
  fg: '#5c6773',
  accent: '#f29718',
  ui: '#8a9199',
  tag: '#41a6d9',
  func: '#f29718',
  entity: '#399ee6',
  string: '#86b300',
  regexp: '#4cbf99',
  markup: '#f07171',
  keyword: '#ff7733',
  special: '#e6ba7e',
  comment: '#abb0b6',
  constant: '#a37acc',
  error: '#ff3333',
}

/**
 * Ayu Dark colors
 */
const ayuDark = {
  bg: '#0b0e14',
  fg: '#b3b1ad',
  accent: '#e6b450',
  ui: '#3d424d',
  tag: '#39bae6',
  func: '#ffb454',
  entity: '#59c2ff',
  string: '#c2d94c',
  regexp: '#95e6cb',
  markup: '#f07178',
  keyword: '#ff8f40',
  special: '#e1d6b0',
  comment: '#626a73',
  constant: '#ffee99',
  error: '#ff3333',
}

/**
 * Ayu Mirage colors
 */
const ayuMirage = {
  bg: '#1f2430',
  fg: '#cbccc6',
  accent: '#ffcc66',
  ui: '#707a8c',
  tag: '#5ccfe6',
  func: '#ffcc66',
  entity: '#73d0ff',
  string: '#bae67e',
  regexp: '#95e6cb',
  markup: '#f28779',
  keyword: '#ffa759',
  special: '#ffe6b3',
  comment: '#5c6773',
  constant: '#d4bfff',
  error: '#ff3333',
}

const lightCSSVars: CSSVarTokens = {
  '--bg-color': ayuLight.bg,
  '--text-color': ayuLight.fg,
  '--accent-color': ayuLight.accent,
  '--accent-light': 'rgba(242,151,24,0.1)',
  '--secondary-text': ayuLight.comment,
  '--border-color': '#e0e0e0',
  '--card-bg': '#ffffff',
  '--header-bg': '#f0f0f0',
  '--hover-color': '#f0f0f0',
}

const createTerminalColors = (colors: typeof ayuDark, dk: boolean): TerminalColors => ({
  bg: dk ? colors.bg : ayuLight.bg,
  text: dk ? colors.fg : ayuLight.fg,
  header: dk ? colors.ui : '#f0f0f0',
  border: dk ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
  prompt: dk ? colors.tag : ayuLight.tag,
  command: dk ? colors.keyword : ayuLight.keyword,
  param: dk ? colors.constant : ayuLight.constant,
  info: dk ? colors.entity : ayuLight.entity,
  highlight: dk ? colors.special : ayuLight.special,
  error: dk ? colors.error : ayuLight.error,
  success: dk ? colors.string : ayuLight.string,
  warning: dk ? colors.func : ayuLight.func,
  secondary: dk ? colors.comment : ayuLight.comment,
  muted: dk ? colors.ui : ayuLight.ui,
  touchBar: dk ? '#151a1e' : '#f5f5f5',
  tabBar: dk ? '#1a2026' : '#fafafa',
})

const createCategoryThemes = (colors: typeof ayuDark, dk: boolean) => ({
  robotics: {
    bg: dk ? 'rgba(115,208,255,0.05)' : '#f0f9ff',
    border: colors.entity,
    stripe: `linear-gradient(180deg, ${colors.entity}, transparent)`,
    color: colors.entity,
    glow: `rgba(115,208,255, ${dk ? '0.15' : '0.08'})`,
    icon: FaRobot,
    label: 'ROBOTICS',
    cmd: '$ ros2 launch planner',
  },
  nlp: {
    bg: dk ? 'rgba(255,167,89,0.05)' : '#fff7ed',
    border: colors.keyword,
    stripe: `linear-gradient(180deg, ${colors.keyword}, transparent)`,
    color: colors.keyword,
    glow: `rgba(255,167,89, ${dk ? '0.15' : '0.08'})`,
    icon: FaBrain,
    label: 'NLP / AI',
    cmd: '$ python train.py',
  },
  'web-app': {
    bg: dk ? 'rgba(255,204,102,0.05)' : '#fffbeb',
    border: colors.accent,
    stripe: `linear-gradient(180deg, ${colors.accent}, transparent)`,
    color: colors.accent,
    glow: `rgba(255,204,102, ${dk ? '0.15' : '0.08'})`,
    icon: FaGlobe,
    label: 'WEB / APP',
    cmd: '$ npm run dev',
  },
  data: {
    bg: dk ? 'rgba(186,230,126,0.05)' : '#f7fee7',
    border: colors.string,
    stripe: `linear-gradient(180deg, ${colors.string}, transparent)`,
    color: colors.string,
    glow: `rgba(186,230,126, ${dk ? '0.15' : '0.08'})`,
    icon: FaChartBar,
    label: 'DATA / ML',
    cmd: '$ jupyter execute',
  },
  tooling: {
    bg: dk ? 'rgba(149,230,203,0.05)' : '#f0fdf9',
    border: colors.regexp,
    stripe: `linear-gradient(180deg, ${colors.regexp}, transparent)`,
    color: colors.regexp,
    glow: `rgba(149,230,203, ${dk ? '0.15' : '0.08'})`,
    icon: FaWrench,
    label: 'TOOLING',
    cmd: '$ make install',
  },
  healthcare: {
    bg: dk ? 'rgba(242,135,121,0.05)' : '#fef2f2',
    border: colors.markup,
    stripe: `linear-gradient(180deg, ${colors.markup}, transparent)`,
    color: colors.markup,
    glow: `rgba(242,135,121, ${dk ? '0.15' : '0.08'})`,
    icon: FaHeartbeat,
    label: 'HEALTHCARE',
    cmd: '$ python recommend.py',
  },
})

export const ayuDarkTheme: ThemeDefinition = {
  name: 'Ayu Dark',
  cssVars: {
    light: lightCSSVars,
    dark: {
      '--bg-color': ayuDark.bg,
      '--text-color': ayuDark.fg,
      '--accent-color': ayuDark.accent,
      '--accent-light': 'rgba(230,180,80,0.15)',
      '--secondary-text': ayuDark.comment,
      '--border-color': 'rgba(255,255,255,0.1)',
      '--card-bg': '#0f131a',
      '--header-bg': '#0f131a',
      '--hover-color': '#151a24',
    },
  },
  terminal: {
    rainbow: ['#ff3333', '#f29718', '#ff7733', '#86b300', '#41a6d9', '#399ee6', '#a37acc'] as const,
    colors: (dk) => createTerminalColors(ayuDark, dk),
  },
  categoryThemes: (dk) => createCategoryThemes(ayuDark, dk),
  articleCategoryColors: {
    robotics: {
      fg: (dk) => (dk ? ayuDark.tag : ayuLight.tag),
      bg: (dk) => (dk ? 'rgba(57,186,230,0.15)' : 'rgba(65,166,217,0.1)'),
    },
    nlp: {
      fg: (dk) => (dk ? ayuDark.keyword : ayuLight.keyword),
      bg: (dk) => (dk ? 'rgba(255,143,64,0.15)' : 'rgba(255,119,51,0.1)'),
    },
    'web-app': {
      fg: (dk) => (dk ? ayuDark.accent : ayuLight.accent),
      bg: (dk) => (dk ? 'rgba(230,180,80,0.15)' : 'rgba(242,151,24,0.1)'),
    },
    data: {
      fg: (dk) => (dk ? ayuDark.string : ayuLight.string),
      bg: (dk) => (dk ? 'rgba(194,217,76,0.15)' : 'rgba(134,179,0,0.1)'),
    },
    tooling: {
      fg: (dk) => (dk ? ayuDark.regexp : ayuLight.regexp),
      bg: (dk) => (dk ? 'rgba(149,230,203,0.15)' : 'rgba(76,191,153,0.1)'),
    },
    healthcare: {
      fg: (dk) => (dk ? ayuDark.markup : ayuLight.markup),
      bg: (dk) => (dk ? 'rgba(240,113,120,0.15)' : 'rgba(240,113,113,0.1)'),
    },
  },
  publicationVenueColors: {
    conference: {
      bg: (dk) => (dk ? 'rgba(89,194,255,0.15)' : 'rgba(57,158,230,0.1)'),
      fg: (dk) => (dk ? ayuDark.entity : ayuLight.entity),
      label: 'CONFERENCE',
    },
    workshop: {
      bg: (dk) => (dk ? 'rgba(255,238,153,0.15)' : 'rgba(163,122,204,0.1)'),
      fg: (dk) => (dk ? ayuDark.constant : ayuLight.constant),
      label: 'WORKSHOP',
    },
    demo: {
      bg: (dk) => (dk ? 'rgba(255,180,84,0.15)' : 'rgba(242,151,24,0.1)'),
      fg: (dk) => (dk ? ayuDark.func : ayuLight.func),
      label: 'DEMO TRACK',
    },
    preprint: {
      bg: (dk) => (dk ? 'rgba(194,217,76,0.15)' : 'rgba(134,179,0,0.1)'),
      fg: (dk) => (dk ? ayuDark.string : ayuLight.string),
      label: 'PREPRINT',
    },
    journal: {
      bg: (dk) => (dk ? 'rgba(255,238,153,0.15)' : 'rgba(230,186,126,0.1)'),
      fg: (dk) => (dk ? ayuDark.constant : ayuLight.special),
      label: 'JOURNAL',
    },
  },
}

export const ayuMirageTheme: ThemeDefinition = {
  name: 'Ayu Mirage',
  cssVars: {
    light: lightCSSVars,
    dark: {
      '--bg-color': ayuMirage.bg,
      '--text-color': ayuMirage.fg,
      '--accent-color': ayuMirage.accent,
      '--accent-light': 'rgba(255,204,102,0.15)',
      '--secondary-text': ayuMirage.comment,
      '--border-color': 'rgba(255,255,255,0.1)',
      '--card-bg': '#242936',
      '--header-bg': '#242936',
      '--hover-color': '#2a313d',
    },
  },
  terminal: {
    rainbow: ['#ff3333', '#f29718', '#ff7733', '#86b300', '#41a6d9', '#399ee6', '#a37acc'] as const,
    colors: (dk) => createTerminalColors(ayuMirage, dk),
  },
  categoryThemes: (dk) => createCategoryThemes(ayuMirage, dk),
  articleCategoryColors: ayuDarkTheme.articleCategoryColors, // Can reuse logic or customize
  publicationVenueColors: ayuDarkTheme.publicationVenueColors,
}
