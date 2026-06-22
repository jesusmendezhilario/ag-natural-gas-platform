import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles").select("*, empresas(*)").eq("id", user.id).single()

  if (profile?.role === "admin") redirect("/admin")

  const { data: proyectos } = await supabase
    .from("proyectos").select("*").eq("empresa_id", profile?.empresa_id).eq("activo", true)
    .order("created_at", { ascending: false })

  const { data: dictamenes } = await supabase
    .from("dictamenes_tecnicos").select("*, proyectos(nombre)")
    .eq("email_alerta_enviado", false)
    .lte("fecha_vencimiento", new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    .order("fecha_vencimiento")

  const empresa = (profile as any)?.empresas

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px", fontFamily: "Manrope, sans-serif" }}>
          Bienvenido de vuelta
        </p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif", lineHeight: 1.2 }}>
          {profile?.nombre || "Usuario"}
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Proyectos activos", value: proyectos?.length || 0, color: "#137ea8" },
          { label: "Empresa", value: empresa?.razon_social || "-", small: true },
          { label: "RFC", value: empresa?.rfc || "-", small: true },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "12px", padding: "20px 24px",
            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
            <p style={{ fontSize: stat.small ? "16px" : "32px", fontWeight: 700, color: stat.color || "#1e293b", fontFamily: "Archivo, sans-serif", lineHeight: 1 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {dictamenes && dictamenes.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#e6392c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
            <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>!</span>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#c42d22", marginBottom: "4px" }}>Dictámenes próximos a vencer</p>
            {dictamenes.map((d: any) => (
              <p key={d.id} style={{ fontSize: "13px", color: "#991b1b" }}>{(d as any).proyectos?.nombre} — vence el {d.fecha_vencimiento}</p>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Proyectos recientes</h2>
          <Link href="/dashboard/proyectos" style={{ fontSize: "13px", color: "#137ea8", fontWeight: 500, textDecoration: "none" }}>Ver todos →</Link>
        </div>
        {proyectos && proyectos.length > 0 ? (
          <div style={{ padding: "8px" }}>
            {proyectos.slice(0, 5).map((p: any) => (
              <Link key={p.id} href={"/dashboard/proyectos/" + p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "8px", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#e8f4f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" fill="none" stroke="#137ea8" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1e293b" }}>{p.nombre}</p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{p.descripcion || "Sin descripción"}</p>
                  </div>
                </div>
                <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#dcfce7", color: "#15803d", fontWeight: 500 }}>Activo</span>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "14px" }}>No tienes proyectos asignados aún.</p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>AG Natural Gas asignará tus proyectos próximamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}