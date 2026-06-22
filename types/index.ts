export type UserRole = 'admin' | 'empresa'

export interface Empresa {
  id: string
  razon_social: string
  rfc?: string
  registro_patronal?: string
  direccion?: string
  telefono?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  role: UserRole
  empresa_id?: string
  nombre?: string
  puesto?: string
  correo?: string
  telefono?: string
  created_at: string
  updated_at: string
}

export interface Proyecto {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
  fecha_inicio?: string
  fecha_fin?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Factura {
  id: string
  proyecto_id: string
  folio?: string
  fecha_emision?: string
  monto?: number
  archivo_url?: string
  notas?: string
  created_at: string
}

export interface Presupuesto {
  id: string
  proyecto_id: string
  folio?: string
  fecha?: string
  monto_total?: number
  archivo_url?: string
  notas?: string
  created_at: string
}

export interface DictamenTecnico {
  id: string
  proyecto_id: string
  descripcion?: string
  fecha_emision?: string
  fecha_vencimiento: string
  archivo_url?: string
  email_alerta_enviado: boolean
  notas?: string
  created_at: string
}

export interface Estimacion {
  id: string
  proyecto_id: string
  numero?: number
  fecha?: string
  concepto?: string
  monto?: number
  archivo_url?: string
  notas?: string
  created_at: string
}

export interface Fotografia {
  id: string
  proyecto_id: string
  titulo?: string
  descripcion?: string
  archivo_url: string
  orden: number
  created_at: string
}

export interface InformacionProyecto {
  id: string
  proyecto_id: string
  tipo_obra?: string
  ubicacion?: string
  capacidad?: string
  norma_aplicable?: string
  responsable?: string
  estado: string
  notas?: string
  updated_at: string
}

export interface Comentario {
  id: string
  proyecto_id: string
  autor_id?: string
  contenido: string
  created_at: string
}