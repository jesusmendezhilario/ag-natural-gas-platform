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
  const [erroresCampos, setErroresCampos] = useState({
    razonSocial: false,
    rfc: false,
    registroPatronal: false,
    telefonoEmpresa: false,
    nombre: false,
    correo: false,
    telefono: false,
  })

  async function handleRegistro() {
    const correoLimpio = correo.trim()
    const nuevosErrores = {
      razonSocial: !razonSocial.trim(),
      rfc: !/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim()),
      registroPatronal: registroPatronal !== "" && registroPatronal.length !== 11,
      telefonoEmpresa: telefonoEmpresa !== "" && !/^\+?\d{8,15}$/.test(telefonoEmpresa),
      nombre: !nombre.trim(),
      correo: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio),
      telefono: telefono !== "" && !/^\+?\d{8,15}$/.test(telefono),
    }

    if (Object.values(nuevosErrores).some(Boolean)) {
      setErroresCampos(nuevosErrores)
      setError("")
      return
    }

    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    //Este bloque se refactorizo ya que el trigger de la bd es quien hace el gurdado y vinculacion entre usuario y empresa.
   const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: correoLimpio, 
        password: password, 
        options: { 
          data: { 
            // Datos para Profiles
            nombre: nombre.trim(), 
            puesto: puesto,
            telefono_usuario: telefono,
            // Datos para Empresas
            razon_social: razonSocial,
            rfc: rfc,
            registro_patronal: registroPatronal,
            direccion: direccion,
            telefono_empresa: telefonoEmpresa 
          } 
        } 
      })
    const user = authData?.user
   
    if (authError || !user) { 
      setError(authError?.message || "Error al crear la cuenta"); 
      setLoading(false); 
      return 
    }
    router.push("/dashboard")
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b",
    background: "white", fontFamily: "Manrope, sans-serif"
  }

  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" } as React.CSSProperties
  const errorTextStyle = { fontSize: "12px", color: "#e6392c", marginTop: "4px", display: "block" }

  function limpiarTelefono(valor: string) {
    const tienePlus = valor.startsWith("+")
    const soloNumeros = valor.replace(/\D/g, "")
    return tienePlus ? `+${soloNumeros}` : soloNumeros
  }

  function validarPasoEmpresa() {
    const nuevosErrores = {
      ...erroresCampos,
      razonSocial: !razonSocial.trim(),
      rfc: !/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim()),
      registroPatronal: registroPatronal !== "" && registroPatronal.length !== 11,
      telefonoEmpresa: telefonoEmpresa !== "" && !/^\+?\d{8,15}$/.test(telefonoEmpresa),
    }

    setErroresCampos(nuevosErrores)
    if (nuevosErrores.razonSocial) { setError("La razón social es obligatoria"); return false }
    if (nuevosErrores.rfc) { setError("El RFC no es válido o está incompleto"); return false }
    if (nuevosErrores.registroPatronal) { setError("El registro patronal debe contener exactamente 11 caracteres"); return false }
    if (nuevosErrores.telefonoEmpresa) { setError("El teléfono de empresa debe tener entre 8 y 15 dígitos"); return false }

    setError("")
    return true
  }

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
                <input
                  type="text"
                  value={razonSocial}
                  onChange={e => {
                    const val = e.target.value
                    setRazonSocial(val)
                    if (erroresCampos.razonSocial && val.trim() !== "") {
                      setErroresCampos(prev => ({ ...prev, razonSocial: false }))
                    }
                  }}
                  onBlur={() => setErroresCampos(prev => ({ ...prev, razonSocial: !razonSocial.trim() }))}
                  placeholder="Empresa S.A. de C.V."
                  style={{ ...inputStyle, borderColor: erroresCampos.razonSocial ? "#e6392c" : "#e2e8f0", background: erroresCampos.razonSocial ? "#fef2f2" : "white" }}
                />
                {erroresCampos.razonSocial && <span style={errorTextStyle}>La razón social es obligatoria</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>RFC *</label>
                  <input
                    type="text"
                    value={rfc}
                    onChange={e => {
                      const limpio = e.target.value.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, "")
                      setRfc(limpio)
                      if (erroresCampos.rfc && /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(limpio)) {
                        setErroresCampos(prev => ({ ...prev, rfc: false }))
                      }
                    }}
                    onBlur={() => setErroresCampos(prev => ({ ...prev, rfc: !/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim()) }))}
                    placeholder="ABC123456XYZ"
                    maxLength={13}
                    style={{ ...inputStyle, borderColor: erroresCampos.rfc ? "#e6392c" : "#e2e8f0", background: erroresCampos.rfc ? "#fef2f2" : "white" }}
                  />
                  {erroresCampos.rfc && <span style={errorTextStyle}>RFC no válido o incompleto</span>}
                </div>
                <div>
                  <label style={labelStyle}>Registro patronal</label>
                  <input
                    type="text"
                    value={registroPatronal}
                    onChange={e => {
                      const limpio = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                      setRegistroPatronal(limpio)
                      if (erroresCampos.registroPatronal && (limpio.length === 11 || limpio === "")) {
                        setErroresCampos(prev => ({ ...prev, registroPatronal: false }))
                      }
                    }}
                    onBlur={() => setErroresCampos(prev => ({ ...prev, registroPatronal: registroPatronal !== "" && registroPatronal.length !== 11 }))}
                    placeholder="Y1234567890"
                    maxLength={11}
                    style={{ ...inputStyle, borderColor: erroresCampos.registroPatronal ? "#e6392c" : "#e2e8f0", background: erroresCampos.registroPatronal ? "#fef2f2" : "white" }}
                  />
                  {erroresCampos.registroPatronal && <span style={errorTextStyle}>Debe contener exactamente 11 caracteres</span>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Dirección</label>
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle, Número, Colonia, Ciudad" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  value={telefonoEmpresa}
                  onChange={e => {
                    const limpio = limpiarTelefono(e.target.value)
                    setTelefonoEmpresa(limpio)
                    if (erroresCampos.telefonoEmpresa && (!limpio || /^\+?\d{8,15}$/.test(limpio))) {
                      setErroresCampos(prev => ({ ...prev, telefonoEmpresa: false }))
                    }
                  }}
                  onBlur={() => setErroresCampos(prev => ({ ...prev, telefonoEmpresa: telefonoEmpresa !== "" && !/^\+?\d{8,15}$/.test(telefonoEmpresa) }))}
                  placeholder="+524421234567"
                  inputMode="tel"
                  maxLength={16}
                  style={{ ...inputStyle, borderColor: erroresCampos.telefonoEmpresa ? "#e6392c" : "#e2e8f0", background: erroresCampos.telefonoEmpresa ? "#fef2f2" : "white" }}
                />
                {erroresCampos.telefonoEmpresa && <span style={errorTextStyle}>Teléfono no válido (entre 8 y 15 dígitos)</span>}
              </div>
              {error && <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>}
              <button onClick={() => { if (validarPasoEmpresa()) setPaso(2) }}
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
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => {
                      const val = e.target.value
                      setNombre(val)
                      if (erroresCampos.nombre && val.trim() !== "") {
                        setErroresCampos(prev => ({ ...prev, nombre: false }))
                      }
                    }}
                    onBlur={() => setErroresCampos(prev => ({ ...prev, nombre: !nombre.trim() }))}
                    placeholder="Juan Pérez"
                    style={{ ...inputStyle, borderColor: erroresCampos.nombre ? "#e6392c" : "#e2e8f0", background: erroresCampos.nombre ? "#fef2f2" : "white" }}
                  />
                  {erroresCampos.nombre && <span style={errorTextStyle}>El nombre es obligatorio</span>}
                </div>
                <div>
                  <label style={labelStyle}>Puesto</label>
                  <input type="text" value={puesto} onChange={e => setPuesto(e.target.value)} placeholder="Director" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Correo electrónico *</label>
                <input
                  type="email"
                  value={correo}
                  onChange={e => {
                    const val = e.target.value.trim()
                    setCorreo(val)
                    if (erroresCampos.correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                      setErroresCampos(prev => ({ ...prev, correo: false }))
                    }
                  }}
                  onBlur={() => setErroresCampos(prev => ({ ...prev, correo: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) }))}
                  placeholder="juan@empresa.com"
                  style={{ ...inputStyle, borderColor: erroresCampos.correo ? "#e6392c" : "#e2e8f0", background: erroresCampos.correo ? "#fef2f2" : "white" }}
                />
                {erroresCampos.correo && <span style={errorTextStyle}>Correo electrónico no válido</span>}
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => {
                    const limpio = limpiarTelefono(e.target.value)
                    setTelefono(limpio)
                    if (erroresCampos.telefono && (!limpio || /^\+?\d{8,15}$/.test(limpio))) {
                      setErroresCampos(prev => ({ ...prev, telefono: false }))
                    }
                  }}
                  onBlur={() => setErroresCampos(prev => ({ ...prev, telefono: telefono !== "" && !/^\+?\d{8,15}$/.test(telefono) }))}
                  placeholder="+524421234567"
                  inputMode="tel"
                  maxLength={16}
                  style={{ ...inputStyle, borderColor: erroresCampos.telefono ? "#e6392c" : "#e2e8f0", background: erroresCampos.telefono ? "#fef2f2" : "white" }}
                />
                {erroresCampos.telefono && <span style={errorTextStyle}>Teléfono no válido (entre 8 y 15 dígitos)</span>}
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
