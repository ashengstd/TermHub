import mdx from '@mdx-js/rollup'
import { tanstackRouter } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import rehypeKatex from 'rehype-katex'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'

import contentImages from './plugins/vite-plugin-content-images'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL ?? '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        /**
         * Split vendor libraries into logical chunks so the browser can cache
         * them independently and visitors only download what changed.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/react-dom/')) return 'react-dom'
          if (
            id.includes('/react/') ||
            id.includes('/@tanstack/react-router/') ||
            id.includes('/scheduler/')
          )
            return 'react-core'

          if (id.includes('@chakra-ui/') || id.includes('@emotion/')) return 'chakra'

          if (id.includes('framer-motion')) return 'motion'

          if (id.includes('react-icons')) return 'icons'

          if (
            id.includes('i18next') ||
            id.includes('react-i18next') ||
            id.includes('i18next-browser-languagedetector')
          )
            return 'i18n'

          if (
            id.includes('/@mdx-js/') ||
            id.includes('/remark-') ||
            id.includes('/rehype-') ||
            id.includes('/katex/')
          )
            return 'mdx'

          return 'vendor'
        },
      },
    },
  },
  plugins: [
    mdx({
      rehypePlugins: [rehypeKatex],
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        // Injects plain-text body into frontmatter for card summaries
        () => (tree: unknown, _file: unknown) => {
          interface MdxNode {
            children?: MdxNode[]
            type: string
            value?: string
          }
          const mdxTree = tree as MdxNode
          let text = ''
          const walk = (node: MdxNode) => {
            if (node.type === 'yaml' || node.type === 'toml') return
            if (node.type === 'text' && node.value) text += node.value + ' '
            if (node.children) node.children.forEach(walk)
          }
          walk(mdxTree)

          let yamlNode = mdxTree.children?.find((n) => n.type === 'yaml')
          if (!yamlNode) {
            yamlNode = { type: 'yaml', value: '' }
            if (mdxTree.children) {
              mdxTree.children.unshift(yamlNode)
            } else {
              mdxTree.children = [yamlNode]
            }
          }
          const cleanText = text.replace(/\n/g, ' ').replace(/"/g, '\\"').trim().slice(0, 1000)
          yamlNode.value = (yamlNode.value ?? '') + `\nbodyText: "${cleanText}"`
        },
        [remarkMdxFrontmatter, { name: 'frontmatter' }],
        remarkMath,
      ],
    }),
    react(),
    tanstackRouter({
      generatedRouteTree: './src/routeTree.gen.ts',
      routesDirectory: './src/routes',
    }),
    contentImages(),
    {
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        try {
          mkdirSync(outDir, { recursive: true })
          copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
          writeFileSync(resolve(outDir, '.nojekyll'), '')
        } catch {
          // Build output not available (e.g. dev mode) — skip
        }
      },
      name: 'spa-fallback-postbuild',
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content': resolve(__dirname, 'content'),
      '@content/zh': resolve(__dirname, 'content/zh'),
    },
  },
})
