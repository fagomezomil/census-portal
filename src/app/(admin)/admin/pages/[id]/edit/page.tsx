"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PAGE_SECTIONS } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"

export default function EditPagePage() {
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
    section: "",
    content: "",
    active: true,
  })

  useEffect(() => {
    async function loadPage() {
      const { data } = await supabase
        .from("pages")
        .select("title, slug, section, content, active")
        .eq("id", id)
        .single()

      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          section: data.section ?? "",
          content: data.content ?? "",
          active: data.active ?? true,
        })
      }
    }
    loadPage()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("pages")
      .update({
        title: form.title,
        slug: form.slug,
        section: form.section || null,
        content: form.content || null,
        active: form.active,
      })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
      toast.error("Error al guardar los cambios")
      setLoading(false)
    } else {
      toast.success("Página actualizada correctamente")
      router.push("/admin/pages")
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error: deleteError } = await supabase
      .from("pages")
      .delete()
      .eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      toast.error("Error al eliminar la página")
      setDeleting(false)
    } else {
      toast.success("Página eliminada correctamente")
      router.push("/admin/pages")
    }
  }

  return (
    <AdminForm
      backHref="/admin/pages"
      backLabel="Páginas"
      title="Editar Página"
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

      <div className="space-y-2">
        <Label htmlFor="section">Sección</Label>
        <select
          id="section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="w-full h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 text-sm"
        >
          <option value="">Sin sección</option>
          {PAGE_SECTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
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
              Eliminar página
            </button>
          }
          title="¿Eliminar esta página?"
          description="Se eliminará la página permanentemente. Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </AdminForm>
  )
}