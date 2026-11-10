"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  BookOpen,
  ArrowLeft,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/indicators", label: "Indicadores", icon: BarChart3 },
  { href: "/admin/pages", label: "Páginas", icon: BookOpen },
  { href: "/admin/publications", label: "Publicaciones", icon: FileText },
  { href: "/admin/staff", label: "Capital Humano", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r border-[var(--border)] bg-[var(--card)] flex flex-col">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/admin" className="font-bold text-lg tracking-tight">
          DEP Admin
        </Link>
        <p className="text-xs text-muted-foreground">Panel de gestión</p>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-[var(--radius-sm)] transition-colors ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-[var(--muted)]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-[var(--border)]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-[var(--radius-sm)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  )
}