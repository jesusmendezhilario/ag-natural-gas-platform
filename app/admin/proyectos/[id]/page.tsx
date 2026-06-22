"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function ProyectoAdminPage() {
  const params = useParams()
  const proyectoId = params.id as string
  const supabase = createClient()

  const [proyecto, setProyecto] = useState<any>(null)
  const [seccion, setSeccion] = useState("facturas")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<any>({})

  const secciones = [
    { key: "facturas", label: "Facturas" },
    { key: "presupuestos", label: "Presupuestos" },
    { key: "dictamenes", label: "Dictámenes" },
    { key: "estimaciones", label: "Estimaciones" },
    { key: "fotografias", label: "Fotografías" },
    { key: "comentarios", label: "Comentarios" },
  ]

  useEffect(() => {
    async function cargar() {
      const { data: p } = await supabase.from("proyectos").select("*, empresas(razon_social, id)").eq("id", proyectoId).single()
      setProyecto(p)
      await cargarSeccion("facturas")
      setLoading(false)
    }
    cargar()
  }, [proyectoId])

  async function cargarSeccion(s: string) {
    setLoading(true)
    const tabla = s === "dictamenes" ? "dictamenes_tecnicos" : s
    const { data } = await supabase.from(tabla).select("*").eq("proyecto_id", proyectoId)
    setItems(data || [])
    setSeccion(s)
    setForm({})
    setLoading(false)
  }

  async function subirArchivo(file: File, carpeta: string) {
    const nombre = Date.now() + "_" + file.name
    const ruta = carpeta + "/" + proyectoId + "/" + nombre
    await supabase.storage.from("proyectos-archivos").upload(ruta, file)
    const { data: url } = supabase.storage.from("proyectos-archivos").getPublicUrl(ruta)
    return url.publicUrl
  }

  async function guardar() {
    setUploading(true)
    const tabla = seccion === "dictamenes" ? "dictamenes_tecnicos" : seccion
    let archivo_url = null
    if (form.archivo) archivo_url = await subirArchivo(form.archivo, seccion)

    const datos: any = { proyecto_id: proyectoId }
    if (seccion === "facturas") { datos.folio = form.folio || null; datos.fecha_emision = form.fecha || null; datos.monto = form.monto || null; datos.notas = form.notas || null; datos.archivo_url = archivo_url }
    else if (seccion === "presupuestos") { datos.folio = form.folio || null; datos.fecha = form.fecha || null; datos.monto_total = form.monto || null; datos.notas = form.notas || null; datos.archivo_url = archivo_url }
    else if (seccion === "dictamenes") { datos.descripcion = form.descripcion || null; datos.fecha_emision = form.fecha_emision || null; datos.fecha_vencimiento = form.fecha_vencimiento; datos.notas = form.notas || null; datos.archivo_url = archivo_url }
    else if (seccion === "estimaciones") { datos.numero = form.numero || null; datos.fecha = form.fecha || null; datos.concepto = form.concepto || null; datos.monto = form.monto || null; datos.archivo_url = archivo_url }
    else if (seccion === "fotografias") { datos.titulo = form.titulo || null; datos.descripcion = form.descripcion || null; datos.archivo_url = archivo_url; datos.orden = items.length }
    else if (seccion === "comentarios") { datos.contenido = form.contenido }

    await supabase.from(tabla).insert(datos)
    await cargarSeccion(seccion)
    setUploading(false)
  }

  async function eliminar(id: string) {
    const tabla = seccion === "dictamenes" ? "dictamenes_tecnicos" : seccion
    await supabase.from(tabla).delete().eq("id", id)
    await cargarSeccion(seccion)
  }

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#1e293b", background: "white", fontFamily: "Manrope, sans-serif" }

  if (!proyecto) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}><p style={{ color: "#64748b" }}>Cargando...</p></div>

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link href={"/admin/empresas/" + proyecto.empresa_id} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          {proyecto.empresas?.razon_social}
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>{proyecto.nombre}</h1>
        {proyecto.descripcion && <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{proyecto.descripcion}</p>}
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
        {secciones.map(s => (
          <button key={s.key} onClick={() => cargarSeccion(s.key)} style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid",
            fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Manrope, sans-serif",
            transition: "all 0.15s",
            borderColor: seccion === s.key ? "#137ea8" : "#e2e8f0",
            background: seccion === s.key ? "#137ea8" : "white",
            color: seccion === s.key ? "white" : "#64748b",
          }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px" }}>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif", marginBottom: "16px" }}>
            Agregar {secciones.find(s => s.key === seccion)?.label}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(seccion === "facturas" || seccion === "presupuestos") && (<>
              <input placeholder="Folio" value={form.folio || ""} onChange={e => setForm({...form, folio: e.target.value})} style={inputStyle} />
              <input type="date" value={form.fecha || ""} onChange={e => setForm({...form, fecha: e.target.value})} style={inputStyle} />
              <input type="number" placeholder="Monto" value={form.monto || ""} onChange={e => setForm({...form, monto: e.target.value})} style={inputStyle} />
              <input placeholder="Notas" value={form.notas || ""} onChange={e => setForm({...form, notas: e.target.value})} style={inputStyle} />
              <input type="file" onChange={e => setForm({...form, archivo: e.target.files?.[0]})} style={{ fontSize: "12px", color: "#64748b" }} />
            </>)}
            {seccion === "dictamenes" && (<>
              <input placeholder="Descripción" value={form.descripcion || ""} onChange={e => setForm({...form, descripcion: e.target.value})} style={inputStyle} />
              <label style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fecha emisión</label>
              <input type="date" value={form.fecha_emision || ""} onChange={e => setForm({...form, fecha_emision: e.target.value})} style={inputStyle} />
              <label style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fecha vencimiento *</label>
              <input type="date" value={form.fecha_vencimiento || ""} onChange={e => setForm({...form, fecha_vencimiento: e.target.value})} style={inputStyle} />
              <input placeholder="Notas" value={form.notas || ""} onChange={e => setForm({...form, notas: e.target.value})} style={inputStyle} />
              <input type="file" onChange={e => setForm({...form, archivo: e.target.files?.[0]})} style={{ fontSize: "12px", color: "#64748b" }} />
            </>)}
            {seccion === "estimaciones" && (<>
              <input type="number" placeholder="Número" value={form.numero || ""} onChange={e => setForm({...form, numero: e.target.value})} style={inputStyle} />
              <input type="date" value={form.fecha || ""} onChange={e => setForm({...form, fecha: e.target.value})} style={inputStyle} />
              <input placeholder="Concepto" value={form.concepto || ""} onChange={e => setForm({...form, concepto: e.target.value})} style={inputStyle} />
              <input type="number" placeholder="Monto" value={form.monto || ""} onChange={e => setForm({...form, monto: e.target.value})} style={inputStyle} />
              <input type="file" onChange={e => setForm({...form, archivo: e.target.files?.[0]})} style={{ fontSize: "12px", color: "#64748b" }} />
            </>)}
            {seccion === "fotografias" && (<>
              <input placeholder="Título" value={form.titulo || ""} onChange={e => setForm({...form, titulo: e.target.value})} style={inputStyle} />
              <input placeholder="Descripción" value={form.descripcion || ""} onChange={e => setForm({...form, descripcion: e.target.value})} style={inputStyle} />
              <input type="file" accept="image/*" onChange={e => setForm({...form, archivo: e.target.files?.[0]})} style={{ fontSize: "12px", color: "#64748b" }} />
            </>)}
            {seccion === "comentarios" && (
              <textarea placeholder="Escribe un comentario..." value={form.contenido || ""} onChange={e => setForm({...form, contenido: e.target.value})} rows={4} style={{...inputStyle, resize: "vertical"}} />
            )}
            <button onClick={guardar} disabled={uploading} style={{
              width: "100%", padding: "10px", borderRadius: "8px", border: "none",
              background: uploading ? "#0d5f80" : "#137ea8", color: "white",
              fontSize: "13px", fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer",
              fontFamily: "Manrope, sans-serif", marginTop: "4px"
            }}>
              {uploading ? "Guardando..." : "Agregar"}
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", fontFamily: "Archivo, sans-serif" }}>
              Registros ({items.length})
            </h2>
          </div>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center" }}><p style={{ color: "#64748b", fontSize: "13px" }}>Cargando...</p></div>
          ) : items.length > 0 ? (
            <div style={{ padding: "8px" }}>
              {items.map((item: any) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "8px", marginBottom: "4px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "13px", color: "#1e293b" }}>
                    {seccion === "facturas" && <p><span style={{ fontWeight: 600 }}>{item.folio || "Sin folio"}</span>{item.monto ? " — $" + Number(item.monto).toLocaleString("es-MX") : ""}</p>}
                    {seccion === "presupuestos" && <p><span style={{ fontWeight: 600 }}>{item.folio || "Sin folio"}</span>{item.monto_total ? " — $" + Number(item.monto_total).toLocaleString("es-MX") : ""}</p>}
                    {seccion === "dictamenes" && <p><span style={{ fontWeight: 600 }}>{item.descripcion || "Dictamen"}</span> — Vence: {item.fecha_vencimiento}</p>}
                    {seccion === "estimaciones" && <p><span style={{ fontWeight: 600 }}>Est. {item.numero || "—"}</span> — {item.concepto || "—"}</p>}
                    {seccion === "fotografias" && <p style={{ fontWeight: 600 }}>{item.titulo || "Sin título"}</p>}
                    {seccion === "comentarios" && <p style={{ color: "#374151" }}>{item.contenido?.slice(0, 80)}{item.contenido?.length > 80 ? "..." : ""}</p>}
                    {item.archivo_url && (
                      <a href={item.archivo_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#137ea8", textDecoration: "none", marginTop: "2px", display: "block" }}>Ver archivo →</a>
                    )}
                  </div>
                  <button onClick={() => eliminar(item.id)} style={{ fontSize: "12px", color: "#e6392c", background: "#fef2f2", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontFamily: "Manrope, sans-serif", flexShrink: 0, marginLeft: "12px" }}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <p style={{ color: "#64748b", fontSize: "13px" }}>Sin registros aún. Agrega el primero.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}