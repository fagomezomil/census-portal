/**
 * Extract indicator values from local XLS/XLSX files and upsert into Supabase.
 *
 * Data sources:
 *  1. IPC Empalmada  – monthly variation, 1968–2018
 *  2. CBA / CBT      – monthly absolute values (pesos), 2018–2026
 *  3. Desocupación    – quarterly rate, 2016–2025
 *  4. Informalidad    – quarterly rate, 2003–2025
 *  5. Pobreza/Indigencia – semiannual rate, 2016–2025
 *
 * Usage:  node scripts/extract-indicator-values.mjs
 */

import XLSX from "xlsx"
import { createClient } from "@supabase/supabase-js"
import path from "path"

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://zblvxddiyomuwonmgqxg.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibHZ4ZGRpeW9tdXdvbm1ncXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1Nzg0OCwiZXhwIjoyMDk0MjMzODQ4fQ.RMXnfQP6mMTskfaY7mTBAum5RzoOsrZloErDnv8tNxQ"
const BASE = "C:/Users/Fede/Desktop/scraping-boilerplate/downloads/dep"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Indicator slugs mapped to IDs (fetched from DB) ────────────────────────
const indicatorMap = {}

// ── Helpers ─────────────────────────────────────────────────────────────────
function parsePercent(val) {
  if (val == null) return null
  const s = String(val).trim().replace("%", "").replace(",", ".").replace(/\s/g, "")
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

function parseNumber(val) {
  if (val == null) return null
  const s = String(val).trim().replace(",", ".").replace(/\s/g, "")
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

const MONTH_MAP = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  Ene: "01", Feb_: "02", Abr: "04", May_: "05", Jun_: "06",
  Jul_: "07", Ago: "08", Sep_: "09", Oct_: "10", Nov_: "11", Dic: "12",
}

function excelMonthToDate(monthStr, yearStr) {
  // e.g. "Jan-18" and year 2018
  const m = monthStr.trim()
  const parts = m.split("-")
  if (parts.length === 2) {
    const monthName = parts[0]
    const shortYear = parts[1]
    const mm = MONTH_MAP[monthName] || "01"
    let yyyy = 2000 + parseInt(shortYear)
    if (yyyy > 2050) yyyy -= 100
    return `${yyyy}-${mm}-01`
  }
  return null
}

const QUARTER_MAP = { "1": "Q1", "2": "Q2", "3": "Q3", "4": "Q4" }
const SEMESTER_MAP = { "1": "S1", "2": "S2" }

function periodLabel(year, quarter, semester) {
  if (quarter) return `${year}-${QUARTER_MAP[quarter]}`
  if (semester) return `${year}-${SEMESTER_MAP[semester]}`
  return `${year}`
}

// ── 1. IPC Empalmada (monthly variation, 1968–2018+) ────────────────────────
async function extractIPC() {
  console.log("\n━━━ Extracting IPC Empalmada ━━━")
  const filePath = path.join(BASE, "precios/sin-fecha/Serie-historica-Empalmada.xlsx")
  const wb = XLSX.readFile(filePath, { type: "file" })
  const ws = wb.Sheets["SERIE DE TIEMPO"]
  const range = XLSX.utils.decode_range(ws["!ref"])

  const rows = []
  let currentYear = null

  for (let r = 2; r <= range.e.r; r++) {
    const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })] // Month (Jan-68)
    const cellB = ws[XLSX.utils.encode_cell({ r, c: 1 })] // Year
    const cellD = ws[XLSX.utils.encode_cell({ r, c: 3 })] // IPC
    const cellE = ws[XLSX.utils.encode_cell({ r, c: 4 })] // Variación

    if (!cellA) continue

    const monthStr = String(cellA.w || cellA.v)
    if (cellB && cellB.v) currentYear = Math.round(cellB.v)

    // Skip footer rows
    if (monthStr.startsWith("Fuente") || monthStr.startsWith("(*)") || !monthStr.match(/\w{3}-\d{2}/)) continue

    const variation = parsePercent(cellE?.w || cellE?.v)
    if (variation == null) continue

    // Parse "Jan-68" format
    const parts = monthStr.split("-")
    if (parts.length !== 2) continue
    const monthName = parts[0]
    const shortYear = parseInt(parts[1])
    let yyyy = shortYear > 50 ? 1900 + shortYear : 2000 + shortYear
    const mm = MONTH_MAP[monthName] || "01"
    const dateStr = `${yyyy}-${mm}-01`

    rows.push({
      indicator_id: indicatorMap["ipc-tucuman"],
      value: variation,
      value_date: dateStr,
      period: `${yyyy}-${mm}`,
      variation: null, // the value IS the variation for IPC
      source_url: "/precios/sin-fecha/Serie-historica-Empalmada.xlsx",
      notes: `Variación mensual IPC Tucumán. Fuente: DEP`
    })
  }

  // Also check the other IPCT files for more recent data
  for (const suffix of ["Serie-historica-IPCT-.xlsx", "Serie-historica-IPCT-(10).xlsx"]) {
    const fp2 = path.join(BASE, "precios/sin-fecha", suffix)
    try {
      const wb2 = XLSX.readFile(fp2, { type: "file" })
      const ws2 = wb2.Sheets[wb2.SheetNames[0]]
      const rng2 = XLSX.utils.decode_range(ws2["!ref"])
      let yr = null
      for (let r = 4; r <= rng2.e.r; r++) {
        const cellA = ws2[XLSX.utils.encode_cell({ r, c: 0 })]
        const cellB = ws2[XLSX.utils.encode_cell({ r, c: 1 })]
        const cellC = ws2[XLSX.utils.encode_cell({ r, c: 2 })]
        if (!cellB) continue
        if (cellA && cellA.v) yr = Math.round(cellA.v) || yr

        const monthStr = String(cellB.w || cellB.v)
        const vari = parsePercent(cellC?.w || cellC?.v)
        if (vari == null) continue

        const mParts = monthStr.split("-")
        if (mParts.length !== 2) continue
        const monthName = mParts[0]
        const shortY = parseInt(mParts[1])
        let yyyy = shortY > 50 ? 1900 + shortY : 2000 + shortY
        const mm = MONTH_MAP[monthName] || "01"
        const dateStr = `${yyyy}-${mm}-01`

        // Avoid duplicates with Empalmada
        if (rows.find(x => x.period === `${yyyy}-${mm}`)) continue

        rows.push({
          indicator_id: indicatorMap["ipc-tucuman"],
          value: vari,
          value_date: dateStr,
          period: `${yyyy}-${mm}`,
          variation: null,
          source_url: `/precios/sin-fecha/${suffix}`,
          notes: `Variación mensual IPC Tucumán. Fuente: DEP`
        })
      }
    } catch (e) { /* skip if file not found */ }
  }

  // Sort by date
  rows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  console.log(`  IPC: ${rows.length} data points (${rows[0]?.value_date} to ${rows[rows.length - 1]?.value_date})`)
  return rows
}

