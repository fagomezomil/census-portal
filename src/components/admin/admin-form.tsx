"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminFormProps {
  backHref: string
  backLabel: string
  title: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
  error?: string | null
  onDelete?: () => void
  deleting?: boolean
  children: React.ReactNode
}

export function AdminForm({
  backHref,
  backLabel,
  title,
  onSubmit,
  loading = false,
  error,
  onDelete,
  deleting = false,
  children,
}: AdminFormProps) {
  const router = useRouter()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {backLabel}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      <form onSubmit={onSubmit} className="max-w-lg space-y-4">
        {children}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Link
            href={backHref}
            className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            Cancelar
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="ml-auto text-sm text-destructive hover:underline disabled:opacity-50"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}