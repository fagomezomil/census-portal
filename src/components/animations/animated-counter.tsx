"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface AnimatedCounterProps {
  value: number
  unit?: string
  formatFn?: (value: number, unit: string) => string
  duration?: number
  className?: string
  /** Size preset: hero (4-5rem), section (3rem), detail (3rem) */
  size?: "hero" | "section" | "detail"
}

const SIZE_CLASSES: Record<string, string> = {
  hero: "hero-number hero-number--home",
  section: "hero-number hero-number--section",
  detail: "hero-number",
}

// Ease-out-quart: cubic-bezier(0, 0, 0.2, 1)
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

/**
 * Counts from 0 to value on viewport entry.
 * Duration: 1200ms, ease-out-quart.
 * Respects prefers-reduced-motion.
 */
export function AnimatedCounter({
  value,
  unit,
  formatFn,
  duration = 1200,
  className,
  size = "detail",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const prefersReduced = useReducedMotion()
  const [displayValue, setDisplayValue] = useState<string | null>(null)

  useEffect(() => {
    if (!isInView) return

    if (prefersReduced) {
      setDisplayValue(formatFn ? formatFn(value, unit ?? "") : value.toLocaleString("es-AR"))
      return
    }

    const startTime = performance.now()
    let animationFrame: number

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const currentValue = easedProgress * value

      setDisplayValue(
        formatFn ? formatFn(currentValue, unit ?? "") : currentValue.toLocaleString("es-AR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      )

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // Ensure final value is exact
        setDisplayValue(formatFn ? formatFn(value, unit ?? "") : value.toLocaleString("es-AR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }))
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isInView, value, unit, duration, formatFn, prefersReduced])

  return (
    <span ref={ref} className={`${SIZE_CLASSES[size]} ${className ?? ""}`}>
      {displayValue ?? (formatFn ? formatFn(0, unit ?? "") : "0")}
      {unit && (
        <span className="text-lg text-muted-foreground ml-1 font-normal">{unit}</span>
      )}
    </span>
  )
}