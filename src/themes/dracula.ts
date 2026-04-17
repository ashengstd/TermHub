import { FaRobot, FaBrain, FaGlobe, FaChartBar, FaWrench, FaHeartbeat } from 'react-icons/fa'
import type { ThemeDefinition, CSSVarTokens, TerminalColors } from './types'

/**
 * Dracula Official Palette
 * https://draculatheme.com/contribute
 */
export const draculaColors = {
  background: '#282a36',
  currentLine: '#44475a',
  foreground: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
}

/**
 * Dracula Light (Custom logic using Dracula accents on light background)
 */
const draculaLight = {
  bg: '#f8f8f2',
  fg: '#282a36',
  accent: '#bd93f9',
  ui: '#e6e6e6',
  comment: '#6272a4',
}

const lightCSSVars: CSSVarTokens = {
  '--bg-color': draculaLight.bg,
  '--text-color': draculaLight.fg,
  '--accent-color': draculaLight.accent,
  '--accent-light': 'rgba(189, 147, 249, 0.1)',
  '--secondary-text': draculaLight.comment,
  '--border-color': '#d1d1d1',
  '--card-bg': '#ffffff',
  '--header-bg': '#efefef',
  '--hover-color': '#efefef',
}

const darkCSSVars: CSSVarTokens = {
  '--bg-color': draculaColors.background,
  '--text-color': draculaColors.foreground,
  '--accent-color': draculaColors.purple,
  '--accent-light': 'rgba(189, 147, 249, 0.15)',
  '--secondary-text': draculaColors.comment,
  '--border-color': draculaColors.currentLine,
  '--card-bg': '#343746',
  '--header-bg': '#343746',
  '--hover-color': '#44475a',
}

const createTerminalColors = (dk: boolean): TerminalColors => ({
  bg: dk ? draculaColors.background : draculaLight.bg,
  text: dk ? draculaColors.foreground : draculaLight.fg,
  header: dk ? '#343746' : '#efefef',
  border: dk ? draculaColors.currentLine : '#d1d1d1',
  prompt: dk ? draculaColors.green : '#388e3c',
  command: dk ? draculaColors.pink : '#c2185b',
  param: dk ? draculaColors.orange : '#e65100',
  info: dk ? draculaColors.cyan : '#0097a7',
  highlight: dk ? draculaColors.yellow : '#fbc02d',
  error: dk ? draculaColors.red : '#d32f2f',
  success: dk ? draculaColors.green : '#388e3c',
  warning: dk ? draculaColors.orange : '#ef6c00',
  secondary: dk ? draculaColors.comment : draculaLight.comment,
  muted: dk ? '#44475a' : '#9e9e9e',
  touchBar: dk ? '#1e1f29' : '#e0e0e0',
  tabBar: dk ? '#21222c' : '#f0f0f0',
})

const createCategoryThemes = (dk: boolean) => ({
  robotics: {
    bg: dk ? 'rgba(189, 147, 249, 0.05)' : '#f3eaff',
    border: draculaColors.purple,
    stripe: `linear-gradient(180deg, ${draculaColors.purple}, transparent)`,
    color: draculaColors.purple,
    glow: `rgba(189, 147, 249, ${dk ? '0.25' : '0.12'})`,
    icon: FaRobot,
    label: 'ROBOTICS',
    cmd: '$ ros2 launch planner',
  },
  nlp: {
    bg: dk ? 'rgba(255, 121, 198, 0.05)' : '#fff0f7',
    border: draculaColors.pink,
    stripe: `linear-gradient(180deg, ${draculaColors.pink}, transparent)`,
    color: draculaColors.pink,
    glow: `rgba(255, 121, 198, ${dk ? '0.25' : '0.12'})`,
    icon: FaBrain,
    label: 'NLP / AI',
    cmd: '$ python train.py',
  },
  'web-app': {
    bg: dk ? 'rgba(139, 233, 253, 0.05)' : '#f0fdff',
    border: draculaColors.cyan,
    stripe: `linear-gradient(180deg, ${draculaColors.cyan}, transparent)`,
    color: draculaColors.cyan,
    glow: `rgba(139, 233, 253, ${dk ? '0.25' : '0.12'})`,
    icon: FaGlobe,
    label: 'WEB / APP',
    cmd: '$ npm run dev',
  },
  data: {
    bg: dk ? 'rgba(80, 250, 123, 0.05)' : '#f0fff4',
    border: draculaColors.green,
    stripe: `linear-gradient(180deg, ${draculaColors.green}, transparent)`,
    color: draculaColors.green,
    glow: `rgba(80, 250, 123, ${dk ? '0.25' : '0.12'})`,
    icon: FaChartBar,
    label: 'DATA / ML',
    cmd: '$ jupyter execute',
  },
  tooling: {
    bg: dk ? 'rgba(255, 184, 108, 0.05)' : '#fff8f0',
    border: draculaColors.orange,
    stripe: `linear-gradient(180deg, ${draculaColors.orange}, transparent)`,
    color: draculaColors.orange,
    glow: `rgba(255, 184, 108, ${dk ? '0.25' : '0.12'})`,
    icon: FaWrench,
    label: 'TOOLING',
    cmd: '$ make install',
  },
  healthcare: {
    bg: dk ? 'rgba(255, 85, 85, 0.05)' : '#fff1f1',
    border: draculaColors.red,
    stripe: `linear-gradient(180deg, ${draculaColors.red}, transparent)`,
    color: draculaColors.red,
    glow: `rgba(255, 85, 85, ${dk ? '0.25' : '0.12'})`,
    icon: FaHeartbeat,
    label: 'HEALTHCARE',
    cmd: '$ python recommend.py',
  },
})