// ── 2. CBA / CBT (monthly absolute values, 2018–2026) ──────────────────────
async function extractCBA() {
  console.log("\n━━━ Extracting CBA / CBT ━━━")
  // Use the most recent file
  const filePath = path.join(BASE, "canasta-basica/2026/DEP_Canasta_Basica_Tucuman-Serie_Historica_ABR_2026.xlsx")
  const wb = XLSX.readFile(filePath, { type: "file" })
  const ws = wb.Sheets["Canasta Básica"]
  const range = XLSX.utils.decode_range(ws["!ref"])

  // Excel epoch for date conversion
  const EXCEL_EPOCH = new Date(1899, 11, 30)
  function excelSerialToDate(serial) {
    const d = new Date(EXCEL_EPOCH.getTime() + serial * 86400000)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    return { date: `${yyyy}-${mm}-01`, period: `${yyyy}-${mm}` }
  }

  const cbaRows = []
  const cbtRows = []

  for (let r = 6; r <= range.e.r; r++) {
    const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })] // Period (Excel serial or "Jun-18")
    const cellB = ws[XLSX.utils.encode_cell({ r, c: 1 })] // CBA value (raw number)
    const cellD = ws[XLSX.utils.encode_cell({ r, c: 3 })] // CBT value (raw number)

    if (!cellA) continue

    // Use raw numeric value (cell.v) to avoid locale formatting issues
    let dateStr, period
    if (cellA.t === "n") {
      // Excel date serial number
      const parsed = excelSerialToDate(cellA.v)
      dateStr = parsed.date
      period = parsed.period
    } else {
      // Formatted string like "Jun-18"
      const periodStr = String(cellA.w || cellA.v)
      const parts = periodStr.split("-")
      if (parts.length !== 2) continue
      const monthName = parts[0]
      const shortYear = parseInt(parts[1])
      const yyyy = shortYear > 50 ? 1900 + shortYear : 2000 + shortYear
      const mm = MONTH_MAP[monthName] || "01"
      dateStr = `${yyyy}-${mm}-01`
      period = `${yyyy}-${mm}`
    }

    // Use raw numeric value (cell.v) to avoid comma-as-thousands-separator issues
    const cbaVal = cellB && cellB.t === "n" ? Math.round(cellB.v * 100) / 100 : null
    const cbtVal = cellD && cellD.t === "n" ? Math.round(cellD.v * 100) / 100 : null

    // Skip footer / non-data rows
    if (cbaVal == null && cbtVal == null) continue

    if (cbaVal != null) {
      cbaRows.push({
        indicator_id: indicatorMap["canasta-basica-alimentaria"],
        value: cbaVal,
        value_date: dateStr,
        period: `${yyyy}-${mm}`,
        variation: null,
        source_url: "/canasta-basica/2026/DEP_Canasta_Basica_Tucuman-Serie_Historica_ABR_2026.xlsx",
        notes: `CBA Tucumán (valor en pesos). Fuente: DEP`
      })
    }

    if (cbtVal != null && indicatorMap["canasta-basica-total"]) {
      cbtRows.push({
        indicator_id: indicatorMap["canasta-basica-total"],
        value: cbtVal,
        value_date: dateStr,
        period: `${yyyy}-${mm}`,
        variation: null,
        source_url: "/canasta-basica/2026/DEP_Canasta_Basica_Tucuman-Serie_Historica_ABR_2026.xlsx",
        notes: `CBT Tucumán (valor en pesos). Fuente: DEP`
      })
    }
  }

  cbaRows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  cbtRows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  console.log(`  CBA: ${cbaRows.length} data points (${cbaRows[0]?.value_date} to ${cbaRows[cbaRows.length - 1]?.value_date})`)
  console.log(`  CBT: ${cbtRows.length} data points (${cbtRows[0]?.value_date} to ${cbtRows[cbtRows.length - 1]?.value_date})`)
  return [...cbaRows, ...cbtRows]
}

