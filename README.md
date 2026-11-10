# census-portal

**EN** — Personal data project: Python scripts that parse official documents — National Census PDFs and provincial statistical indicators published by Tucumán's statistics office — into a structured database, explored through a Next.js dashboard portal with Chart.js/Recharts.

**ES** — Proyecto de datos personal: scripts Python que parsean documentos oficiales — PDFs del Censo Nacional e indicadores estadísticos provinciales que publica la Secretaría de Estadística de Tucumán — hacia una base de datos estructurada, explorada a través de un portal Next.js con Chart.js/Recharts.

**Status / Estado:** in progress, not publicly deployed · en desarrollo, no publicado. Proof of the full loop: *ugly PDF → structured data → readable dashboard* — the same loop behind my data-extraction service.

## What it does / Qué hace

- **Ingestion scripts / scripts de ingesta** (`scripts/`) — parse Excel/CSV/PDF official files, extract indicator values by period and geography, populate the database (Supabase) with dataset dates and structured values.
  *Parsea archivos oficiales Excel/CSV/PDF, extrae valores de indicadores por período y geografía, carga la base (Supabase) con fechas de datasets y valores estructurados.*
- **Portal / portal** (`src/`) — public dashboard views over indicators (charts by destination/period), plus auth-guarded admin sections for data management; map views from `public/maps/`.
  *Vistas públicas de indicadores (gráficos por destino/período), administración protegida para la gestión de datos, y vistas de mapa.*
- **Stack / stack** — Next.js (App Router) + TypeScript strict + Tailwind v4 + Radix UI; Supabase (PostgreSQL) + xlsx parsing; Recharts + Chart.js; react-simple-maps + sonner.

## Repo map / Mapa

| Path | What / Qué |
|---|---|
| `scripts/` | Ingestion & maintenance scripts (Indicator extraction, dataset dates, staff tables) | scripts de ingesta y mantenimiento |
| `src/app/(main)/` | Public dashboard / dashboard público |
| `src/app/(admin)/`, `(auth)/` | Data management, guarded sections / administración con auth |
| `src/lib/`, `src/types/` | Data access + domain types / acceso a datos y tipos |

## Notes / Notas

- Runtime data (census/institutions datasets, staff images) is **not included** in this repo — only code and parsing logic / *Los datasets y fotos de runtime no están incluidos — solo código y lógica de parseo.*
- No credentials committed / sin credenciales: conectá tu instancia en un `.env.local` local.

## License

MIT
