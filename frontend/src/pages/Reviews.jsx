import { useState } from 'react'
import { api } from '../lib/api'
import { useApi } from '../lib/hooks'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { fmtLong } from '../lib/format'
import { Empty, ErrorBox, Field, Icon, LoginGate, PageHead, Spinner, StarInput, Stars } from '../components/ui'

export default function Reviews() {
  const { user, isAdmin } = useAuth()
  const toast = useToast()
  const [page, setPage] = useState(0)
  const list = useApi(() => api.get('/resenas', { params: { page, size: 6 } }), [page])
  const avg = useApi(() => api.get('/resenas/promedio'), [])
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const data = list.data
  const items = data?.content || []
  const totalPages = data?.totalPages ?? data?.page?.totalPages ?? 1
  const total = data?.totalElements ?? data?.page?.totalElements ?? items.length

  const submit = async (e) => {
    e.preventDefault()
    if (!stars) return toast.err('Elige de 1 a 5 estrellas.')
    if (text.trim().length < 5) return toast.err('Cuéntanos un poco más: mínimo 5 caracteres.')
    setBusy(true)
    try {
      await api.post('/resenas', { calificacion: stars, comentario: text.trim() })
      toast.ok('Gracias por tu reseña')
      setStars(0); setText(''); setPage(0)
      list.reload(); avg.reload()
    } catch (err) { toast.err(err.message) } finally { setBusy(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return
    try { await api.del(`/resenas/${id}`); toast.ok('Reseña eliminada'); list.reload(); avg.reload() } catch (err) { toast.err(err.message) }
  }

  return (
    <div className="container page">
      <PageHead title="Reseñas">Opiniones reales de quienes ya pasaron por nuestra mesa.</PageHead>
      <div className="reviews-layout">
        <div>
          <div className="avg avg-lg">
            <b className="num">{avg.data != null ? Number(avg.data).toFixed(1) : '–'}</b>
            <div><Stars value={Number(avg.data || 0)} size={24} /><span>{total} {total === 1 ? 'reseña' : 'reseñas'}</span></div>
          </div>
          {list.loading && <Spinner label="Cargando reseñas" />}
          <ErrorBox error={list.error} onRetry={list.reload} />
          {!list.loading && !list.error && items.length === 0 && <Empty icon="message" title="Todavía no hay reseñas">Cuando alguien cuente su experiencia, la verás aquí.</Empty>}
          <div className="review-list">
            {items.map((r) => (
              <article key={r.id} className="review">
                <div className="review-top"><Stars value={r.calificacion} size={17} /><time>{fmtLong(r.fecha)}</time></div>
                <p>{r.comentario}</p>
                <footer>
                  <span>{r.nombreUsuario || 'Cliente'}</span>
                  {isAdmin && <button className="icon-btn danger" onClick={() => remove(r.id)} aria-label="Eliminar reseña"><Icon name="trash" size={18} /></button>}
                </footer>
              </article>
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="pager" aria-label="Paginación">
              <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
              <span>Página {page + 1} de {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
            </nav>
          )}
        </div>

        <aside className="panel">
          <h2>Deja tu reseña</h2>
          {user ? (
            <form onSubmit={submit} className="stack">
              <div className="field"><span>Tu calificación</span><StarInput value={stars} onChange={setStars} /></div>
              <Field label="Tu comentario" hint={`${text.length}/100 caracteres`}>
                <textarea className="input" rows="4" maxLength={100} value={text} onChange={(e) => setText(e.target.value)} placeholder="¿Qué fue lo mejor de tu visita?" />
              </Field>
              <button className="btn btn-dark btn-block" disabled={busy}>{busy ? 'Publicando…' : 'Publicar reseña'}</button>
              <p className="muted small">Puedes dejar una sola reseña por cuenta.</p>
            </form>
          ) : (
            <LoginGate title="Ingresa para opinar" next="/resenas">Solo los clientes con cuenta pueden dejar reseñas.</LoginGate>
          )}
        </aside>
      </div>
    </div>
  )
}
