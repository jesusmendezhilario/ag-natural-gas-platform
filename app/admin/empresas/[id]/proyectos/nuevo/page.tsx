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
  //Esto es meramente una validación visual para el usuario.
   const [erroresCampos, setErroresCampos] = useState({
     nombre: false,
     fechaFin:false,
     fechaInicio:false
   });
  const regexNombreProyecto = /^[a-zA-ZÀ-ÿñÑ0-9 .,\-_()"]+$/;

  async function handleSubmit() {
    const nombreLimpio = nombre.trim();

    // Validación visual para el usuario (se puede saltar, por eso el constraint debertia de ir en DB)
    if (!nombreLimpio) {
      setError("El nombre es obligatorio");
      setErroresCampos(prev => ({ ...prev, nombre: true }));
      return;
    }
    if (nombreLimpio.length > 100) {
      setError("El nombre no puede superar los 100 caracteres");
      setErroresCampos(prev => ({ ...prev, nombre: true }));
      return;
    }
    if (!regexNombreProyecto.test(nombreLimpio)) {
      setError("El nombre solo puede contener letras, números, espacios y . , - _ ( ) ¿ ? ¡ ! & : ' \"");
      setErroresCampos(prev => ({ ...prev, nombre: true }));
      return;
    }
    if (!fechaFin) {
      setError("La fecha de Fin es obligatoria");
      setErroresCampos(prev => ({ ...prev, fechaFin: true }));
      return;
    }
    if (!fechaInicio) {
      setError("La fecha de Inicio es obligatoria");
      setErroresCampos(prev => ({ ...prev, fechaInicio: true }));
      return;
    }

    setErroresCampos({ nombre: false, fechaFin: false, fechaInicio: false });
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: existentes, error: errorBusqueda } = await supabase
      .from('proyectos')
      .select('id')
      .eq('empresa_id', empresaId)
      .eq('nombre', nombreLimpio)
      .eq('fecha_inicio', fechaInicio)
      .eq('fecha_fin', fechaFin);

    if (errorBusqueda) {
      setError("Error al validar duplicados: " + errorBusqueda.message);
      setLoading(false);
      return;
    }

    if (existentes && existentes.length > 0) {
      setError("Existe un proyecto con el mismo nombre, fechas Inicio y Fin idénticos.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("proyectos").insert({
      empresa_id: empresaId,
      nombre: nombreLimpio,
      descripcion,
      fecha_inicio: fechaInicio || null,
      fecha_fin: fechaFin || null,
      activo: true
    });

    if (error) {
      setError("Error: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/empresas/" + empresaId);
  }
  
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#e2e8f0", fontSize: "14px", color: "#1e293b", backgroundColor: "white", fontFamily: "Manrope, sans-serif" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" } as React.CSSProperties
  const inputErrorStyle = {
    ...inputStyle,
    borderColor: '#e53e3e',
    backgroundColor: '#fff5f5'
  };
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
            <input type="text" value={nombre} onChange={e => {
                const valor = e.target.value;
                if (regexNombreProyecto.test(valor)) {
                  setNombre(valor);
                  if (erroresCampos.nombre) setErroresCampos(prev => ({ ...prev, nombre: false }));
                }
            } 
            } 
            placeholder="Nombre del proyecto" maxLength={100}  style={erroresCampos.nombre ? inputErrorStyle : inputStyle}
             />{erroresCampos.nombre && (
              <span style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</span>
              )}
          </div>
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción del proyecto" rows={3} style={{...inputStyle, resize: "vertical"}} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Fecha de inicio</label>
              <input type="date" value={fechaInicio} onChange={e => {setFechaInicio(e.target.value)
                    if (erroresCampos.fechaInicio) setErroresCampos(prev => ({ ...prev, fechaInicio: false }));
              }}  style={erroresCampos.fechaInicio ? inputErrorStyle : inputStyle} />
              {erroresCampos.fechaInicio && (
                <span style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</span>
              )}
            </div>
            <div>
              <label style={labelStyle}>Fecha de fin</label>
              <input type="date" value={fechaFin} onChange={e => {setFechaFin(e.target.value)
                    if (erroresCampos.fechaFin) setErroresCampos(prev => ({ ...prev, fechaFin: false }));
              }}  style={erroresCampos.fechaFin ? inputErrorStyle : inputStyle} />
              {erroresCampos.fechaFin && (
                <span style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</span>
              )}
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