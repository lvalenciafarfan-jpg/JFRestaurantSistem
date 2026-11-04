import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, usePath } from '../lib/router'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { RESTAURANT } from '../config'
import { DishImage, Empty, Icon, Stepper } from './ui'
import { money } from '../lib/format'

export function Brand({ to = '/' }) {
  return (
      <Link to={to} className="brand" aria-label={`${RESTAURANT.name}, ir al inicio`}>
        {RESTAURANT.logo
            ? <img className="brand-logo" src={RESTAURANT.logo} alt="" />
            : <span className="brand-mark">{RESTAURANT.initials}</span>}
        {RESTAURANT.wordmark && <span className="brand-name">{RESTAURANT.wordmark}</span>}
      </Link>
  )
}

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const path = usePath()
  const navigate = useNavigate()
  useEffect(() => setMenu(false), [path])

  return (
    <header className="nav">
      <div className="container nav-in">
        <Brand />
        <nav className={`nav-links ${menu ? 'open' : ''}`} aria-label="Principal">
          <NavLink to="/carta">Carta</NavLink>
          <NavLink to="/reservar">Reservar mesa</NavLink>
          <NavLink to="/resenas">Reseñas</NavLink>
          {isAdmin && <NavLink to="/admin" className="nav-admin">Panel admin</NavLink>}
          <div className="nav-mobile-user">
            {user
              ? <><NavLink to="/cuenta">Mi cuenta</NavLink><button onClick={() => { logout(); navigate('/') }}>Salir</button></>
              : <NavLink to="/ingresar">Ingresar</NavLink>}
          </div>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn on-dark cart-btn" onClick={() => setOpen(true)} aria-label={`Abrir carrito, ${count} productos`}>
            <Icon name="bag" size={22} />
            {count > 0 && <b>{count}</b>}
          </button>
          {user ? (
            <>
              <Link to="/cuenta" className="user-chip"><Icon name="user" size={18} /><span>{user.nombre.split(' ')[0]}</span></Link>
              <button className="icon-btn on-dark hide-sm" onClick={() => { logout(); navigate('/') }} aria-label="Cerrar sesión"><Icon name="logout" size={20} /></button>
            </>
          ) : (
            <Link to="/ingresar" className="btn btn-primary btn-sm hide-sm">Ingresar</Link>
          )}
          <button className="icon-btn on-dark show-sm" onClick={() => setMenu(!menu)} aria-label="Menú" aria-expanded={menu}>
            <Icon name={menu ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, total, count } = useCart()
  const navigate = useNavigate()
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])
  if (!open) return null

  return (
    <div className="overlay overlay-right" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Tu pedido">
        <header><h2>Tu pedido</h2><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar"><Icon name="close" /></button></header>
        {items.length === 0 ? (
          <Empty icon="bag" title="Tu pedido está vacío" action={<button className="btn btn-dark" onClick={() => { setOpen(false); navigate('/carta') }}>Ver la carta</button>}>
            Agrega platos desde la carta para empezar.
          </Empty>
        ) : (
          <>
            <ul className="drawer-list">
              {items.map((i) => (
                <li key={i.id}>
                  <DishImage src={i.urlImagen} name={i.nombre} className="thumb" />
                  <div>
                    <strong>{i.nombre}</strong>
                    <span className="muted">{money(i.precio)} c/u</span>
                    <Stepper value={i.cantidad} onChange={(n) => setQty(i.id, n)} label={`Cantidad de ${i.nombre}`} />
                  </div>
                  <b className="num">{money(i.precio * i.cantidad)}</b>
                </li>
              ))}
            </ul>
            <footer>
              <div className="total-row"><span>Total ({count} {count === 1 ? 'producto' : 'productos'})</span><b className="num">{money(total)}</b></div>
              <button className="btn btn-primary btn-block" onClick={() => { setOpen(false); navigate('/checkout') }}>Continuar con el pedido</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div>
          <Brand />
          <p className="muted-d">{RESTAURANT.tagline}</p>
        </div>
        <div>
          <h4>Horarios</h4>
          <ul className="footer-hours">{RESTAURANT.hours.map((h) => <li key={h.days}><span>{h.days}</span> {h.time}</li>)}</ul>
        </div>
        <div>
          <h4>Encuéntranos</h4>
          <ul>
            <li><Icon name="pin" size={16} /> {RESTAURANT.address}</li>
            <li>{RESTAURANT.phone}</li>
          </ul>
        </div>
        <div>
          <h4>Explora</h4>
          <ul>
            <li><Link to="/carta">Carta</Link></li>
            <li><Link to="/reservar">Reservar mesa</Link></li>
            <li><Link to="/resenas">Reseñas</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
