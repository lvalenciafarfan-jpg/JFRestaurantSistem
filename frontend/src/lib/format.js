const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
export const money = (n) => cop.format(Number(n || 0))

const parse = (v) => (v ? new Date(v) : null)
export const fmtDate = (v) => parse(v)?.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) ?? ''
export const fmtTime = (v) => parse(v)?.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) ?? ''
export const fmtDateTime = (v) => (v ? `${fmtDate(v)}, ${fmtTime(v)}` : '')
export const fmtLong = (v) => parse(v)?.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) ?? ''

const pad = (n) => String(n).padStart(2, '0')
export const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// LocalDateTime de Java: sin zona horaria, "2026-10-05T19:00:00"
export const toLocalISO = (d) => `${dayStr(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
export const sameDay = (a, b) => dayStr(new Date(a)) === dayStr(new Date(b))
export const minutesLabel = (m) => (m % 60 === 0 ? `${m / 60} h` : `${Math.floor(m / 60)} h ${m % 60} min`)

// Etiquetas y tonos de los enums del backend
export const ESTADO_PEDIDO = {
  PENDIENTE: ['Pendiente', 'amber'],
  EN_PREPARACION: ['En preparación', 'blue'],
  EN_CAMINO: ['En camino', 'violet'],
  ENTREGADO: ['Entregado', 'green'],
  CANCELADO: ['Cancelado', 'red'],
}
export const ESTADO_RESERVA = {
  PENDIENTE: ['Pendiente', 'amber'],
  CONFIRMADA: ['Confirmada', 'green'],
  CANCELADA: ['Cancelada', 'red'],
  COMPLETADA: ['Completada', 'blue'],
  NO_SHOW: ['No asistió', 'gray'],
}
export const ESTADO_MESA = {
  DISPONIBLE: ['Disponible', 'green'],
  RESERVADA: ['Con reservas', 'amber'],
  OCUPADA: ['Ocupada', 'red'],
  FUERADS: ['Fuera de servicio', 'gray'],
}
export const TIPO_PEDIDO = {
  A_DOMICILIO: 'A domicilio',
  PARA_RECOGER: 'Para recoger',
  CONSUMO_MESA: 'Comer en el restaurante',
}
export const METODO_PAGO = { EFECTIVO: 'Efectivo', VIRTUAL: 'Pago virtual' }
