"use client"

import { useCallback, useRef } from "react"
import { toPng } from "html-to-image"
import { Download } from "lucide-react"

interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>
  filename?: string
  className?: string
}

export function ExportChartButton({
  chartRef,
  filename,
  className,
}: ExportChartButtonProps) {
  const handleExport = useCallback(async () => {
    if (!chartRef.current) return

    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      })

      const link = document.createElement("a")
      link.download = filename ?? `indicador-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to export chart:", err)
    }
  }, [chartRef, filename])

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-[var(--accent)] transition-colors ${className ?? ""}`}
    >
      <Download className="h-3.5 w-3.5" />
      PNG
    </button>
  )
}