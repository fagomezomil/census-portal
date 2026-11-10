import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function OperativosPage() {
  const supabase = await createClient()

  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, content, html_content, section")
    .eq("section", "operativos")
    .eq("active", true)
    .order("title")

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Operativos en Calle</h1>
        <p className="mt-2 text-muted-foreground">
          Operativos estadísticos permanentes y temporales de la Dirección de Estadística de la Provincia.
        </p>
      </div>

      {pages && pages.length > 0 ? (
        <div className="space-y-8">
          {pages.map((page) => (
            <article key={page.id} className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] p-6">
              <h2 className="text-xl font-semibold">{page.title}</h2>
              {page.content ? (
                <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
              ) : page.html_content ? (
                <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.html_content }} />
              ) : (
                <p className="text-muted-foreground">Contenido no disponible.</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No hay operativos disponibles aún.</p>
      )}
    </div>
  )
}