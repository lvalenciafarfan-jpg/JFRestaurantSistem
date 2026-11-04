import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { fmtLong } from '../../lib/format'
import { Badge, Empty, ErrorBox, Field, Icon, Modal, PageHead, Spinner } from '../../components/ui'

const ESTADO = { ACTIVO: ['Activo', 'green'], INACTIVO: ['Inactivo', 'gray'] }
const BLANK = { cargo: '', fechaContratacion: '', horarioAsignado: '', usuarioId: '' }

export default function Staff() {
  const toast = useToast()
  const { data, loading, error, reload } = useApi(() => api.get('/empleados'), [])
  const usuarios = useApi(() => api.get('/usuarios'), [])
  const [edit, setEdit] = useState(null) // null | 'new' | empleado
  const [f, setF] = useState(BLANK)
  const [busy, setBusy] = useState(false)

  const open = (e) => {
    setEdit(e)
    setF(e === 'new' ? BLANK : { cargo: e.cargo, fechaContratacion: e.fechaContratacion, horarioAsignado: e.horarioAsignado, usuarioId: e.usuarioId ?? '' })
  }
  const set = (k) => (ev) => setF({ ...f, [k]: ev.target.value })

  const submit = async (ev) => {
    ev.preventDefault()
    setBusy(true)
    const body = { cargo: f.cargo.trim(), fechaContratacion: f.fechaContratacion, horarioAsignado: f.horarioAsignado.trim(), usuarioId: f.usuarioId ? Number(f.usuarioId) : null }
    try {
      edit === 'new' ? await api.post('/empleados', body) : await api.put(`/empleados/${edit.id}`, body)
      toast.ok(edit === 'new' ? 'Empleado agregado' : 'Empleado actualizado'); setEdit(null); reload()
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  const deactivate = async (e) => {
    if (!window.confirm(`¿Desactivar a ${e.nombreUsuario || e.cargo}?`)) return
    try { await api.del(`/empleados/${e.id}`); toast.ok('Empleado desactivado'); reload() } catch (err) { toast.err(err.message) }
  }

  const lista = data || []
  const vinculados = new Set(lista.map((e) => e.usuarioId).filter(Boolean))
  const libres = (usuarios.data || []).filter((u) => !vinculados.has(u.id))
  return (
      <>
        <PageHead title="Empleados" action={<button className="btn btn-dark" onClick={() => open('new')}><Icon name="plus" size={18} /> Nuevo empleado</button>}>Tu equipo, sus cargos y horarios.</PageHead>
        {loading && <Spinner />}
        <ErrorBox error={error} onRetry={reload} />
        {!loading && !error && lista.length === 0 && <Empty icon="users" title="Aún no hay empleados" action={<button className="btn btn-dark" onClick={() => open('new')}>Agregar empleado</button>} />}
        {lista.length > 0 && (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Empleado</th><th>Cargo</th><th>Horario</th><th>Contratación</th><th>Estado</th><th><span className="sr">Acciones</span></th></tr></thead>
                <tbody>
                {lista.map((e) => (
                    <tr key={e.id}>
                      <td><strong>{e.nombreUsuario || 'Sin cuenta vinculada'}</strong></td>
                      <td>{e.cargo}</td><td>{e.horarioAsignado}</td><td>{fmtLong(`${e.fechaContratacion}T00:00:00`)}</td>
                      <td><Badge map={ESTADO} value={e.estado} /></td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => open(e)} aria-label="Editar"><Icon name="edit" size={18} /></button>
                        {e.estado === 'ACTIVO' && <button className="icon-btn danger" onClick={() => deactivate(e)} aria-label="Desactivar"><Icon name="trash" size={18} /></button>}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
        {edit && (
            <Modal title={edit === 'new' ? 'Nuevo empleado' : 'Editar empleado'} onClose={() => setEdit(null)}>
              <form onSubmit={submit} className="stack">
                <Field label="Cargo"><input className="input" value={f.cargo} onChange={set('cargo')} placeholder="Mesero, cocinero, cajero…" required autoFocus /></Field>
                <div className="row2">
                  <Field label="Fecha de contratación"><input className="input" type="date" value={f.fechaContratacion} onChange={set('fechaContratacion')} required /></Field>
                  <Field label="Horario asignado"><input className="input" value={f.horarioAsignado} onChange={set('horarioAsignado')} placeholder="Lun a vie, 8:00 a 16:00" required /></Field>
                </div>
                {edit === 'new' && (
                    <Field label="Cuenta del empleado (opcional)" hint={usuarios.error ? 'No pudimos cargar los usuarios. Puedes crear al empleado sin cuenta y vincularla después.' : 'Solo aparecen personas con cuenta que aún no son empleados.'}>
                      <select className="input" value={f.usuarioId} onChange={set('usuarioId')} disabled={usuarios.loading}>
                        <option value="">Sin cuenta vinculada</option>
                        {libres.map((u) => <option key={u.id} value={u.id}>{u.nombre} ({u.correo})</option>)}
                      </select>
                    </Field>
                )}
                <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancelar</button><button className="btn btn-dark" disabled={busy}>Guardar</button></div>
              </form>
            </Modal>
        )}
      </>
  )
}
