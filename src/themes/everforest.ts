import { FaRobot, FaBrain, FaGlobe, FaChartBar, FaWrench, FaHeartbeat } from 'react-icons/fa'
import type { ThemeDefinition, CSSVarTokens, TerminalColors } from './types'

/**
 * Everforest Official Palette (Dark Hard)
 * https://github.com/sainnhe/everforest
 */
export const everforestDarkColors = {
  bg_dim: '#1e2326',
  bg0: '#272e33',
  bg1: '#2e383c',
  bg2: '#374145',
  bg3: '#414b50',
  bg4: '#495156',
  bg5: '#4f5b58',
  fg: '#d3c6aa',
  red: '#e67e80',
  orange: '#e69875',
  yellow: '#dbbc7f',
  green: '#a7c080',
  aqua: '#83c092',
  blue: '#7fbbb3',
  purple: '#d699b6',
  grey0: '#7a8478',
  grey1: '#859289',
  grey2: '#9da9a0',
}

/**
 * Everforest Official Palette (Light Hard)
 */
const everforestLightColors = {
  bg0: '#fffbef',
  bg1: '#f8f5e4',
  bg2: '#f2efdf',
  bg3: '#edeada',
  bg4: '#e8e5d5',
  fg: '#5c6a72',
  red: '#f85552',
  orange: '#f57d26',
  yellow: '#dfa000',
  green: '#8da101',
  aqua: '#35a77c',
  blue: '#3a94c5',
  purple: '#df69ba',
  grey0: '#a6b0a0',
  grey1: '#939f91',
}

const lightCSSVars: CSSVarTokens = {
  '--bg-color': everforestLightColors.bg0,
  '--text-color': everforestLightColors.fg,
  '--accent-color': everforestLightColors.green,
  '--accent-light': 'rgba(141, 161, 1, 0.1)',
  '--secondary-text': everforestLightColors.grey1,
  '--border-color': everforestLightColors.bg4,
  '--card-bg': '#ffffff',
  '--header-bg': everforestLightColors.bg1,
  '--hover-color': everforestLightColors.bg1,
}

const darkCSSVars: CSSVarTokens = {
  '--bg-color': everforestDarkColors.bg0,
  '--text-color': everforestDarkColors.fg,
  '--accent-color': everforestDarkColors.green,
  '--accent-light': 'rgba(167, 192, 128, 0.15)',
  '--secondary-text': everforestDarkColors.grey1,
  '--border-color': 'rgba(0,0,0,0.2)',
  '--card-bg': everforestDarkColors.bg_dim,
  '--header-bg': everforestDarkColors.bg1,
  '--hover-color': everforestDarkColors.bg1,
}

const createTerminalColors = (dk: boolean): TerminalColors => ({
  bg: dk ? everforestDarkColors.bg0 : everforestLightColors.bg0,
  text: dk ? everforestDarkColors.fg : everforestLightColors.fg,
  header: dk ? everforestDarkColors.bg1 : everforestLightColors.bg1,
  border: dk ? 'rgba(0,0,0,0.2)' : everforestLightColors.bg4,
  prompt: dk ? everforestDarkColors.aqua : everforestLightColors.aqua,
  command: dk ? everforestDarkColors.green : everforestLightColors.green,
  param: dk ? everforestDarkColors.orange : everforestLightColors.orange,
  info: dk ? everforestDarkColors.blue : everforestLightColors.blue,
  highlight: dk ? everforestDarkColors.yellow : everforestLightColors.yellow,
  error: dk ? everforestDarkColors.red : everforestLightColors.red,
  success: dk ? everforestDarkColors.green : everforestLightColors.green,
  warning: dk ? everforestDarkColors.orange : everforestLightColors.orange,
  secondary: dk ? everforestDarkColors.grey1 : everforestLightColors.grey1,
  muted: dk ? everforestDarkColors.grey0 : everforestLightColors.grey0,
  touchBar: dk ? '#1e2326' : '#f2efdf',
  tabBar: dk ? '#272e33' : '#fffbef',
})

