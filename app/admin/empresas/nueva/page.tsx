"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevaEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [rfc, setRfc] = useState("");
  const [registroPatronal, setRegistroPatronal] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  //Esto es meramente una validación visual para el usuario.
  const [erroresCampos, setErroresCampos] = useState({
    razonSocial: false,
    rfc: false,
    registroPatronal: false,
    telefono: false,
  });

  async function handleSubmit() {
    setError("");
    const nuevosErrores = {
      razonSocial: false,
      rfc: false,
      registroPatronal: false,
      telefono: false,
    };

    const razonSocialLimpia = razonSocial.trim();
    const rfcLimpio = rfc.trim();

    if (!razonSocialLimpia) {
      nuevosErrores.razonSocial = true;
    }

    if (!rfcLimpio || !/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfcLimpio)) {
      nuevosErrores.rfc = true;
    }

    if (registroPatronal && registroPatronal.length !== 11) {
      nuevosErrores.registroPatronal = true;
    }

    if (telefono && !/^\+?\d{8,15}$/.test(telefono)) {
      nuevosErrores.telefono = true;
    }

    if (Object.values(nuevosErrores).some((e) => e)) {
      setErroresCampos(nuevosErrores);
      return;
    }

    const supabase = createClient();
    // 1. Validar si ya existe una empresa con ese RFC ya que esto debe ser unico a nivel Nacional
    const { data: existeEmpresa, error: errorBusqueda } = await supabase
      .from("empresas")
      .select("id, rfc")
      .or(`rfc.eq.${rfc}`)
      .maybeSingle();
    if (existeEmpresa) {
      setError("Ya existe una empresa registrada con este RFC");
      setLoading(false);
      return;
    }
    const { data, error: errorInsert } = await supabase
      .from("empresas")
      .insert({
        razon_social: razonSocial,
        rfc,
        registro_patronal: registroPatronal,
        direccion,
        telefono,
        activo: true,
      });

    if (errorInsert) {
      console.error("Error al registrar:", errorInsert);
      setError("Ocurrió un error al guardar la empresa");
      setLoading(false);
      return;
    }
    router.push("/admin/empresas");
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    fontSize: "14px",
    color: "#1e293b",
    backgroundColor: "white",
    fontFamily: "Manrope, sans-serif",
  };
  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  } as React.CSSProperties;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link
          href="/admin/empresas"
          style={{
            fontSize: "13px",
            color: "#64748b",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "12px",
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Empresas
        </Link>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: "Archivo, sans-serif",
          }}
        >
          Nueva empresa
        </h1>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "grid", gap: "16px" }}>
          {/* Razón Social */}
          <div>
            <label style={labelStyle}>Razón social *</label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => {
                const val = e.target.value;
                setRazonSocial(val);
                if (erroresCampos.razonSocial && val.trim() !== "") {
                  setErroresCampos((prev) => ({ ...prev, razonSocial: false }));
                }
              }}
              onBlur={() => {
                if (!razonSocial.trim()) {
                  setErroresCampos((prev) => ({ ...prev, razonSocial: true }));
                } else {
                  setErroresCampos((prev) => ({ ...prev, razonSocial: false }));
                }
              }}
              placeholder="Empresa S.A. de C.V."
              style={{
                ...inputStyle,
                borderColor: erroresCampos.razonSocial ? "#e6392c" : "#e2e8f0",
                backgroundColor: erroresCampos.razonSocial
                  ? "#fef2f2"
                  : "#ffffff",
              }}
            />
            {erroresCampos.razonSocial && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#e6392c",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                La razón social es obligatoria
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* RFC */}
            <div>
              <label style={labelStyle}>RFC *</label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => {
                  const limpio = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9&]/g, "");
                  setRfc(limpio);

                  const esValido = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(
                    limpio,
                  );
                  if (erroresCampos.rfc && esValido) {
                    setErroresCampos((prev) => ({ ...prev, rfc: false }));
                  }
                }}
                onBlur={() => {
                  const esValido = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim());
                  if (!esValido) {
                    setErroresCampos((prev) => ({ ...prev, rfc: true }));
                  } else {
                    setErroresCampos((prev) => ({ ...prev, rfc: false }));
                  }
                }}
                placeholder="ABC123456XYZ"
                maxLength={13}
                style={{
                  ...inputStyle,
                  borderColor: erroresCampos.rfc ? "#e6392c" : "#e2e8f0",
                  backgroundColor: erroresCampos.rfc ? "#fef2f2" : "#ffffff",
                }}
              />
              {erroresCampos.rfc && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#e6392c",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  RFC no válido o incompleto
                </span>
              )}
            </div>

            {/* Registro Patronal */}
            <div>
              <label style={labelStyle}>Registro patronal</label>
              <input
                type="text"
                value={registroPatronal}
                onChange={(e) => {
                  const limpio = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");
                  setRegistroPatronal(limpio);

                  if (
                    erroresCampos.registroPatronal &&
                    (limpio.length === 11 || limpio === "")
                  ) {
                    setErroresCampos((prev) => ({
                      ...prev,
                      registroPatronal: false,
                    }));
                  }
                }}
                onBlur={() => {
                  const limpio = registroPatronal.trim();
                  if (limpio !== "" && limpio.length !== 11) {
                    setErroresCampos((prev) => ({
                      ...prev,
                      registroPatronal: true,
                    }));
                  } else {
                    setErroresCampos((prev) => ({
                      ...prev,
                      registroPatronal: false,
                    }));
                  }
                }}
                placeholder="Y1234567890"
                maxLength={11}
                style={{
                  ...inputStyle,
                  borderColor: erroresCampos.registroPatronal
                    ? "#e6392c"
                    : "#e2e8f0",
                  backgroundColor: erroresCampos.registroPatronal
                    ? "#fef2f2"
                    : "#ffffff",
                }}
              />
              {erroresCampos.registroPatronal && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#e6392c",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Debe contener exactamente 11 caracteres
                </span>
              )}
            </div>
          </div>

          {/* Dirección */}

          <div>
            <label style={labelStyle}>Dirección</label>

            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, Número, Colonia, Ciudad"
              style={inputStyle}
            />
          </div>

          {/* Teléfono */}

          <div>
            <label style={labelStyle}>Teléfono</label>

            <input
              type="tel"
              value={telefono}
              onChange={(e) => {
                let valor = e.target.value;
                const tienePlus = valor.startsWith("+");
                const soloNumeros = valor.replace(/\D/g, "");
                const limpio = tienePlus ? `+${soloNumeros}` : soloNumeros;
                setTelefono(limpio);

                if (
                  erroresCampos.telefono &&
                  (!limpio || /^\+?\d{8,15}$/.test(limpio))
                ) {
                  setErroresCampos((prev) => ({ ...prev, telefono: false }));
                }
              }}
              onBlur={() => {
                if (telefono && !/^\+?\d{8,15}$/.test(telefono)) {
                  setErroresCampos((prev) => ({ ...prev, telefono: true }));
                } else {
                  setErroresCampos((prev) => ({ ...prev, telefono: false }));
                }
              }}
              placeholder="+524421234567"
              maxLength={16}
              style={{
                ...inputStyle,
                borderColor: erroresCampos.telefono ? "#e6392c" : "#e2e8f0",
                backgroundColor: erroresCampos.telefono
                  ? "#fef2f2"
                  : "#ffffff",
              }}
            />
            {erroresCampos.telefono && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#e6392c",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                Teléfono no válido (entre 8 y 15 dígitos)
              </span>
            )}
          </div>

          {/* Alerta Global */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <p style={{ fontSize: "13px", color: "#c42d22" }}>{error}</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <Link
            href="/admin/empresas"
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Cancelar
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#0d5f80" : "#137ea8",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {loading ? "Creando..." : "Crear empresa"}
          </button>
        </div>
      </div>
    </div>
  );
}
