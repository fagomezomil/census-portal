"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, AnimatedCounter } from "@/components/animations"
import { formatValue, formatPeriod, calcVariation, FREQ_LABELS } from "@/lib/indicators"

interface IndicatorItem {
  id: string
  name: string
  slug: string
  unit: string
  frequency: string | null
  source: string | null
  description: string | null
}

interface IndicatorGridProps {
  indicators: IndicatorItem[]
  latestByIndicator: Record<string, { value: number; value_date: string; period: string }>
  countByIndicator: Record<string, number>
  secondLatestByIndicator: Record<string, { value: number }>
}

export function IndicatorsGrid({
  indicators,
  latestByIndicator,
  countByIndicator,
  secondLatestByIndicator,
}: IndicatorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {indicators.map((indicator, i) => {
        const latest = latestByIndicator[indicator.id]
        const secondLatest = secondLatestByIndicator[indicator.id]
        const count = countByIndicator[indicator.id] || 0
        const variation =
          latest && secondLatest
            ? calcVariation(latest.value, secondLatest.value)
            : null

        return (
          <ScrollReveal key={indicator.id} delay={i * 0.03} amount={0.1}>
            <Link href={`/indicadores/${indicator.slug}`} className="block">
              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--accent)] transition-colors h-full flex flex-col justify-between">
                {/* Label */}
                <div className="text-base font-semibold mb-3">
                  {indicator.name}
                </div>

                {/* Hero number */}
                <div className="flex items-baseline gap-2 mb-2">
                  {latest ? (
                    <AnimatedCounter
                      value={latest.value}
                      unit={indicator.unit || "%"}
                      formatFn={formatValue}
                      size="detail"
                    />
                  ) : (
                    <span className="hero-number text-muted-foreground">—</span>
                  )}
                </div>

                {/* Delta badge */}
                {variation != null && (
                  <div className="mb-2">
                    <span
                      className={
                        variation > 0 ? "delta-positive" : "delta-negative"
                      }
                    >
                      {variation > 0 ? "+" : ""}
                      {variation.toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Meta */}
                <div className="text-xs text-muted-foreground mt-auto">
                  {latest ? `Último: ${formatPeriod(latest.period, indicator.frequency || "monthly")}` : ""}
                  {count > 0 ? ` · ${count} datos` : ""}
                </div>

                {/* Tags */}
                <div className="mt-2 flex gap-2">
                  {indicator.frequency && (
                    <Badge variant="outline" className="text-xs">
                      {FREQ_LABELS[indicator.frequency] || indicator.frequency}
                    </Badge>
                  )}
                  {indicator.source && (
                    <Badge variant="secondary" className="text-xs">
                      {indicator.source}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )
      })}
    </div>
  )
}