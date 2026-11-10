"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/animations"

interface Publication {
  id: string
  title: string
  slug: string
  publication_date: string | null
  publication_type: string | null
  file_type: string | null
}

interface RecentPublicationsProps {
  publications: Publication[]
}

export function RecentPublications({ publications }: RecentPublicationsProps) {
  if (publications.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Publicaciones Recientes</h2>
        <Link
          href="/publicaciones"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publications.map((pub, i) => (
          <ScrollReveal key={pub.id} delay={i * 0.05} amount={0.1}>
            <Card className="hover:border-[var(--accent)] transition-colors h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {pub.publication_type ?? "documento"}
                  </Badge>
                  {pub.file_type && (
                    <Badge variant="secondary" className="text-xs uppercase">
                      {pub.file_type}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base leading-snug">
                  {pub.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pub.publication_date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(pub.publication_date).toLocaleDateString("es-AR")}
                  </p>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}