import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { money } from '../../lib/format'
import { DishImage, Empty, ErrorBox, Field, Icon, Modal, PageHead, Spinner } from '../../components/ui'
import { catOf } from '../Menu'

const EMPTY = { nombre: '', descripcion: '', precio: '', urlImagen: '', disponibilidadProducto: 'ACTIVO', categoriaId: '' }

function ProductForm({ product, categorias, onClose, onSaved }) {
  const toast = useToast()
  const [f, setF] = useState(product ? {
    nombre: product.nombre, descripcion: product.descripcion, precio: product.precio, urlImagen: product.urlImagen,
    disponibilidadProducto: product.disponibilidadProducto, categoriaId: product.categoriaId ?? '',
  } : EMPTY)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const sinIds = categorias.length > 0 && categorias.every((c) => c.id == null)

  const submit = async (e) => {
    e.preventDefault()
    if (f.nombre.trim().length < 5) return toast.err('El nombre debe tener entre 5 y 50 caracteres.')
    if (f.descripcion.trim().length < 10) return toast.err('La descripción debe tener entre 10 y 255 caracteres.')
    if (!f.categoriaId) return toast.err('Elige una categoría.')
    setBusy(true)
    const body = { ...f, nombre: f.nombre.trim(), descripcion: f.descripcion.trim(), precio: Number(f.precio), categoriaId: Number(f.categoriaId) }
    try {
      product ? await api.put(`/productos/${product.id}`, body) : await api.post('/productos', body)
      toast.ok(product ? 'Plato actualizado' : 'Plato creado')
      onSaved()
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  return (
    <Modal title={product ? 'Editar plato' : 'Nuevo plato'} onClose={onClose}>
      <form onSubmit={submit} className="stack">
        <Field label="Nombre"><input className="input" value={f.nombre} onChange={set('nombre')} maxLength={50} required /></Field>
        <Field label="Descripción" hint={`${f.descripcion.length}/255`}><textarea className="input" rows="3" value={f.descripcion} onChange={set('descripcion')} maxLength={255} required /></Field>
        <div className="row2">
          <Field label="Precio (COP)"><input className="input" type="number" min="0" step="100" value={f.precio} onChange={set('precio')} required /></Field>
          <Field label="Estado">
            <select className="input" value={f.disponibilidadProducto} onChange={set('disponibilidadProducto')}>
              <option value="ACTIVO">Disponible</option><option value="AGOTADO">Agotado</option>
            </select>
          </Field>
        </div>
        <Field label="Categoría" hint={sinIds ? 'Tu backend aún no devuelve el id de las categorías. Revisa los cambios sugeridos.' : null}>
          <select className="input" value={f.categoriaId} onChange={set('categoriaId')} required>
            <option value="">Elige una categoría</option>
            {categorias.map((c, i) => <option key={c.id ?? i} value={c.id ?? ''} disabled={c.id == null}>{c.nombre}</option>)}
          </select>
        </Field>
        <Field label="URL de la imagen">
          <input className="input" type="url" value={f.urlImagen} onChange={set('urlImagen')} placeholder="https://…" required />
        </Field>
        {f.urlImagen && <DishImage src={f.urlImagen} name={f.nombre} className="form-preview" />}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-dark" disabled={busy}>{busy ? 'Guardando…' : 'Guardar plato'}</button>
        </div>
      </form>
    </Modal>
  )
}

function CategoryForm({ onClose, onSaved }) {
  const toast = useToast()
  const [nombre, setNombre] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await api.post('/categorias', { nombre: nombre.trim() }); toast.ok('Categoría creada'); onSaved() } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }
  return (
    <Modal title="Nueva categoría" onClose={onClose}>
      <form onSubmit={submit} className="stack">
        <Field label="Nombre" hint="Entre 3 y 30 caracteres."><input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} minLength={3} maxLength={30} required autoFocus /></Field>
        <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-dark" disabled={busy}>Crear categoría</button></div>
      </form>
    </Modal>
  )
}

export default function MenuAdmin() {
  const toast = useToast()
  const prod = useApi(() => api.get('/productos/admins'), [])
  const cats = useApi(() => api.get('/categorias'), [])
  const [edit, setEdit] = useState(null) // null | 'new' | producto
  const [catModal, setCatModal] = useState(false)

  const toggle = async (p) => {
    const agotado = p.disponibilidadProducto === 'AGOTADO'
    try { await api.put(`/productos/${p.id}/${agotado ? 'activar' : 'desactivar'}`); toast.ok(agotado ? 'Plato disponible de nuevo' : 'Plato marcado como agotado'); prod.reload() } catch (e) { toast.err(e.message) }
  }

  const lista = prod.data || []
  return (
    <>
      <PageHead title="Carta" action={
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={() => setCatModal(true)}>Nueva categoría</button>
          <button className="btn btn-dark" onClick={() => setEdit('new')}><Icon name="plus" size={18} /> Nuevo plato</button>
        </div>
      }>Administra los platos que ven tus clientes. Los agotados se ocultan de la carta pública.</PageHead>

      {(cats.data || []).length > 0 && <div className="chips static">{cats.data.map((c, i) => <span key={c.id ?? i} className="chip">{c.nombre}</span>)}</div>}
      {prod.loading && <Spinner />}
      <ErrorBox error={prod.error} onRetry={prod.reload} />
      {!prod.loading && !prod.error && lista.length === 0 && <Empty icon="utensils" title="Tu carta está vacía" action={<button className="btn btn-dark" onClick={() => setEdit('new')}>Crear el primer plato</button>}>Crea una categoría y agrega tu primer plato.</Empty>}

      {lista.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Plato</th><th>Categoría</th><th>Precio</th><th>Estado</th><th><span className="sr">Acciones</span></th></tr></thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td><div className="cell-dish"><DishImage src={p.urlImagen} name={p.nombre} className="thumb" /><div><strong>{p.nombre}</strong><span className="muted clamp">{p.descripcion}</span></div></div></td>
                  <td>{catOf(p) || <span className="muted">Sin dato</span>}</td>
                  <td className="num">{money(p.precio)}</td>
                  <td>
                    <button className={`switch ${p.disponibilidadProducto === 'ACTIVO' ? 'on' : ''}`} role="switch" aria-checked={p.disponibilidadProducto === 'ACTIVO'} onClick={() => toggle(p)} aria-label={`Disponibilidad de ${p.nombre}`}>
                      <i />
                    </button>
                    <span className="switch-lbl">{p.disponibilidadProducto === 'ACTIVO' ? 'Disponible' : 'Agotado'}</span>
                  </td>
                  <td className="actions"><button className="icon-btn" onClick={() => setEdit(p)} aria-label={`Editar ${p.nombre}`}><Icon name="edit" size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {edit && <ProductForm product={edit === 'new' ? null : edit} categorias={cats.data || []} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); prod.reload() }} />}
      {catModal && <CategoryForm onClose={() => setCatModal(false)} onSaved={() => { setCatModal(false); cats.reload() }} />}
    </>
  )
}
