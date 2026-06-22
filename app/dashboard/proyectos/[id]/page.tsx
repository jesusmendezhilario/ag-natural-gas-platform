import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const secciones = [
  { key: "facturas", label: "Facturas", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#137ea8", bg: "#e8f4f8" },
  { key: "presupuestos", label: "Presupuestos", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#137ea8", bg: "#e8f4f8" },
  { key: "dictamenes", label: "Dictamen tecnico", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#e6392c", bg: "#fef2f2" },
  { key: "estimaciones", label: "Estimaciones", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", color: "#137ea8", bg: "#e8f4f8" },
  { key: "fotografias", label: "Fotografias", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#137ea8", bg: "#e8f4f8" },
  { key: "comentarios", label: "Comentarios", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "#137ea8", bg: "#e8f4f8" },
]

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: proyecto } = await supabase.from("proyectos").select("*, informacion_proyecto(*)").eq("id", id).single()
  if (!proyecto) redirect("/dashboard/proyectos")

  const [facturas, presupuestos, dictamenes, estimaciones, fotografias, comentarios] = await Promise.all([
    supabase.from("facturas").select("*", { count: "exact" }).eq("proyecto_id", id),
    supabase.from("presupuestos").select("*", { count: "exact" }).eq("proyecto_id", id),
    supabase.from("dictamenes_tecnicos").select("*", { count: "exact" }).eq("proyecto_id", id),
    supabase.from("estimaciones").select("*", { count: "exact" }).eq("proyecto_id", id),
    supabase.from("fotografias").select("*", { count: "exact" }).eq("proyecto_id", id),
    supabase.from("comentarios").select("*", { count: "exact" }).eq("proyecto_id", id),
  ])

  const counts: Record<string, number> = {
    facturas: facturas.count || 0,
    presupuestos: presupuestos.count || 0,
    dictamenes: dictamenes.count || 0,
    estimaciones: estimaciones.count || 0,
    fotografias: fotografias.count || 0,
    comentarios: comentarios.count || 0,
  }

  const info = proyecto.informacion_proyecto

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard/proyectos" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Proyectos
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>{proyecto.nombre}</h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{proyecto.descripcion || "Sin descripcion"}</p>
          </div>
          <span style={{ fontSize: "12px", padding: "5px 14px", borderRadius: "20px", background: proyecto.activo ? "#dcfce7" : "#f1f5f9", color: proyecto.activo ? "#15803d" : "#64748b", fontWeight: 500, marginTop: "6px" }}>
            {proyecto.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {info && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px 24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "16px" }}>Informacion del proyecto</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { label: "Tipo de obra", value: info.tipo_obra },
              { label: "Ubicacion", value: info.ubicacion },
              { label: "Responsable", value: info.responsable },
              { label: "Norma aplicable", value: info.norma_aplicable },
              { label: "Capacidad", value: info.capacidad },
              { label: "Estado", value: info.estado },
            ].filter(f => f.value).map((f, i) => (
              <div key={i}>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{f.label}</p>
                <p style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {secciones.map(s => (
          <Link key={s.key} href={"/dashboard/proyectos/" + id + "/" + s.key} style={{
            display: "block", background: "white", borderRadius: "12px",
            border: "1px solid #e2e8f0", padding: "20px 20px 16px",
            textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" fill="none" stroke={s.color} strokeWidth="2" viewBox="0 0 24 24">
                  <path d={s.icon}/>
                </svg>
              </div>
              <span style={{ fontSize: "24px", fontWeight: 700, color: s.color, fontFamily: "Archivo, sans-serif" }}>{counts[s.key]}</span>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "2px" }}>{s.label}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>Ver documentos</p>
          </Link>
        ))}
      </div>
    </div>
  )
}