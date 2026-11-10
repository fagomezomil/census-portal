/**
 * Download dataset_resources from SEP (Sistema Estadístico Provincial) portal.
 *
 * This script:
 * 1. Fetches all undownloaded resources from Supabase
 * 2. Downloads each file from original_url to local storage
 * 3. Updates the resource with local_path, file_size, and downloaded=true
 *
 * Usage: node scripts/download-dataset-resources.mjs [--limit N] [--dry-run]
 *
 * --limit N   Only process N resources (default: 50)
 * --dry-run   Don't actually download, just show what would be done
 */

import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const SUPABASE_URL = "https://zblvxddiyomuwonmgqxg.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibHZ4ZGRpeW9tdXdvbm1ncXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1Nzg0OCwiZXhwIjoyMDk0MjMzODQ4fQ.RMXnfQP6mMTskfaY7mTBAum5RzoOsrZloErDnv8tNxQ"
const DOWNLOAD_DIR = "C:/Users/Fede/Desktop/estadisticas-tuc/public/datasets"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Parse args
const args = process.argv.slice(2)
const limitArg = args.findIndex(a => a === "--limit")
const LIMIT = limitArg >= 0 ? parseInt(args[limitArg + 1]) || 50 : 50
const DRY_RUN = args.includes("--dry-run")

// Valid file extensions for download
const VALID_EXTENSIONS = new Set(["pdf", "xlsx", "xls", "csv", "ods", "doc", "docx", "ppt", "pptx", "zip", "rar", "png", "jpg", "jpeg", "svg", "html", "xml", "json"])

function getExtension(url) {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname).toLowerCase().replace(".", "")
    if (VALID_EXTENSIONS.has(ext)) return ext
    // Try query params
    const match = url.match(/[?&]format=(\w+)/i)
    if (match) return match[1].toLowerCase()
    return null
  } catch {
    return null
  }
}

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 200)
}

async function downloadFile(url, destPath) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "DEP-Tucuman-DataBot/1.0" },
    })
    clearTimeout(timeout)

    if (!response.ok) {
      return { success: false, status: response.status, error: `HTTP ${response.status}` }
    }

    const contentType = response.headers.get("content-type") || ""
    const contentLength = response.headers.get("content-length")

    // Skip HTML pages that aren't actual files
    if (contentType.includes("text/html") && !url.endsWith(".html")) {
      return { success: false, status: 200, error: "Got HTML page, not a file" }
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.writeFileSync(destPath, buffer)

    return {
      success: true,
      size: buffer.length,
      contentType,
      contentLength: contentLength ? parseInt(contentLength) : buffer.length,
    }
  } catch (err) {
    clearTimeout(timeout)
    return { success: false, error: err.message }
  }
}

async function main() {
  console.log(`=== Download Dataset Resources ===`)
  console.log(`Limit: ${LIMIT}, Dry run: ${DRY_RUN}\n`)

  // Fetch undownloaded resources with valid URLs
  const { data: resources, error } = await supabase
    .from("dataset_resources")
    .select("id, dataset_id, name, format, original_url, file_size")
    .eq("downloaded", false)
    .not("original_url", "is", null)
    .limit(LIMIT)

  if (error) {
    console.error("Error fetching resources:", error)
    return
  }

  console.log(`Found ${resources.length} resources to process\n`)

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const resource of resources) {
    const url = resource.original_url
    const ext = getExtension(url)
    const filename = `${sanitizeFilename(resource.name)}${ext ? `.${ext}` : ""}`
    const localPath = `datasets/${filename}`
    const fullPath = path.join(DOWNLOAD_DIR, filename)

    if (DRY_RUN) {
      console.log(`[DRY] ${resource.name.substring(0, 50).padEnd(52)} | ${ext || "?"} | ${url.substring(0, 70)}`)
      skipped++
      continue
    }

    // Skip resources with obviously invalid URLs
    if (!url.startsWith("http")) {
      console.log(`  SKIP (bad URL): ${resource.name.substring(0, 50)}`)
      skipped++
      continue
    }

    console.log(`  Downloading: ${resource.name.substring(0, 50)}...`)
    const result = await downloadFile(url, fullPath)

    if (result.success) {
      const { error: updateError } = await supabase
        .from("dataset_resources")
        .update({
          local_path: localPath,
          file_size: result.size,
          downloaded: true,
          downloaded_at: new Date().toISOString(),
        })
        .eq("id", resource.id)

      if (updateError) {
        console.error(`  DB update error: ${updateError.message}`)
      } else {
        downloaded++
        console.log(`  OK: ${result.size} bytes -> ${localPath}`)
      }
    } else {
      console.log(`  FAIL: ${result.error}`)
      failed++
    }

    // Rate limit: 500ms between requests
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n=== Results ===`)
  console.log(`Downloaded: ${downloaded}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Failed: ${failed}`)
}

main().catch(console.error)