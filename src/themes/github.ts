import { FaRobot, FaBrain, FaGlobe, FaChartBar, FaWrench, FaHeartbeat } from 'react-icons/fa'
import type { ThemeDefinition, CSSVarTokens, TerminalColors } from './types'

/**
 * GitHub Official Primer Palette
 * https://primer.style/primitives/colors
 */
export const githubDarkColors = {
  canvas: {
    default: '#0d1117',
    subtle: '#161b22',
    overlay: '#161b22',
    inset: '#010409',
  },
  fg: {
    default: '#c9d1d9',
    muted: '#8b949e',
    subtle: '#6e7681',
    onEmphasis: '#ffffff',
  },
  border: {
    default: '#30363d',
    muted: '#21262d',
    subtle: 'rgba(240,246,252,0.1)',
  },
  accent: {
    fg: '#58a6ff',
    emphasis: '#1f6feb',
    subtle: 'rgba(56,139,253,0.15)',
  },
  success: {
    fg: '#3fb950',
    emphasis: '#238636',
  },
  attention: {
    fg: '#d29922',
    emphasis: '#9e6a03',
  },
  severe: {
    fg: '#db6d28',
    emphasis: '#bd5300',
  },
  danger: {
    fg: '#f85149',
    emphasis: '#da3633',
  },
  done: {
    fg: '#a371f7',
    emphasis: '#8957e5',
  },
  sponsors: {
    fg: '#db61a2',
    emphasis: '#bf4b8a',
  },
}

/**
 * GitHub Official Light Palette
 */
const githubLightColors = {
  canvas: {
    default: '#ffffff',
    subtle: '#f6f8fa',
    inset: '#eff1f3',
  },
  fg: {
    default: '#24292f',
    muted: '#57606a',
    subtle: '#6e7781',
  },
  border: {
    default: '#d0d7de',
    muted: 'hsl(210deg 18% 87%)',
  },
  accent: {
    fg: '#0969da',
    emphasis: '#0550ae',
    subtle: '#ddf4ff',
  },
  success: {
    fg: '#1a7f37',
    emphasis: '#116329',
  },
  attention: {
    fg: '#9a6700',
    emphasis: '#7d4e00',
  },
  danger: {
    fg: '#cf222e',
    emphasis: '#a0111f',
  },
  done: {
    fg: '#8250df',
    emphasis: '#6e40c9',
  },
}

const lightCSSVars: CSSVarTokens = {
  '--bg-color': githubLightColors.canvas.default,
  '--text-color': githubLightColors.fg.default,
  '--accent-color': githubLightColors.accent.fg,
  '--accent-light': githubLightColors.accent.subtle,
  '--secondary-text': githubLightColors.fg.muted,
  '--border-color': githubLightColors.border.default,
  '--card-bg': '#ffffff',
  '--header-bg': githubLightColors.canvas.subtle,
  '--hover-color': githubLightColors.canvas.subtle,
}

const darkCSSVars: CSSVarTokens = {
  '--bg-color': githubDarkColors.canvas.default,
  '--text-color': githubDarkColors.fg.default,
  '--accent-color': githubDarkColors.accent.fg,
  '--accent-light': githubDarkColors.accent.subtle,
  '--secondary-text': githubDarkColors.fg.muted,
  '--border-color': githubDarkColors.border.default,
  '--card-bg': githubDarkColors.canvas.subtle,
  '--header-bg': githubDarkColors.canvas.subtle,
  '--hover-color': '#1f242c',
}

const createTerminalColors = (dk: boolean): TerminalColors => ({
  bg: dk ? githubDarkColors.canvas.default : githubLightColors.canvas.default,
  text: dk ? githubDarkColors.fg.default : githubLightColors.fg.default,
  header: dk ? githubDarkColors.canvas.subtle : githubLightColors.canvas.subtle,
  border: dk ? githubDarkColors.border.default : githubLightColors.border.default,
  prompt: dk ? githubDarkColors.success.fg : githubLightColors.success.fg,
  command: dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg,
  param: dk ? githubDarkColors.done.fg : githubLightColors.done.fg,
  info: dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg,
  highlight: dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg,
  error: dk ? githubDarkColors.danger.fg : githubLightColors.danger.fg,
  success: dk ? githubDarkColors.success.fg : githubLightColors.success.fg,
  warning: dk ? githubDarkColors.severe.fg : githubLightColors.attention.fg,
  secondary: dk ? githubDarkColors.fg.muted : githubLightColors.fg.muted,
  muted: dk ? githubDarkColors.fg.subtle : githubLightColors.fg.subtle,
  touchBar: dk ? '#010409' : '#f6f8fa',
  tabBar: dk ? '#0d1117' : '#ffffff',
})

