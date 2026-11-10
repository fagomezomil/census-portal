import { createClient } from "@/lib/supabase/server"
import { HeaderClient, type BarItem } from "@/components/layout/header-client"

export async function Header() {
  const supabase = await createClient()

  // Fetch the 5 key indicators with their latest values
  const keySlugs = ["ipc-tucuman", "tasa-desocupacion", "tasa-informalidad", "canasta-basica-alimentaria", "pobreza-personas"]
  const { data: indicators } = await supabase
    .from("indicators")
    .select("id, name, slug, unit")
    .in("slug", keySlugs)
    .eq("active", true)

  const indicatorIds = indicators?.map((i) => i.id) ?? []

  const { data: values } = await supabase
    .from("indicator_values")
    .select("indicator_id, value, value_date, period")
    .in("indicator_id", indicatorIds)
    .order("value_date", { ascending: false })

  // Build latest + second-latest for each indicator
  const latestMap: Record<string, { value: number; period: string }> = {}
  const prevMap: Record<string, number> = {}
  for (const v of values ?? []) {
    if (!latestMap[v.indicator_id]) {
      latestMap[v.indicator_id] = { value: v.value, period: v.period }
    } else if (!prevMap[v.indicator_id]) {
      prevMap[v.indicator_id] = v.value
    }
  }

  const barItems: BarItem[] = (indicators ?? []).map((ind) => {
    const latest = latestMap[ind.id]
    const prev = prevMap[ind.id]
    const variation: number | null = latest && prev && prev !== 0 ? ((latest.value - prev) / prev) * 100 : null
    return {
      slug: ind.slug,
      name: ind.name,
      unit: ind.unit || "%",
      value: latest?.value ?? null,
      period: latest?.period ?? null,
      variation,
    }
  })

  // Reorder to match keySlugs order
  const ordered: BarItem[] = keySlugs
    .map((slug) => barItems.find((i) => i.slug === slug))
    .filter((item): item is BarItem => item !== undefined)

  return <HeaderClient items={ordered} />
}