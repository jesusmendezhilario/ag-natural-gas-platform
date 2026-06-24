"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

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
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  const navContent = (
    <>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.webp" alt="AG Natural Gas" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px" }} />
          <div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, color: "white", fontSize: "14px", lineHeight: 1.2 }}>Panel Admin</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>AG Natural Gas</div>
          </div>
        </div>
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "4px", background: "#e6392c" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "white", letterSpacing: "0.05em", textTransform: "uppercase" }}>Administrador</span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "8px", marginBottom: "2px",
            color: isActive(item.href) ? "white" : "rgba(255,255,255,0.5)",
            background: isActive(item.href) ? "rgba(255,255,255,0.1)" : "transparent",
            textDecoration: "none", fontSize: "14px", fontWeight: isActive(item.href) ? 500 : 400,
          }}>
            {item.icon}{item.label}
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
          Cerrar sesion
        </button>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        .adm-sidebar { display: flex; }
        .adm-topbar { display: none; }
        .adm-main { margin-left: 240px; padding: 40px 48px; }
        @media (max-width: 768px) {
          .adm-sidebar { display: none; }
          .adm-topbar { display: flex; }
          .adm-main { margin-left: 0; padding: 72px 16px 24px; }
        }
      `}</style>

      <div className="adm-topbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1e293b", padding: "12px 16px", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.08)", boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.webp" alt="AG" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px" }} />
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, color: "white", fontSize: "14px" }}>Panel Admin</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "8px",
          padding: "8px", cursor: "pointer", color: "white", display: "flex", alignItems: "center"
        }}>
          {menuOpen
            ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.5)", overflowX: "hidden"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "260px", maxWidth: "80vw", height: "100%", background: "#1e293b",
            display: "flex", flexDirection: "column", paddingTop: "56px", overflowY: "auto"
          }}>
            {navContent}
          </div>
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <aside className="adm-sidebar" style={{
          width: "240px", minHeight: "100vh", background: "#1e293b",
          flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 50
        }}>
          {navContent}
        </aside>
        <div style={{ flex: 1 }}>
          <main className="adm-main" style={{ maxWidth: "1100px" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}