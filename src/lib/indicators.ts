/**
 * DEP Tucumán — Shared indicator utilities
 * Centralizes formatting and calculation functions used across multiple pages.
 */

/** Frequency label map for display */
export const FREQ_LABELS: Record<string, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual",
}

/** Format an indicator value for full display */
export function formatValue(value: number, unit: string): string {
  if (unit === "$") {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

/** Format an indicator value for abbreviated display (header bar, cards) */
export function formatBarValue(value: number, unit: string): string {
  if (unit === "$") {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
    return value.toLocaleString("es-AR")
  }
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

/** Calculate percentage variation between two values */
export function calcVariation(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/** Format a period string into a human-readable label */
export function formatPeriod(period: string, frequency: string): string {
  if (frequency === "monthly") {
    const [y, m] = period.split("-")
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ]
    return `${months[parseInt(m) - 1]} ${y}`
  }
  if (frequency === "quarterly" || frequency === "semiannual") {
    return period.replace("-", " ")
  }
  return period
}

/** Month names for period formatting */
export const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
]