import { motion, type Variants } from 'framer-motion'
import React, { type ReactNode } from 'react'

interface MotionListProps {
  children: ReactNode
  initialDelay?: number
  staggerDelay?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { 
      delayChildren: i as number,
    },
  }),
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      damping: 15,
      stiffness: 100,
      type: 'spring',
    },
    y: 0,
  },
}

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
    <motion.div
      custom={initialDelay}
      initial="hidden"
      style={{ width: '100%' }}
      variants={containerVariants}
      viewport={{ margin: '-50px', once: true }}
      whileInView="visible"
    >
      {items.map((child, index) => (
        <motion.div 
          key={index} 
          transition={{ delay: index * staggerDelay }}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * A simple wrapper for single elements that should fade and slide in.
 */
export const MotionBox: React.FC<{ children: ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{
        damping: 15,
        delay,
        stiffness: 100,
        type: 'spring',
      }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A wrapper that adds a "bouncy" spring effect on hover.
 */
export const MotionHover: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      style={{ display: 'inline-block' }}
      transition={{ damping: 10, stiffness: 400, type: 'spring' }}
      whileHover={{ scale: 1.05, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}
