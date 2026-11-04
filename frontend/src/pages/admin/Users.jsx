import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../lib/hooks'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { fmtLong } from '../../lib/format'
import { Badge, Empty, ErrorBox, Icon, PageHead, Spinner } from '../../components/ui'

const ROL = { ADMIN: ['Administrador', 'dark'], CLIENTE: ['Cliente', 'gray'] }
const rolDe = (u) => u.rol ?? u.rolUsuario

export default function Users() {
    const { user } = useAuth()
    const toast = useToast()
    const { data, loading, error, reload } = useApi(() => api.get('/usuarios'), [])
    const [q, setQ] = useState('')
    const [busyId, setBusyId] = useState(null)

    const lista = data || []
    const admins = lista.filter((u) => rolDe(u) === 'ADMIN').length
    const visibles = lista.filter((u) => `${u.nombre} ${u.correo} ${u.id}`.toLowerCase().includes(q.trim().toLowerCase()))

    const cambiar = async (u) => {
        const nuevo = rolDe(u) === 'ADMIN' ? 'CLIENTE' : 'ADMIN'
        const msg = nuevo === 'ADMIN'
            ? `¿Dar permisos de administrador a ${u.nombre}? Podrá ver y cambiar pedidos, reservas, carta, empleados y usuarios.`
            : `¿Quitar los permisos de administrador a ${u.nombre}?`
        if (!window.confirm(msg)) return
        setBusyId(u.id)
        try {
            await api.put(`/usuarios/${u.id}/rol`, undefined, { params: { nuevoRol: nuevo } })
            toast.ok(nuevo === 'ADMIN' ? `${u.nombre} ahora es administrador` : `${u.nombre} ya no es administrador`)
            reload()
        } catch (e) { toast.err(e.message) } finally { setBusyId(null) }
    }

    return (
        <>
            <PageHead title="Usuarios">
                Quién tiene cuenta en la web y qué puede hacer. Si cambias el rol de alguien que ya tiene la sesión abierta, debe cerrarla y volver a ingresar para ver el cambio.
            </PageHead>

            {loading && <Spinner />}
            <ErrorBox error={error} onRetry={reload} />
            {error?.status === 404 && <p className="muted small">¿Ya agregaste <code>GET /api/usuarios</code> al backend? Mira los cambios sugeridos.</p>}

            {!loading && !error && (
                <>
                    <div className="filters">
                        <label className="search">
                            <Icon name="search" size={18} />
                            <input type="search" placeholder="Buscar usuario" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar usuarios" />
                        </label>
                        <span className="muted small">{lista.length} {lista.length === 1 ? 'usuario' : 'usuarios'}, {admins} {admins === 1 ? 'administrador' : 'administradores'}</span>
                    </div>

                    {visibles.length === 0 ? (
                        <Empty icon="search" title="No hay usuarios con esa búsqueda" />
                    ) : (
                        <div className="table-wrap">
                            <table className="table">
                                <thead><tr><th>ID</th><th>Usuario</th><th>Teléfono</th><th>Registro</th><th>Rol</th><th><span className="sr">Acciones</span></th></tr></thead>
                                <tbody>
                                {visibles.map((u) => {
                                    const esAdmin = rolDe(u) === 'ADMIN'
                                    const yo = u.correo === user.correo
                                    return (
                                        <tr key={u.id}>
                                            <td className="num">{u.id}</td>
                                            <td><div className="cell-user"><strong>{u.nombre}{yo && <span className="muted"> (tú)</span>}</strong><span className="muted">{u.correo}</span></div></td>
                                            <td>{u.telefono || <span className="muted">Sin dato</span>}</td>
                                            <td>{u.fechaRegistro ? fmtLong(u.fechaRegistro) : ''}</td>
                                            <td><Badge map={ROL} value={rolDe(u)} /></td>
                                            <td className="actions">
                                                <button
                                                    className={`btn btn-sm ${esAdmin ? 'btn-ghost danger-text' : 'btn-dark'}`}
                                                    disabled={yo || busyId === u.id}
                                                    title={yo ? 'No puedes cambiar tu propio rol' : undefined}
                                                    onClick={() => cambiar(u)}
                                                >
                                                    {esAdmin ? 'Quitar admin' : 'Hacer admin'}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </>
    )
}