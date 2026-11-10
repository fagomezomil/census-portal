"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PAGE_SECTIONS } from "@/lib/admin-constants"
import { AdminForm } from "@/components/admin/admin-form"

export default function NewPagePage() {
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
    const section = form.get("section") as string
    const content = form.get("content") as string

    const { error: insertError } = await supabase.from("pages").insert({
      title,
      slug,
      section: section || null,
      content: content || null,
      active,
    })

    if (insertError) {
      setError(insertError.message)
      toast.error("Error al crear la página")
      setLoading(false)
    } else {
      toast.success("Página creada correctamente")
      router.push("/admin/pages")
    }
  }

  return (
    <AdminForm
      backHref="/admin/pages"
      backLabel="Páginas"
      title="Nueva Página"
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

      <div className="space-y-2">
        <Label htmlFor="section">Sección</Label>
        <select
          id="section"
          name="section"
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
        <Textarea id="content" name="content" rows={6} />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={active} onCheckedChange={setActive} />
        <Label htmlFor="active">Activo</Label>
      </div>
    </AdminForm>
  )
}