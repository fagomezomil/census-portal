"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PUBLICATION_TYPES } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"

export default function EditPublicationPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    publication_type: "",
    publication_date: "",
    source: "",
    original_url: "",
    active: true,
  })

  useEffect(() => {
    async function loadPublication() {
      const { data } = await supabase
        .from("publications")
        .select("title, slug, description, publication_type, publication_date, source, original_url, active")
        .eq("id", id)
        .single()

      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          description: data.description ?? "",
          publication_type: data.publication_type ?? "",
          publication_date: data.publication_date ?? "",
          source: data.source ?? "",
          original_url: data.original_url ?? "",
          active: data.active ?? true,
        })
      }
    }
    loadPublication()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("publications")
      .update({
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        publication_type: form.publication_type || null,
        publication_date: form.publication_date || null,
        source: form.source || null,
        original_url: form.original_url || null,
        active: form.active,
      })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
      toast.error("Error al guardar los cambios")
      setLoading(false)
    } else {
      toast.success("Publicación actualizada correctamente")
      router.push("/admin/publications")
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error: deleteError } = await supabase
      .from("publications")
      .delete()
      .eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      toast.error("Error al eliminar la publicación")
      setDeleting(false)
    } else {
      toast.success("Publicación eliminada correctamente")
      router.push("/admin/publications")
    }
  }

  return (
    <AdminForm
      backHref="/admin/publications"
      backLabel="Publicaciones"
      title="Editar Publicación"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publication_type">Tipo</Label>
          <select
            id="publication_type"
            value={form.publication_type}
            onChange={(e) => setForm({ ...form, publication_type: e.target.value })}
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
          <Input
            id="publication_date"
            type="date"
            value={form.publication_date}
            onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Fuente</Label>
        <Input
          id="source"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="DEP / INDEC"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="original_url">URL original</Label>
        <Input
          id="original_url"
          type="url"
          value={form.original_url}
          onChange={(e) => setForm({ ...form, original_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="active"
          checked={form.active}
          onCheckedChange={(checked) => setForm({ ...form, active: checked })}
        />
        <Label htmlFor="active">Activo</Label>
      </div>

      <div className="pt-2">
        <DeleteDialog
          trigger={
            <button type="button" className="text-sm text-destructive hover:underline">
              Eliminar publicación
            </button>
          }
          title="¿Eliminar esta publicación?"
          description="Se eliminará la publicación permanentemente. Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </AdminForm>
  )
}