import { createClient } from "@/lib/supabase/server"
import { ScrollReveal } from "@/components/animations"
import { IndicatorsGrid } from "./indicators-grid"

export default async function IndicadoresPage() {
  const supabase = await createClient()
  const { data: indicators } = await supabase
    .from("indicators")
    .select("id, name, slug, unit, frequency, source, description, active")
    .eq("active", true)
    .order("name")

  if (!indicators || indicators.length === 0) {
    return (
      <div className="space-y-8">
        <ScrollReveal>
          <div>
            <h1 className="text-3xl font-bold">Indicadores</h1>
            <p className="mt-2 text-muted-foreground">
              No hay indicadores disponibles aún.
            </p>
          </div>
        </ScrollReveal>
      </div>
    )
  }

  // Fetch latest value for each indicator
  const indicatorIds = indicators.map((i) => i.id)
  const { data: allValues } = await supabase
    .from("indicator_values")
    .select("indicator_id, value, value_date, period")
    .in("indicator_id", indicatorIds)
    .order("value_date", { ascending: false })

  // Build a map of latest value per indicator
  const latestByIndicator: Record<
    string,
    { value: number; value_date: string; period: string }
  > = {}
  const countByIndicator: Record<string, number> = {}
  if (allValues) {
    for (const v of allValues) {
      if (!latestByIndicator[v.indicator_id]) {
        latestByIndicator[v.indicator_id] = v
      }
      countByIndicator[v.indicator_id] =
        (countByIndicator[v.indicator_id] || 0) + 1
    }
  }

  // Calculate variation for latest value
  const secondLatestByIndicator: Record<string, { value: number }> = {}
  if (allValues) {
    const seen = new Set<string>()
    for (const v of allValues) {
      if (!seen.has(v.indicator_id)) {
        seen.add(v.indicator_id)
        continue // skip first (latest)
      }
      if (!secondLatestByIndicator[v.indicator_id]) {
        secondLatestByIndicator[v.indicator_id] = v
      }
    }
  }

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div>
          <h1 className="text-3xl font-bold">Indicadores</h1>
          <p className="mt-2 text-muted-foreground">
            Indicadores económicos y sociales de la Provincia de Tucumán
          </p>
        </div>
      </ScrollReveal>

      <IndicatorsGrid
        indicators={indicators}
        latestByIndicator={latestByIndicator}
        countByIndicator={countByIndicator}
        secondLatestByIndicator={secondLatestByIndicator}
      />
    </div>
  )
}