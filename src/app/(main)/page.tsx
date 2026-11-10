import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "./hero-section"
import { KeyIndicatorsGrid } from "./key-indicators-grid"
import { ExploreSection } from "./explore-section"
import { RecentPublications } from "./recent-publications"

async function getHomeData() {
  const supabase = await createClient()

  const [indicatorsRes, categoriesRes, recentPublicationsRes] =
    await Promise.all([
      supabase
        .from("indicators")
        .select("id, name, slug, unit, frequency, source, description, active")
        .eq("active", true)
        .order("name"),
      supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("sort_order"),
      supabase
        .from("publications")
        .select("id, title, slug, publication_date, publication_type, file_type")
        .eq("active", true)
        .order("publication_date", { ascending: false })
        .limit(6),
    ])

  const indicators = indicatorsRes.data ?? []

  // Fetch latest and second-latest values for all indicators
  const indicatorIds = indicators.map((i) => i.id)
  const { data: allValues } = await supabase
    .from("indicator_values")
    .select("indicator_id, value, value_date, period")
    .in("indicator_id", indicatorIds)
    .order("value_date", { ascending: false })

  const latestByIndicator: Record<
    string,
    { value: number; value_date: string; period: string }
  > = {}
  const secondLatestByIndicator: Record<string, { value: number }> = {}
  if (allValues) {
    for (const v of allValues) {
      if (!latestByIndicator[v.indicator_id]) {
        latestByIndicator[v.indicator_id] = v
      } else if (!secondLatestByIndicator[v.indicator_id]) {
        secondLatestByIndicator[v.indicator_id] = v
      }
    }
  }

  return {
    indicators,
    latestByIndicator,
    secondLatestByIndicator,
    categories: categoriesRes.data ?? [],
    recentPublications: recentPublicationsRes.data ?? [],
  }
}

export default async function HomePage() {
  const {
    indicators,
    latestByIndicator,
    secondLatestByIndicator,
    recentPublications,
  } = await getHomeData()

  return (
    <div className="space-y-16">
      <HeroSection />
      {indicators.length > 0 && (
        <KeyIndicatorsGrid
          indicators={indicators}
          latestByIndicator={latestByIndicator}
          secondLatestByIndicator={secondLatestByIndicator}
        />
      )}
      <ExploreSection />
      <RecentPublications publications={recentPublications} />
    </div>
  )
}