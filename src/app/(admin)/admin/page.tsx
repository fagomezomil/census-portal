import { createClient, createServiceClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BarChart3, BookOpen, FileText, Users } from "lucide-react"

const modules = [
  {
    label: "Indicadores",
    href: "/admin/indicators",
    icon: BarChart3,
    table: "indicators" as const,
    color: "text-[var(--accent)]",
  },
  {
    label: "Páginas",
    href: "/admin/pages",
    icon: BookOpen,
    table: "pages" as const,
    color: "text-[var(--success)]",
  },
  {
    label: "Publicaciones",
    href: "/admin/publications",
    icon: FileText,
    table: "publications" as const,
    color: "text-[var(--warning)]",
  },
  {
    label: "Capital Humano",
    href: "/admin/staff",
    icon: Users,
    table: "staff" as const,
    color: "text-[var(--accent-light)]",
  },
]

export default async function AdminDashboard() {
  const supabase = await createServiceClient()

  const counts = await Promise.all(
    modules.map(async (mod) => {
      const { count } = await supabase
        .from(mod.table)
        .select("*", { count: "exact", head: true })
      return { table: mod.table, count: count ?? 0 }
    })
  )

  const countMap = Object.fromEntries(counts.map((c) => [c.table, c.count]))

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--accent)] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-5 w-5 ${mod.color}`} />
                <span className="text-sm font-medium">{mod.label}</span>
              </div>
              <div className="text-3xl font-bold tabular-nums">{countMap[mod.table]}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mod.table === "staff" ? "integrantes" : "registros"}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}