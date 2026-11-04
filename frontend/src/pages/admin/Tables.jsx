import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { ESTADO_MESA } from '../../lib/format'
import { Badge, Empty, ErrorBox, Field, Icon, Modal, PageHead, Spinner } from '../../components/ui'

export default function Tables() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/mesas'), [])
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ numeroMesa: '', capacidad: 4 })
  const [busy, setBusy] = useState(false)
  const lista = (data || []).slice().sort((a, b) => a.numeroMesa - b.numeroMesa)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post('/mesas', { numeroMesa: Number(f.numeroMesa), capacidad: Number(f.capacidad) })
      toast.ok('Mesa creada'); setOpen(false); setF({ numeroMesa: '', capacidad: 4 }); reload()
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  return (
    <>
      <PageHead title="Mesas" action={<button className="btn btn-dark" onClick={() => setOpen(true)}><Icon name="plus" size={18} /> Nueva mesa</button>}>
        Plano de mesas del restaurante. El estado cambia solo según las reservas.
      </PageHead>
      {loading && <Spinner />}
      <ErrorBox error={error} onRetry={reload} />
      {!loading && !error && lista.length === 0 && <Empty icon="table" title="Aún no hay mesas" action={<button className="btn btn-dark" onClick={() => setOpen(true)}>Crear la primera mesa</button>}>Sin mesas, los clientes no pueden reservar.</Empty>}
      <div className="mesa-grid admin-mesas">
        {lista.map((m) => (
          <div key={m.id} className="mesa static">
            <b className="num">{m.numeroMesa}</b>
            <span className="seats" aria-hidden="true">{Array.from({ length: Math.min(m.capacidad, 10) }).map((_, i) => <i key={i} />)}</span>
            <small>{m.capacidad} puestos</small>
            <Badge map={ESTADO_MESA} value={m.estadoMesa} />
          </div>
        ))}
      </div>
      {open && (
        <Modal title="Nueva mesa" onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="stack">
            <div className="row2">
              <Field label="Número de mesa"><input className="input" type="number" min="1" value={f.numeroMesa} onChange={(e) => setF({ ...f, numeroMesa: e.target.value })} required autoFocus /></Field>
              <Field label="Capacidad"><input className="input" type="number" min="1" max="30" value={f.capacidad} onChange={(e) => setF({ ...f, capacidad: e.target.value })} required /></Field>
            </div>
            <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button><button className="btn btn-dark" disabled={busy}>Crear mesa</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
