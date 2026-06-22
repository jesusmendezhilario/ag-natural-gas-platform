import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function EmpresaAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: empresa } = await supabase.from("empresas").select("*").eq("id", id).single()
  if (!empresa) redirect("/admin/empresas")

  const { data: proyectos } = await supabase.from("proyectos").select("*").eq("empresa_id", id).order("created_at", { ascending: false })
  const { data: contactos } = await supabase.from("profiles").select("*").eq("empresa_id", id)

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/admin/empresas" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Empresas
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>{empresa.razon_social}</h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{empresa.rfc || "Sin RFC"}</p>
          </div>
          <span style={{ fontSize: "12px", padding: "5px 14px", borderRadius: "20px", background: empresa.activo ? "#dcfce7" : "#f1f5f9", color: empresa.activo ? "#15803d" : "#64748b", fontWeight: 500, marginTop: "6px" }}>
            {empresa.activo ? "Activa" : "Inactiva"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>Informacion</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Razon social", value: empresa.razon_social },
              { label: "RFC", value: empresa.rfc },
              { label: "Registro patronal", value: empresa.registro_patronal },
              { label: "Direccion", value: empresa.direccion },
              { label: "Telefono", value: empresa.telefono },
            ].map((f, i) => (
              <div key={i}>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>{f.label}</p>
                <p style={{ fontSize: "14px", color: f.value ? "#1e293b" : "#94a3b8" }}>{f.value || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>Contactos ({contactos?.length || 0})</h2>
          {contactos && contactos.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {contactos.map((c: any) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#e8f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#137ea8", flexShrink: 0 }}>
                    {c.nombre ? c.nombre[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1e293b" }}>{c.nombre || "Sin nombre"}</p>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>{c.puesto || c.correo || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>Sin contactos registrados</p>
          )}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Proyectos ({proyectos?.length || 0})</h2>
          <Link href={"/admin/empresas/" + id + "/proyectos/nuevo"} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#137ea8", color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo proyecto
          </Link>
        </div>
        {proyectos && proyectos.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Proyecto", "Inicio", "Estado", "Acciones"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", padding: "12px 20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p: any, i: number) => (
                <tr key={p.id} style={{ borderBottom: i < proyectos.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "16px 20px", fontSize: "14px", fontWeight: 500, color: "#1e293b" }}>{p.nombre}</td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{p.fecha_inicio || "-"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: p.activo ? "#dcfce7" : "#f1f5f9", color: p.activo ? "#15803d" : "#64748b", fontWeight: 500 }}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <Link href={"/admin/proyectos/" + p.id} style={{ fontSize: "13px", fontWeight: 500, color: "#137ea8", textDecoration: "none", padding: "5px 12px", borderRadius: "6px", background: "#e8f4f8" }}>
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "14px" }}>No hay proyectos para esta empresa.</p>
          </div>
        )}
      </div>
    </div>
  )
}