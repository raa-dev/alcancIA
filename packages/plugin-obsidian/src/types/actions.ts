export interface ActionResponse<T = unknown> {
  success: boolean
  data?: {
    message: string
    [key: string]: unknown
  } & T
  error?: {
    message: string
    details?: string
  }
}

export interface CondominioNote {
  tipo: string
  fecha_actualizacion: string
  [key: string]: unknown
}

export interface Vecino {
  casa: string
  direccion: string
  tokens: number
  estado: 'Activo' | 'Inactivo'
}

export interface Pago {
  fecha: string
  monto: number
  estado: 'Pagado' | 'Pendiente'
  tipo: 'Cuota' | 'Extraordinario'
}

export interface Propuesta {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  estado: 'Activa' | 'Cerrada' | 'Aprobada' | 'Rechazada'
  votosAFavor: number
  votosEnContra: number
}

export interface Proveedor {
  nombre: string
  servicio: string
  contrato: 'Activo' | 'Inactivo'
  fechaInicio: string
  fechaFin?: string
}

export interface EstadoCuenta {
  ingresos: number
  gastos: number
  balance: number
  fecha: string
} 