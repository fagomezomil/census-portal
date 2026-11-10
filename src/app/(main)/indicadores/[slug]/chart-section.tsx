"use client"

import { useRef } from "react"
import { ScrollReveal } from "@/components/animations"
import { ExportChartButton } from "@/components/export/export-chart-button"
import IndicatorChart from "./indicator-chart"

interface ChartData {
  date: string
  value: number
  period: string
}

interface ChartSectionProps {
  data: ChartData[]
  unit: string
  frequency: string
  slug: string
}

export function ChartSection({ data, unit, frequency, slug }: ChartSectionProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollReveal>
      <div
        ref={chartRef}
        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Evolución</h2>
          <ExportChartButton
            chartRef={chartRef}
            filename={`${slug}-${new Date().toISOString().slice(0, 10)}.png`}
          />
        </div>
        <IndicatorChart data={data} unit={unit} frequency={frequency} />
      </div>
    </ScrollReveal>
  )
}