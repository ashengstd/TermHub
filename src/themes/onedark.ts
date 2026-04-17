import { FaRobot, FaBrain, FaGlobe, FaChartBar, FaWrench, FaHeartbeat } from 'react-icons/fa'
import type { ThemeDefinition, CSSVarTokens, TerminalColors } from './types'

/**
 * One Dark Official Palette (Atom/VS Code Pro)
 */
export const oneDarkColors = {
  background: '#282c34',
  foreground: '#abb2bf',
  selection: '#3e4452',
  comment: '#5c6370',
  red: '#e06c75',
  orange: '#d19a66',
  yellow: '#e5c07b',
  green: '#98c379',
  cyan: '#56b6c2',
  blue: '#61afef',
  purple: '#c678dd',
  gutter: '#4b5263',
}

/**
 * One Light Official Palette
 */
const oneLightColors = {
  background: '#fafafa',
  foreground: '#383a42',
  selection: '#eaeae8',
  comment: '#a0a1a7',
  red: '#e45649',
  orange: '#986801',
  yellow: '#c18401',
  green: '#50a14f',
  cyan: '#0184bc',
  blue: '#4078f2',
  purple: '#a626a4',
  gutter: '#dbdbdc',
}

const lightCSSVars: CSSVarTokens = {
  '--bg-color': oneLightColors.background,
  '--text-color': oneLightColors.foreground,
  '--accent-color': oneLightColors.blue,
  '--accent-light': 'rgba(64, 120, 242, 0.1)',
  '--secondary-text': oneLightColors.comment,
  '--border-color': '#dbdbdc',
  '--card-bg': '#ffffff',
  '--header-bg': '#f0f0f0',
  '--hover-color': '#f0f0f0',
}

const darkCSSVars: CSSVarTokens = {
  '--bg-color': oneDarkColors.background,
  '--text-color': oneDarkColors.foreground,
  '--accent-color': oneDarkColors.blue,
  '--accent-light': 'rgba(97, 175, 239, 0.15)',
  '--secondary-text': oneDarkColors.comment,
  '--border-color': '#181a1f',
  '--card-bg': '#21252b',
  '--header-bg': '#21252b',
  '--hover-color': '#2c313a',
}

const createTerminalColors = (dk: boolean): TerminalColors => ({
  bg: dk ? oneDarkColors.background : oneLightColors.background,
  text: dk ? oneDarkColors.foreground : oneLightColors.foreground,
  header: dk ? '#21252b' : '#f0f0f0',
  border: dk ? '#181a1f' : '#dbdbdc',
  prompt: dk ? oneDarkColors.green : oneLightColors.green,
  command: dk ? oneDarkColors.purple : oneLightColors.purple,
  param: dk ? oneDarkColors.orange : oneLightColors.orange,
  info: dk ? oneDarkColors.cyan : oneLightColors.cyan,
  highlight: dk ? oneDarkColors.yellow : oneLightColors.yellow,
  error: dk ? oneDarkColors.red : oneLightColors.red,
  success: dk ? oneDarkColors.green : oneLightColors.green,
  warning: dk ? oneDarkColors.orange : oneLightColors.orange,
  secondary: dk ? oneDarkColors.comment : oneLightColors.comment,
  muted: dk ? oneDarkColors.gutter : oneLightColors.gutter,
  touchBar: dk ? '#21252b' : '#f5f5f5',
  tabBar: dk ? '#181a1f' : '#fafafa',
})