export const draculaTheme: ThemeDefinition = {
  name: 'Dracula',
  cssVars: {
    light: lightCSSVars,
    dark: darkCSSVars,
  },
  terminal: {
    rainbow: [
      draculaColors.red,
      draculaColors.orange,
      draculaColors.yellow,
      draculaColors.green,
      draculaColors.cyan,
      draculaColors.purple,
      draculaColors.pink,
    ] as const,
    colors: createTerminalColors,
  },
  categoryThemes: createCategoryThemes,
  articleCategoryColors: {
    robotics: {
      fg: (dk) => (dk ? draculaColors.purple : '#7b1fa2'),
      bg: (dk) => (dk ? 'rgba(189, 147, 249, 0.15)' : 'rgba(123, 31, 162, 0.1)'),
    },
    nlp: {
      fg: (dk) => (dk ? draculaColors.pink : '#c2185b'),
      bg: (dk) => (dk ? 'rgba(255, 121, 198, 0.15)' : 'rgba(194, 24, 91, 0.1)'),
    },
    'web-app': {
      fg: (dk) => (dk ? draculaColors.cyan : '#0097a7'),
      bg: (dk) => (dk ? 'rgba(139, 233, 253, 0.15)' : 'rgba(0, 151, 167, 0.1)'),
    },
    data: {
      fg: (dk) => (dk ? draculaColors.green : '#388e3c'),
      bg: (dk) => (dk ? 'rgba(80, 250, 123, 0.15)' : 'rgba(56, 142, 60, 0.1)'),
    },
    tooling: {
      fg: (dk) => (dk ? draculaColors.orange : '#e65100'),
      bg: (dk) => (dk ? 'rgba(255, 184, 108, 0.15)' : 'rgba(230, 81, 0, 0.1)'),
    },
    healthcare: {
      fg: (dk) => (dk ? draculaColors.red : '#d32f2f'),
      bg: (dk) => (dk ? 'rgba(255, 85, 85, 0.15)' : 'rgba(211, 47, 47, 0.1)'),
    },
  },
  publicationVenueColors: {
    conference: {
      bg: (dk) => (dk ? 'rgba(139, 233, 253, 0.15)' : 'rgba(0, 151, 167, 0.1)'),
      fg: (dk) => (dk ? draculaColors.cyan : '#0097a7'),
      label: 'CONFERENCE',
    },
    workshop: {
      bg: (dk) => (dk ? 'rgba(189, 147, 249, 0.15)' : 'rgba(123, 31, 162, 0.1)'),
      fg: (dk) => (dk ? draculaColors.purple : '#7b1fa2'),
      label: 'WORKSHOP',
    },
    demo: {
      bg: (dk) => (dk ? 'rgba(255, 184, 108, 0.15)' : 'rgba(230, 81, 0, 0.1)'),
      fg: (dk) => (dk ? draculaColors.orange : '#e65100'),
      label: 'DEMO TRACK',
    },
    preprint: {
      bg: (dk) => (dk ? 'rgba(80, 250, 123, 0.15)' : 'rgba(56, 142, 60, 0.1)'),
      fg: (dk) => (dk ? draculaColors.green : '#388e3c'),
      label: 'PREPRINT',
    },
    journal: {
      bg: (dk) => (dk ? 'rgba(241, 250, 140, 0.15)' : 'rgba(251, 192, 45, 0.1)'),
      fg: (dk) => (dk ? draculaColors.yellow : '#f9a825'),
      label: 'JOURNAL',
    },
  },
}
