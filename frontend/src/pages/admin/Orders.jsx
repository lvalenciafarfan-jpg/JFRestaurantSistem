import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { ESTADO_PEDIDO, TIPO_PEDIDO, METODO_PAGO, fmtTime, money } from '../../lib/format'
import { Badge, ErrorBox, PageHead, Spinner } from '../../components/ui'

const COLS = ['PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO']
const NEXT = { PENDIENTE: ['EN_PREPARACION', 'CANCELADO'], EN_PREPARACION: ['EN_CAMINO', 'ENTREGADO'], EN_CAMINO: ['ENTREGADO'], ENTREGADO: [], CANCELADO: [] }
const VERB = { EN_PREPARACION: 'Preparar', EN_CAMINO: 'Enviar', ENTREGADO: 'Entregar', CANCELADO: 'Cancelar' }

export default function Orders() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/pedidos'), [], { interval: 15000 })

  const move = async (p, estado) => {
    if (estado === 'CANCELADO' && !window.confirm(`¿Cancelar el pedido #${p.id}?`)) return
    try { await api.put(`/pedidos/${p.id}/estado`, undefined, { params: { nuevoEstado: estado } }); toast.ok(`Pedido #${p.id}: ${ESTADO_PEDIDO[estado][0].toLowerCase()}`); reload() } catch (e) { toast.err(e.message) }
  }

  const pedidos = (data || []).slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  return (
    <>
      <PageHead title="Pedidos">Tablero de cocina. Se actualiza solo cada 15 segundos.</PageHead>
      {loading && <Spinner />}
      <ErrorBox error={error} onRetry={reload} />
      {!loading && !error && (
        <div className="kanban">
          {COLS.map((estado) => {
            const col = pedidos.filter((p) => p.estadoPedido === estado)
            const closed = estado === 'ENTREGADO' || estado === 'CANCELADO'
            return (
              <section key={estado} className="kcol">
                <h2><Badge map={ESTADO_PEDIDO} value={estado} /><span className="kcount">{col.length}</span></h2>
                {col.length === 0 && <p className="muted small kempty">Sin pedidos</p>}
                {(closed ? col.slice(0, 6) : col).map((p) => (
                  <article key={p.id} className="kcard">
                    <header><strong>#{p.id}</strong><span className="muted">{fmtTime(p.fecha)}</span><b className="num">{money(p.total)}</b></header>
                    <p className="ktype">{TIPO_PEDIDO[p.tipoPedido]} · {METODO_PAGO[p.metodoPago]}</p>
                    {p.direccion && <p className="kaddr">{p.direccion}</p>}
                    <ul>{p.items?.map((i) => <li key={i.productoId}><b>{i.cantidad}×</b> {i.nombreProducto}</li>)}</ul>
                    {NEXT[estado].length > 0 && (
                      <div className="kactions">
                        {NEXT[estado].filter((n) => n !== 'EN_CAMINO' || p.tipoPedido === 'A_DOMICILIO').map((n) => (
                          <button key={n} className={`btn btn-sm ${n === 'CANCELADO' ? 'btn-ghost danger-text' : 'btn-dark'}`} onClick={() => move(p, n)}>{VERB[n]}</button>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
                {closed && col.length > 6 && <p className="muted small kempty">y {col.length - 6} más antiguos</p>}
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
