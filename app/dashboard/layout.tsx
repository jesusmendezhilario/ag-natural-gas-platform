"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: "/dashboard/proyectos", label: "Proyectos", icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  )},
  { href: "/dashboard/perfil", label: "Mi perfil", icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [empresa, setEmpresa] = useState("")
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      const { data: p } = await supabase.from("profiles").select("nombre, empresas(razon_social)").eq("id", user.id).single()
      if (p) {
        setNombre(p.nombre || "Usuario")
        setEmpresa((p as any).empresas?.razon_social || "")
      }
      setLoading(false)
    }
    cargar()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isActive = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <aside style={{
        width: "240px", minHeight: "100vh", background: "#0d5f80",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 50
      }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.webp" alt="AG Natural Gas" style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px" }} />
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, color: "white", fontSize: "14px", lineHeight: 1.2 }}>Portal de Proyectos</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>AG Natural Gas</div>
            </div>
          </div>
        </div>

        {empresa && (
          <div style={{ margin: "16px", padding: "10px 12px", background: "rgba(255,255,255,0.08)", borderRadius: "8px", borderLeft: "3px solid #137ea8" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Empresa activa</div>
            <div style={{ fontSize: "12px", color: "white", fontWeight: 500, lineHeight: 1.3 }}>{empresa}</div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", marginBottom: "2px",
              color: isActive(item.href) ? "white" : "rgba(255,255,255,0.55)",
              background: isActive(item.href) ? "rgba(255,255,255,0.12)" : "transparent",
              textDecoration: "none", fontSize: "14px", fontWeight: isActive(item.href) ? 500 : 400,
              transition: "all 0.15s"
            }}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", background: "#137ea8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 600, color: "white"
            }}>{nombre ? nombre[0].toUpperCase() : "U"}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "white" }}>{nombre}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Empresa</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "13px",
            cursor: "pointer", fontFamily: "Manrope, sans-serif"
          }}>Cerrar sesión</button>
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