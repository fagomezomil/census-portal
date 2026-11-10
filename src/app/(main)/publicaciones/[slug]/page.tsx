import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

export default async function PublicacionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pub } = await supabase
    .from("publications")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("active", true)
    .single()

  if (!pub) notFound()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {pub.publication_type && (
            <Badge variant="outline">{pub.publication_type}</Badge>
          )}
          {pub.file_type && (
            <Badge variant="secondary" className="uppercase">
              {pub.file_type}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{pub.title}</h1>
        {pub.description && (
          <p className="mt-2 text-muted-foreground">{pub.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {pub.publication_date && (
          <div>
            <span className="text-muted-foreground">Fecha:</span>{" "}
            {new Date(pub.publication_date).toLocaleDateString("es-AR")}
          </div>
        )}
        {pub.categories?.name && (
          <div>
            <span className="text-muted-foreground">Categoría:</span>{" "}
            {pub.categories.name}
          </div>
        )}
        {pub.source && (
          <div>
            <span className="text-muted-foreground">Fuente:</span> {pub.source}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {pub.original_url && (
          <a
            href={pub.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Descargar ({pub.file_type?.toUpperCase() ?? "Archivo"})
          </a>
        )}
      </div>
    </div>
  )
}