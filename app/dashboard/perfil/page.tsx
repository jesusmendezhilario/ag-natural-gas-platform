"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [profile, setProfile] = useState({ nombre: "", puesto: "", correo: "", telefono: "" })
  const [empresa, setEmpresa] = useState({ razon_social: "", rfc: "", registro_patronal: "", direccion: "", telefono: "" })

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      const { data: p } = await supabase.from("profiles").select("*, empresas(*)").eq("id", user.id).single()
      if (p) {
        setProfile({ nombre: p.nombre || "", puesto: p.puesto || "", correo: p.correo || user.email || "", telefono: p.telefono || "" })
        if ((p as any).empresas) {
          const e = (p as any).empresas
          setEmpresa({ razon_social: e.razon_social || "", rfc: e.rfc || "", registro_patronal: e.registro_patronal || "", direccion: e.direccion || "", telefono: e.telefono || "" })
        }
      }
      setLoading(false)
    }
    cargar()
  }, [])

  async function guardar() {
    setSaving(true)
    setMensaje("")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: p } = await supabase.from("profiles").select("empresa_id").eq("id", user.id).single()
    await supabase.from("profiles").update({ nombre: profile.nombre, puesto: profile.puesto, correo: profile.correo, telefono: profile.telefono }).eq("id", user.id)
    if (p?.empresa_id) {
      await supabase.from("empresas").update({ razon_social: empresa.razon_social, rfc: empresa.rfc, registro_patronal: empresa.registro_patronal, direccion: empresa.direccion, telefono: empresa.telefono }).eq("id", p.empresa_id)
    }
    setMensaje("Cambios guardados correctamente")
    setSaving(false)
    setTimeout(() => setMensaje(""), 3000)
  }

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" } as React.CSSProperties

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <p style={{ color: "#64748b", fontSize: "14px" }}>Cargando...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Mi perfil</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Actualiza tu información de contacto y datos de empresa</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>Datos de contacto</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input type="text" value={profile.nombre} onChange={e => setProfile({...profile, nombre: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Puesto</label>
            <input type="text" value={profile.puesto} onChange={e => setProfile({...profile, puesto: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Correo</label>
            <input type="email" value={profile.correo} onChange={e => setProfile({...profile, correo: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="tel" value={profile.telefono} onChange={e => setProfile({...profile, telefono: e.target.value})} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>Datos de empresa</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Razón social</label>
            <input type="text" value={empresa.razon_social} onChange={e => setEmpresa({...empresa, razon_social: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>RFC</label>
            <input type="text" value={empresa.rfc} onChange={e => setEmpresa({...empresa, rfc: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Registro patronal</label>
            <input type="text" value={empresa.registro_patronal} onChange={e => setEmpresa({...empresa, registro_patronal: e.target.value})} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Dirección</label>
            <input type="text" value={empresa.direccion} onChange={e => setEmpresa({...empresa, direccion: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="tel" value={empresa.telefono} onChange={e => setEmpresa({...empresa, telefono: e.target.value})} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {mensaje ? (
          <span style={{ fontSize: "13px", color: "#15803d", fontWeight: 500 }}>✓ {mensaje}</span>
        ) : <span />}
        <button onClick={guardar} disabled={saving} style={{
          padding: "11px 28px", borderRadius: "8px", border: "none",
          background: saving ? "#0d5f80" : "#137ea8", color: "white",
          fontSize: "14px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
          fontFamily: "Manrope, sans-serif", transition: "background 0.15s"
        }}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  )
}