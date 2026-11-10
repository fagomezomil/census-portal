"use client"

import { useCallback } from "react"
import { Download } from "lucide-react"
import { formatPeriod } from "@/lib/indicators"

interface CsvRow {
  period: string
  value: number
  variation: number | null
}

interface ExportCsvButtonProps {
  data: CsvRow[]
  slug: string
  indicatorName: string
  unit: string
  frequency: string
  className?: string
}

export function ExportCsvButton({
  data,
  slug,
  indicatorName,
  unit,
  frequency,
  className,
}: ExportCsvButtonProps) {
  const handleExport = useCallback(() => {
    const header = `"Período","Valor (${unit})","Variación (%)"`
    const rows = data.map(
      (row) =>
        `"${row.period}","${row.value.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}","${row.variation != null ? row.variation.toFixed(1) : ""}"`
    )
    const csv = [header, ...rows].join("\n")

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `${slug}-${new Date().toISOString().slice(0, 10)}.csv`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [data, slug, unit])

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-[var(--accent)] transition-colors ${className ?? ""}`}
    >
      <Download className="h-3.5 w-3.5" />
      CSV
    </button>
  )
}