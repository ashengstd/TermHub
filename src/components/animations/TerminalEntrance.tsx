import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { useLocalizedData } from '@/hooks/useLocalizedData'

interface TerminalEntranceProps {
  children: React.ReactNode
  delay?: number
  path?: string
}

export const TerminalEntrance: React.FC<TerminalEntranceProps> = ({ children, path = '~' }) => {
  const { siteOwner } = useLocalizedData()
  const [phase, setPhase] = useState<'command' | 'content' | 'loading'>('command')
  const [commandText, setCommandText] = useState('')
  const fullCommand = `cat ${path}/index.md`

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      setCommandText(fullCommand.slice(0, current))
      current++
      if (current > fullCommand.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('loading'), 150)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [fullCommand])

  useEffect(() => {
    if (phase === 'loading') {
      setTimeout(() => setPhase('content'), 400)
    }
  }, [phase])

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col font-mono">
      <AnimatePresence mode="wait">
        {phase === 'command' && (
          <motion.div
            animate={{ opacity: 1 }}
            className="text-[var(--text-color)] p-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="command"
          >
            <span className="text-[var(--prompt-color)] font-bold">
              {siteOwner.terminalUsername}@{siteOwner.terminalHostname}
            </span>
            <span className="text-[var(--border-color)] mx-1">:</span>
            <span className="text-[var(--accent-color)]">{path}</span>
            <span className="text-[var(--text-color)] ml-1">
              {siteOwner.terminalPrompt} {commandText}
            </span>
            <motion.span
              animate={{ opacity: [0, 1] }}
              className="inline-block w-2 h-4 bg-[var(--text-color)] ml-1 align-middle"
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            animate={{ opacity: 1 }}
            className="text-[var(--secondary-text)] p-8 text-xs space-y-1"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="loading"
          >
            <div className="flex gap-2">
              <span className="text-[var(--success-color)]">[ OK ]</span>
              <span>Initializing data stream...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[var(--success-color)]">[ OK ]</span>
              <span>Resolving local dependencies...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[var(--accent-color)]">[ BUSY ]</span>
              <span>Compiling MDX components...</span>
            </div>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: '100%' }}
                className="h-full bg-[var(--accent-color)]"
                initial={{ width: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'content' && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full"
            initial={{ opacity: 0, y: 10 }}
            key="content"
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