const createCategoryThemes = (dk: boolean) => ({
  robotics: {
    bg: dk ? 'rgba(214, 153, 182, 0.05)' : '#fdf4f8',
    border: dk ? everforestDarkColors.purple : everforestLightColors.purple,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.purple : everforestLightColors.purple}, transparent)`,
    color: dk ? everforestDarkColors.purple : everforestLightColors.purple,
    glow: `rgba(214, 153, 182, ${dk ? '0.2' : '0.1'})`,
    icon: FaRobot,
    label: 'ROBOTICS',
    cmd: '$ ros2 launch planner',
  },
  nlp: {
    bg: dk ? 'rgba(230, 126, 128, 0.05)' : '#fef4f4',
    border: dk ? everforestDarkColors.red : everforestLightColors.red,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.red : everforestLightColors.red}, transparent)`,
    color: dk ? everforestDarkColors.red : everforestLightColors.red,
    glow: `rgba(230, 126, 128, ${dk ? '0.2' : '0.1'})`,
    icon: FaBrain,
    label: 'NLP / AI',
    cmd: '$ python train.py',
  },
  'web-app': {
    bg: dk ? 'rgba(127, 187, 179, 0.05)' : '#f4fbf9',
    border: dk ? everforestDarkColors.blue : everforestLightColors.blue,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.blue : everforestLightColors.blue}, transparent)`,
    color: dk ? everforestDarkColors.blue : everforestLightColors.blue,
    glow: `rgba(127, 187, 179, ${dk ? '0.2' : '0.1'})`,
    icon: FaGlobe,
    label: 'WEB / APP',
    cmd: '$ npm run dev',
  },
  data: {
    bg: dk ? 'rgba(167, 192, 128, 0.05)' : '#f7faf2',
    border: dk ? everforestDarkColors.green : everforestLightColors.green,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.green : everforestLightColors.green}, transparent)`,
    color: dk ? everforestDarkColors.green : everforestLightColors.green,
    glow: `rgba(167, 192, 128, ${dk ? '0.2' : '0.1'})`,
    icon: FaChartBar,
    label: 'DATA / ML',
    cmd: '$ jupyter execute',
  },
  tooling: {
    bg: dk ? 'rgba(230, 152, 117, 0.05)' : '#fff6f2',
    border: dk ? everforestDarkColors.orange : everforestLightColors.orange,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.orange : everforestLightColors.orange}, transparent)`,
    color: dk ? everforestDarkColors.orange : everforestLightColors.orange,
    glow: `rgba(230, 152, 117, ${dk ? '0.2' : '0.1'})`,
    icon: FaWrench,
    label: 'TOOLING',
    cmd: '$ make install',
  },
  healthcare: {
    bg: dk ? 'rgba(131, 192, 146, 0.05)' : '#f2faf4',
    border: dk ? everforestDarkColors.aqua : everforestLightColors.aqua,
    stripe: `linear-gradient(180deg, ${dk ? everforestDarkColors.aqua : everforestLightColors.aqua}, transparent)`,
    color: dk ? everforestDarkColors.aqua : everforestLightColors.aqua,
    glow: `rgba(131, 192, 146, ${dk ? '0.2' : '0.1'})`,
    icon: FaHeartbeat,
    label: 'HEALTHCARE',
    cmd: '$ python recommend.py',
  },
})

export const everforestTheme: ThemeDefinition = {
  name: 'Everforest',
  cssVars: {
    light: lightCSSVars,
    dark: darkCSSVars,
  },
  terminal: {
    rainbow: [
      everforestDarkColors.red,
      everforestDarkColors.orange,
      everforestDarkColors.yellow,
      everforestDarkColors.green,
      everforestDarkColors.blue,
      everforestDarkColors.purple,
      everforestDarkColors.aqua,
    ] as const,
    colors: createTerminalColors,
  },
  categoryThemes: createCategoryThemes,
  articleCategoryColors: {
    robotics: {
      fg: (dk) => (dk ? everforestDarkColors.purple : everforestLightColors.purple),
      bg: (dk) => (dk ? 'rgba(214, 153, 182, 0.15)' : 'rgba(223, 105, 186, 0.1)'),
    },
    nlp: {
      fg: (dk) => (dk ? everforestDarkColors.red : everforestLightColors.red),
      bg: (dk) => (dk ? 'rgba(230, 126, 128, 0.15)' : 'rgba(248, 85, 82, 0.1)'),
    },
    'web-app': {
      fg: (dk) => (dk ? everforestDarkColors.blue : everforestLightColors.blue),
      bg: (dk) => (dk ? 'rgba(127, 187, 179, 0.15)' : 'rgba(58, 148, 197, 0.1)'),
    },
    data: {
      fg: (dk) => (dk ? everforestDarkColors.green : everforestLightColors.green),
      bg: (dk) => (dk ? 'rgba(167, 192, 128, 0.15)' : 'rgba(141, 161, 1, 0.1)'),
    },
    tooling: {
      fg: (dk) => (dk ? everforestDarkColors.orange : everforestLightColors.orange),
      bg: (dk) => (dk ? 'rgba(230, 152, 117, 0.15)' : 'rgba(245, 125, 38, 0.1)'),
    },
    healthcare: {
      fg: (dk) => (dk ? everforestDarkColors.aqua : everforestLightColors.aqua),
      bg: (dk) => (dk ? 'rgba(131, 192, 146, 0.15)' : 'rgba(53, 167, 124, 0.1)'),
    },
  },
  publicationVenueColors: {
    conference: {
      bg: (dk) => (dk ? 'rgba(127, 187, 179, 0.15)' : 'rgba(58, 148, 197, 0.1)'),
      fg: (dk) => (dk ? everforestDarkColors.blue : everforestLightColors.blue),
      label: 'CONFERENCE',
    },
    workshop: {
      bg: (dk) => (dk ? 'rgba(214, 153, 182, 0.15)' : 'rgba(223, 105, 186, 0.1)'),
      fg: (dk) => (dk ? everforestDarkColors.purple : everforestLightColors.purple),
      label: 'WORKSHOP',
    },
    demo: {
      bg: (dk) => (dk ? 'rgba(230, 152, 117, 0.15)' : 'rgba(245, 125, 38, 0.1)'),
      fg: (dk) => (dk ? everforestDarkColors.orange : everforestLightColors.orange),
      label: 'DEMO TRACK',
    },
    preprint: {
      bg: (dk) => (dk ? 'rgba(167, 192, 128, 0.15)' : 'rgba(141, 161, 1, 0.1)'),
      fg: (dk) => (dk ? everforestDarkColors.green : everforestLightColors.green),
      label: 'PREPRINT',
    },
    journal: {
      bg: (dk) => (dk ? 'rgba(219, 188, 127, 0.15)' : 'rgba(223, 160, 0, 0.1)'),
      fg: (dk) => (dk ? everforestDarkColors.yellow : everforestLightColors.yellow),
      label: 'JOURNAL',
    },
  },
}
