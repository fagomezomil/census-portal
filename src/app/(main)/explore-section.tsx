"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/animations"

const SECTIONS = [
  {
    href: "/economia",
    title: "Economía",
    description:
      "Precios, canasta básica, mercado laboral, comercio exterior, PBG y más.",
  },
  {
    href: "/sociedad",
    title: "Sociedad",
    description:
      "Pobreza, indigencia, condiciones de vida, educación, estadísticas vitales.",
  },
  {
    href: "/poblacion",
    title: "Población",
    description:
      "Censos, demografía, proyecciones y estadísticas vitales.",
  },
]

export function ExploreSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Explorar datos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SECTIONS.map((section, i) => (
          <ScrollReveal key={section.href} delay={i * 0.08} amount={0.1}>
            <Link
              href={section.href}
              className="block rounded-[var(--radius-md)] border border-[var(--border)] p-6 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-colors h-full"
            >
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {section.description}
              </p>
              <span className="text-sm text-[var(--accent)] mt-3 inline-flex items-center gap-1">
                Ver sección <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}