// ── 3. Desocupación (quarterly, 2016–2025) ─────────────────────────────────
async function extractDesocupacion() {
  console.log("\n━━━ Extracting Tasa de Desocupación ━━━")
  const dir = path.join(BASE, "mercado-laboral/sin-fecha")
  const fs = await import("fs")
  const files = fs.readdirSync(dir)
  const mlFile = files.find(f => f.includes("principales") && f.includes("tasas"))
  if (!mlFile) { console.log("  File not found!"); return [] }

  const wb = XLSX.readFile(path.join(dir, mlFile), { type: "file" })
  const ws = wb.Sheets["Tasas"]
  const range = XLSX.utils.decode_range(ws["!ref"])

  // Row 4 has headers (period columns), Row 25 has "Tasa de desocupación" total
  // Row 16 has "Tasa de empleo"
  // Row 7 has "Tasa de actividad"

  // Parse period headers from row 4
  const periods = []
  for (let c = 1; c <= range.e.c; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 4, c })]
    if (!cell) { periods.push(null); continue }
    const pStr = String(cell.w || cell.v).trim()
    // Parse "3 trim. 2016" or "4 trim. 2025(1)"
    const match = pStr.match(/(\d)\s*trim\.?\s*(\d{4})/)
    if (match) {
      periods.push({ quarter: match[1], year: match[2] })
    } else {
      periods.push(null)
    }
  }

  const rows = []

  // Extract specific rows: Tasa de desocupación (row 25)
  const rowMappings = [
    { row: 25, slug: "tasa-desocupacion", label: "Desocupación" },
    { row: 7, slug: "tasa-actividad", label: "Actividad" },
    { row: 16, slug: "tasa-empleo", label: "Empleo" },
  ]

  for (const mapping of rowMappings) {
    const indicatorId = indicatorMap[mapping.slug]
    if (!indicatorId) {
      console.log(`  Skipping ${mapping.slug} — indicator not in DB`)
      continue
    }

    for (let c = 1; c <= range.e.c; c++) {
      const period = periods[c - 1]
      if (!period) continue

      const cell = ws[XLSX.utils.encode_cell({ r: mapping.row, c })]
      const val = parseNumber(cell?.w || cell?.v)
      if (val == null) continue

      const dateStr = `${period.year}-${parseInt(period.quarter) * 3 - 2 < 10 ? "0" : ""}${parseInt(period.quarter) * 3 - 2}-01`
      const periodLabel = `${period.year}-Q${period.quarter}`

      rows.push({
        indicator_id: indicatorId,
        value: val,
        value_date: dateStr,
        period: periodLabel,
        variation: null,
        source_url: "/mercado-laboral/sin-fecha/Serie-historica-mercado-laboral(principales%20tasas).xlsx",
        notes: `${mapping.label} Gran Tucumán-Tafí Viejo. Fuente: INDEC/DEP`
      })
    }
  }

  rows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  console.log(`  ML Tasas: ${rows.length} data points`)
  return rows
}

