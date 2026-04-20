import { m, type Variants } from 'framer-motion'
import React, { type ReactNode, useMemo } from 'react'

interface MotionListProps {
  children: ReactNode
  initialDelay?: number
  staggerDelay?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delayChildren: number) => ({
    opacity: 1,
    transition: { delayChildren },
  }),
}

// Uses `custom` to receive per-item delay without creating new objects per render
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { damping: 15, delay, stiffness: 100, type: 'spring' },
    y: 0,
  }),
}

const VIEWPORT = { margin: '-50px', once: true } as const

/**
 * A wrapper for lists that animates items with a staggered "slide-up" effect.
 * Perfect for project grids, news feeds, or skill lists.
 */
export const MotionList: React.FC<MotionListProps> = ({
  children,
  initialDelay = 0,
  staggerDelay = 0.1,
}) => {
  const items = React.Children.toArray(children)

  return (
    <m.div
      custom={initialDelay}
      initial="hidden"
      style={{ width: '100%' }}
      variants={containerVariants}
      viewport={VIEWPORT}
      whileInView="visible"
    >
      {items.map((child, index) => {
        const key = React.isValidElement(child) && child.key != null ? child.key : index
        return (
          <m.div custom={index * staggerDelay} key={key} variants={itemVariants}>
            {child}
          </m.div>
        )
      })}
    </m.div>
  )
}

const BOX_VIEWPORT = { once: true } as const

/**
 * A simple wrapper for single elements that should fade and slide in.
 */
export const MotionBox: React.FC<{ children: ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const transition = useMemo(
    () => ({ damping: 15, delay, stiffness: 100, type: 'spring' as const }),
    [delay],
  )

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      transition={transition}
      viewport={BOX_VIEWPORT}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </m.div>
  )
}

/**
 * A wrapper that adds a "bouncy" spring effect on hover.
 */
const HOVER_TRANSITION = { damping: 10, stiffness: 400, type: 'spring' } as const
const HOVER_SCALE = { scale: 1.05, translateY: -2 } as const
const TAP_SCALE = { scale: 0.95 } as const
const HOVER_STYLE = { display: 'inline-block' } as const

export const MotionHover: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <m.div
      className={className}
      style={HOVER_STYLE}
      transition={HOVER_TRANSITION}
      whileHover={HOVER_SCALE}
      whileTap={TAP_SCALE}
    >
      {children}
    </m.div>
  )
}
