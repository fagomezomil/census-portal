import XLSX from "xlsx"
import fs from "fs"
import path from "path"

const BASE = "C:/Users/Fede/Desktop/scraping-boilerplate/downloads/dep"

function readFile(filePath) {
  try {
    const wb = XLSX.readFile(decodeURIComponent(filePath), { type: "file" })
    console.log(`\n📄 ${path.basename(decodeURIComponent(filePath))}`)
    console.log(`   Sheets: ${wb.SheetNames.join(", ")}`)

    for (const sheetName of wb.SheetNames.slice(0, 3)) {
      const ws = wb.Sheets[sheetName]
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1")
      const maxRow = Math.min(range.e.r, 15) // first 15 rows
      const maxCol = Math.min(range.e.c, 10) // first 10 cols

      console.log(`\n   Sheet "${sheetName}" (rows ${range.s.r}-${range.e.r}, cols ${range.s.c}-${range.e.c}):`)

      for (let r = range.s.r; r <= maxRow; r++) {
        let row = []
        for (let c = range.s.c; c <= maxCol; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r, c })]
          row.push(cell ? String(cell.v).substring(0, 30) : "")
        }
        console.log(`   ${row.map(v => v.padEnd(30)).join(" | ")}`)
      }
    }
  } catch (e) {
    console.error(`   ERROR: ${e.message}`)
  }
}

console.log("=== EXAMINANDO ESTRUCTURA DE ARCHIVOS XLS/XLSX ===\n")

// 1. IPC - Serie historica
console.log("━━━ IPC TUCUMÁN ━━━")
const ipcFiles = [
  "/precios/sin-fecha/Serie-historica-IPCT-.xlsx",
  "/precios/sin-fecha/Serie-historica-IPCT-(10).xlsx",
]
for (const f of ipcFiles) {
  const full = BASE + f
  if (fs.existsSync(full)) readFile(full)
  else if (fs.existsSync(decodeURIComponent(full))) readFile(decodeURIComponent(full))
}

// 2. CBA - Serie historica mas reciente
console.log("\n\n━━━ CANASTA BÁSICA ━━━")
const cbaFiles = [
  "/canasta-basica/2026/DEP_Canasta_Basica_Tucuman-Serie_Historica_ABR_2026.xlsx",
  "/canasta-basica/sin-fecha/DEP_Canasta_Basica_Tucuman-Serie_Historica.xlsx",
]
for (const f of cbaFiles) {
  const full = BASE + f
  if (fs.existsSync(full)) readFile(full)
  else if (fs.existsSync(decodeURIComponent(full))) readFile(decodeURIComponent(full))
}

// 3. Mercado Laboral - Principales Tasas
console.log("\n\n━━━ MERCADO LABORAL ━━━")
const mlFiles = [
  "/mercado-laboral/2019/Serie%20historica%20mercado%20laboral%202016-2019.xlsx",
]
for (const f of mlFiles) {
  const full = BASE + f
  if (fs.existsSync(full)) readFile(full)
  else if (fs.existsSync(decodeURIComponent(full))) readFile(decodeURIComponent(full))
}

// 4. Condiciones de Vida
console.log("\n\n━━━ CONDICIONES DE VIDA ━━━")
const cdvFiles = [
  "/condiciones-de-vida/2024/eph_indicadores_hogares_2_sem_2024.xlsx",
  "/condiciones-de-vida/sin-fecha/Pobreza%20e%20indigencia%20-%2029%20aglomerados.xlsx",
]
for (const f of cdvFiles) {
  const full = BASE + f
  if (fs.existsSync(full)) readFile(full)
  else if (fs.existsSync(decodeURIComponent(full))) readFile(decodeURIComponent(full))
}

// List available files in condiciones-de-vida/sin-fecha
console.log("\n\n━━━ Archivos disponibles en condiciones-de-vida/sin-fecha ━━━")
const cdvDir = BASE + "/condiciones-de-vida/sin-fecha/"
try {
  const files = fs.readdirSync(decodeURIComponent(cdvDir))
  for (const f of files) {
    console.log(`  ${f}`)
  }
} catch (e) {
  const files = fs.readdirSync(cdvDir)
  for (const f of files) {
    console.log(`  ${f}`)
  }
}