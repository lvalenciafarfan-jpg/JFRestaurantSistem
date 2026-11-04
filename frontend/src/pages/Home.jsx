import { Link } from '../lib/router'
import { useApi } from '../lib/hooks'
import { api } from '../lib/api'
import { money, fmtLong } from '../lib/format'
import { DishImage, Icon, Stars } from '../components/ui'
import { RESTAURANT } from '../config'


export default function Home() {
  const { data: productos, loading } = useApi(() => api.get('/productos'), [])
  const { data: promedio } = useApi(() => api.get('/resenas/promedio'), [])
  const { data: resenas } = useApi(() => api.get('/resenas', { params: { size: 3 } }), [])

  const lista = productos || []
  const board = lista.slice(0, 6)
  const destacados = lista.filter((p) => p.urlImagen).slice(0, 4)
  const opiniones = resenas?.content || []

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-copy">
            <h1>{RESTAURANT.hero.title}</h1>
            <p>{RESTAURANT.hero.text}</p>
            <div className="hero-cta">
              <Link to="/carta" className="btn btn-primary btn-lg">Pedir ahora</Link>
              <Link to="/reservar" className="btn btn-outline-light btn-lg">Reservar mesa</Link>
            </div>
          </div>

          <aside className="board" aria-label="La carta de hoy">
            <div className="board-frame">
              <h2>La carta de hoy</h2>
              <p className="board-date">{fmtLong(new Date())}</p>
              {loading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="leader-row skeleton-row"><span /></div>)}
              {!loading && board.length === 0 && <p className="board-empty">Estamos preparando la carta. Vuelve en un momento.</p>}
              {board.map((p, i) => (
                <div key={p.id} className="leader-row" style={{ animationDelay: `${i * 90}ms` }}>
                  <span className="leader-name">{p.nombre}</span>
                  <span className="leader-dots" />
                  <span className="leader-price num">{money(p.precio)}</span>
                </div>
              ))}
              <Link to="/carta" className="board-link">Ver la carta completa</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container services">
          <Link to="/carta" className="service service-order">
            <Icon name="bike" size={34} />
            <h3>Pide a casa o pasa por él</h3>
            <p>Arma tu pedido, elige si lo recibes en tu puerta o lo recoges, y sigue su estado desde tu cuenta.</p>
            <span className="service-cta">Ver la carta</span>
          </Link>
          <Link to="/reservar" className="service service-book">
            <Icon name="table" size={34} />
            <h3>Reserva tu mesa</h3>
            <p>Escoge día, hora y la mesa que prefieras. Si el horario está ocupado, te avisamos al instante.</p>
            <span className="service-cta">Reservar</span>
          </Link>
        </div>
      </section>

      {destacados.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head">
              <h2>{RESTAURANT.featuredTitle}</h2>
              <Link to="/carta" className="text-link">Ver toda la carta</Link>
            </div>
            <div className="featured">
              {destacados.map((p) => (
                <Link to="/carta" key={p.id} className="feat">
                  <DishImage src={p.urlImagen} name={p.nombre} />
                  <div className="feat-info">
                    <strong>{p.nombre}</strong>
                    <span className="num">{money(p.precio)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section reviews-band">
        <div className="container">
          <div className="reviews-top">
            <div>
              <h2>{RESTAURANT.reviewsTitle}</h2>
            </div>
            {promedio != null && (
              <div className="avg">
                <b className="num">{Number(promedio).toFixed(1)}</b>
                <div><Stars value={Number(promedio)} size={22} /><span>Promedio de calificaciones</span></div>
              </div>
            )}
          </div>
          {opiniones.length > 0 ? (
            <div className="quotes">
              {opiniones.map((r) => (
                <figure key={r.id} className="quote">
                  <Stars value={r.calificacion} size={16} />
                  <blockquote>{r.comentario}</blockquote>
                  <figcaption>{r.nombreUsuario || 'Cliente'}, {fmtLong(r.fecha)}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="muted">Aún no hay reseñas. <Link to="/resenas" className="text-link">Sé la primera persona en opinar</Link>.</p>
          )}
          <Link to="/resenas" className="btn btn-dark" style={{ marginTop: 28 }}>Leer y dejar una reseña</Link>
        </div>
      </section>
    </>
  )
}
