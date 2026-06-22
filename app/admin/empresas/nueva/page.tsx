"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NuevaEmpresaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [razonSocial, setRazonSocial] = useState("")
  const [rfc, setRfc] = useState("")
  const [registroPatronal, setRegistroPatronal] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")

  async function handleSubmit() {
    if (!razonSocial) { setError("La razón social es obligatoria"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.from("empresas").insert({ razon_social: razonSocial, rfc, registro_patronal: registroPatronal, direccion, telefono, activo: true })
    if (error) { setError("Error: " + error.message); setLoading(false); return }
    router.push("/admin/empresas")
  }

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" } as React.CSSProperties

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/admin/empresas" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Empresas
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Nueva empresa</h1>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Razón social *</label>
            <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} placeholder="Empresa S.A. de C.V." style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>RFC</label>
              <input type="text" value={rfc} onChange={e => setRfc(e.target.value)} placeholder="ABC123456XYZ" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Registro patronal</label>
              <input type="text" value={registroPatronal} onChange={e => setRegistroPatronal(e.target.value)} placeholder="Y12-34-56-789" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Dirección</label>
            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle, Número, Colonia, Ciudad" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+52 442 000 0000" style={inputStyle} />
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <Link href="/admin/empresas" style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#374151", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center" }}>
              Cancelar
            </Link>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: loading ? "#0d5f80" : "#137ea8", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Manrope, sans-serif" }}>
              {loading ? "Creando..." : "Crear empresa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}