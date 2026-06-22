"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/admin", label: "Inicio", icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: "/admin/empresas", label: "Empresas", icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { href: "/admin/proyectos", label: "Proyectos", icon: (
   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  )},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <aside style={{
        width: "240px", minHeight: "100vh", background: "#1e293b",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 50
      }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.webp" alt="AG Natural Gas" style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px" }} />
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, color: "white", fontSize: "14px", lineHeight: 1.2 }}>Panel Admin</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>AG Natural Gas</div>
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 8px", borderRadius: "4px", background: "#e6392c" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "white", letterSpacing: "0.05em", textTransform: "uppercase" }}>Administrador</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", marginBottom: "2px",
              color: isActive(item.href) ? "white" : "rgba(255,255,255,0.5)",
              background: isActive(item.href) ? "rgba(255,255,255,0.1)" : "transparent",
              textDecoration: "none", fontSize: "14px", fontWeight: isActive(item.href) ? 500 : 400,
              transition: "all 0.15s"
            }}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "13px",
            cursor: "pointer", fontFamily: "Manrope, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: "240px", flex: 1, minHeight: "100vh" }}>
        <main style={{ padding: "40px 48px", maxWidth: "1100px" }}>
          {children}
        </main>
      </div>
    </div>
  )
}