import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatPeriod } from "@/lib/indicators"
import { IndicatorDetailClient } from "./indicator-detail-client"
import { ChartSection } from "./chart-section"
import { ExportCsvButton } from "@/components/export/export-csv-button"

export default async function IndicadorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: indicator } = await supabase
    .from("indicators")
    .select("id, name, slug, unit, frequency, source, description, active")
    .eq("slug", slug)
    .eq("active", true)
    .single()

  if (!indicator) notFound()

  const { data: values } = await supabase
    .from("indicator_values")
    .select("id, value, value_date, period, variation, source_url, notes")
    .eq("indicator_id", indicator.id)
    .order("value_date", { ascending: true })

  const sortedValues = (values ?? []) as Array<{
    id: string
    value: number
    value_date: string
    period: string
    variation: number | null
    source_url: string | null
    notes: string | null
  }>

  // Calculate variations where missing
  const processedValues = sortedValues.map((v, i) => {
    if (v.variation == null && i > 0) {
      const prev = sortedValues[i - 1]
      if (prev && prev.value !== 0) {
        return { ...v, variation: ((v.value - prev.value) / prev.value) * 100 }
      }
    }
    return v
  })

  // Get latest and second-latest for hero display
  const latest = processedValues[processedValues.length - 1]
  const secondLatest = processedValues[processedValues.length - 2]
  const heroVariation =
    latest && secondLatest && secondLatest.value !== 0
      ? ((latest.value - secondLatest.value) / secondLatest.value) * 100
      : null

  // Prepare chart data (last 24 points for monthly, all for quarterly/semiannual)
  const chartSlice =
    indicator.frequency === "monthly" ? -24 : processedValues.length
  const chartData = processedValues.slice(chartSlice).map((v) => ({
    date: v.value_date,
    value: v.value,
    period: formatPeriod(v.period, indicator.frequency || "monthly"),
  }))

  // CSV data
  const csvData = processedValues.map((v) => ({
    period: formatPeriod(v.period, indicator.frequency || "monthly"),
    value: v.value,
    variation: v.variation,
  }))

  return (
    <div className="space-y-8">
      <IndicatorDetailClient
        indicator={{
          id: indicator.id,
          name: indicator.name,
          slug: indicator.slug,
          unit: indicator.unit,
          frequency: indicator.frequency,
          source: indicator.source,
          description: indicator.description,
        }}
        latest={latest}
        heroVariation={heroVariation}
        processedValues={processedValues}
        totalValues={processedValues.length}
      />

      {/* Chart with PNG export */}
      {chartData.length > 1 && (
        <ChartSection
          data={chartData}
          unit={indicator.unit || "%"}
          frequency={indicator.frequency || "monthly"}
          slug={indicator.slug}
        />
      )}

      {/* Data table with CSV export */}
      {processedValues.length > 0 && (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Serie Histórica</h2>
              <p className="text-sm text-muted-foreground">
                {processedValues.length} registros
              </p>
            </div>
            <ExportCsvButton
              data={csvData}
              slug={indicator.slug}
              indicatorName={indicator.name}
              unit={indicator.unit || "%"}
              frequency={indicator.frequency || "monthly"}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Período</th>
                  <th className="text-right py-2 px-4">Valor</th>
                  <th className="text-right py-2 px-4">Variación</th>
                </tr>
              </thead>
              <tbody>
                {[...processedValues].reverse().map((v) => (
                  <tr key={v.id}>
                    <td className="py-2 px-4">
                      {formatPeriod(v.period, indicator.frequency || "monthly")}
                    </td>
                    <td className="text-right py-2 px-4 tabular-nums">
                      {v.value.toLocaleString("es-AR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="text-right py-2 px-4">
                      {v.variation != null ? (
                        <span
                          className={
                            v.variation > 0
                              ? "delta-positive"
                              : "delta-negative"
                          }
                        >
                          {v.variation > 0 ? "+" : ""}
                          {v.variation.toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}