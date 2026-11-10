"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, Mail, Phone, ChevronDown } from "lucide-react"

interface StaffMember {
  id: string
  section: string
  apellido: string
  nombre: string
  funcion: string
  sort_order: number
  email: string | null
  photo_url: string | null
  gender: string | null
}

function groupBySection(staff: StaffMember[]) {
  const sections: Record<string, StaffMember[]> = {}
  for (const member of staff) {
    if (!sections[member.section]) {
      sections[member.section] = []
    }
    sections[member.section].push(member)
  }
  return sections
}

function fullName(m: StaffMember) {
  return `${m.nombre}${m.apellido ? " " + m.apellido : ""}`.trim() || m.funcion
}

const WHATSAPP_NUMBER = "5493814567890"

function Avatar({ member, size = "md" }: { member: StaffMember; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-24 w-24" }
  const iconSizes = { sm: 16, md: 20, lg: 40 }

  if (member.photo_url) {
    return (
      <Image
        src={member.photo_url}
        alt={fullName(member)}
        width={size === "lg" ? 96 : size === "md" ? 44 : 36}
        height={size === "lg" ? 96 : size === "md" ? 44 : 36}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-[var(--border)]`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-muted flex items-center justify-center ring-1 ring-[var(--border)]`}>
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/60"
      >
        <circle cx="12" cy="8" r="4" />
        <path d={member.gender === "F"
          ? "M5.5 20.5c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5"
          : "M4 20.5c0-4 3.6-7.5 8-7.5s8 3.5 8 7.5"
        } />
      </svg>
    </div>
  )
}

function LeadershipCard({ member }: { member: StaffMember }) {
  const name = fullName(member)
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-card p-5 flex items-center gap-5">
      <Avatar member={member} size="lg" />
      <div className="min-w-0">
        <p className="font-semibold text-[1.125rem] leading-tight">{name}</p>
        <p className="text-accent font-medium mt-0.5">{member.funcion}</p>
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <Mail className="h-3.5 w-3.5" />
            {member.email}
          </a>
        )}
        <div className="mt-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Contáctame
          </a>
        </div>
      </div>
    </div>
  )
}

function StaffCard({ member }: { member: StaffMember }) {
  const name = fullName(member)
  const isLeader = member.funcion.toLowerCase().includes("coordinador") ||
    member.funcion.toLowerCase().includes("responsable") ||
    member.funcion.toLowerCase().includes("sub coordinador")

  return (
    <div className="px-3 py-2 flex items-center gap-2.5">
      <Avatar member={member} size="sm" />
      <div className="min-w-0 flex-1">
        <p className={`text-[0.9375rem] leading-tight truncate ${isLeader ? "font-medium" : ""}`}>
          {name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{member.funcion}</p>
      </div>
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={member.email}
        >
          <Mail className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}

export function CapitalHumanoClient({ staff }: { staff: StaffMember[] }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const sections = groupBySection(staff)
  const sortedSections = Object.entries(sections).sort(([a], [b]) => {
    if (a === "Dirección") return -1
    if (b === "Dirección") return 1
    return a.localeCompare(b, "es")
  })

  if (!staff || staff.length === 0) {
    return (
      <div className="container py-16 text-center text-muted-foreground">
        <Users className="mx-auto h-12 w-12 mb-4 opacity-40" />
        <p>Información de capital humano no disponible.</p>
      </div>
    )
  }

  const [leadershipSection, ...restSections] = sortedSections
  const leadership = leadershipSection?.[1] ?? []

  return (
    <div className="container py-8 space-y-10">
      {/* Page header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Capital Humano</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          La Dirección de Estadística de la Provincia (DEP) provee herramientas para la toma de
          decisiones conducentes al desarrollo provincial. Asume un rol protagónico, estratégico e
          insustituible en la elaboración, análisis e interpretación de información estadística como
          insumo básico para el diseño, formulación y evaluación de políticas públicas orientadas a
          la mejora de las condiciones de vida de la sociedad.
        </p>
      </div>

      {/* Dirección — hero cards */}
      {leadershipSection && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-5 text-foreground">
            {leadershipSection[0]}
          </h2>
          <div className="flex flex-wrap gap-5">
            {leadership.map((m) => (
              <LeadershipCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* Operative sections — collapsible cards */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-4 [&>div]:mb-4 [&>div]:break-inside-avoid">
        {restSections.map(([section, members]) => {
          const isOpen = expandedSection === section
          return (
            <div
              key={section}
              className="rounded-[var(--radius-md)] overflow-hidden bg-card border border-[var(--border)] hover:border-accent/30 transition-colors"
            >
              <button
                onClick={() => setExpandedSection(isOpen ? null : section)}
                className="w-full px-4 py-3 flex items-center justify-between bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <span className="text-sm font-semibold tracking-tight">{section}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="divide-y divide-[var(--border)]">
                  {members.map((m) => (
                    <StaffCard
                      key={m.id}
                      member={m}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}