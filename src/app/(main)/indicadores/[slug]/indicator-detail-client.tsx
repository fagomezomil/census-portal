"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, AnimatedCounter } from "@/components/animations"
import { formatValue, formatPeriod, calcVariation, FREQ_LABELS } from "@/lib/indicators"

interface ProcessedValue {
  id: string
  value: number
  value_date: string
  period: string
  variation: number | null
  source_url: string | null
  notes: string | null
}

interface IndicatorDetailClientProps {
  indicator: {
    id: string
    name: string
    slug: string
    unit: string
    frequency: string | null
    source: string | null
    description: string | null
  }
  latest: ProcessedValue | undefined
  heroVariation: number | null
  processedValues: ProcessedValue[]
  totalValues: number
}

export function IndicatorDetailClient({
  indicator,
  latest,
  heroVariation,
  processedValues,
  totalValues,
}: IndicatorDetailClientProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div>
          <Link
            href="/indicadores"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Indicadores
          </Link>
          <div className="flex items-center gap-2 mb-2">
            {indicator.frequency && (
              <Badge variant="outline">
                {FREQ_LABELS[indicator.frequency] || indicator.frequency}
              </Badge>
            )}
            {indicator.source && (
              <Badge variant="secondary">{indicator.source}</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold">{indicator.name}</h1>
          {indicator.description && (
            <p className="mt-2 text-muted-foreground">{indicator.description}</p>
          )}
        </div>
      </ScrollReveal>

      {/* Hero number */}
      {latest && (
        <ScrollReveal>
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-6 flex items-baseline gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Último dato: {formatPeriod(latest.period, indicator.frequency || "monthly")}
              </div>
              <div className="flex items-baseline gap-2">
                <AnimatedCounter
                  value={latest.value}
                  unit={indicator.unit || "%"}
                  formatFn={formatValue}
                  size="detail"
                />
              </div>
              {heroVariation != null && (
                <div className="mt-2">
                  <span
                    className={
                      heroVariation > 0 ? "delta-positive" : "delta-negative"
                    }
                  >
                    {heroVariation > 0 ? "+" : ""}
                    {heroVariation.toFixed(1)}% vs período anterior
                  </span>
                </div>
              )}
            </div>
            <div className="ml-auto text-right text-sm text-muted-foreground">
              <div>{totalValues} datos en la serie</div>
              <div>
                {formatPeriod(processedValues[0]?.period, indicator.frequency || "monthly")} —{" "}
                {formatPeriod(latest.period, indicator.frequency || "monthly")}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  )
}