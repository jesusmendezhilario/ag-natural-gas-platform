import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ProyectosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("empresa_id").eq("id", user.id).single()
  const { data: proyectos } = await supabase.from("proyectos").select("*").eq("empresa_id", profile?.empresa_id).order("created_at", { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Proyectos</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{proyectos?.length || 0} proyectos asignados</p>
      </div>

      {proyectos && proyectos.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {proyectos.map((p: any) => (
            <Link key={p.id} href={"/dashboard/proyectos/" + p.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "white", borderRadius: "12px", padding: "20px 24px",
              border: "1px solid #e2e8f0", textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color 0.15s, box-shadow 0.15s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px", background: "#e8f4f8",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <svg width="20" height="20" fill="none" stroke="#137ea8" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>{p.nombre}</p>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{p.descripcion || "Sin descripción"}</p>
                  {p.fecha_inicio && (
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Inicio: {p.fecha_inicio}</p>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{
                  fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: 500,
                  background: p.activo ? "#dcfce7" : "#f1f5f9",
                  color: p.activo ? "#15803d" : "#64748b"
                }}>{p.activo ? "Activo" : "Inactivo"}</span>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{
          background: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
          padding: "64px 24px", textAlign: "center"
        }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#e8f4f8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="22" fill="none" stroke="#137ea8" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
          </div>
          <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin proyectos aún</p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>AG Natural Gas asignará tus proyectos próximamente.</p>
        </div>
      )}
    </div>
  )
}