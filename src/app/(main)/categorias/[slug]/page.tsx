import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { SectionPageLayout } from "@/components/shared/section-page-layout"
import { ScrollReveal } from "@/components/animations"

export default async function CategoriaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) notFound()

  const [
    { data: publications },
    { data: datasets },
    { data: indicators },
    { data: subcategories },
  ] = await Promise.all([
    supabase
      .from("publications")
      .select("id, title, slug, publication_date, publication_type, file_type")
      .eq("category_id", category.id)
      .eq("active", true)
      .order("publication_date", { ascending: false })
      .limit(10),
    supabase
      .from("datasets")
      .select("id, title, slug, organization, frequency")
      .eq("category_id", category.id)
      .eq("active", true)
      .order("title"),
    supabase
      .from("indicators")
      .select("id, name, slug, unit, frequency")
      .eq("category_id", category.id)
      .eq("active", true),
    supabase
      .from("categories")
      .select("id, name, slug")
      .eq("parent_id", category.id)
      .order("name"),
  ])

  return (
    <SectionPageLayout
      title={category.name}
      description={category.description ?? undefined}
    >
      {subcategories && subcategories.length > 0 && (
        <ScrollReveal>
          <section>
            <h2 className="text-xl font-semibold mb-3">Subcategorías</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link key={sub.id} href={`/categorias/${sub.slug}`}>
                  <Badge
                    variant="outline"
                    className="text-sm py-1 px-3 hover:bg-accent cursor-pointer"
                  >
                    {sub.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {indicators && indicators.length > 0 && (
        <ScrollReveal>
          <section>
            <h2 className="text-xl font-semibold mb-3">Indicadores</h2>
            <div className="space-y-2">
              {indicators.map((ind) => (
                <Link
                  key={ind.id}
                  href={`/indicadores/${ind.slug}`}
                  className="block rounded-[var(--radius-md)] border border-[var(--border)] p-4 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ind.name}</span>
                    <div className="flex gap-2">
                      {ind.unit && (
                        <Badge variant="secondary" className="text-xs">
                          {ind.unit}
                        </Badge>
                      )}
                      {ind.frequency && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {ind.frequency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {publications && publications.length > 0 && (
        <ScrollReveal>
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Publicaciones</h2>
              <Link
                href={`/publicaciones?categoria=${slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-2">
              {publications.map((pub) => (
                <Link
                  key={pub.id}
                  href={`/publications/${pub.slug}`}
                  className="block rounded-[var(--radius-md)] border border-[var(--border)] p-4 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pub.title}</span>
                    <div className="flex gap-2">
                      {pub.publication_type && (
                        <Badge variant="outline" className="text-xs">
                          {pub.publication_type}
                        </Badge>
                      )}
                      {pub.file_type && (
                        <Badge variant="secondary" className="text-xs uppercase">
                          {pub.file_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {datasets && datasets.length > 0 && (
        <ScrollReveal>
          <section>
            <h2 className="text-xl font-semibold mb-3">Datasets</h2>
            <div className="space-y-2">
              {datasets.map((ds) => (
                <Link
                  key={ds.id}
                  href={`/datasets/${ds.slug}`}
                  className="block rounded-[var(--radius-md)] border border-[var(--border)] p-4 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ds.title}</span>
                    {ds.organization && (
                      <Badge variant="outline" className="text-xs">
                        {ds.organization}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </SectionPageLayout>
  )
}