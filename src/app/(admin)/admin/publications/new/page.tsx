"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PUBLICATION_TYPES } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"

export default function NewPublicationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(true)

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const title = form.get("title") as string
    const slug = form.get("slug") as string || generateSlug(title)
    const description = form.get("description") as string
    const publication_type = form.get("publication_type") as string
    const publication_date = form.get("publication_date") as string
    const source = form.get("source") as string
    const original_url = form.get("original_url") as string

    const { error: insertError } = await supabase.from("publications").insert({
      title,
      slug,
      description: description || null,
      publication_type: publication_type || null,
      publication_date: publication_date || null,
      source: source || null,
      original_url: original_url || null,
      active,
    })

    if (insertError) {
      setError(insertError.message)
      toast.error("Error al crear la publicación")
      setLoading(false)
    } else {
      toast.success("Publicación creada correctamente")
      router.push("/admin/publications")
    }
  }

  return (
    <AdminForm
      backHref="/admin/publications"
      backLabel="Publicaciones"
      title="Nueva Publicación"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          required
          onChange={(e) => {
            const slugInput = document.getElementById("slug") as HTMLInputElement
            if (slugInput && !slugInput.dataset.touched) {
              slugInput.value = generateSlug(e.target.value)
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="se-genera-automaticamente"
          onFocus={(e) => e.target.dataset.touched = "true"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publication_type">Tipo</Label>
          <select
            id="publication_type"
            name="publication_type"
            className="w-full h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 text-sm"
          >
            <option value="">Seleccionar</option>
            {PUBLICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication_date">Fecha de publicación</Label>
          <Input id="publication_date" name="publication_date" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Fuente</Label>
        <Input id="source" name="source" placeholder="DEP / INDEC" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="original_url">URL original</Label>
        <Input id="original_url" name="original_url" type="url" placeholder="https://..." />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={active} onCheckedChange={setActive} />
        <Label htmlFor="active">Activo</Label>
      </div>
    </AdminForm>
  )
}