const createCategoryThemes = (dk: boolean) => ({
  robotics: {
    bg: dk ? 'rgba(163, 113, 247, 0.05)' : '#f5f0ff',
    border: dk ? githubDarkColors.done.fg : githubLightColors.done.fg,
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.done.fg : githubLightColors.done.fg}, transparent)`,
    color: dk ? githubDarkColors.done.fg : githubLightColors.done.fg,
    glow: `rgba(163, 113, 247, ${dk ? '0.2' : '0.1'})`,
    icon: FaRobot,
    label: 'ROBOTICS',
    cmd: '$ ros2 launch planner',
  },
  nlp: {
    bg: dk ? 'rgba(219, 97, 162, 0.05)' : '#fff0f7',
    border: dk ? githubDarkColors.sponsors.fg : '#bf4b8a',
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.sponsors.fg : '#bf4b8a'}, transparent)`,
    color: dk ? githubDarkColors.sponsors.fg : '#bf4b8a',
    glow: `rgba(219, 97, 162, ${dk ? '0.2' : '0.1'})`,
    icon: FaBrain,
    label: 'NLP / AI',
    cmd: '$ python train.py',
  },
  'web-app': {
    bg: dk ? 'rgba(88, 166, 255, 0.05)' : '#f0f7ff',
    border: dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg,
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg}, transparent)`,
    color: dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg,
    glow: `rgba(88, 166, 255, ${dk ? '0.2' : '0.1'})`,
    icon: FaGlobe,
    label: 'WEB / APP',
    cmd: '$ npm run dev',
  },
  data: {
    bg: dk ? 'rgba(63, 185, 80, 0.05)' : '#f0fff4',
    border: dk ? githubDarkColors.success.fg : githubLightColors.success.fg,
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.success.fg : githubLightColors.success.fg}, transparent)`,
    color: dk ? githubDarkColors.success.fg : githubLightColors.success.fg,
    glow: `rgba(63, 185, 80, ${dk ? '0.2' : '0.1'})`,
    icon: FaChartBar,
    label: 'DATA / ML',
    cmd: '$ jupyter execute',
  },
  tooling: {
    bg: dk ? 'rgba(210, 153, 34, 0.05)' : '#fffbf0',
    border: dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg,
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg}, transparent)`,
    color: dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg,
    glow: `rgba(210, 153, 34, ${dk ? '0.2' : '0.1'})`,
    icon: FaWrench,
    label: 'TOOLING',
    cmd: '$ make install',
  },
  healthcare: {
    bg: dk ? 'rgba(248, 81, 73, 0.05)' : '#fff1f0',
    border: dk ? githubDarkColors.danger.fg : githubLightColors.danger.fg,
    stripe: `linear-gradient(180deg, ${dk ? githubDarkColors.danger.fg : githubLightColors.danger.fg}, transparent)`,
    color: dk ? githubDarkColors.danger.fg : githubLightColors.danger.fg,
    glow: `rgba(248, 81, 73, ${dk ? '0.2' : '0.1'})`,
    icon: FaHeartbeat,
    label: 'HEALTHCARE',
    cmd: '$ python recommend.py',
  },
})

export const githubTheme: ThemeDefinition = {
  name: 'GitHub',
  cssVars: {
    light: lightCSSVars,
    dark: darkCSSVars,
  },
  terminal: {
    rainbow: [
      githubDarkColors.danger.fg,
      githubDarkColors.severe.fg,
      githubDarkColors.attention.fg,
      githubDarkColors.success.fg,
      githubDarkColors.accent.fg,
      githubDarkColors.done.fg,
      githubDarkColors.sponsors.fg,
    ] as const,
    colors: createTerminalColors,
  },
  categoryThemes: createCategoryThemes,
  articleCategoryColors: {
    robotics: {
      fg: (dk) => (dk ? githubDarkColors.done.fg : githubLightColors.done.fg),
      bg: (dk) => (dk ? 'rgba(163, 113, 247, 0.15)' : 'rgba(130, 80, 223, 0.1)'),
    },
    nlp: {
      fg: (dk) => (dk ? githubDarkColors.sponsors.fg : '#bf4b8a'),
      bg: (dk) => (dk ? 'rgba(219, 97, 162, 0.15)' : 'rgba(191, 75, 138, 0.1)'),
    },
    'web-app': {
      fg: (dk) => (dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg),
      bg: (dk) => (dk ? 'rgba(88, 166, 255, 0.15)' : 'rgba(9, 105, 218, 0.1)'),
    },
    data: {
      fg: (dk) => (dk ? githubDarkColors.success.fg : githubLightColors.success.fg),
      bg: (dk) => (dk ? 'rgba(63, 185, 80, 0.15)' : 'rgba(26, 127, 55, 0.1)'),
    },
    tooling: {
      fg: (dk) => (dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg),
      bg: (dk) => (dk ? 'rgba(210, 153, 34, 0.15)' : 'rgba(154, 103, 0, 0.1)'),
    },
    healthcare: {
      fg: (dk) => (dk ? githubDarkColors.danger.fg : githubLightColors.danger.fg),
      bg: (dk) => (dk ? 'rgba(248, 81, 73, 0.15)' : 'rgba(207, 34, 46, 0.1)'),
    },
  },
  publicationVenueColors: {
    conference: {
      bg: (dk) => (dk ? 'rgba(88, 166, 255, 0.15)' : 'rgba(9, 105, 218, 0.1)'),
      fg: (dk) => (dk ? githubDarkColors.accent.fg : githubLightColors.accent.fg),
      label: 'CONFERENCE',
    },
    workshop: {
      bg: (dk) => (dk ? 'rgba(163, 113, 247, 0.15)' : 'rgba(130, 80, 223, 0.1)'),
      fg: (dk) => (dk ? githubDarkColors.done.fg : githubLightColors.done.fg),
      label: 'WORKSHOP',
    },
    demo: {
      bg: (dk) => (dk ? 'rgba(210, 153, 34, 0.15)' : 'rgba(154, 103, 0, 0.1)'),
      fg: (dk) => (dk ? githubDarkColors.attention.fg : githubLightColors.attention.fg),
      label: 'DEMO TRACK',
    },
    preprint: {
      bg: (dk) => (dk ? 'rgba(63, 185, 80, 0.15)' : 'rgba(26, 127, 55, 0.1)'),
      fg: (dk) => (dk ? githubDarkColors.success.fg : githubLightColors.success.fg),
      label: 'PREPRINT',
    },
    journal: {
      bg: (dk) => (dk ? 'rgba(219, 97, 162, 0.15)' : 'rgba(191, 75, 138, 0.1)'),
      fg: (dk) => (dk ? githubDarkColors.sponsors.fg : '#bf4b8a'),
      label: 'JOURNAL',
    },
  },
}
