"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { formatBarValue as formatBarValueUtil, calcVariation } from "@/lib/indicators"

export interface BarItem {
  slug: string
  name: string
  unit: string
  value: number | null
  period: string | null
  variation: number | null
}

const SHORT_NAMES: Record<string, string> = {
  "ipc-tucuman": "IPC",
  "tasa-desocupacion": "Desocupación",
  "tasa-informalidad": "Informalidad",
  "canasta-basica-alimentaria": "CBA",
  "pobreza-personas": "Pobreza",
}


type NavLink = { href: string; label: string }
type NavDropdown = { label: string; links: NavLink[] }
type NavItem = NavLink | NavDropdown

const navItems: NavItem[] = [
  { href: "/", label: "Inicio" },
  {
    label: "Institucional",
    links: [
      { href: "/institucional/capital-humano", label: "Capital Humano" },
      { href: "/institucional", label: "Quiénes somos" },
      { href: "/institucional/objetivos", label: "Objetivos" },
      { href: "/institucional/historia", label: "Historia" },
    ],
  },
  {
    label: "Operativos en Calle",
    links: [
      { href: "/operativos", label: "Verificación de Encuestadores" },
    ],
  },
  {
    label: "Indicadores",
    links: [
      { href: "/economia", label: "Economía" },
      { href: "/sociedad", label: "Sociedad" },
      { href: "/poblacion", label: "Población" },
      { href: "/publicaciones", label: "Publicaciones" },
      { href: "/indicadores", label: "Ver todos" },
    ],
  },
  { href: "/censo", label: "Censo 2022" },
  { href: "/datasets", label: "Datasets" },
  {
    label: "Contacto",
    links: [
      { href: "/contacto", label: "Consulta" },
      { href: "/contacto/solicitud-de-datos", label: "Solicitud de Datos" },
    ],
  },
]

export function HeaderClient({ items }: { items: BarItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Indicator bar */}
      <div className="indicator-bar">
        <div className="container flex items-center justify-between px-4 md:px-6 h-8 text-xs">
          <div className="flex items-center gap-4 overflow-x-auto">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/indicadores/${item.slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {SHORT_NAMES[item.slug] || item.name}{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatBarValueUtil(item.value ?? 0, item.unit)}
                  {item.unit === "$" ? "" : item.unit}
                </span>
                {item.variation != null && (
                  <span className={item.variation > 0 ? "delta-positive ml-0.5" : "delta-negative ml-0.5"} style={{ fontSize: "0.65rem" }}>
                    {item.variation > 0 ? "+" : ""}
                    {item.variation.toFixed(1)}%
                  </span>
                )}
              </Link>
            ))}
          </div>
          <span className="text-muted-foreground hidden lg:inline">
            Fuente: DEP / INDEC
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="border-b border-[var(--border)]">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logos/secretaria-gestion-publica.png"
              alt="Secretaria de Gestión Pública de Tucumán"
              className="h-28 w-auto object-contain"
            />

          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => {
              if ("href" in item) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-[var(--radius-sm)]"
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <div key={item.label} className="group/dropdown relative">
                  <span
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-[var(--radius-sm)] cursor-default"
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </span>
                  <div className="absolute top-full right-0 pt-2 z-50 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-opacity duration-150">
                  <div className="w-56 bg-card border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm py-1">
                    {item.links.map((link) => (
                      <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-[var(--radius-sm)] hover:bg-muted transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-1 mt-8">
                {navItems.map((item) => {
                  if ("href" in item) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-[var(--radius-sm)]"
                      >
                        {item.label}
                      </Link>
                    )
                  }
                  return (
                    <div key={item.label}>
                      <div className="px-3 py-1 mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </div>
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2 pl-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-[var(--radius-sm)]"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}