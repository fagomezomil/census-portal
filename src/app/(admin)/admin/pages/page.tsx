import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { PAGE_SECTIONS } from "@/lib/admin-constants"

export default async function AdminPagesPage() {
  const supabase = await createServiceClient()

  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, section, active")
    .order("section")
    .order("title")

  const grouped = (pages ?? []).reduce<Record<string, typeof pages>>((acc, page) => {
    const section = page.section || "Sin sección"
    if (!acc[section]) acc[section] = []
    acc[section].push(page)
    return acc
  }, {})

  const sectionOrder = [...PAGE_SECTIONS.map((s) => s.value), "Sin sección"]
  const sortedSections = Object.keys(grouped).sort(
    (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
  )

  const sectionLabels: Record<string, string> = {
    institucional: "Institucional",
    operativos: "Operativos",
    censo: "Censo",
    "Sin sección": "Sin sección",
  }

  return (
    <AdminPageLayout
      title="Páginas"
      description="Gestiona las páginas del sitio"
      action={
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva página
        </Link>
      }
    >
      {sortedSections.map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {sectionLabels[section] || section}
          </h2>
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Título</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Slug</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Activo</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grouped[section]!.map((page) => (
                  <tr key={page.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                    <td className="py-2.5 px-4 font-medium">{page.title}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{page.slug}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          page.active ? "bg-[var(--success)]" : "bg-[var(--destructive)]"
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
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
        </div>
      ))}
    </AdminPageLayout>
  )
}