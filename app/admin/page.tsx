import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: empresas } = await supabase.from("empresas").select("*").eq("activo", true)
  const { data: proyectos } = await supabase.from("proyectos").select("*").eq("activo", true)

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>Panel de administración</p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Resumen general</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Total empresas</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#137ea8", fontFamily: "Archivo, sans-serif" }}>{empresas?.length || 0}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Total proyectos</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#137ea8", fontFamily: "Archivo, sans-serif" }}>{proyectos?.length || 0}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Link href="/admin/empresas/nueva" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "8px", background: "#137ea8",
            color: "white", fontSize: "14px", fontWeight: 600, textDecoration: "none"
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva empresa
          </Link>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Empresas registradas</h2>
          <Link href="/admin/empresas" style={{ fontSize: "13px", color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Ver todas →</Link>
        </div>
        {empresas && empresas.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Empresa", "RFC", "Teléfono", "Acciones"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", padding: "12px 20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empresas.map((e: any, i: number) => (
                <tr key={e.id} style={{ borderBottom: i < empresas.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#137ea8" }}>
                        {e.razon_social[0]}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#1e293b" }}>{e.razon_social}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{e.rfc || "—"}</td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{e.telefono || "—"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <Link href={"/admin/empresas/" + e.id} style={{ fontSize: "13px", fontWeight: 500, color: "#137ea8", textDecoration: "none", padding: "5px 12px", borderRadius: "6px", background: "#e8f4f8" }}>
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin empresas</p>
            <Link href="/admin/empresas/nueva" style={{ fontSize: "13px", color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Crear primera empresa →</Link>
          </div>
        )}
      </div>
    </div>
  )
}