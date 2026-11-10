"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  once?: boolean
  amount?: number
}

const DIRECTION_OFFSET: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 16 },
  down: { x: 0, y: -16 },
  left: { x: 16, y: 0 },
  right: { x: -16, y: 0 },
}

/**
 * Fade + translate on viewport entry.
 * Duration: 200ms ease-out (page-level per design system).
 * Stagger children at 150ms intervals by setting `delay` per child.
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReduced = useReducedMotion()
  const offset = DIRECTION_OFFSET[direction]

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration: 0.2, delay, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}