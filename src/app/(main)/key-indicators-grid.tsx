"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal, AnimatedCounter } from "@/components/animations"
import { formatValue, formatPeriod, FREQ_LABELS } from "@/lib/indicators"

interface IndicatorItem {
  id: string
  name: string
  slug: string
  unit: string
  frequency: string
}

interface LatestValue {
  value: number
  value_date: string
  period: string
}

interface KeyIndicatorsGridProps {
  indicators: IndicatorItem[]
  latestByIndicator: Record<string, LatestValue>
  secondLatestByIndicator: Record<string, { value: number }>
}

export function KeyIndicatorsGrid({
  indicators,
  latestByIndicator,
  secondLatestByIndicator,
}: KeyIndicatorsGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Indicadores</h2>
        <Link
          href="/indicadores"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((indicator, i) => {
          const latest = latestByIndicator[indicator.id]
          const secondLatest = secondLatestByIndicator[indicator.id]
          const variation =
            latest && secondLatest && secondLatest.value !== 0
              ? ((latest.value - secondLatest.value) / secondLatest.value) * 100
              : null
          const periodLabel = latest
            ? formatPeriod(latest.period, indicator.frequency || "monthly")
            : null
          const freqLabel =
            FREQ_LABELS[indicator.frequency || "monthly"] || indicator.frequency

          return (
            <ScrollReveal key={indicator.id} delay={i * 0.05} amount={0.1}>
              <Link href={`/indicadores/${indicator.slug}`} className="block">
                <div className="group rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--accent)] transition-colors h-full flex flex-col justify-between">
                  {/* Label: caption, muted */}
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    {indicator.name}
                  </div>

                  {/* Hero number — the value IS the design */}
                  <div className="flex items-baseline gap-2 mb-2">
                    {latest ? (
                      <AnimatedCounter
                        value={latest.value}
                        unit={indicator.unit || "%"}
                        formatFn={formatValue}
                        size="hero"
                      />
                    ) : (
                      <span className="hero-number hero-number--home text-muted-foreground">
                        —
                      </span>
                    )}
                  </div>

                  {/* Delta badge + period */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {variation != null && (
                      <span
                        className={
                          variation > 0 ? "delta-positive" : "delta-negative"
                        }
                      >
                        {variation > 0 ? "+" : ""}
                        {variation.toFixed(1)}%
                      </span>
                    )}
                    {periodLabel && (
                      <span className="text-xs text-muted-foreground">
                        {periodLabel} · {freqLabel}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}