/**
 * FadeInView — Scroll-triggered fade-in with optional slide direction.
 * Uses Framer Motion whileInView for viewport detection.
 * Respects prefers-reduced-motion.
 */
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInViewProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
  once?: boolean
}

export function FadeInView({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 20,
  duration = 0.45,
  once = true,
}: FadeInViewProps) {
  const shouldReduceMotion = useReducedMotion()

  const directionMap = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  }

  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...directionMap[direction] }

  const visible = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
