import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"

export default async function AdminIndicatorsPage() {
  const supabase = await createServiceClient()

  const { data: indicators } = await supabase
    .from("indicators")
    .select("id, name, slug, unit, frequency, active, category_id")
    .order("name")

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const categoryMap = Object.fromEntries(
    (categories ?? []).map((c) => [c.id, c.name])
  )

  return (
    <AdminPageLayout
      title="Indicadores"
      description="Gestiona los indicadores estadísticos del sitio"
      action={
        <Link
          href="/admin/indicators/new"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo indicador
        </Link>
      }
    >
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Nombre</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Unidad</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Frecuencia</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Categoría</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Activo</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(indicators ?? []).map((ind) => (
              <tr key={ind.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                <td className="py-2.5 px-4 font-medium">{ind.name}</td>
                <td className="py-2.5 px-4 text-muted-foreground">{ind.unit || "—"}</td>
                <td className="py-2.5 px-4 text-muted-foreground capitalize">{ind.frequency || "—"}</td>
                <td className="py-2.5 px-4 text-muted-foreground">
                  {ind.category_id ? categoryMap[ind.category_id] || "—" : "—"}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      ind.active ? "bg-[var(--success)]" : "bg-[var(--destructive)]"
                    }`}
                  />
                </td>
                <td className="py-2.5 px-4 text-right">
                  <Link
                    href={`/admin/indicators/${ind.id}/edit`}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPageLayout>
  )
}