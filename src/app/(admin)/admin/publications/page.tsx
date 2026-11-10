import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { PUBLICATION_TYPES } from "@/lib/admin-constants"

export default async function AdminPublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createServiceClient()
  const pageSize = 20
  const currentPage = parseInt(params.page || "1")
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("publications")
    .select("id, title, slug, publication_type, publication_date, active", { count: "exact" })
    .order("publication_date", { ascending: false, nullsFirst: false })

  if (params.type) {
    query = query.eq("publication_type", params.type)
  }

  const { data: publications, count } = await query.range(from, to)
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  const typeLabels: Record<string, string> = Object.fromEntries(
    PUBLICATION_TYPES.map((t) => [t.value, t.label])
  )

  return (
    <AdminPageLayout
      title="Publicaciones"
      description="Gestiona las publicaciones del sitio"
      action={
        <Link
          href="/admin/publications/new"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva publicación
        </Link>
      }
    >
      {/* Type filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <a
          href="/admin/publications"
          className={`px-3 py-1 text-sm rounded-[var(--radius-sm)] border transition-colors ${
            !params.type
              ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)]"
              : "border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-[var(--accent)]"
          }`}
        >
          Todas
        </a>
        {PUBLICATION_TYPES.map((type) => (
          <a
            key={type.value}
            href={`/admin/publications?type=${type.value}`}
            className={`px-3 py-1 text-sm rounded-[var(--radius-sm)] border transition-colors ${
              params.type === type.value
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)]"
                : "border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-[var(--accent)]"
            }`}
          >
            {type.label}
          </a>
        ))}
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Título</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fecha</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Activo</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(publications ?? []).map((pub) => (
              <tr key={pub.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                <td className="py-2.5 px-4 font-medium">{pub.title}</td>
                <td className="py-2.5 px-4 text-muted-foreground">
                  {pub.publication_type ? typeLabels[pub.publication_type] || pub.publication_type : "—"}
                </td>
                <td className="py-2.5 px-4 text-muted-foreground tabular-nums">
                  {pub.publication_date || "—"}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      pub.active ? "bg-[var(--success)]" : "bg-[var(--destructive)]"
                    }`}
                  />
                </td>
                <td className="py-2.5 px-4 text-right">
                  <Link
                    href={`/admin/publications/${pub.id}/edit`}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {currentPage > 1 && (
            <a
              href={`/admin/publications?page=${currentPage - 1}${params.type ? `&type=${params.type}` : ""}`}
              className="px-3 py-1 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] text-muted-foreground hover:text-foreground transition-colors"
            >
              Anterior
            </a>
          )}
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              href={`/admin/publications?page=${currentPage + 1}${params.type ? `&type=${params.type}` : ""}`}
              className="px-3 py-1 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] text-muted-foreground hover:text-foreground transition-colors"
            >
              Siguiente
            </a>
          )}
        </div>
      )}
    </AdminPageLayout>
  )
}