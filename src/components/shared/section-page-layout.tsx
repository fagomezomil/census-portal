"use client"

import { type ReactNode } from "react"
import { ScrollReveal } from "@/components/animations"

interface SectionPageLayoutProps {
  title: string
  description?: string
  children: ReactNode
  /** Optional indicators row rendered between title and children */
  indicators?: ReactNode
}

export function SectionPageLayout({
  title,
  description,
  indicators,
  children,
}: SectionPageLayoutProps) {
  return (
    <div className="space-y-10">
      <ScrollReveal>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
      </ScrollReveal>
      {indicators}
      {children}
    </div>
  )
}