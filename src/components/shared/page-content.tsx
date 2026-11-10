import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface PageContentProps {
  section: string
  slug?: string
  title?: string
}

export async function PageContent({ section, slug, title }: PageContentProps) {
  const supabase = await createClient()

  if (slug) {
    // Single page by slug
    const { data: page } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single()

    if (!page) notFound()

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.content ? (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : page.html_content ? (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: page.html_content }}
          />
        ) : (
          <p className="text-muted-foreground">Contenido no disponible.</p>
        )}
      </div>
    )
  }

  // Multiple pages in a section
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("section", section)
    .eq("active", true)
    .order("title")

  if (!pages || pages.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{title ?? section}</h1>
        <p className="text-muted-foreground">Contenido no disponible aún.</p>
      </div>
    )
  }

  // If only one page, show it directly
  if (pages.length === 1) {
    const page = pages[0]
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.content ? (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : page.html_content ? (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: page.html_content }}
          />
        ) : (
          <p className="text-muted-foreground">Contenido no disponible.</p>
        )}
      </div>
    )
  }

  // Multiple pages: list with content
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">{title ?? section}</h1>
      {pages.map((page) => (
        <article key={page.id} className="space-y-4">
          <h2 className="text-2xl font-semibold">{page.title}</h2>
          {page.content ? (
            <div
              className="prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : page.html_content ? (
            <div
              className="prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: page.html_content }}
            />
          ) : (
            <p className="text-muted-foreground">Contenido no disponible.</p>
          )}
        </article>
      ))}
    </div>
  )
}