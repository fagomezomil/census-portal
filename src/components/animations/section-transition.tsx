"use client"

import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface SectionTransitionProps {
  children: ReactNode
  /** A unique key that triggers the transition when it changes */
  id: string | number
  className?: string
}

/**
 * Crossfade + subtle translateY for tab/section changes.
 * Duration: 200ms ease-out per design system.
 * Respects prefers-reduced-motion.
 */
export function SectionTransition({
  children,
  id,
  className,
}: SectionTransitionProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        className={className}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}