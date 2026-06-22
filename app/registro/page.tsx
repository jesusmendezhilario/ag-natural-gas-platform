"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paso, setPaso] = useState(1)
  const [razonSocial, setRazonSocial] = useState("")
  const [rfc, setRfc] = useState("")
  const [registroPatronal, setRegistroPatronal] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("")
  const [nombre, setNombre] = useState("")
  const [puesto, setPuesto] = useState("")
  const [correo, setCorreo] = useState("")
  const [telefono, setTelefono] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleRegistro() {
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: correo, password, options: { data: { nombre, puesto } } })
    if (authError || !authData.user) { setError(authError?.message || "Error al crear la cuenta"); setLoading(false); return }
    const { data: empresaData, error: empresaError } = await supabase.from("empresas").insert({ razon_social: razonSocial, rfc, registro_patronal: registroPatronal, direccion, telefono: telefonoEmpresa }).select().single()
    if (empresaError || !empresaData) { setError("Error: " + empresaError?.message); setLoading(false); return }
    await supabase.from("profiles").update({ nombre, puesto, correo, telefono, empresa_id: empresaData.id }).eq("id", authData.user.id)
    router.push("/dashboard")
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b",
    background: "white", fontFamily: "Manrope, sans-serif"
  }

  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" } as React.CSSProperties

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
      <div style={{
        width: "480px", background: "#0d5f80", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 48px"
      }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px", background: "#137ea8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Archivo, sans-serif", fontWeight: 700, color: "white", fontSize: "18px",
            marginBottom: "32px"
          }}>AG</div>
          <h1 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, color: "white", fontSize: "28px", lineHeight: 1.2, marginBottom: "12px" }}>
            Crea tu cuenta
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.6 }}>
            Registra tu empresa y accede a todos tus proyectos con AG Natural Gas.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { n: 1, label: "Datos de empresa", desc: "Información fiscal y de contacto" },
            { n: 2, label: "Datos de acceso", desc: "Responsable y contraseña" }
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                background: paso >= s.n ? "#137ea8" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 600, color: "white"
              }}>{s.n}</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: paso >= s.n ? "white" : "rgba(255,255,255,0.4)" }}>{s.label}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: "22px", color: "#1e293b", marginBottom: "6px" }}>
            {paso === 1 ? "Datos de la empresa" : "Datos de contacto"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "28px" }}>
            {paso === 1 ? "Información fiscal y de registro" : "Responsable de la cuenta y acceso"}
          </p>

          {paso === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  <input type="text" value={registroPatronal} onChange={e => setRegistroPatronal(e.target.value)} placeholder="Y12-34-56" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Dirección</label>
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle, Número, Colonia, Ciudad" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input type="tel" value={telefonoEmpresa} onChange={e => setTelefonoEmpresa(e.target.value)} placeholder="+52 442 000 0000" style={inputStyle} />
              </div>
              {error && <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>}
              <button onClick={() => { if (!razonSocial) { setError("La razón social es obligatoria"); return } setError(""); setPaso(2) }}
                style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "none", background: "#137ea8", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Manrope, sans-serif", marginTop: "4px" }}>
                Continuar →
              </button>
            </div>
          )}

          {paso === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Juan Pérez" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Puesto</label>
                  <input type="text" value={puesto} onChange={e => setPuesto(e.target.value)} placeholder="Director" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Correo electrónico *</label>
                <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="juan@empresa.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+52 442 000 0000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contraseña *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirmar contraseña *</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
              </div>
              {error && <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={() => { setError(""); setPaso(1) }}
                  style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#374151", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Manrope, sans-serif" }}>
                  ← Atrás
                </button>
                <button onClick={handleRegistro} disabled={loading}
                  style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: loading ? "#0d5f80" : "#137ea8", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Manrope, sans-serif" }}>
                  {loading ? "Creando..." : "Crear cuenta"}
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "24px" }}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}