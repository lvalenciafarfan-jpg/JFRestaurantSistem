import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { ESTADO_RESERVA, fmtDateTime, fmtTime, sameDay } from '../../lib/format'
import { Badge, Empty, ErrorBox, PageHead, Spinner } from '../../components/ui'

const NEXT = { PENDIENTE: ['CONFIRMADA', 'CANCELADA'], CONFIRMADA: ['COMPLETADA', 'NO_SHOW'], NO_SHOW: ['CANCELADA'], CANCELADA: [], COMPLETADA: [] }
const VERB = { CONFIRMADA: 'Confirmar', CANCELADA: 'Cancelar', COMPLETADA: 'Completar', NO_SHOW: 'No asistió' }

export default function Reservations() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/reservas'), [], { interval: 30000 })
  const [estado, setEstado] = useState('')
  const [dia, setDia] = useState('')

  const move = async (r, nuevo) => {
    if (nuevo === 'CANCELADA' && !window.confirm('¿Cancelar esta reserva?')) return
    try { await api.put(`/reservas/${r.id}/estado`, undefined, { params: { nuevoEstado: nuevo } }); toast.ok(`Reserva #${r.id} ${ESTADO_RESERVA[nuevo][0].toLowerCase()}`); reload() } catch (e) { toast.err(e.message) }
  }

  const lista = (data || [])
    .filter((r) => (!estado || r.estadoReserva === estado) && (!dia || sameDay(r.horaInicio, `${dia}T12:00:00`)))
    .sort((a, b) => new Date(b.horaInicio) - new Date(a.horaInicio))

  return (
    <>
      <PageHead title="Reservas">Confirma, completa o cancela las reservas de tus clientes.</PageHead>
      <div className="filters">
        <label className="field"><span>Estado</span>
          <select className="input" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(ESTADO_RESERVA).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="field"><span>Día</span><input className="input" type="date" value={dia} onChange={(e) => setDia(e.target.value)} /></label>
        {(estado || dia) && <button className="btn btn-ghost btn-sm" onClick={() => { setEstado(''); setDia('') }}>Quitar filtros</button>}
      </div>
      {loading && <Spinner />}
      <ErrorBox error={error} onRetry={reload} />
      {!loading && !error && lista.length === 0 && <Empty icon="calendar" title="No hay reservas con estos filtros" />}
      {lista.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>#</th><th>Cuándo</th><th>Mesa</th><th>Personas</th><th>Estado</th><th><span className="sr">Acciones</span></th></tr></thead>
            <tbody>
              {lista.map((r) => (
                <tr key={r.id}>
                  <td className="num">{r.id}</td>
                  <td>{fmtDateTime(r.horaInicio)}{r.horaFin ? ` a ${fmtTime(r.horaFin)}` : ''}</td>
                  <td>Mesa {r.mesaResponse?.numeroMesa}</td>
                  <td className="num">{r.cantidadPersonas}</td>
                  <td><Badge map={ESTADO_RESERVA} value={r.estadoReserva} /></td>
                  <td className="actions">
                    {NEXT[r.estadoReserva].map((n) => <button key={n} className={`btn btn-sm ${n === 'CANCELADA' ? 'btn-ghost danger-text' : 'btn-dark'}`} onClick={() => move(r, n)}>{VERB[n]}</button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
