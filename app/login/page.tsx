"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error, data } = await supabase.auth.signInWithPassword({ email: correo, password })
    if (error) { setError("Correo o contrasena incorrectos"); setLoading(false) }
    else {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()
      if (profile?.role === "admin") router.push("/admin")
      else router.push("/dashboard")
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .login-container { flex-direction: column !important; }
          .login-left { width: 100% !important; min-height: 220px !important; padding: 32px 24px !important; }
          .login-right { width: 100% !important; padding: 32px 24px !important; min-height: auto !important; }
        }
      `}</style>
      <div className="login-container" style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
        <div className="login-left" style={{
          width: "440px", background: "#0d5f80", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "60px 48px"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <img src="/logo.webp" alt="AG Natural Gas" style={{ width: "72px", marginBottom: "24px", objectFit: "contain" }} />
            <h1 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, color: "white", fontSize: "28px", lineHeight: 1.2, marginBottom: "12px" }}>
              Portal de Proyectos
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.6 }}>
              Accede a tus proyectos, documentos y dictamenes tecnicos en un solo lugar.
            </p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>AG Natural Gas</p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>Queretaro, Mexico</p>
          </div>
        </div>

        <div className="login-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: "24px", color: "#1e293b", marginBottom: "8px" }}>
              Inicia sesion
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>
              No tienes cuenta?{" "}
              <Link href="/registro" style={{ color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Registrate aqui</Link>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Correo electronico</label>
                <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@empresa.com"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Contrasena</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif", boxSizing: "border-box" }} />
              </div>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                  <p style={{ fontSize: "13px", color: "#c42d22", margin: 0 }}>{error}</p>
                </div>
              )}

              <button onClick={handleLogin} disabled={loading} style={{
                width: "100%", padding: "11px", borderRadius: "8px", border: "none",
                background: loading ? "#0d5f80" : "#137ea8", color: "white",
                fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Manrope, sans-serif"
              }}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}