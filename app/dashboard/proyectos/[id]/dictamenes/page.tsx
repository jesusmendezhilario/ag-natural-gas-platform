import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import SendEmailButton from "@/app/components/SendEmailButton"

export default async function DictamenesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: proyecto } = await supabase.from("proyectos").select("nombre, empresas(razon_social)").eq("id", id).single()
  const { data: dictamenes } = await supabase.from("dictamenes_tecnicos").select("*").eq("proyecto_id", id).order("fecha_vencimiento")
  const { data: profile } = await supabase.from("profiles").select("correo").eq("id", user.id).single()
  const { data: admins } = await supabase.from("profiles").select("correo").eq("role", "admin")

  const adminEmails = admins?.map((a: any) => a.correo).filter(Boolean) || []
  const userEmail = profile?.correo || user.email || ""
  const empresaNombre = (proyecto as any)?.empresas?.razon_social || ""

  function diasRestantes(fecha: string) {
    return Math.ceil((new Date(fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href={"/dashboard/proyectos/" + id} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          {proyecto?.nombre}
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Dictamen Tecnico</h1>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>Recibiras un aviso por correo 1 mes antes del vencimiento.</p>
          </div>
          <SendEmailButton seccion="dictamenes" proyectoNombre={proyecto?.nombre || ""} empresaNombre={empresaNombre} adminEmails={adminEmails} userEmail={userEmail} items={dictamenes || []} />
        </div>
      </div>
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        {dictamenes && dictamenes.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Descripcion", "Emision", "Vencimiento", "Estado", "Archivo"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", padding: "12px 20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dictamenes.map((d: any, i: number) => {
                const dias = diasRestantes(d.fecha_vencimiento)
                const vencido = dias <= 0
                const urgente = dias > 0 && dias <= 30
                return (
                  <tr key={d.id} style={{ borderBottom: i < dictamenes.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "16px 20px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{d.descripcion || "-"}</td>
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{d.fecha_emision || "-"}</td>
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#1e293b", fontWeight: 500 }}>{d.fecha_vencimiento}</td>
                    <td style={{ padding: "16px 20px" }}>
                      {vencido ? (
                        <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "#fef2f2", color: "#c42d22", fontWeight: 500 }}>Vencido</span>
                      ) : urgente ? (
                        <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "#fefce8", color: "#854d0e", fontWeight: 500 }}>Vence en {dias} dias</span>
                      ) : (
                        <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "#dcfce7", color: "#15803d", fontWeight: 500 }}>Vigente</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {d.archivo_url ? (
                        <a href={d.archivo_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "#137ea8", textDecoration: "none", padding: "5px 12px", borderRadius: "6px", background: "#e8f4f8" }}>
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                          Descargar
                        </a>
                      ) : <span style={{ fontSize: "13px", color: "#94a3b8" }}>Sin archivo</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin dictamenes</p>
            <p style={{ color: "#64748b", fontSize: "13px" }}>AG Natural Gas agregara los dictamenes de este proyecto.</p>
          </div>
        )}
      </div>
    </div>
  )
}