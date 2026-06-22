import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function FotografiasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: proyecto } = await supabase.from("proyectos").select("nombre").eq("id", id).single()
  const { data: fotografias } = await supabase.from("fotografias").select("*").eq("proyecto_id", id).order("orden")

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href={"/dashboard/proyectos/" + id} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          {proyecto?.nombre}
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>Fotografias</h1>
      </div>
      {fotografias && fotografias.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {fotografias.map((f: any) => (
            <a key={f.id} href={f.archivo_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ height: "180px", overflow: "hidden", background: "#f1f5f9" }}>
                <img src={f.archivo_url} alt={f.titulo || "Fotografia"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{f.titulo || "Sin titulo"}</p>
                {f.descripcion && <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{f.descripcion}</p>}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
          <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Sin fotografias</p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>AG Natural Gas agregara las fotografias de este proyecto.</p>
        </div>
      )}
    </div>
  )
}