/**
 * Populate date_range_start and date_range_end for datasets
 * by extracting years from titles and resource names.
 * Usage: node scripts/populate-dataset-dates.mjs
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://zblvxddiyomuwonmgqxg.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibHZ4ZGRpeW9tdXdvbm1ncXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1Nzg0OCwiZXhwIjoyMDk0MjMzODQ4fQ.RMXnfQP6mMTskfaY7mTBAum5RzoOsrZloErDnv8tNxQ"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  const { data: datasets } = await supabase.from("datasets").select("id, title, slug, frequency")
  const { data: resources } = await supabase.from("dataset_resources").select("dataset_id, name")

  const yearRegex = /\b(19|20)\d{2}\b/g
  const updates = []

  for (const ds of datasets) {
    const years = new Set()

    // From title
    const titleMatches = ds.title.match(yearRegex) || []
    titleMatches.forEach(y => years.add(parseInt(y)))

    // From resource names
    const dsResources = resources.filter(r => r.dataset_id === ds.id)
    for (const r of dsResources) {
      const resMatches = r.name.match(yearRegex) || []
      resMatches.forEach(y => years.add(parseInt(y)))
    }

    if (years.size > 0) {
      const sorted = [...years].sort((a, b) => a - b)
      const startYear = sorted[0]
      const endYear = sorted[sorted.length - 1]
      updates.push({
        id: ds.id,
        title: ds.title.substring(0, 50),
        date_range_start: `${startYear}-01-01`,
        date_range_end: `${endYear}-12-31`,
      })
    }
  }

  console.log(`Datasets with extractable date ranges: ${updates.length} of ${datasets.length}`)

  // Batch update
  let updated = 0
  for (const u of updates) {
    const { error } = await supabase.from("datasets")
      .update({ date_range_start: u.date_range_start, date_range_end: u.date_range_end })
      .eq("id", u.id)
    if (error) console.error("Error:", u.title, error.message)
    else updated++
  }

  console.log(`Updated ${updated} datasets with date ranges`)

  // Show some examples
  for (const u of updates.slice(0, 10)) {
    console.log(`  ${u.title.padEnd(52)} | ${u.date_range_start} → ${u.date_range_end}`)
  }
}

main().catch(console.error)