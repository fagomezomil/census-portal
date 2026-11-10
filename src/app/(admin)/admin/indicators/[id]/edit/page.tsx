"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FREQUENCIES } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"

export default function EditIndicatorPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    unit: "",
    frequency: "",
    source: "",
    description: "",
    active: true,
  })

  useEffect(() => {
    async function loadIndicator() {
      const { data } = await supabase
        .from("indicators")
        .select("name, slug, unit, frequency, source, description, active")
        .eq("id", id)
        .single()

      if (data) {
        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          unit: data.unit ?? "",
          frequency: data.frequency ?? "",
          source: data.source ?? "",
          description: data.description ?? "",
          active: data.active ?? true,
        })
      }
    }
    loadIndicator()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("indicators")
      .update({
        name: form.name,
        slug: form.slug,
        unit: form.unit || null,
        frequency: form.frequency || null,
        source: form.source || null,
        description: form.description || null,
        active: form.active,
      })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
      toast.error("Error al guardar los cambios")
      setLoading(false)
    } else {
      toast.success("Indicador actualizado correctamente")
      router.push("/admin/indicators")
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error: deleteError } = await supabase
      .from("indicators")
      .delete()
      .eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      toast.error("Error al eliminar el indicador")
      setDeleting(false)
    } else {
      toast.success("Indicador eliminado correctamente")
      router.push("/admin/indicators")
    }
  }

  return (
    <AdminForm
      backHref="/admin/indicators"
      backLabel="Indicadores"
      title="Editar Indicador"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      onDelete={() => {}}
      deleting={deleting}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Unidad</Label>
          <Input
            id="unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="% o $"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia</Label>
          <select
            id="frequency"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="w-full h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 text-sm"
          >
            <option value="">Seleccionar</option>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
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
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
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
            <button
              type="button"
              className="text-sm text-destructive hover:underline"
            >
              Eliminar indicador
            </button>
          }
          title="¿Eliminar este indicador?"
          description="Se eliminará el indicador y todos sus datos asociados. Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </AdminForm>
  )
}