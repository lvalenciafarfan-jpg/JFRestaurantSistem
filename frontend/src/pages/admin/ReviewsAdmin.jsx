import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useToast } from '../../lib/toast'
import { fmtLong } from '../../lib/format'
import { Empty, ErrorBox, Icon, PageHead, Spinner, Stars } from '../../components/ui'

export default function ReviewsAdmin() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const { data, loading, error, reload } = useApi(() => api.get('/resenas', { params: { page, size: 10 } }), [page])
  const items = data?.content || []
  const totalPages = data?.totalPages ?? data?.page?.totalPages ?? 1

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar esta reseña? No se puede deshacer.')) return
    try { await api.del(`/resenas/${id}`); toast.ok('Reseña eliminada'); reload() } catch (e) { toast.err(e.message) }
  }

  return (
    <>
      <PageHead title="Reseñas">Modera lo que publican tus clientes.</PageHead>
      {loading && <Spinner />}
      <ErrorBox error={error} onRetry={reload} />
      {!loading && !error && items.length === 0 && <Empty icon="message" title="No hay reseñas todavía" />}
      {items.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Calificación</th><th>Comentario</th><th>Cliente</th><th>Fecha</th><th><span className="sr">Acciones</span></th></tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td><Stars value={r.calificacion} size={15} /></td>
                  <td>{r.comentario}</td>
                  <td>{r.nombreUsuario || <span className="muted">Sin dato</span>}</td>
                  <td>{fmtLong(r.fecha)}</td>
                  <td className="actions"><button className="icon-btn danger" onClick={() => remove(r.id)} aria-label="Eliminar reseña"><Icon name="trash" size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <nav className="pager">
          <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page + 1} de {totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </nav>
      )}
    </>
  )
}
