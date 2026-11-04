import { useState } from 'react'
import { api } from '../lib/api'
import { useApi } from '../lib/hooks'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Link, Redirect, useQuery } from '../lib/router'
import { ESTADO_PEDIDO, ESTADO_RESERVA, TIPO_PEDIDO, METODO_PAGO, fmtDateTime, fmtTime, money } from '../lib/format'
import { Badge, Empty, ErrorBox, Icon, PageHead, Spinner } from '../components/ui'

function Pedidos() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/pedidos/mios'), [], { interval: 20000 })
  const cancel = async (id) => {
    if (!window.confirm('¿Cancelar este pedido?')) return
    try { await api.put(`/pedidos/${id}/cancelar`); toast.ok('Pedido cancelado'); reload() } catch (e) { toast.err(e.message) }
  }
  const lista = (data || []).slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  if (loading) return <Spinner label="Cargando tus pedidos" />
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!lista.length) return <Empty icon="receipt" title="Aún no has hecho pedidos" action={<Link to="/carta" className="btn btn-dark">Ver la carta</Link>}>Cuando pidas algo, lo verás aquí con su estado.</Empty>
  return (
    <div className="stack">
      {lista.map((p) => (
        <article key={p.id} className="order">
          <header>
            <div><strong>Pedido #{p.id}</strong><span className="muted">{fmtDateTime(p.fecha)}</span></div>
            <Badge map={ESTADO_PEDIDO} value={p.estadoPedido} />
          </header>
          <ul>{p.items?.map((i) => <li key={i.productoId}><span>{i.cantidad} × {i.nombreProducto}</span><b className="num">{money(i.subtotal)}</b></li>)}</ul>
          <footer>
            <span className="muted">{TIPO_PEDIDO[p.tipoPedido]} · {METODO_PAGO[p.metodoPago]}{p.direccion ? ` · ${p.direccion}` : ''}</span>
            <div className="order-end">
              {p.estadoPedido === 'PENDIENTE' && <button className="btn btn-ghost btn-sm danger-text" onClick={() => cancel(p.id)}>Cancelar</button>}
              <b className="num">{money(p.total)}</b>
            </div>
          </footer>
        </article>
      ))}
    </div>
  )
}

function Reservas() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/reservas/mias'), [], { interval: 30000 })
  const cancel = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return
    try { await api.put(`/reservas/${id}/cancelar`); toast.ok('Reserva cancelada'); reload() } catch (e) { toast.err(e.message) }
  }
  const lista = (data || []).slice().sort((a, b) => new Date(b.horaInicio) - new Date(a.horaInicio))
  if (loading) return <Spinner label="Cargando tus reservas" />
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!lista.length) return <Empty icon="calendar" title="No tienes reservas" action={<Link to="/reservar" className="btn btn-dark">Reservar una mesa</Link>}>Reserva una mesa y la verás aquí.</Empty>
  return (
    <div className="stack">
      {lista.map((r) => (
        <article key={r.id} className="order">
          <header>
            <div><strong>Mesa {r.mesaResponse?.numeroMesa}</strong><span className="muted">{r.cantidadPersonas} {r.cantidadPersonas === 1 ? 'persona' : 'personas'}</span></div>
            <Badge map={ESTADO_RESERVA} value={r.estadoReserva} />
          </header>
          <footer>
            <span className="muted"><Icon name="clock" size={16} /> {fmtDateTime(r.horaInicio)}{r.horaFin ? ` a ${fmtTime(r.horaFin)}` : ''}</span>
            {r.estadoReserva === 'PENDIENTE' && <button className="btn btn-ghost btn-sm danger-text" onClick={() => cancel(r.id)}>Cancelar</button>}
          </footer>
        </article>
      ))}
    </div>
  )
}

export default function Account() {
  const { user, logout } = useAuth()
  const query = useQuery()
  const [tab, setTab] = useState(query.get('tab') === 'reservas' ? 'reservas' : 'pedidos')
  if (!user) return <Redirect to="/ingresar?next=/cuenta" />
  return (
    <div className="container page narrow-lg">
      <PageHead title={`Hola, ${user.nombre.split(' ')[0]}`} action={<button className="btn btn-ghost btn-sm" onClick={logout}>Cerrar sesión</button>}>{user.correo}</PageHead>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'pedidos'} className={tab === 'pedidos' ? 'active' : ''} onClick={() => setTab('pedidos')}>Mis pedidos</button>
        <button role="tab" aria-selected={tab === 'reservas'} className={tab === 'reservas' ? 'active' : ''} onClick={() => setTab('reservas')}>Mis reservas</button>
      </div>
      <div style={{ marginTop: 22 }}>{tab === 'pedidos' ? <Pedidos /> : <Reservas />}</div>
    </div>
  )
}
