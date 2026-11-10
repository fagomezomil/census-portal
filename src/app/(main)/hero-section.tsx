"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LoadChoreography } from "@/components/animations"

export function HeroSection() {
  return (
    <LoadChoreography className="py-16 md:py-24 text-center">
      <h1 className="hero-title text-foreground">
        Dirección de Estadística
        <br />
        <span className="text-[var(--accent)]">Provincia de Tucumán</span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Datos estadísticos oficiales de Tucumán. Indicadores económicos,
        publicaciones, datasets y más.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/indicadores"
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 transition-colors"
        >
          Ver Indicadores
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/publicaciones"
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-6 py-3 text-sm font-medium text-foreground hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          Publicaciones
        </Link>
      </div>
    </LoadChoreography>
  )
}