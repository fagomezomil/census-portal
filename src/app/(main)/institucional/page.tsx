import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function InstitucionalPage() {
  const supabase = await createClient()

  const [{ data: mainPage }, { data: subPages }] = await Promise.all([
    supabase.from("pages").select("*").eq("slug", "quienes-somos").eq("active", true).single(),
    supabase.from("pages").select("id, title, slug, section").eq("section", "institucional").eq("active", true).order("title"),
  ])

  const otherPages = subPages?.filter((p) => p.slug !== "quienes-somos") ?? []

  return (
    <div className="space-y-12">
      {/* Main content: Quiénes somos */}
      {mainPage ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{mainPage.title}</h1>
          {mainPage.content ? (
            <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: mainPage.content }} />
          ) : mainPage.html_content ? (
            <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: mainPage.html_content }} />
          ) : (
            <p className="text-muted-foreground">Contenido no disponible.</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Institucional</h1>
          <p className="text-muted-foreground">Contenido no disponible aún.</p>
        </div>
      )}

      {/* Links to other institutional pages */}
      {otherPages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-[var(--border)] pb-2">Más información</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherPages.map((page) => {
              const href =
                page.slug === "historia"
                  ? "/institucional/historia"
                  : page.slug === "nuestros-objetivos"
                  ? "/institucional/objetivos"
                  : page.slug === "capital-humano"
                  ? "/institucional/capital-humano"
                  : page.slug === "terminos-y-condiciones"
                  ? "/institucional/terminos"
                  : `/institucional/${page.slug}`

              return (
                <Link
                  key={page.id}
                  href={href}
                  className="block rounded-[var(--radius-md)] border border-[var(--border)] p-4 hover:border-[var(--accent)] hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{page.title}</span>
                  <span className="block text-sm text-muted-foreground mt-1">Sección {page.section}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}