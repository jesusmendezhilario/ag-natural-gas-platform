"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function NuevoProyectoPage() {
  const router = useRouter()
  const params = useParams()
  const empresaId = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  async function handleSubmit() {
    if (!nombre) { setError("El nombre es obligatorio"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.from("proyectos").insert({ empresa_id: empresaId, nombre, descripcion, fecha_inicio: fechaInicio || null, fecha_fin: fechaFin || null, activo: true })
    if (error) { setError("Error: " + error.message); setLoading(false); return }
    router.push("/admin/empresas/" + empresaId)
  }

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" } as React.CSSProperties

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href={"/admin/empresas/" + empresaId} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Empresa
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Nuevo proyecto</h1>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Nombre del proyecto *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del proyecto" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción del proyecto" rows={3} style={{...inputStyle, resize: "vertical"}} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Fecha de inicio</label>
              <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fecha de fin</label>
              <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <Link href={"/admin/empresas/" + empresaId} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#374151", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center" }}>
              Cancelar
            </Link>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: loading ? "#0d5f80" : "#137ea8", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Manrope, sans-serif" }}>
              {loading ? "Creando..." : "Crear proyecto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}