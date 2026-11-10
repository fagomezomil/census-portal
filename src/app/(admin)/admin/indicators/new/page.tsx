"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FREQUENCIES } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"

export default function NewIndicatorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const slug = form.get("slug") as string
    const unit = form.get("unit") as string
    const frequency = form.get("frequency") as string
    const source = form.get("source") as string
    const description = form.get("description") as string

    const { error: insertError } = await supabase.from("indicators").insert({
      name,
      slug,
      unit: unit || null,
      frequency: frequency || null,
      source: source || null,
      description: description || null,
      active,
    })

    if (insertError) {
      setError(insertError.message)
      toast.error("Error al crear el indicador")
      setLoading(false)
    } else {
      toast.success("Indicador creado correctamente")
      router.push("/admin/indicators")
    }
  }

  return (
    <AdminForm
      backHref="/admin/indicators"
      backLabel="Indicadores"
      title="Nuevo Indicador"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" name="slug" required placeholder="ipc-tucuman" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Unidad</Label>
          <Input id="unit" name="unit" placeholder="% o $" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia</Label>
          <select
            id="frequency"
            name="frequency"
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
        <Input id="source" name="source" placeholder="DEP / INDEC" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={active} onCheckedChange={setActive} />
        <Label htmlFor="active">Activo</Label>
      </div>
    </AdminForm>
  )
}