import { defaultConfig } from '@chakra-ui/react/preset'
import { createSystem, defineConfig } from '@chakra-ui/react/styled-system'

const config = defineConfig({
  globalCss: {
    body: {
      bg: 'var(--bg-color)',
      color: 'var(--text-color)',
      fontSize: '14px',
      lineHeight: 1.6,
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: {
          value:
            '"Maple Mono CN", "Maple Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
        heading: {
          value:
            '"Maple Mono CN", "Maple Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
        mono: {
          value:
            '"Maple Mono CN", "Maple Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
      },
    },
  },
})

const theme = createSystem(defaultConfig, config)

export default theme
