import { createClient } from "@/lib/supabase/server"
import { ECONOMIA_SECTIONS } from "@/lib/sections"
import { formatValue } from "@/lib/indicators"
import { SectionPageLayout } from "@/components/shared/section-page-layout"
import { SectionCardsGrid, KeyIndicatorsRow } from "@/components/shared/section-cards-grid"

export default async function EconomiaPage() {
  const supabase = await createClient()

  // Fetch indicators for key sections
  const { data: indicators } = await supabase
    .from("indicators")
    .select("id, name, slug, unit, frequency, category_id")
    .in("slug", [
      "ipc-tucuman",
      "canasta-basica-alimentaria",
      "canasta-basica-total",
      "tasa-desocupacion",
    ])
    .eq("active", true)

  const indicatorIds = indicators?.map((i) => i.id) ?? []
  const { data: values } = await supabase
    .from("indicator_values")
    .select("indicator_id, value, value_date, period")
    .in("indicator_id", indicatorIds)
    .order("value_date", { ascending: false })

  const latestMap: Record<string, { value: number; period: string }> = {}
  for (const v of values ?? []) {
    if (!latestMap[v.indicator_id]) latestMap[v.indicator_id] = v
  }

  const keyIndicators =
    indicators?.map((ind) => ({
      id: ind.id,
      name: ind.name,
      slug: ind.slug,
      unit: ind.unit || "%",
      value: latestMap[ind.id]?.value ?? null,
      period: latestMap[ind.id]?.period ?? null,
    })) ?? []

  return (
    <SectionPageLayout
      title="Economía"
      description="Indicadores económicos, mercado laboral, precios, comercio exterior y más."
      indicators={
        keyIndicators.length > 0 ? (
          <KeyIndicatorsRow indicators={keyIndicators} />
        ) : undefined
      }
    >
      <SectionCardsGrid sections={ECONOMIA_SECTIONS} columns={3} />
    </SectionPageLayout>
  )
}