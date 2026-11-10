import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default async function PublicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; tipo?: string; q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("publications")
    .select("id, title, slug, publication_date, publication_type, file_type, categories(name)")
    .eq("active", true)
    .order("publication_date", { ascending: false })
    .limit(50)

  if (params.tipo) {
    query = query.eq("publication_type", params.tipo)
  }

  const [{ data: publications }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id, name, slug").order("name"),
  ])

  const publicationTypes = [
    { value: "informe", label: "Informe" },
    { value: "serie", label: "Serie" },
    { value: "gacetilla", label: "Gacetilla" },
    { value: "anuario", label: "Anuario" },
    { value: "boletin", label: "Boletín" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Publicaciones</h1>
        <p className="mt-2 text-muted-foreground">
          Explore las publicaciones estadísticas de la Provincia de Tucumán
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar publicaciones..."
          className="max-w-sm"
          name="q"
          defaultValue={params.q}
        />
        <select
          name="tipo"
          defaultValue={params.tipo ?? ""}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          {publicationTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {publications?.map((pub) => (
          <Link
            key={pub.id}
            href={`/publicaciones/${pub.slug}`}
            className="block rounded-lg border p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium leading-snug">{pub.title}</h3>
                <div className="flex flex-wrap gap-2">
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
              {pub.publication_date && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(pub.publication_date).toLocaleDateString("es-AR")}
                </span>
              )}
            </div>
          </Link>
        ))}

        {(!publications || publications.length === 0) && (
          <p className="text-muted-foreground">
            No se encontraron publicaciones.
          </p>
        )}
      </div>
    </div>
  )
}