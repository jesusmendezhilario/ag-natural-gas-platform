"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ProyectosAdminPage() {
  const [proyectos, setProyectos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState<string | null>(null)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const supabase = createClient()
    const { data } = await supabase.from("proyectos").select("*, empresas(razon_social)").order("created_at", { ascending: false })
    setProyectos(data || [])
    setLoading(false)
  }

  async function eliminar(id: string, nombre: string) {
    if (!confirm("Eliminar proyecto " + nombre + "? Esta accion eliminara todos sus documentos y no se puede deshacer.")) return
    setEliminando(id)
    const supabase = createClient()
    await supabase.from("facturas").delete().eq("proyecto_id", id)
    await supabase.from("presupuestos").delete().eq("proyecto_id", id)
    await supabase.from("dictamenes_tecnicos").delete().eq("proyecto_id", id)
    await supabase.from("estimaciones").delete().eq("proyecto_id", id)
    await supabase.from("fotografias").delete().eq("proyecto_id", id)
    await supabase.from("comentarios").delete().eq("proyecto_id", id)
    await supabase.from("informacion_proyecto").delete().eq("proyecto_id", id)
    await supabase.from("proyectos").delete().eq("id", id)
    await cargar()
    setEliminando(null)
  }

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>Cargando...</div>

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Proyectos</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{proyectos.length} proyectos registrados</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        {proyectos.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Proyecto", "Empresa", "Inicio", "Estado", "Acciones"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", padding: "12px 20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p: any, i: number) => (
                <tr key={p.id} style={{ borderBottom: i < proyectos.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "16px 20px", fontSize: "14px", fontWeight: 500, color: "#1e293b" }}>{p.nombre}</td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{p.empresas?.razon_social || "-"}</td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>{p.fecha_inicio || "-"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: p.activo ? "#dcfce7" : "#f1f5f9", color: p.activo ? "#15803d" : "#64748b", fontWeight: 500 }}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href={"/admin/proyectos/" + p.id} style={{ fontSize: "13px", fontWeight: 500, color: "#137ea8", textDecoration: "none", padding: "5px 12px", borderRadius: "6px", background: "#e8f4f8" }}>
                        Gestionar
                      </Link>
                      <button onClick={() => eliminar(p.id, p.nombre)} disabled={eliminando === p.id} style={{ fontSize: "13px", fontWeight: 500, color: "#e6392c", background: "#fef2f2", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "Manrope, sans-serif" }}>
                        {eliminando === p.id ? "..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin proyectos</p>
            <p style={{ color: "#64748b", fontSize: "13px" }}>Crea empresas y agrega proyectos desde cada empresa.</p>
          </div>
        )}
      </div>
    </div>
  )
}