// ── 4. Informalidad (quarterly, 2003–2025) ─────────────────────────────────
async function extractInformalidad() {
  console.log("\n━━━ Extracting Tasa de Informalidad ━━━")
  const filePath = path.join(BASE, "mercado-laboral/sin-fecha/Serie-historica-de-tasa-de-informalidad-Tucuman.xlsx")
  const wb = XLSX.readFile(filePath, { type: "file" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const range = XLSX.utils.decode_range(ws["!ref"])

  const rows = []

  for (let r = 5; r <= range.e.r; r++) {
    const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })]
    const cellB = ws[XLSX.utils.encode_cell({ r, c: 1 })]
    if (!cellA) continue

    const periodStr = String(cellA.w || cellA.v).trim()

    // Skip footnotes and empty rows
    if (periodStr.startsWith("(") || periodStr.startsWith("Fuente") || periodStr === "") continue

    // Parse "1 trim. 2003" or "4 trim.2025" or "4 trim. 2025(1)(2)"
    const match = periodStr.match(/(\d)\s*trim\.?\s*(\d{4})/)
    if (!match) continue

    const quarter = match[1]
    const year = match[2]
    const val = parseNumber(cellB?.w || cellB?.v)
    if (val == null) continue

    const monthNum = parseInt(quarter) * 3 - 2
    const dateStr = `${year}-${monthNum < 10 ? "0" : ""}${monthNum}-01`

    rows.push({
      indicator_id: indicatorMap["tasa-informalidad"],
      value: val,
      value_date: dateStr,
      period: `${year}-Q${quarter}`,
      variation: null,
      source_url: "/mercado-laboral/sin-fecha/Serie-historica-de-tasa-de-informalidad-Tucuman.xlsx",
      notes: "Tasa de informalidad Gran Tucumán-Tafí Viejo. Fuente: INDEC/DEP"
    })
  }

  rows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  console.log(`  Informalidad: ${rows.length} data points (${rows[0]?.value_date} to ${rows[rows.length - 1]?.value_date})`)
  return rows
}

