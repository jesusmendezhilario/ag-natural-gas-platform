import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ComentariosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: proyecto } = await supabase.from("proyectos").select("nombre").eq("id", id).single()
  const { data: comentarios } = await supabase.from("comentarios").select("*, profiles(nombre, puesto)").eq("proyecto_id", id).order("created_at", { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href={"/dashboard/proyectos/" + id} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          {proyecto?.nombre}
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Comentarios</h1>
      </div>
      {comentarios && comentarios.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {comentarios.map((c: any) => (
            <div key={c.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#137ea8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {c.profiles?.nombre ? c.profiles.nombre[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{c.profiles?.nombre || "Usuario"}</p>
                    {c.profiles?.puesto && <p style={{ fontSize: "12px", color: "#64748b" }}>{c.profiles.puesto}</p>}
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {new Date(c.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{c.contenido}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
          <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin comentarios</p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>AG Natural Gas agregara comentarios sobre el avance del proyecto.</p>
        </div>
      )}
    </div>
  )
}