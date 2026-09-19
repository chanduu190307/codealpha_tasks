/**
 * CountUp — Animates a number from 0 to its target value on mount.
 * Used in admin dashboard stats. Respects prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useInView } from 'framer-motion'

interface CountUpProps {
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({
  to,
  duration = 1.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const shouldReduce = useReducedMotion()
  const [value, setValue] = useState(shouldReduce ? to : 0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isInView || shouldReduce) {
      setValue(to)
      return
    }

    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(parseFloat((eased * to).toFixed(decimals)))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isInView, to, duration, decimals, shouldReduce])

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