// ── 5. Pobreza / Indigencia (semiannual, 2016–2025) ────────────────────────
async function extractPobreza() {
  console.log("\n━━━ Extracting Pobreza / Indigencia ━━━")
  const filePath = path.join(BASE, "condiciones-de-vida/sin-fecha/Serie-historica-de-tasa-de-pobreza-e_indigencia.xlsx")
  const wb = XLSX.readFile(filePath, { type: "file" })
  const ws = wb.Sheets["Tasa"]
  const range = XLSX.utils.decode_range(ws["!ref"])

  const rows = []

  for (let r = 6; r <= range.e.r; r++) {
    const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })] // Período
    const cellB = ws[XLSX.utils.encode_cell({ r, c: 1 })] // Pobreza Hogares Gran Tucumán
    const cellC = ws[XLSX.utils.encode_cell({ r, c: 2 })] // Pobreza Personas Gran Tucumán
    const cellD = ws[XLSX.utils.encode_cell({ r, c: 3 })] // Indigencia Hogares Gran Tucumán
    const cellE = ws[XLSX.utils.encode_cell({ r, c: 4 })] // Indigencia Personas Gran Tucumán

    if (!cellA) continue
    const periodStr = String(cellA.w || cellA.v).trim()
    if (periodStr.startsWith("Fuente") || periodStr === "") continue

    // Parse "2 sem 2016", "1 sem 2025", "2 sem 2025"
    const match = periodStr.match(/(\d)\s*sem\.?\s*(\d{4})/)
    if (!match) continue

    const semester = match[1]
    const year = match[2]
    const month = semester === "1" ? "01" : "07"
    const dateStr = `${year}-${month}-01`
    const periodLabel = `${year}-S${semester}`

    // Pobreza personas (Gran Tucumán)
    const pobPersVal = parsePercent(cellC?.w || cellC?.v)
    if (pobPersVal != null && indicatorMap["pobreza-personas"]) {
      rows.push({
        indicator_id: indicatorMap["pobreza-personas"],
        value: pobPersVal,
        value_date: dateStr,
        period: periodLabel,
        variation: null,
        source_url: "/condiciones-de-vida/sin-fecha/Serie-historica-de-tasa-de-pobreza-e_indigencia.xlsx",
        notes: "Tasa de pobreza personas Gran Tucumán-Tafí Viejo. Fuente: INDEC"
      })
    }

    // Pobreza hogares (Gran Tucumán)
    const pobHogVal = parsePercent(cellB?.w || cellB?.v)
    if (pobHogVal != null && indicatorMap["pobreza-hogares"]) {
      rows.push({
        indicator_id: indicatorMap["pobreza-hogares"],
        value: pobHogVal,
        value_date: dateStr,
        period: periodLabel,
        variation: null,
        source_url: "/condiciones-de-vida/sin-fecha/Serie-historica-de-tasa-de-pobreza-e_indigencia.xlsx",
        notes: "Tasa de pobreza hogares Gran Tucumán-Tafí Viejo. Fuente: INDEC"
      })
    }

    // Indigencia personas (Gran Tucumán)
    const indPersVal = parsePercent(cellE?.w || cellE?.v)
    if (indPersVal != null && indicatorMap["indigencia-personas"]) {
      rows.push({
        indicator_id: indicatorMap["indigencia-personas"],
        value: indPersVal,
        value_date: dateStr,
        period: periodLabel,
        variation: null,
        source_url: "/condiciones-de-vida/sin-fecha/Serie-historica-de-tasa-de-pobreza-e_indigencia.xlsx",
        notes: "Tasa de indigencia personas Gran Tucumán-Tafí Viejo. Fuente: INDEC"
      })
    }

    // Indigencia hogares (Gran Tucumán)
    const indHogVal = parsePercent(cellD?.w || cellD?.v)
    if (indHogVal != null && indicatorMap["indigencia-hogares"]) {
      rows.push({
        indicator_id: indicatorMap["indigencia-hogares"],
        value: indHogVal,
        value_date: dateStr,
        period: periodLabel,
        variation: null,
        source_url: "/condiciones-de-vida/sin-fecha/Serie-historica-de-tasa-de-pobreza-e_indigencia.xlsx",
        notes: "Tasa de indigencia hogares Gran Tucumán-Tafí Viejo. Fuente: INDEC"
      })
    }
  }

  rows.sort((a, b) => a.value_date.localeCompare(b.value_date))
  console.log(`  Pobreza/Indigencia: ${rows.length} data points`)
  return rows
}

