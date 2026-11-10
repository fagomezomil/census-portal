"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/animations"
import { AnimatedCounter } from "@/components/animations"
import { formatValue } from "@/lib/indicators"

interface SectionCard {
  slug: string
  name: string
  desc: string
}

interface SectionCardsGridProps {
  sections: SectionCard[]
  basePath?: string
  columns?: 2 | 3
}

export function SectionCardsGrid({
  sections,
  basePath = "/categorias",
  columns = 3,
}: SectionCardsGridProps) {
  const gridCols =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {sections.map((sec, i) => (
        <ScrollReveal key={sec.slug} delay={i * 0.05} amount={0.1}>
          <Link
            href={`${basePath}/${sec.slug}`}
            className="block rounded-[var(--radius-md)] border border-[var(--border)] p-5 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-colors h-full"
          >
            <h3 className="font-semibold">{sec.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{sec.desc}</p>
            <span className="text-xs text-[var(--accent)] mt-2 inline-flex items-center gap-1">
              Ver datos <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  )
}

interface KeyIndicatorItem {
  id: string
  name: string
  slug: string
  unit: string
  value: number | null
  period: string | null
}

interface KeyIndicatorsRowProps {
  indicators: KeyIndicatorItem[]
}

export function KeyIndicatorsRow({ indicators }: KeyIndicatorsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {indicators.map((ind, i) => (
        <ScrollReveal key={ind.id} delay={i * 0.05} amount={0.1}>
          <Link
            href={`/indicadores/${ind.slug}`}
            className="block rounded-[var(--radius-md)] border border-[var(--border)] p-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="text-xs text-muted-foreground">{ind.name}</div>
            {ind.value != null ? (
              <AnimatedCounter
                value={ind.value}
                unit={ind.unit || "%"}
                formatFn={formatValue}
                size="section"
              />
            ) : (
              <span className="hero-number text-muted-foreground">—</span>
            )}
            {ind.period && (
              <div className="text-xs text-muted-foreground mt-1">{ind.period}</div>
            )}
          </Link>
        </ScrollReveal>
      ))}
    </div>
  )
}