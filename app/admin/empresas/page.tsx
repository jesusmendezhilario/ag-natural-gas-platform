"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EmpresasPage() {
  const router = useRouter()
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState<string | null>(null)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const supabase = createClient()
    const { data } = await supabase.from("empresas").select("*").order("razon_social")
    setEmpresas(data || [])
    setLoading(false)
  }

  async function eliminar(id: string, nombre: string) {
    if (!confirm("Eliminar " + nombre + "? Esta accion no se puede deshacer.")) return
    setEliminando(id)
    const supabase = createClient()
    await supabase.from("proyectos").delete().eq("empresa_id", id)
    await supabase.from("profiles").update({ empresa_id: null }).eq("empresa_id", id)
    await supabase.from("empresas").delete().eq("id", id)
    await cargar()
    setEliminando(null)
  }

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>Cargando...</div>

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Empresas</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{empresas.length} empresas registradas</p>
        </div>
        <Link href="/admin/empresas/nueva" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: "#137ea8", color: "white", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva empresa
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        {empresas.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Empresa", "RFC", "Direccion", "Estado", "Acciones"].map(h => (
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
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{e.rfc || "-"}</td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.direccion || "-"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: e.activo ? "#dcfce7" : "#f1f5f9", color: e.activo ? "#15803d" : "#64748b", fontWeight: 500 }}>
                      {e.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href={"/admin/empresas/" + e.id} style={{ fontSize: "13px", fontWeight: 500, color: "#137ea8", textDecoration: "none", padding: "5px 12px", borderRadius: "6px", background: "#e8f4f8" }}>
                        Gestionar
                      </Link>
                      <button onClick={() => eliminar(e.id, e.razon_social)} disabled={eliminando === e.id} style={{ fontSize: "13px", fontWeight: 500, color: "#e6392c", background: "#fef2f2", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "Manrope, sans-serif" }}>
                        {eliminando === e.id ? "..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin empresas</p>
            <Link href="/admin/empresas/nueva" style={{ fontSize: "13px", color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Crear primera empresa</Link>
          </div>
        )}
      </div>
    </div>
  )
}