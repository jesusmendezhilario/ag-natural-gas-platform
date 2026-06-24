"use client"

import { useState } from "react"

interface Props {
  seccion: string
  proyectoNombre: string
  empresaNombre: string
  adminEmails: string[]
  userEmail: string
  items: any[]
}

export default function SendEmailButton({ seccion, proyectoNombre, empresaNombre, adminEmails, userEmail, items }: Props) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  function buildHTML() {
    const fecha = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })

    let tabla = ""
    if (seccion === "facturas") {
      tabla = `<table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead><tr style="background:#137ea8;color:white">
          <th style="padding:10px;text-align:left">Folio</th>
          <th style="padding:10px;text-align:left">Fecha</th>
          <th style="padding:10px;text-align:left">Monto</th>
          <th style="padding:10px;text-align:left">Notas</th>
        </tr></thead><tbody>
        ${items.map((f, i) => `<tr style="background:${i%2===0?'#f8fafc':'white'}">
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${f.folio||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${f.fecha_emision||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${f.monto ? '$'+Number(f.monto).toLocaleString('es-MX') : '-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${f.notas||'-'}</td>
        </tr>`).join('')}
        </tbody></table>`
    } else if (seccion === "presupuestos") {
      tabla = `<table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead><tr style="background:#137ea8;color:white">
          <th style="padding:10px;text-align:left">Folio</th>
          <th style="padding:10px;text-align:left">Fecha</th>
          <th style="padding:10px;text-align:left">Monto total</th>
          <th style="padding:10px;text-align:left">Notas</th>
        </tr></thead><tbody>
        ${items.map((p, i) => `<tr style="background:${i%2===0?'#f8fafc':'white'}">
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${p.folio||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${p.fecha||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${p.monto_total ? '$'+Number(p.monto_total).toLocaleString('es-MX') : '-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${p.notas||'-'}</td>
        </tr>`).join('')}
        </tbody></table>`
    } else if (seccion === "dictamenes") {
      tabla = `<table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead><tr style="background:#137ea8;color:white">
          <th style="padding:10px;text-align:left">Descripcion</th>
          <th style="padding:10px;text-align:left">Emision</th>
          <th style="padding:10px;text-align:left">Vencimiento</th>
          <th style="padding:10px;text-align:left">Estado</th>
        </tr></thead><tbody>
        ${items.map((d, i) => {
          const dias = Math.ceil((new Date(d.fecha_vencimiento).getTime() - new Date().getTime()) / (1000*60*60*24))
          const estado = dias <= 0 ? 'Vencido' : dias <= 30 ? `Vence en ${dias} dias` : 'Vigente'
          const color = dias <= 0 ? '#e6392c' : dias <= 30 ? '#854d0e' : '#15803d'
          return `<tr style="background:${i%2===0?'#f8fafc':'white'}">
            <td style="padding:10px;border-bottom:1px solid #e2e8f0">${d.descripcion||'-'}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0">${d.fecha_emision||'-'}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0"><b>${d.fecha_vencimiento}</b></td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:${color}"><b>${estado}</b></td>
          </tr>`
        }).join('')}
        </tbody></table>`
    } else if (seccion === "estimaciones") {
      tabla = `<table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead><tr style="background:#137ea8;color:white">
          <th style="padding:10px;text-align:left">No.</th>
          <th style="padding:10px;text-align:left">Fecha</th>
          <th style="padding:10px;text-align:left">Concepto</th>
          <th style="padding:10px;text-align:left">Monto</th>
        </tr></thead><tbody>
        ${items.map((e, i) => `<tr style="background:${i%2===0?'#f8fafc':'white'}">
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${e.numero||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${e.fecha||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${e.concepto||'-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${e.monto ? '$'+Number(e.monto).toLocaleString('es-MX') : '-'}</td>
        </tr>`).join('')}
        </tbody></table>`
    } else if (seccion === "comentarios") {
      tabla = `<div style="margin-top:16px">${items.map(c => `
        <div style="background:#f8fafc;border-radius:8px;padding:12px 16px;margin-bottom:8px;border-left:3px solid #137ea8">
          <p style="margin:0 0 4px;color:#64748b;font-size:12px">${new Date(c.created_at).toLocaleDateString('es-MX')}</p>
          <p style="margin:0;color:#1e293b">${c.contenido}</p>
        </div>`).join('')}</div>`
    }

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;margin-top:24px;margin-bottom:24px">
    <div style="background:#0d5f80;padding:32px 32px 24px">
      <h1 style="color:white;margin:0;font-size:22px">AG Natural Gas</h1>
      <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">Portal de Proyectos</p>
    </div>
    <div style="padding:24px 32px">
      <h2 style="color:#1e293b;font-size:18px;margin:0 0 4px">${seccion.charAt(0).toUpperCase()+seccion.slice(1)} — ${proyectoNombre}</h2>
      <p style="color:#64748b;font-size:13px;margin:0 0 16px">Empresa: ${empresaNombre} &nbsp;|&nbsp; Fecha: ${fecha}</p>
      <p style="color:#1e293b;font-size:14px">A continuacion encontraras el resumen de ${seccion} del proyecto <b>${proyectoNombre}</b>:</p>
      ${tabla}
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center">
      <p style="color:#94a3b8;font-size:12px;margin:0">Este correo fue enviado desde el Portal de Proyectos de AG Natural Gas</p>
      <p style="color:#94a3b8;font-size:12px;margin:4px 0 0">portal.agnaturalgas.com</p>
    </div>
  </div>
</body></html>`
  }

  async function handleSend() {
    setSending(true)
    setError("")
    setSent(false)

    const html = buildHTML()
    const subject = `${seccion.charAt(0).toUpperCase()+seccion.slice(1)} — Proyecto ${proyectoNombre}`
    const recipients = [...adminEmails, userEmail].filter(Boolean).join(",")

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipients, subject, html }),
      })
      const data = await res.json()
      if (data.ok) {
        setSent(true)
        setTimeout(() => setSent(false), 4000)
      } else {
        setError("Error al enviar: " + data.error)
      }
    } catch {
      setError("Error de conexion")
    }
    setSending(false)
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={handleSend}
        disabled={sending || items.length === 0}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "8px", border: "none",
          background: sent ? "#15803d" : sending ? "#0d5f80" : "#137ea8",
          color: "white", fontSize: "13px", fontWeight: 600,
          cursor: sending || items.length === 0 ? "not-allowed" : "pointer",
          opacity: items.length === 0 ? 0.5 : 1,
          fontFamily: "Manrope, sans-serif", transition: "background 0.2s"
        }}
      >
        {sent ? (
          <>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Enviado
          </>
        ) : sending ? (
          "Enviando..."
        ) : (
          <>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Enviar correo
          </>
        )}
      </button>
      {error && <span style={{ fontSize: "12px", color: "#e6392c" }}>{error}</span>}
    </div>
  )
}