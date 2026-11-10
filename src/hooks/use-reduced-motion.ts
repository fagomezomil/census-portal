"use client"

import { useSyncExternalStore } from "react"

/**
 * Returns true if the user prefers reduced motion.
 * Used by animation components to skip or simplify animations.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false // server snapshot: assume no preference
  )
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}