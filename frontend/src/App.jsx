import { AuthProvider, useAuth } from './lib/auth'
import { CartProvider } from './lib/cart'
import { ToastProvider } from './lib/toast'
import { Redirect, Router, Link, usePath } from './lib/router'
import { CartDrawer, Footer, Navbar } from './components/Layout'
import { Empty } from './components/ui'

import Home from './pages/Home'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import Reserve from './pages/Reserve'
import Reviews from './pages/Reviews'
import Account from './pages/Account'
import Auth from './pages/Auth'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Orders from './pages/admin/Orders'
import Reservations from './pages/admin/Reservations'
import MenuAdmin from './pages/admin/MenuAdmin'
import Tables from './pages/admin/Tables'
import Staff from './pages/admin/Staff'
import ReviewsAdmin from './pages/admin/ReviewsAdmin'

const PUBLIC = {
  '/': Home, '/carta': Menu, '/checkout': Checkout, '/reservar': Reserve, '/resenas': Reviews,
  '/cuenta': Account, '/ingresar': Auth, '/registro': Auth,
}
const ADMIN = {
  '/admin': Dashboard, '/admin/pedidos': Orders, '/admin/reservas': Reservations, '/admin/carta': MenuAdmin,
  '/admin/mesas': Tables, '/admin/empleados': Staff, '/admin/usuarios': Users, '/admin/resenas': ReviewsAdmin,
}

const NotFound = () => (
  <div className="container page narrow">
    <Empty icon="search" title="Esta página no existe" action={<Link to="/" className="btn btn-dark">Volver al inicio</Link>}>Revisa la dirección o vuelve al inicio.</Empty>
  </div>
)

function Routes() {
  const path = usePath().replace(/(.)\/$/, '$1')
  const { user, isAdmin } = useAuth()

  if (path === '/admin' || path.startsWith('/admin/')) {
    if (!user) return <Redirect to={`/ingresar?next=${encodeURIComponent(path)}`} />
    if (!isAdmin) {
      return (
        <>
          <Navbar />
          <main className="container page narrow"><Empty icon="alert" title="Esta zona es solo para administradores" action={<Link to="/" className="btn btn-dark">Volver al inicio</Link>}>Tu cuenta no tiene permisos de administración.</Empty></main>
        </>
      )
    }
    const Page = ADMIN[path]
    return <AdminLayout>{Page ? <Page /> : <NotFound />}</AdminLayout>
  }

  const Page = PUBLIC[path] || NotFound
  const bare = path === '/ingresar' || path === '/registro'
  return (
    <>
      {!bare && <Navbar />}
      <main>{<Page />}</main>
      {!bare && <Footer />}
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}
