import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { Link } from '../../lib/router'
import { ESTADO_PEDIDO, ESTADO_RESERVA, dayStr, fmtDateTime, money, sameDay } from '../../lib/format'
import { Badge, ErrorBox, PageHead, Spinner, Stars } from '../../components/ui'

const ACTIVOS = ['PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO']

export default function Dashboard() {
  const pedidos = useApi(() => api.get('/pedidos'), [], { interval: 30000 })
  const reservas = useApi(() => api.get('/reservas'), [], { interval: 30000 })
  const prom = useApi(() => api.get('/resenas/promedio'), [])

  if (pedidos.loading || reservas.loading) return <><PageHead title="Resumen" /><Spinner /></>
  const err = pedidos.error || reservas.error
  if (err) return <><PageHead title="Resumen" /><ErrorBox error={err} onRetry={() => { pedidos.reload(); reservas.reload() }} /></>

  const now = new Date()
  const P = pedidos.data || []
  const R = reservas.data || []
  const validos = P.filter((p) => p.estadoPedido !== 'CANCELADO')
  const hoy = validos.filter((p) => sameDay(p.fecha, now))
  const ventasHoy = hoy.reduce((n, p) => n + Number(p.total), 0)
  const enCurso = P.filter((p) => ACTIVOS.includes(p.estadoPedido))
  const reservasHoy = R.filter((r) => sameDay(r.horaInicio, now) && !['CANCELADA', 'NO_SHOW'].includes(r.estadoReserva))
  const porConfirmar = R.filter((r) => r.estadoReserva === 'PENDIENTE')
  const proximas = R.filter((r) => ['PENDIENTE', 'CONFIRMADA'].includes(r.estadoReserva) && new Date(r.horaInicio) >= now)
    .sort((a, b) => new Date(a.horaInicio) - new Date(b.horaInicio)).slice(0, 5)

  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i))
    const total = validos.filter((p) => dayStr(new Date(p.fecha)) === dayStr(d)).reduce((n, p) => n + Number(p.total), 0)
    return { d, total, label: d.toLocaleDateString('es-CO', { weekday: 'short' }) }
  })
  const max = Math.max(...dias.map((x) => x.total), 1)

  return (
    <>
      <PageHead title="Resumen">Así va el restaurante hoy. Se actualiza solo cada 30 segundos.</PageHead>

      <div className="kpis">
        <div><span>Ventas de hoy</span><b className="num">{money(ventasHoy)}</b><small>{hoy.length} {hoy.length === 1 ? 'pedido' : 'pedidos'}</small></div>
        <div><span>Pedidos en curso</span><b className="num">{enCurso.length}</b><small><Link to="/admin/pedidos" className="text-link">Abrir tablero</Link></small></div>
        <div><span>Reservas de hoy</span><b className="num">{reservasHoy.length}</b><small>{porConfirmar.length} por confirmar</small></div>
        <div><span>Calificación</span><b className="num">{prom.data != null ? Number(prom.data).toFixed(1) : '–'}</b><small><Stars value={Number(prom.data || 0)} size={14} /></small></div>
      </div>

      <div className="dash-grid">
        <section className="panel">
          <h2>Ventas de los últimos 7 días</h2>
          <svg viewBox="0 0 560 220" className="chart" role="img" aria-label="Ventas por día">
            {dias.map((x, i) => {
              const h = Math.round((x.total / max) * 150)
              return (
                <g key={i} transform={`translate(${i * 80 + 12},0)`}>
                  <rect x="0" y={170 - h} width="56" height={Math.max(h, 2)} rx="6" className={i === 6 ? 'bar today' : 'bar'} />
                  {x.total > 0 && <text x="28" y={162 - h} textAnchor="middle" className="bar-val">{x.total >= 1000 ? `${Math.round(x.total / 1000)}k` : x.total}</text>}
                  <text x="28" y="196" textAnchor="middle" className="bar-lbl">{x.label}</text>
                </g>
              )
            })}
          </svg>
        </section>

        <section className="panel">
          <h2>Próximas reservas</h2>
          {proximas.length === 0 ? <p className="muted">No hay reservas próximas.</p> : (
            <ul className="mini-list">
              {proximas.map((r) => (
                <li key={r.id}>
                  <div><strong>Mesa {r.mesaResponse?.numeroMesa} · {r.cantidadPersonas} p.</strong><span className="muted">{fmtDateTime(r.horaInicio)}</span></div>
                  <Badge map={ESTADO_RESERVA} value={r.estadoReserva} />
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/reservas" className="text-link">Ver todas las reservas</Link>
        </section>

        <section className="panel span2">
          <h2>Pedidos en curso</h2>
          {enCurso.length === 0 ? <p className="muted">No hay pedidos activos en este momento.</p> : (
            <ul className="mini-list">
              {enCurso.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <div><strong>Pedido #{p.id} · {money(p.total)}</strong><span className="muted">{fmtDateTime(p.fecha)}, {p.items?.length || 0} {p.items?.length === 1 ? 'producto' : 'productos'}</span></div>
                  <Badge map={ESTADO_PEDIDO} value={p.estadoPedido} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
