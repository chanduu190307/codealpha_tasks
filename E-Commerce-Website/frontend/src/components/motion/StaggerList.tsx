/**
 * StaggerList — Wraps a list with staggered children animations.
 * Each child animates in sequentially.
 */
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

const containerVariants = (stagger: number, initial: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: initial,
    },
  },
})

export const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] },
  },
}

export const itemVariantsReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}

export function StaggerList({
  children,
  className,
  staggerDelay = 0.07,
  initialDelay = 0,
}: StaggerListProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={containerVariants(shouldReduce ? 0.03 : staggerDelay, initialDelay)}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

/** Wrap individual list items with this to get stagger effect */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={shouldReduce ? itemVariantsReduced : itemVariants}
    >
      {children}
    </motion.div>
  )
}