const createCategoryThemes = (dk: boolean) => ({
  robotics: {
    bg: dk ? 'rgba(198, 120, 221, 0.05)' : '#f5f0f9',
    border: dk ? oneDarkColors.purple : oneLightColors.purple,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.purple : oneLightColors.purple}, transparent)`,
    color: dk ? oneDarkColors.purple : oneLightColors.purple,
    glow: `rgba(198, 120, 221, ${dk ? '0.2' : '0.1'})`,
    icon: FaRobot,
    label: 'ROBOTICS',
    cmd: '$ ros2 launch planner',
  },
  nlp: {
    bg: dk ? 'rgba(224, 108, 117, 0.05)' : '#fdf3f4',
    border: dk ? oneDarkColors.red : oneLightColors.red,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.red : oneLightColors.red}, transparent)`,
    color: dk ? oneDarkColors.red : oneLightColors.red,
    glow: `rgba(224, 108, 117, ${dk ? '0.2' : '0.1'})`,
    icon: FaBrain,
    label: 'NLP / AI',
    cmd: '$ python train.py',
  },
  'web-app': {
    bg: dk ? 'rgba(97, 175, 239, 0.05)' : '#f4faff',
    border: dk ? oneDarkColors.blue : oneLightColors.blue,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.blue : oneLightColors.blue}, transparent)`,
    color: dk ? oneDarkColors.blue : oneLightColors.blue,
    glow: `rgba(97, 175, 239, ${dk ? '0.2' : '0.1'})`,
    icon: FaGlobe,
    label: 'WEB / APP',
    cmd: '$ npm run dev',
  },
  data: {
    bg: dk ? 'rgba(152, 195, 121, 0.05)' : '#fafff4',
    border: dk ? oneDarkColors.green : oneLightColors.green,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.green : oneLightColors.green}, transparent)`,
    color: dk ? oneDarkColors.green : oneLightColors.green,
    glow: `rgba(152, 195, 121, ${dk ? '0.2' : '0.1'})`,
    icon: FaChartBar,
    label: 'DATA / ML',
    cmd: '$ jupyter execute',
  },
  tooling: {
    bg: dk ? 'rgba(209, 154, 102, 0.05)' : '#fffaf4',
    border: dk ? oneDarkColors.orange : oneLightColors.orange,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.orange : oneLightColors.orange}, transparent)`,
    color: dk ? oneDarkColors.orange : oneLightColors.orange,
    glow: `rgba(209, 154, 102, ${dk ? '0.2' : '0.1'})`,
    icon: FaWrench,
    label: 'TOOLING',
    cmd: '$ make install',
  },
  healthcare: {
    bg: dk ? 'rgba(86, 182, 194, 0.05)' : '#f4fdfd',
    border: dk ? oneDarkColors.cyan : oneLightColors.cyan,
    stripe: `linear-gradient(180deg, ${dk ? oneDarkColors.cyan : oneLightColors.cyan}, transparent)`,
    color: dk ? oneDarkColors.cyan : oneLightColors.cyan,
    glow: `rgba(86, 182, 194, ${dk ? '0.2' : '0.1'})`,
    icon: FaHeartbeat,
    label: 'HEALTHCARE',
    cmd: '$ python recommend.py',
  },
})

export const oneDarkTheme: ThemeDefinition = {
  name: 'One Dark',
  cssVars: {
    light: lightCSSVars,
    dark: darkCSSVars,
  },
  terminal: {
    rainbow: [
      oneDarkColors.red,
      oneDarkColors.orange,
      oneDarkColors.yellow,
      oneDarkColors.green,
      oneDarkColors.cyan,
      oneDarkColors.blue,
      oneDarkColors.purple,
    ] as const,
    colors: createTerminalColors,
  },
  categoryThemes: createCategoryThemes,
  articleCategoryColors: {
    robotics: {
      fg: (dk) => (dk ? oneDarkColors.purple : oneLightColors.purple),
      bg: (dk) => (dk ? 'rgba(198, 120, 221, 0.15)' : 'rgba(166, 38, 164, 0.1)'),
    },
    nlp: {
      fg: (dk) => (dk ? oneDarkColors.red : oneLightColors.red),
      bg: (dk) => (dk ? 'rgba(224, 108, 117, 0.15)' : 'rgba(228, 86, 73, 0.1)'),
    },
    'web-app': {
      fg: (dk) => (dk ? oneDarkColors.blue : oneLightColors.blue),
      bg: (dk) => (dk ? 'rgba(97, 175, 239, 0.15)' : 'rgba(64, 120, 242, 0.1)'),
    },
    data: {
      fg: (dk) => (dk ? oneDarkColors.green : oneLightColors.green),
      bg: (dk) => (dk ? 'rgba(152, 195, 121, 0.15)' : 'rgba(80, 161, 79, 0.1)'),
    },
    tooling: {
      fg: (dk) => (dk ? oneDarkColors.orange : oneLightColors.orange),
      bg: (dk) => (dk ? 'rgba(209, 154, 102, 0.15)' : 'rgba(152, 104, 1, 0.1)'),
    },
    healthcare: {
      fg: (dk) => (dk ? oneDarkColors.cyan : oneLightColors.cyan),
      bg: (dk) => (dk ? 'rgba(86, 182, 194, 0.15)' : 'rgba(1, 132, 188, 0.1)'),
    },
  },
  publicationVenueColors: {
    conference: {
      bg: (dk) => (dk ? 'rgba(97, 175, 239, 0.15)' : 'rgba(64, 120, 242, 0.1)'),
      fg: (dk) => (dk ? oneDarkColors.blue : oneLightColors.blue),
      label: 'CONFERENCE',
    },
    workshop: {
      bg: (dk) => (dk ? 'rgba(198, 120, 221, 0.15)' : 'rgba(166, 38, 164, 0.1)'),
      fg: (dk) => (dk ? oneDarkColors.purple : oneLightColors.purple),
      label: 'WORKSHOP',
    },
    demo: {
      bg: (dk) => (dk ? 'rgba(209, 154, 102, 0.15)' : 'rgba(152, 104, 1, 0.1)'),
      fg: (dk) => (dk ? oneDarkColors.orange : oneLightColors.orange),
      label: 'DEMO TRACK',
    },
    preprint: {
      bg: (dk) => (dk ? 'rgba(152, 195, 121, 0.15)' : 'rgba(80, 161, 79, 0.1)'),
      fg: (dk) => (dk ? oneDarkColors.green : oneLightColors.green),
      label: 'PREPRINT',
    },
    journal: {
      bg: (dk) => (dk ? 'rgba(229, 192, 123, 0.15)' : 'rgba(193, 132, 1, 0.1)'),
      fg: (dk) => (dk ? oneDarkColors.yellow : oneLightColors.yellow),
      label: 'JOURNAL',
    },
  },
}
