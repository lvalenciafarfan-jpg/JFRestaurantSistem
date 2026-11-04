import { NavLink, Link, useNavigate } from '../../lib/router'
import { useAuth } from '../../lib/auth'
import { Brand } from '../../components/Layout'
import { Icon } from '../../components/ui'

const LINKS = [
  ['/admin', 'grid', 'Resumen', true],
  ['/admin/pedidos', 'receipt', 'Pedidos'],
  ['/admin/reservas', 'calendar', 'Reservas'],
  ['/admin/carta', 'utensils', 'Carta'],
  ['/admin/mesas', 'table', 'Mesas'],
  ['/admin/empleados', 'users', 'Empleados'],
  ['/admin/usuarios', 'user', 'Usuarios'],
  ['/admin/resenas', 'message', 'Reseñas'],
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="admin">
      <aside className="admin-side">
        <Brand to="/admin" />
        <span className="admin-tag">Panel de administración</span>
        <nav aria-label="Administración">
          {LINKS.map(([to, icon, label, end]) => (
            <NavLink key={to} to={to} end={end}><Icon name={icon} size={19} />{label}</NavLink>
          ))}
        </nav>
        <div className="admin-foot">
          <Link to="/"><Icon name="external" size={17} />Ver el sitio</Link>
          <button onClick={() => { logout(); navigate('/') }}><Icon name="logout" size={17} />Salir ({user.nombre.split(' ')[0]})</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