// ── Create new indicators if needed ─────────────────────────────────────────
async function ensureIndicators() {
  const newIndicators = [
    { name: "Canasta Básica Total", slug: "canasta-basica-total", unit: "$", frequency: "monthly", source: "DEP", description: "Valor mensual de la Canasta Básica Total (Línea de pobreza) en Tucumán", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
    { name: "Tasa de Actividad", slug: "tasa-actividad", unit: "%", frequency: "quarterly", source: "INDEC", description: "Tasa de actividad en el aglomerado Gran Tucumán-Tafí Viejo según EPH", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
    { name: "Tasa de Empleo", slug: "tasa-empleo", unit: "%", frequency: "quarterly", source: "INDEC", description: "Tasa de empleo en el aglomerado Gran Tucumán-Tafí Viejo según EPH", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
    { name: "Pobreza Hogares", slug: "pobreza-hogares", unit: "%", frequency: "semiannual", source: "INDEC", description: "Tasa de hogares bajo la línea de pobreza en Gran Tucumán-Tafí Viejo", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
    { name: "Indigencia Personas", slug: "indigencia-personas", unit: "%", frequency: "semiannual", source: "INDEC", description: "Tasa de personas bajo la línea de indigencia en Gran Tucumán-Tafí Viejo", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
    { name: "Indigencia Hogares", slug: "indigencia-hogares", unit: "%", frequency: "semiannual", source: "INDEC", description: "Tasa de hogares bajo la línea de indigencia en Gran Tucumán-Tafí Viejo", source_url: "https://estadistica.tucuman.gov.ar/", active: true },
  ]

  // Update existing indicator unit for CBA
  const { error: updateError } = await supabase
    .from("indicators")
    .update({ unit: "$", description: "Valor mensual de la Canasta Básica Alimentaria (Línea de indigencia) en Tucumán" })
    .eq("slug", "canasta-basica-alimentaria")
  if (updateError) console.error("  Error updating CBA unit:", updateError)
  else console.log("  Updated CBA unit from % to $")

  for (const indicator of newIndicators) {
    const { data, error } = await supabase
      .from("indicators")
      .insert(indicator)
      .select("id, slug")
      .single()

    if (error && error.code === "23505") {
      // Already exists, fetch it
      const { data: existing } = await supabase
        .from("indicators")
        .select("id, slug")
        .eq("slug", indicator.slug)
        .single()
      console.log(`  Indicator ${indicator.slug} already exists: ${existing.id}`)
      indicatorMap[indicator.slug] = existing.id
    } else if (error) {
      console.error(`  Error creating ${indicator.slug}:`, error)
    } else {
      console.log(`  Created indicator ${indicator.slug}: ${data.id}`)
      indicatorMap[indicator.slug] = data.id
    }
  }
}

// ── Upsert values into Supabase ─────────────────────────────────────────────
async function upsertValues(rows, batchSize = 500) {
  console.log(`\n  Upserting ${rows.length} values in batches of ${batchSize}...`)
  let inserted = 0
  let errors = 0

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from("indicator_values")
      .upsert(batch, { onConflict: "indicator_id,value_date,period", ignoreDuplicates: true })

    if (error) {
      console.error(`  Error upserting batch ${i / batchSize + 1}:`, error.message)
      errors++
    } else {
      inserted += batch.length
    }
  }

  console.log(`  Done: ${inserted} inserted, ${errors} errors`)
  return inserted
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== EXTRACTING INDICATOR VALUES FROM LOCAL FILES ===\n")

  // Fetch existing indicators
  const { data: indicators, error } = await supabase.from("indicators").select("id, slug")
  if (error) { console.error("Error fetching indicators:", error); process.exit(1) }

  for (const ind of indicators) {
    indicatorMap[ind.slug] = ind.id
  }
  console.log("Existing indicators:", Object.keys(indicatorMap).join(", "))

  // Create new indicators
  await ensureIndicators()

  // Extract data from all sources
  const allRows = []

  const ipcRows = await extractIPC()
  allRows.push(...ipcRows)

  const cbaRows = await extractCBA()
  allRows.push(...cbaRows)

  const desocRows = await extractDesocupacion()
  allRows.push(...desocRows)

  const infoRows = await extractInformalidad()
  allRows.push(...infoRows)

  const pobRows = await extractPobreza()
  allRows.push(...pobRows)

  console.log(`\n=== TOTAL: ${allRows.length} data points to insert ===`)

  // Upsert all values
  const totalInserted = await upsertValues(allRows)

  console.log(`\n=== DONE: ${totalInserted} values inserted ===`)

  // Print summary per indicator
  const summary = {}
  for (const row of allRows) {
    const slug = Object.entries(indicatorMap).find(([s, id]) => id === row.indicator_id)?.[0] || row.indicator_id
    if (!summary[slug]) summary[slug] = { count: 0, from: row.value_date, to: row.value_date }
    summary[slug].count++
    if (row.value_date < summary[slug].from) summary[slug].from = row.value_date
    if (row.value_date > summary[slug].to) summary[slug].to = row.value_date
  }

  console.log("\nSummary per indicator:")
  for (const [slug, info] of Object.entries(summary)) {
    console.log(`  ${slug}: ${info.count} points (${info.from} to ${info.to})`)
  }
}

main().catch(console.error)